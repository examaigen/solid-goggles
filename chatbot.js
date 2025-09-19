import { supabase } from './supabaseClient.js';
import { getCurrentQuestionText, getTopicContext } from './services/context.js';
import { APP_NAME, DEFAULT_LOCALE, LOCALE_TAG } from "./config/env.js";
import { t } from "./config/i18n-lt.js";

const SYSTEM_LT =
  "Tu esi pagalbininkas. Atsakyk trumpai ir aiškiai lietuvių kalba. " +
  "Naudok SI vienetus; formules rašyk KaTeX su $...$ (inline). " +
  "Jei klausimas neaiškus – užduok tikslinantį klausimą lietuviškai.";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("#chatbot-input");
  const send  = document.querySelector("#chatbot-send");
  if (input) input.setAttribute("placeholder", t.chatbot.ask_placeholder);
  if (send)  send.textContent = t.chatbot.send;
});

let userId = null;

// Extract text from various backend response shapes
function extractAnswer(data) {
  try {
    // 0) reply object shape from /chat: { reply: { role, content } }
    if (data && data.reply && typeof data.reply === 'object') {
      const c = data.reply.content;
      if (typeof c === 'string' && c.trim()) return c.trim();
    }
    // 1) common flat fields
    const flats = [
      data?.answer,
      data?.content,
      data?.message,
      data?.reply,
      data?.response,
      data?.text,
      data?.output_text,
      data?.result,
    ];
    for (const s of flats) {
      if (typeof s === 'string' && s.trim()) return s.trim();
    }
    // 2) OpenAI chat completions
    const c = data?.choices?.[0]?.message?.content;
    if (typeof c === 'string' && c.trim()) return c.trim();
    // 3) Other tool formats (e.g., outputs[0].content[0].text)
    const t = data?.outputs?.[0]?.content?.[0]?.text;
    if (typeof t === 'string' && t.trim()) return t.trim();
  } catch {}
  return null;
}

// Prefer the player's bridge, fall back to DOM extractor
function getExerciseContext() {
  if (typeof window !== 'undefined' && typeof window.getCurrentExerciseText === 'function') {
    try {
      const s = window.getCurrentExerciseText();
      if (s && s.trim().length) return s;
    } catch (_) {}
  }
  try {
    const s = getCurrentQuestionText?.();
    if (s && s.trim().length) return s;
  } catch (_) {}
  return "";
}

// --- Safe HTML escape for KaTeX rendering ---
function escapeHTML(s) {
  if (typeof s !== 'string') return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// --- Write ONE row per message (matches chat_logs schema) ---
async function saveChatMessage({ role, text, topicContext }) {
  try {
    if (!userId) return; // RLS: only write when logged in
    if (!text || !text.trim()) return;
    await supabase.from('chat_logs').insert({
      user_id: userId,
      message: text,
      role, // 'user' | 'assistant' | 'system'
      topic_context: topicContext || null,
      // id + created_at have defaults
    });
  } catch (e) {
    console.warn('[chatbot] chat log insert failed:', e);
  }
}


function renderBotAnswer(el, text) {
  // preserve line breaks, then let KaTeX auto-render scan the element
  el.innerHTML = escapeHTML(text).replace(/\n/g, '<br>');
  if (typeof window !== 'undefined' && typeof window.renderMathInElement === 'function') {
    try {
      window.renderMathInElement(el, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false },
          { left: '$',  right: '$',  display: false }
        ],
        throwOnError: false,
        ignoredTags: ['script','noscript','style','textarea','pre','code']
      });
    } catch (e) {
      console.warn('[chatbot] KaTeX render error:', e);
    }
  }
}

