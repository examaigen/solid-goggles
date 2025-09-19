// practice.js — selection page. Launches player.html with chosen params.
import { supabase } from "./supabaseClient.js";
import { subjects } from "./config/subjects.js";
import { APP_NAME, DEFAULT_LOCALE, LOCALE_TAG } from "./config/env.js";
let userId = null;
let selectedSubject = null;
let selectedClass = null;
let selectedSubtopic = null;

const subjectsGrid = document.getElementById('subjects-grid');
const subjectView = document.getElementById('subject-view');
const classSection = document.getElementById('class-section');
const classButtons = document.getElementById('class-buttons');
const subtopicsSection = document.getElementById('subtopics-section');
const subtopicsGrid = document.getElementById('subtopics-grid');
const startSection = document.getElementById('start-section');
const startBtn = document.getElementById('start-btn');
const backToSubjects = document.getElementById('back-to-subjects');
const backToClasses = document.getElementById('back-to-classes');

(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return window.location.replace('login.html');
  userId = session.user.id;
  const presetMode = new URLSearchParams(location.search).get('mode');

  renderSubjects();


  // Back buttons
  backToSubjects?.addEventListener('click', () => {
    // show subjects; hide classes/subtopics/start
    subjectView?.classList.remove('hidden');
    classSection.classList.add('hidden');
    subtopicsSection.classList.add('hidden');
    startSection.classList.add('hidden');
  });
  backToClasses?.addEventListener('click', () => {
    // show classes; hide subtopics/start
    classSection.classList.remove('hidden');
    subtopicsSection.classList.add('hidden');
    startSection.classList.add('hidden');
    selectedSubtopic = null;
    subtopicsGrid.innerHTML = '';
  });
})();

function renderSubjects(){
  subjectsGrid.innerHTML = '';
  for (const key of Object.keys(subjects)){
    const s = subjects[key];
    const card = document.createElement('button');
    card.className = 'p-4 border rounded bg-white shadow hover:shadow-md text-left';
    card.innerHTML = `<div class="font-semibold text-lg">${s.label}</div><div class="text-sm text-gray-600">Choose</div>`;
    card.addEventListener('click', ()=> onSubject(key));
    subjectsGrid.appendChild(card);
  }
}

function onSubject(key){
  selectedSubject = key;
  selectedClass = null;
  selectedSubtopic = null;

  classButtons.innerHTML = '';
  subtopicsGrid.innerHTML = '';
  subjectView?.classList.add('hidden');
  classSection.classList.remove('hidden');
  subtopicsSection.classList.add('hidden');
  startSection.classList.add('hidden');

  const classes = Object.keys(subjects[selectedSubject]?.topicsByClass || {})
    .sort((a,b)=> Number(a)-Number(b));
  for (const klass of classes){
    const btn = document.createElement('button');
    btn.className = 'px-3 py-2 rounded border bg-white hover:bg-gray-50';
    btn.textContent = `${klass} klasė`;
    btn.addEventListener('click', ()=> onClass(klass));
    classButtons.appendChild(btn);
  }
}

function onClass(klass){
  selectedClass = String(klass);
  selectedSubtopic = null;

  // show/hide
  classSection.classList.add('hidden');
  subtopicsSection.classList.remove('hidden');
  startSection.classList.add('hidden'); // hide until a subtopic is picked

  // build grid
  subtopicsGrid.innerHTML = '';
  const topicsByClass = subjects[selectedSubject]?.topicsByClass || {};
  const topics = Array.isArray(topicsByClass[klass]) ? topicsByClass[klass] : [];

  if (!topics.length) {
    subtopicsGrid.innerHTML = '<div class="text-gray-500">Šiai klasei temų nėra.</div>';
    return;
  }

  topics.forEach(topic => {
    const wrap = document.createElement('div');
    wrap.className = 'bg-white p-3 rounded border';

    const header = document.createElement('div');
    header.className = 'font-semibold mb-2';
    header.textContent = topic.title || 'Tema';
    wrap.appendChild(header);

    (topic.subtopics || []).forEach(st => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.st = st.id;
      btn.className = 'px-3 py-1 rounded border bg-white hover:bg-gray-50 mr-2 mb-2 text-sm';
      btn.textContent = st.label || st.name || st.title || st.id;
      btn.addEventListener('click', () => {
        selectedSubtopic = st.id;
        // deselect others
        subtopicsGrid.querySelectorAll('button[data-st]').forEach(b => {
          b.classList.remove('bg-blue-600','text-white');
          b.classList.add('bg-white','text-gray-900');
        });
        // select this one
        btn.classList.remove('bg-white','text-gray-900');
        btn.classList.add('bg-blue-600','text-white');
        startSection.classList.remove('hidden');
      });
      wrap.appendChild(btn);
    });

    subtopicsGrid.appendChild(wrap);
  });
}

startBtn.addEventListener('click', ()=>{
  if (!selectedSubtopic) return alert('Pasirinkite potėmę.');
  const subs = [selectedSubtopic];
  const preset = new URLSearchParams(location.search).get('mode');
  const mode = (preset === 'mistakes' || preset === 'review') ? preset : 'practice';

  const url = new URL('player.html', location.href);
  url.searchParams.set('subs', subs.join(','));
  url.searchParams.set('class', selectedClass || '');
  url.searchParams.set('mode', mode);
  location.href = url.toString();
});