export function initChatbot() {
  const chatbotBtn      = document.getElementById("chatbot-btn");
  const chatbotPanel    = document.getElementById("chatbot-panel");
  const chatbotClose    = document.getElementById("chatbot-close");
  const chatbotSend     = document.getElementById("chatbot-send");
  const chatbotInput    = document.getElementById("chatbot-input");
  const chatbotMessages = document.getElementById("chatbot-messages");

  // If the UI isn't on this page, just no-op
  if (!chatbotBtn || !chatbotPanel || !chatbotSend || !chatbotInput || !chatbotMessages) {
    console.warn("[chatbot] UI elements not found; skipping init");
    return;
  }

  console.debug("[chatbot] init");

  // Do NOT block UI on session; just record userId if available
  (async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.warn("[chatbot] session error:", error);
      userId = session?.user?.id || null;
      console.debug("[chatbot] userId:", userId);
    } catch (e) {
      console.warn("[chatbot] getSession failed:", e);
    }
  })();

  // Open/close
  chatbotBtn.addEventListener("click", () => {
    chatbotPanel.classList.toggle("hidden");
    if (!chatbotPanel.classList.contains("hidden")) {
      chatbotInput.focus();
    }
  });
  chatbotClose.addEventListener("click", () => {
    chatbotPanel.classList.add("hidden");
  });

  // Send on Enter
  chatbotInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      chatbotSend.click();
    }
  });

  // Send click
  chatbotSend.addEventListener("click", async () => {
    const question = chatbotInput.value.trim();
    if (!question) return;

    // append user message immediately
    const userMsg = document.createElement("div");
    userMsg.className = "text-right";
    userMsg.textContent = question;
    chatbotMessages.appendChild(userMsg);
    chatbotInput.value = "";

    const botMsg = document.createElement("div");
    botMsg.className = "text-left text-gray-500 italic";
    botMsg.textContent = "Atsakymas generuojamas...";
    chatbotMessages.appendChild(botMsg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    // Build payload
    const exercise     = getExerciseContext();
    const topicContext = (function(){ try { return getTopicContext?.(); } catch(_) { return null; } })();
    const payload = {
      messages: [
        {
          role: "system",
          content:
            "Tu esi kantrus matematikos mokytojas. Atsakyk lietuviškai, žingsnis po žingsnio. " +
            "Naudok aiškų žymėjimą, jei reikia – paprastą LaTeX (pvz., x^2, sqrt(x), \\\\frac{a}{b}). " +
            (topicContext ? `Tema: ${topicContext}. ` : "") +
            (exercise ? `Užduotis: ${exercise}` : ""),
        },
        { role: "user", content: question }
      ],
      user_id: userId,
      topic_context: topicContext || null
    };
    
    saveChatMessage({ role: 'user', text: question, topicContext: exercise });
    // POST to backend
    const API = window.CHAT_API_BASE || "https://examgenai.onrender.com";
    const url = `${API}/chat`;
    console.debug("[chatbot] POST", url, payload);

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.debug("[chatbot] resp", resp.status);
      if (!resp.ok) {
        const txt = await resp.text().catch(()=> "");
        throw new Error(`HTTP ${resp.status} ${txt}`);
      }
      const data = await resp.json().catch(()=> ({}));
      console.debug("[chatbot] body", data);
      const text = extractAnswer(data);
      botMsg.classList.remove("text-gray-500","italic");
      if (text) {
        renderBotAnswer(botMsg, text);
        // Log the ASSISTANT reply (non-blocking)
        saveChatMessage({ role: 'assistant', text, topicContext: exercise });
      } else {
        botMsg.textContent = "Atsakymo gauti nepavyko.";
        // Optional: also log an empty/failed assistant message
        saveChatMessage({ role: 'assistant', text: '(no answer)', topicContext: exercise });
      }
    } catch (err) {
      console.error("[chatbot] error", err);
      botMsg.classList.remove("text-gray-500","italic");
      botMsg.textContent = "Įvyko klaida jungiantis prie AI.";
      saveChatMessage({ role: 'assistant', text: '(error)', topicContext: exercise });
    }

    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  });
}

export function buildMessages(userText) {
  return [
    { role: "system", content: SYSTEM_LT },
    { role: "user", content: userText }
  ];
}