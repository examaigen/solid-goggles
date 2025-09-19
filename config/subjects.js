  // Topics data structure
  export const subjects = {
  matematika: {
    label: "Matematika",
    topicsByClass: {
      "12": [
      { title: "Modeliai ir sąryšiai", subtopics:[
        { id:"59b79162-e114-4c41-92ed-74bf06617725", label:"Trigonometrinės lygtys" },
         { id:"d82c2043-264a-4254-9ae5-3147bcbedf0b", label:"Testing(10)" },
        { id:"f718a301-bcd2-4c0f-aa30-5c435546d38d", label:"Trigonometrinės nelygybės" },
        { id:"8c67361b-3e14-4ccb-a0af-a7319cbe1d5d", label:"Funkcijos išvestinė" },
        { id:"0bee88ef-7a4b-4bbd-8c2f-9d56f1e747b0", label:"Pirmykštė funkcija ir integralas" }
      ]},
      { title: "Geometrija ir matavimai", subtopics:[
        { id:"23fa4428-08ba-4ca4-bad5-6476d201fc6f", label:"Tiesės, plokštumos, kampai erdvėje" },
        { id:"0c0e0955-3f8b-4aad-98ad-5519f0ccc1c4", label:"Briaunainiai, sukiniai" },
      ]},
      { title: "Duomenys ir tikimybės", subtopics:[
        { id:"700bbe17-f101-484b-b34e-c5223d63f786", label:"Rinkiniai: kėliniai, gretiniai, deriniai." },
        { id:"fd8af56c-8cc7-44e5-bca3-3c22835779fd", label:"Klasikiniai ir neklasikiniai tikimybiniai modeliai." },
        { id:"35209c9e-aade-45e3-bc70-92b0f74b38a7", label:" Atsitiktiniai dydžiai." }
      ]},
    ],
    "11": [{ title:"Skaičiai ir skaičiavimai", 
      subtopics:[{id:"42fcc2e3-d736-47dd-b93d-6d4a7537da2b", label:"Skaičių aibės"},
        {id:"330c93ff-3f98-44c3-b317-4a9e02664a5a", label:"Realiojo skaičiaus modulis"},
        {id:"ae599539-91df-4897-8fda-24c5ded1e7a5", label:"Laipsniai"},
        {id:"b0797a89-e483-469f-8fe8-3c6860ad9b93", label:"Šaknys"},
        {id:"8b764966-c7ab-4573-853f-f440766d3def", label:"Logaritmai"},
        {id:"18af2636-d3a0-41dd-9e29-34080b162568", label:"Sinusas, kosinusas ir tangentas"},
      ]},
      { title:"Modeliai ir sąryšiai",
        subtopics:[{id:"9103c2c6-0539-4dae-92d1-30884faf0423", label:"Progresijos"},
          {id:"25351ec4-029e-44ae-8d8d-33762063ef4c", label:"Funkcijos"},
          {id:"cd61cefb-4efd-446c-ad8a-3726932f93a1", label:"Lygtys"},
          {id:"e8c69641-0262-4bb6-8617-1fd775bb13ad", label:"Nelygybės"},
    ]},
  { title:"Geometrija ir matavimai",
        subtopics:[{id:"faf5dd15-35c1-4656-8d02-503e5d112946", label:"Plokštumos vektoriai ir veiksmai su jais"},
          {id:"9e4291c2-8135-40c5-b434-8ac219393871", label:"Vektoriai stačiakampėje koordinačių plokštumoje"},
    ]}],
    "10": [{ title:"Modeliai ir sąryšiai", 
      subtopics:[{id:"a43a055d-0888-4371-b22c-10b621946da2", label:"Dėsningumai"},
        {id:"aa9a56f5-9f6c-49db-881c-6f79cb4d98d5", label:"Algebra"}
    ]},
  { title:"Geometrija ir matavimai", 
      subtopics:[{id:"02530e9f-2ca6-4a43-9b61-1c0f73863235", label:"Figūros"}
    ]},
  { title:"Duomenys ir tikimybės", 
      subtopics:[{id:"ba27c801-5fe6-48c0-af78-2c847acd8a58", label:"Duomenys ir jų interpretavimas"},
        {id:"9b313c74-5202-456f-a08d-53595c05d120", label:"Tikimybės ir jų interpretavimas"}
    ]}],
    "9": [{ title:"Modeliai ir sąryšiai", 
      subtopics:[{id:"a43a055d-0888-4371-b22c-10b621946da2", label:"Dėsningumai"},
        {id:"aa9a56f5-9f6c-49db-881c-6f79cb4d98d5", label:"Algebra"},
        {id:"58f95200-7013-4ca2-b84c-f870f60c7610", label:"Tiesiniai ir netiesiniai sąryšiai"}
    ]},
    { title:"Geometrija ir matavimai", 
      subtopics:[{id:"02530e9f-2ca6-4a43-9b61-1c0f73863235", label:"Figūros"}
    ]},
    { title:"Duomenys ir tikimybės", 
      subtopics:[{id:"ba27c801-5fe6-48c0-af78-2c847acd8a58", label:"Duomenys ir jų interpretavimas"}
    ]}]
    }
  },
  fizika: {
    label: "Fizika",
    topicsByClass: {
      "12": [
        { title: "Svyravimai ir bangos", subtopics: [
          { id: "7f14038f-bd64-4079-abe9-1accc02be8c2", label: "Svyravimai" },
          { id: "468f8f1e-0b9d-4aa6-be61-279551dba9ce", label: "Kintamoji elektros srovė ir jos perdavimas" },
          { id: "d7901b23-6624-48df-be1a-142649ad5950", label: "Bangos" },
          { id: "75ebc7f8-ff21-4344-a064-3d3e75f1c598", label: "Bangų savybės" }
        ] },
        { title: "Šviesa", subtopics: [
          { id: "d7f6fc34-d284-40c7-9c4a-f870aced0bd3", label: "Geometrinė optika" },
          { id: "8c5e7cf6-6ca5-4d08-ab35-922b6290c527", label: "Banginiai šviesos reiškiniai" },
        ] },
        { title: "Atomas, branduolys ir elementariosios dalelės", subtopics: [
          { id: "58d805be-0fa5-40e0-bd75-d38316c8f26c", label: "Kvantinė optika" },
          { id: "9d98902e-4214-4b97-980c-4002d44aa533", label: "Atomo sandara" },
          { id: "0b4f42e9-e513-4bdd-9445-52ab86f7a9e6", label: "Atomo branduolys ir radioktyvumas" },
          { id: "bc7db34b-c05f-4cd8-95d3-33e69d31c801", label: "Elementariosios dalelės" },
        ] },
        { title: "Reliatyvumo teorijos pagrindai", subtopics: [
          { id: "340d1e9f-d0da-46da-a7b4-b5d7290d2d5a", label: "Įvadas į reliatyvumo teoriją" },
          { id: "e98c0f84-d40e-4626-bfae-6d712789e965", label: "Reliatyvistinė mechanika" },
        ] },
      ],
      "11": [
         { title: "Fizikos mokslo kalba ir pažinimo metodai", subtopics: [
          { id: "72188a85-b1c2-45c0-88b6-d19d70c690c1", label: "Fizikos mokslo raida" },
          { id: "b0fa698e-3545-44f1-8239-21a18b036f63", label: "Pažinimo metodai ir kalba" },
          { id: "97a8f4ab-94b5-45ea-a386-b8b91af43651", label: "Matavimai ir skaičiavimai fizikoje" },
        ] },
       { title: "Judėjimas ir jėgos", subtopics: [
           { id: "0d3513ec-d8e1-4d35-ae5e-bfd363cfa3d0", label: "Judėjimas" },
           { id: "f685c415-73ad-42b9-a712-58d4e29b2c23", label: "Jėgos" },
           { id: "f3bd282d-e923-410d-99c6-d69e91da1a13", label: "Judėsio kiekis ir jėgos impulsas" }
         ] },
             { title: "Energija", subtopics: [
           { id: "c9f30f8d-2e87-4401-a584-4e3b2bd211ce", label: "Energija" },
           { id: "5c65f15d-7937-495d-b3c0-4ff6d8255bf8", label: "Darbas" },
           { id: "e78a73b3-2920-42fe-9074-dd83e4754a9b", label: "Galia" }
         ] },
                { title: "Šiluminiai reiškiniai", subtopics: [
           { id: "82aa9742-e518-44f4-a759-466b50774d88", label: "Ryšys tarp mikro ir makro pasaulio" },
           { id: "5ec6436a-2907-4d37-bca4-474abfb4c361", label: "Termodinamika" },
         ] },
                { title: "Elektra ir magnetizmas", subtopics: [
           { id: "66af11f3-4bf4-4a4c-82d1-768c86b16ef6", label: "Elektrostatinis laukas" },
           { id: "54b1528f-75cc-4332-ab29-6d76b7eb4a69", label: "Elektros srovė metaluose" },
           { id: "3599dded-6518-4686-8499-8f5659ba4363", label: "Elektros srovės šaltiniai" },
           { id: "87c71153-aa61-43b4-9b94-9cee3bbb5504", label: "Magnetinis laukas" },
           { id: "94276793-d376-46b1-bbe9-52e5ab5723ea", label: "Elektromagnetinė indukcija" },
           { id: "05d77003-b6a5-47c6-9c58-77d4771b1035", label: "Energijos šaltiniai" },
         ] },
        ],
      "10": [
        { title: "Mechaniniai svyravimai ir bangos", subtopics: [
          { id: "add656d7-6457-4f79-bd34-a12081686979", label: "Mechaniniai svyravimai" },
          { id: "9eb496c9-c476-4504-9e8a-211edc84f2ec", label: "Mechaninės bangos" },
        ] },
        { title: "Elektra ir magnetizmas", subtopics: [
          { id: "49aa51d5-82ba-41a4-8951-b9baf7b5d1fa", label: "Nuolatiniai magnetai" },
          { id: "6eca8a60-1e87-4f75-a5f0-4e7989d0ff10", label: "Elektros srovė ir magnetinis laukas" },
          { id: "e69a5107-35aa-4cf5-9127-1670431b472c", label: "Elektros energijos gamyba ir naudojimas" },
        ] },
        { title: "Elektromagnetiniai virpesiai ir bangos", subtopics: [
          { id: "bbfd2864-0f07-4eb2-8289-0d12f360398b", label: "Elektromagnetiniai virpesiai" },
          { id: "9ec00308-c6ef-44bf-b2ed-d65928693a75", label: "Elektromagnetinės bangos ir jų savybės" },
        ] },
      ],
      "9": [
        { title: "Šiluminiai reiškiniai", subtopics: [
          { id: "d32cd25e-6a8d-4398-a988-17cf6355611d", label: "Vidinė energija" },
          { id: "3486dd69-0734-415b-98b1-2dd6c9a76c87", label: "Medžiagos būsenų kitimas" },
        ] },
        { title: "Judėjimas ir jėgos", subtopics: [
          { id: "c043bdb5-7501-4c6d-9b2a-dce3448d0bb1", label: "Mechaninis judėjimas" },
          { id: "6f6f59ce-8bbd-49e2-b396-1482b2458275", label: "Jėgos" },
          { id: "a52d9b77-25ea-4ff7-bf3a-b6c9352af855", label: "Sąveikos dėsniai" },
          { id: "69a5c1cf-8f3a-41f6-a531-7c88c285a20c", label: "Slėgis" }
        ] },
        { title: "Mechaninis darbas, galia ir energija", subtopics: [
          { id: "feddaf89-0af5-4591-bf5d-a70e7c0966ab", label: "Mechaninis darbas ir galia" },
          { id: "cdc2a1bd-dea7-4350-9978-f13437c4cbf1", label: "Mechaninė energija" },
          { id: "01a3911b-5703-43a8-9f60-452c52e8bcbe", label: "Paprastieji mechanizmai" }
        ] }
      ]
    }
  },
  chemija: {
    label: "Chemija",
    topicsByClass: {
      "12": [
        { title: "Chemijos pagrindai ir skaičiavimo uždaviniai", subtopics: [
          { id: "1968ba26-661a-4619-bf20-b78f98f9dc71", label: "Pagrindinės chemijos sąvokos ir dėsniai" },
          { id: "c6efb984-3846-41dd-8346-76a6efd7ed51", label: "Skaičiavimai pagal formules ir reakcijų lygtis" },
        ] },
        { title: "Medžiagos sandara ir sudėtis", subtopics: [
          { id: "2a6b2fa7-352d-463d-be5f-ca5f0edbe37d", label: "Atomo sandara ir periodinis dėsnis" },
          { id: "ecbee23b-9819-4eea-9237-1b9ac7c1b374", label: "Cheminis ryšys" },
        ] },
        { title: "Cheminės reakcijos", subtopics: [
          { id: "b81f9333-8686-4978-9b6b-c9bed081226f", label: "Cheminių reakcijų klasifikavimas" },
          { id: "d2e0d388-63d2-47d1-b262-a3a41cd4646b", label: "Cheminių reakcijų energija" },
          { id: "009b377c-fb3a-4c5d-a8f3-ab7184933a96", label: "Cheminių reakcijų greitis" },
          { id: "14d77dc9-2f70-4283-8a2c-af30953c6f0a", label: "Cheminė pusiausvyra" },
          { id: "f9e85355-3a9a-4d76-90f5-209754f64368", label: "Oksidacijos-redukcijos reakcijos" },
          { id: "a26d3d94-029c-40d9-b247-d5aa82b5cbb5", label: "Lydalų ir vandeninių tirpalų elektrolizė" },
        ] },
        { title: "Tirpalai", subtopics: [
          { id: "74f2b794-7a0b-47c7-8b76-3413c340fb16", label: "Vanduo ir jo savybės" },
          { id: "4696af79-6be1-4907-bfba-7c036273833b", label: "Elektrolitinė disociacija ir jonizacija" },
          { id: "691a1cb9-b144-4917-a52b-612775e4c9ea", label: "Vandens joninė sandauga, pH. Neutralizacijos reakcijos. Druskų hidrolizė" }
        ] },
        { title: "Neorganinių junginių klasės, cheminės savybės, gavimas ir atpažinimas", subtopics: [
          { id: "a3b7ec7f-a0bd-4961-b7fc-4dc7abfb1f22", label: "Nemetalai ir metalai" },
          { id: "f7aa95f0-81c6-4f3b-bf30-a6408331551e", label: "Oksidai" },
          { id: "27149a38-d730-447f-9ad3-106b1b091b7c", label: "Rūštys ir bazės" },
          { id: "3fc9d5c8-8cfd-4488-bcdc-1642f7b1dd9d", label: "Druskos" }
        ] },
        { title: "Chemija ir aplinka", subtopics: [
          { id: "1133e53a-6fbe-475b-ab6f-8b18d3e7c248", label: "Aplinkos reiškinių kaita" },
          { id: "c249f2c2-62cb-48b8-93ba-dd2d7faeac05", label: "Aplinkos tarša" }
        ] },
      ],
      "11": [
        { title: "Bendrieji organinės chemijos pagrindai", subtopics: [
          { id: "630f6ed8-769b-46d1-984d-7c94e386a9e6", label: "Anglies atomo sandara" },
          { id: "8f3228f5-b2a0-40be-8acb-666bee70cb2c", label: "Angliavandenilių sandara ir pavadinimai" },
        ] },
        { title: "Gamtiniai angliavandenilių šaltiniai", subtopics: [
          { id: "84e01017-5c76-4af7-a998-47a9db73e61f", label: "Iškastinis kuras ir jo perdirbimas" },
          { id: "05518f8d-7308-43f2-bfdb-5ba099bb0cce", label: "Angliavandenilių degimas" },
        ] },
        { title: "Funkcinės grupės ir organinių junginių klasės", subtopics: [
          { id: "727942ec-492d-496d-ad9f-9623478eecd9", label: "Funkcinės grupės" },
          { id: "8371ecc4-6afc-42db-9928-d8c0b6dc64ab", label: "Organinių junginių pavadinimų sudarymo taisyklės" },
        ] },
        { title: "Homologija ir izomerija", subtopics: [
          { id: "029fdd56-2baa-4584-9bf0-753fe23f27e4", label: "Homologija" },
          { id: "992948e3-dd98-4986-abbf-7675f42604fc", label: "Izomerija" },
        ] },
        { title: "Praktinis organinių junginių gavimas, fizikinės savybės ir kokybinės atpažinimo reakcijos", subtopics: [
          { id: "57c5d8ee-70ce-40ff-bcc9-1cf9728d0cc4", label: "Organinių junginių fizikinės savybės, naudojimas" },
          { id: "84bd8d21-f1e4-4ef8-b694-271951ca69d7", label: "Organinių junginių gavimas ir atpažinimo reakcijos" },
        ] },
        { title: "Organinių junginių tyrimo metodai", subtopics: [
          { id: "c69aaefe-2972-44e1-85b8-3ef986b0bd34", label: "Organinių junginių gryninimas ir analizė" },
          { id: "2793d33d-4e5e-4891-9a0e-1f9bc7e62c73", label: "Spektriniai analizės metodai" },
        ] },
        { title: "Organinės chemijos reakcijų mechanizmai", subtopics: [
          { id: "f32b2333-c7a6-4dcb-a81b-10e039b7a27d", label: "Reakcijų mechanizmų pagrindinės sąvokos" },
          { id: "281f69f0-6839-4583-8959-6568344af087", label: "Reakcijų mechanizmų užrašymo principai" },
        ] },
        { title: "Pagrindinės organinės chemijos reakcijos", subtopics: [
          { id: "21cf0108-3418-4344-bf80-affb393ad218", label: "Angliavandenilių cheminės savybės" },
          { id: "87f1dcf1-8ac7-4f8c-97be-2b5b8c20c621", label: "Organinių junginių rūgštinės ir bazinės, oksidacinės-redukcinės savybės" },
          { id: "8c02c7ac-cbdf-4e55-bb86-85f8fc988ac5", label: "Organinių junginių degimas" }
        ] },
        { title: "Gyvybės chemija", subtopics: [
          { id: "1d2acfbd-2cd8-4021-a4dc-c42d67105e5c", label: "Riebalai" },
          { id: "95ca9792-93ff-4970-afe1-64b76ab4e2fc", label: "Sacharidai" },
          { id: "31def938-3ea1-4e7d-a56b-9a11c54d13b7", label: "Baltymai, nukleorūgštys" }
        ] }
      ],
      "10": [
        { title: "Metalai ir nemetalai", subtopics: [
          { id: "9d059efd-9553-4590-88de-1a859913d6c5", label: "Metalai ir jų lydiniai" },
          { id: "3f6b6c9d-f8e2-4e8e-92d5-257b6a9096f3", label: "Nemetalai ir jų lydiniai" },
        ] },
                { title: "Organinės chemijos pagrindai", subtopics: [
          { id: "f8e16640-5f56-4c88-8c49-5ce0709b0fde", label: "Anglis - organinių junginių pagrindas" },
          { id: "979966d6-ed27-486d-aa1a-b7c644366aad", label: "Organinių junginių įvairovė ir taikymas" },
        ] },
                { title: "Aplinkosauga", subtopics: [
          { id: "6be500f0-48e0-41a4-96c3-3aabbd525ef5", label: "Žmogaus veiklos poveikis aplinkai" },
          { id: "45b728cf-c15e-4175-a790-1eb468bedf28", label: "Tarša plastikais" },
        ] },
      ],
      "9": [ 
        { title: "Molis. Avogadro dėsnis", subtopics: [
          { id: "2298029b-91ae-494c-bee0-f18f870eabdb", label: "Molis" },
          { id: "64de924f-0b2d-401d-8c0e-6d337250576e", label: "Dujų molio tūris ir avogadro dėsnis" },
        ] },
        { title: "Vanduo ir tirpalai", subtopics: [
          { id: "cb93e39e-48da-41d4-9f0e-5120ff378bc6", label: "Bendrosios žinios apie tirpalus" },
          { id: "9096a4f5-dc5e-4ffd-b94b-265eb8361cbb", label: "Vandens telkiniai, tarša ir valymas" },
          { id: "3e9e417c-87da-42fe-9c0e-b1c4867cfa65", label: "Tirpalų koncentracija" },
          { id: "6c23aadf-7cdf-4b53-bcae-b048c7b63603", label: "Indikatoriai ir ph skalė" },
          { id: "ad932179-88e2-4f48-b107-65aad3b8ab6f", label: "Neutralizacijos reakcijos tirpaluose" },
        ] },
        { title: "Neorganinių junginių klasės", subtopics: [
          { id: "f6168fa7-8431-41c5-84ea-be11df5ae01f", label: "Oksidai" },
          { id: "f2df7da2-9996-415f-993b-fd3f43ee8108", label: "Bazės" }, 
          { id: "cdfae657-f1c3-4a89-86ae-336de6a936a0", label: "Rūgštys" },
          { id: "dd328b39-7592-4827-a31b-2b304490e476", label: "Druskos" }
        ] },
      ]
    }
  },
  biologija: {
    label: "Biologija",
    topicsByClass: {
      "12": [
        { title: "Žmogaus organizmo funkcijos", subtopics: [
          { id: "0fd236e8-0472-4aa5-a136-e39c2ed2e252", label: "Virškinimas ir mityba" },
          { id: "eda9dba7-c4c4-4b23-b627-499acb8772a8", label: "Kvėpavimas" },
          { id: "382824fc-4055-40c8-a915-b6a84fd7ce21", label: "Kraujas ir jo funkcijos" },
          { id: "075b5d09-f2e6-4dca-9b85-0fe524df0a0a", label: "Kraujotaka" },
          { id: "02805ae3-0272-43c7-acc4-2f5284e939e9", label: "Organizmo apsauga nuo infekcijų" },
          { id: "72287216-72df-42a0-9333-7f1b1a7c08f8", label: "Šalinimas" },
          { id: "62d9eaaf-be79-4dde-aff7-baab93bf54ec", label: "Organizmų funkcijų valdymas" },
          { id: "07dd3916-32f3-4832-b5e3-e1cbace7a204", label: "Homeostazės valdymas" },
          { id: "2da41293-246b-4714-8cee-cfc7159f3f24", label: "Dauginimasis." },
        ] },
        { title: "Gyvūnų biologija", subtopics: [
          { id: "32fb2b51-d2de-419f-bf0e-46156674103e", label: "Judėjimas ir kūno danga" },
          { id: "969ab46b-3c02-491d-9449-55e221004c32", label: "Dauginimasis ir vystymasis" },
          { id: "d8fa3435-70bf-49a3-8115-85f6cfc6996c", label: "Dujų apykaita" },
          { id: "63bb483f-c409-4678-b9db-a1cf6f69c932", label: "Šalinimas" },
        ] },
        { title: "Augalų biologija", subtopics: [
          { id: "25b44bc3-2022-4de6-b1c3-5d76d8779f92", label: "Augalų įvairovė" },
          { id: "a5008af7-8243-4dac-adf7-df82415e6803", label: "Medžiagų pernaša gaubtasėkliuose augaluose" },
          { id: "e8f75b85-878e-40c2-ab16-bb07f49affdd", label: "Augalų dauginimasis" },
        ] },
        { title: "Evoliucija ir sistematika", subtopics: [
          { id: "12f5bf22-5d59-40dc-8458-f3a7ad3f242f", label: "Evoliucijos procesas" },
          { id: "b9d6da11-0d06-42a2-ba96-9e582c821d8d", label: "Organizmų sistematika" },
          { id: "f6dbba03-e194-426e-bc2f-f22f0de0a3fe", label: "Biologinė įvairovė – evoliucijos rezultatas" },
        ] },
        { title: "Ekologija", subtopics: [
          { id: "253ae72b-a53e-490a-a674-76f51d8d6134", label: "Populiacijos" },
          { id: "20c496fd-d7d0-4b94-901a-c4445059e0fa", label: "Bendrijos" },
          { id: "795cedab-d585-4041-a370-ea6ba3f23952", label: "Energijos ir medžiagų virsmai biosferoje" },
          { id: "68d1ef0a-c3f8-485e-b1d0-67537abf54fa", label: "Žmogaus veiklos įtaka aplinkai" },
        ] },
      ],
      "11": [ 
        { title: "Ląstelės biologija", subtopics: [
          { id: "a1b991f1-c5ec-4f1a-88d1-614d0bd5d52a", label: "Ląstelės sandara" },
          { id: "81ee96d9-f1e3-4838-b9a5-6299ac712c55", label: "Membranos sandara ir pernaša per membraną" },
          { id: "ba5e8743-1ad1-4080-a78a-a2410b1b22af", label: "Ląstelės ciklas" },
        ] },
        { title: "Molekulinė biologija ir biochemija", subtopics: [
          { id: "1e34396b-16d6-48e4-97dc-5d08aed64dc8", label: "Vanduo" },
          { id: "a2f50bd4-69d4-4b00-b70e-525fb430963a", label: "Angliavandeniai ir lipidai" },
          { id: "9871c562-3012-4fcd-8f90-b13360de594d", label: "Baltymai" },
          { id: "a85613ed-de7a-4c96-855a-336c8748415b", label: "Fermentai" },
          { id: "8286c783-6f60-48ee-94eb-a5ca7797e5a6", label: "Nukleorūgštys" },
          { id: "9e463040-51e9-4c55-afaf-f0519cf29b42", label: "Baltymų sintezė" },
          { id: "092df5dd-5e26-4e04-b2c0-560c5990adba", label: "Ląstelinis kvėpavimas" },
          { id: "665ad7eb-49e4-43a7-80e8-2017dd3e0879", label: "Fotosintezė" },
        ] },
        { title: "Organizmų požymių paveldėjimas ir genų technologijos", subtopics: [
          { id: "b7620abc-63cc-48c8-ad40-9523396bc7bd", label: "Genai ir chromosomos" },
          { id: "81932412-9d5f-49fe-a046-d437e1b0067b", label: "Mejozė" },
          { id: "b6036269-1395-4686-af7c-20f82e1463ec", label: "Paveldimumas ir kintamumas" },
          { id: "e1a9ad04-3f3c-494c-96db-85c140c5dfb5", label: "Genetinės modifikacijos ir biotechnologija" },
        ] },
      ],
      "10": [ 
        { title: "Paveldėjimas ir biotechnologijos", subtopics: [
          { id: "a89a6f28-e44c-4b2a-9598-8afd7a52861a", label: "Genetika" },
          { id: "086ff1c5-6811-486e-8947-31ef694904b0", label: "Biotechnologijos" },
        ] },
        { title: "Žmogaus poveikis aplinkai", subtopics: [
          { id: "b71606c2-2d6a-484a-b1d6-32d748d2cac1", label: "Ekologinės problemos" },
          { id: "e1219658-4fd1-473a-b5cc-f5499e9a3a9c", label: "Aplinkosauga" },
        ] },

       ],
      "9": [ 
        { title: "Žmogaus organizmas - vieninga sistema", subtopics: [
          { id: "852affaf-99ee-4155-b2d1-9e3d7e60a9e8", label: "Žmogaus organizmas kaip įvairių mokslų tyrimo objektas" },
        ] },
        { title: "Medžiagų apykaita", subtopics: [
          { id: "16447393-cece-440e-8e1d-b141362624c4", label: "Medžiagų apykaitos svarba" },
          { id: "ff55e21d-ccb7-49f5-be05-3ef08c8f5e27", label: "Kvėpavimo sistema" },
          { id: "f8310328-9781-49a2-9848-783d941fdab1", label: "Kraujas ir kraujotaka" },
          { id: "5b532e9f-f653-4cc2-bf09-8cc18eb4d173", label: "Mityba ir virškinimas" },
        ] },
        { title: "Infekcinės ligos ir imunitetas", subtopics: [
          { id: "401284b0-1aba-4e4f-aa2a-39e50c78ffbd", label: "Imunitetas" },
          { id: "e7ba5ff4-74e2-43ed-9e3c-c571435a9032", label: "Infekcinės ligos" },
        ] },
        { title: "Organizmo funkcijų reguliavimas", subtopics: [
          { id: "4e1a6433-065c-4d36-a470-309ba0ac79c0", label: "Nervinis organizmo funkcijų reguliavimas, jutimai" },
          { id: "dd6b8807-0648-4285-8d53-3b8600c3b991", label: "Humoralinis reguliavimas" },
        ] },
        { title: "Dauginimasis ir vystymasis", subtopics: [
          { id: "440ccf3f-bc97-4c7c-85ce-09662f08dda2", label: "Žmogaus gyvenimo ciklas" },
          { id: "2020d68f-ee81-4dae-83e0-af1687c4a4cc", label: "Apvaisinimas ir vystymasis po apvaisinimo" },
          { id: "ffb522a2-d873-4473-a813-2ab89e86dbf9", label: "Vaisingumas. Lytiškai plintančios ligos" },
        ] },
        { title: "Transplantacija ir sveikata", subtopics: [
          { id: "3fde1f61-9f43-4064-8134-cddac414f383", label: "Organų donorystė" },
        ] },
      ]
    }
  },
  Ekonomika_ir_verslumas: {
    label: "Ekonomika ir verslumas",
    topicsByClass: {
      "12": [
        { title: "Valstybės vaidmens ekonomikoje ir ekonomikos rodiklių nagrinėjimas ir vertinimas", subtopics: [
          { id: "17958fbb-5f00-45b0-b2b4-3229cb58843b", label: "Rinkos ribotumas" },
          { id: "84cfbd7d-a9c1-414d-b07d-aed37baf7fa9", label: "Valstybės biudžetas" },
          { id: "e314f661-b14e-41e3-98f3-d2e698a29a55", label: "Nacionaliniai pajamų rodikliai" },
          { id: "6ea7f71e-34f5-4348-b325-bca8e0da9852", label: "Nedarbas. Ekonomiškai aktyvūs (darbo jėga) ir ekonomiškai neaktyvūs gyventojai" },
          { id: "cb97fb75-4959-48e8-b872-b4638aca4fe7", label: "Infliacija" },
          { id: "4c2a58e6-0208-473a-b432-3cac3cde9f90", label: "Ekonomikos ciklas ir jo fazės" },
          { id: "a97e982b-452c-4752-9310-2e45a5de48ee", label: "Visuminė paklausa ir pasiūla" },
          { id: "b34ed8fe-e5e4-4b3b-9dbc-41dcbc25d0bb", label: "Valstybės ekonominė politika. Monetarinė politika ir jos įgyvendinimas" },
          { id: "2e6787ec-4e0b-4af0-b4f7-4aea970661e0", label: "Šešėlinė ekonomika" },
          { id: "73578228-13c0-4ec6-9a86-336574498ac8", label: "Pajamų nelygybė" },
        ] },
        { title: "Globalinių ekonominių procesų supratimas", subtopics: [
          { id: "187eb952-15d7-479b-875c-6486e24fdb23", label: "Globalizacija" },
          { id: "20380268-bec2-430a-bae7-1d19215a6d68", label: "Tarptautinė prekyba" },
          { id: "bbd0a2ac-4dbf-4894-87f6-3be16595b62c", label: "Šalių specializacija" },
          { id: "5594b34d-3cac-4a63-95ec-6f86bc987b31", label: "Šalies mokėjimų balansas ir jo dalys" },
          { id: "9f27e82f-b277-43b8-b97a-4fd6d4196a43", label: "Tarptautinė įmonė" },
          { id: "bf0f0579-ac0c-4ccf-a3c7-abb2dc30797b", label: "Ekonominė integracija ir jos etapai" },
          { id: "d3ce3271-bca3-40d8-9dc4-ff6478faa6d0", label: "Ekonomikos augimas ir ekonomikos plėtra" },
          { id: "33d8ed80-72e6-464f-9628-ee67bf19cb6f", label: "Globalūs iššūkiai" },
          { id: "6ce352ff-4a83-487c-849a-55ac18456988", label: "Darni (tvari) plėtra" },
        ] },
      ],
      "11": [
        { title: "Orientavimasis rinkoje", subtopics: [
          { id: "7a2ec899-1d88-468e-8c7b-0d5311744a5f", label: "Ekonomikos mokslo raida ir ryšiai su kitais mokslais" },
          { id: "42bbc5f9-dd8f-4c61-bebc-9f9015fe0374", label: "Ištekliai" },
          { id: "e46279e1-f5e3-4a00-899d-a457a5b30d71", label: "Ekonomikos sistemos. Ekonomikos sistemų tipai (tradicinė, komandinė, rinkos, mišrioji)" },
          { id: "b05fa64d-afa4-4c5c-a364-8075b54ff740", label: "Prekių (paslaugų) rinka" },
          { id: "3c72601d-6d98-4733-b1bc-0c9c3b3f3f31", label: "Išteklių rinka" },
          { id: "7d1ab6a6-1299-464e-98a6-aad1b34eaeea", label: "Rinkos konkurencijos struktūra" },
          { id: "cfe1a3ab-151d-46d8-b5eb-3381e89cc416", label: "Pinigų rinka" },
        ] },
        { title: "Asmeninių finansų tvarkymas", subtopics: [
          { id: "d071b3b4-c167-45fe-a79e-072ea54f3f87", label: "Namų ūkio biudžetas" },
          { id: "7afb193d-9cd6-4fc5-80a2-576cd1c3b7b9", label: "Finansų institucijos" },
          { id: "ef28df1b-a608-486b-af93-96eeba8e6ef9", label: "Taupymas ir investavimas" },
          { id: "ba5e00df-9721-4685-8897-273ac37b0a7c", label: "Draudimo rūšys. Lietuvos pensijų sistema" },
        ] },
        { title: "Verslo organizavimas ir verslumo gebėjimų ugdymasis", subtopics: [
          { id: "9d1deb26-1a42-404a-b319-16824b312d65", label: "Antreprenerystė ir verslas" },
          { id: "0be408ea-f0fb-4813-a183-c8e9746df13b", label: "Verslo formos" },
          { id: "4b6a029b-cc87-44f1-9302-40059d2def93", label: "Verslo idėja" },
          { id: "70205ee0-9342-4178-b641-24fb49d4cbb1", label: "Rinkodara" },
          { id: "9971c1a8-97fd-458c-814f-125bdbd70456", label: "Įmonės organizacinė struktūra" },
          { id: "4a2001ed-c7ef-488e-bba4-db068d5f40c7", label: "Verslo finansavimas" },
          { id: "1f3c8bb6-9de5-4e9b-9aa3-5452e9e8bd6b", label: "Įmonės trumpojo ir ilgojo laikotarpio kaštai" },
          { id: "29a0594c-4a99-4ca5-a4f7-58773a633194", label: "Verslo mokesčiai" },
          { id: "b65757cb-81f2-4e65-9c3f-66e4e2d5b234", label: "Apskaita verslo įmonėje" },
          { id: "cebc5e15-c22e-447d-8881-bcf1b2fab827", label: "Verslo etika" },
          { id: "bd90e99e-e6cd-4377-ac43-2084adf0c591", label: "Inovacijos versle" },
        ] },
      ],
      "10": [
        { title: "Orientavimasis rinkoje", subtopics: [
          { id: "3b6f7895-e5bd-49dd-8905-34a823f4194e", label: "Ekonomikos samprata" },
          { id: "e6eacdd2-f9af-4f21-a95b-680acbc4c667", label: "Alternatyvieji kaštai ir pasirinkimai" },
          { id: "109b7f95-a71c-456d-afbd-2a8d485c8db5", label: "Ekonominės sistemos" },
          { id: "c28e4a03-5ab0-49ba-a1d3-5774c8db566b", label: "Rinkos modelis. Pasiūla, paklausa, rinkos kaina" },
          { id: "dc20cd8b-0e70-4608-9989-f389ccc09f0d", label: "Rinkos konkurencinė struktūra" },
        ] },
        { title: "Asmeninių finansų tvarkymas", subtopics: [
          { id: "f2f098f7-18f0-4517-b2c2-4f9d7c267b07", label: "Pajamų šaltiniai, asmeninės pajamos, asmeninis biudžetas" },
          { id: "eb3db47d-0471-4a78-a84a-922f386c8057", label: "Finansų planavimas" },
          { id: "6121de03-85c8-47dd-8b46-73ac6405e08d", label: "Finansinių įstaigų teikiamos paslaugos. Palūkanų norma" },
          { id: "0f2cb819-bbfc-4997-89a1-135db777d697", label: "Savo finansinio tikslo pagrindimas skaičiavimais" },
          { id: "dddce842-39c5-4da3-89b7-d7ab0353f50d", label: "Biudžetas" },
        ] },
        { title: "Verslo organizavimas ir verslumo gebėjimų ugdymasis", subtopics: [
          { id: "f1bf3e62-b644-4300-b5c8-445aa57b561b", label: "Verslas. Verslumas ir verslas, verslininkas ir vadovas, verslininkas novatorius, lyderystė" },
          { id: "87cd26cf-aa8b-408c-8004-696c74345055", label: "Verslo organizavimo formos" },
          { id: "14c5de6d-e28b-42fa-bf08-6c85b7c2679f", label: "Verslo finansavimas" },
          { id: "eca7c7e1-e5ef-4123-9b6d-1fed2fe656a9", label: "Verslo įmonės kaštai" },
          { id: "05deb72b-c6ed-4046-95d2-5936488ee9ed", label: "Idėjos analizė – verslo planas" },
          { id: "d3a14ea9-e115-43eb-a916-928c2881d1ed", label: "Idėjos įgyvendinimas – įmonės tiekimo grandinė" },
          { id: "37c712fd-fd3d-4813-9c3a-9d7c50cf3c96", label: "Idėjos įgyvendinimas – įmonės struktūra" },
          { id: "605ebf9b-81d9-4ca5-bd0f-c513567db452", label: "Idėjos įgyvendinimas – įmonės finansai" },
          { id: "d206af39-8e37-4402-bb1a-1a0f6be724b0", label: "Idėjos įgyvendinimas – prototipas" },
          { id: "94a89352-4789-4e09-80c1-25968a974b2d", label: "Idėjos įgyvendinimas – marketingas" },
          { id: "2620001c-0901-4f69-a883-7e97a8acf523", label: "Idėjos įgyvendinimas – pristatymas" },
          { id: "3daabb75-b4ce-4b40-bc0e-16d1408b7bf1", label: "Kolegų idėjų vertinimas" },
        ] },
        { title: "Valstybės vaidmens ekonomikoje ir ekonomikos rodiklių nagrinėjimas ir vertinimas", subtopics: [
          { id: "43e0f0ed-2fdd-44a5-bd7f-bc1da501d184", label: "Valstybės vaidmuo ekonominėje apytakoje" },
          { id: "85751025-9e53-43ed-b9b2-41be5dca8d83", label: "Viešosios gėrybės" },
          { id: "72fb25a7-1a51-4f6f-8bc3-22d6392eedf9", label: "Pagrindiniai makroekonominiai rodikliai" },
          { id: "178b1df9-277f-467c-ac23-6a7dd1da65cd", label: "Valstybės biudžetas" },
          { id: "f579f74c-b3af-4f7d-b892-ecdc17ece545", label: "Šešėlinė ekonomika" },
          { id: "c138ea3d-0f0d-4c43-aafa-f68ef1e4f085", label: "Valstybės ekonominė politika" },
        ] },
        { title: "Globalinių ekonominių procesų supratimas", subtopics: [
          { id: "bdb06ad9-e89f-48d6-a230-9950fd6f1252", label: "Atviros ekonomikos modelis" },
          { id: "52870cea-1c60-4292-a8d8-e71c2618ba22", label: "Globalizacija" },
          { id: "068d8da8-e82f-4ee7-8614-3a07b13105f4", label: "Tarptautinės prekybos nauda. Mainai. Šalių specializacija" },
          { id: "e0cbbfa4-b870-48b5-9901-3aaae6ca9789", label: "Valiutos" },
          { id: "04d97877-bae4-4571-bbc7-e6a8913e7d43", label: "Europa ir Lietuva pasaulyje" },
        ] },
      ]
    }
  },
  Istorija: {
    label: "Istorija",
    topicsByClass: {
      "12": [
        { title: "Tarptautiniai santykiai", subtopics: [
          { id: "b9d1512b-1ea7-4d5b-ae48-3e619b2719bf", label: "Civilizaciniai susidūrimai Senovės pasaulyje: Graikų ir persų karai, Aleksandro Makedoniečio užkariavimai, Pūnų karai, romėnų kovos su germanais" },
          { id: "794dbf64-f74e-4a9e-aac7-298e39a1d5c2", label: "Ikimoderniųjų laikų kariniai konfliktai ir šiuolaikinės tarptautinių santykių sistemos susikūrimas" },
          { id: "fb80f08f-8b08-4aaf-8e18-2b3d9ff0a6b9", label: "XX a. pirmosios pusės totaliniai karai ir tautų apsisprendimo bei kolektyvinio saugumo doktrinų įsigalėjimas tarptautiniuose santykiuose" },
          { id: "d0c7a940-8465-4cfb-bb5b-042315263d19", label: "XX a. antrosios pusės dvipolė tarptautinių santykių sistema ir Šaltojo karo konfliktai" },
          { id: "2c78edc9-036a-4674-b4f5-b07226fbf47e", label: "Iššūkiai valstybingumui ir tarptautiniams santykiams XX a. pab.–XXI a." },
          { id: "686a9200-6407-4c2e-952f-c61a1746b46e", label: "LDK karyba ir diplomatija XIII–XVIII a" },
          { id: "3eb44b9f-2ab7-4ed9-a522-c4324f0071ae", label: "Lietuvos valstybės sugrįžimas, įsitvirtinimas tarptautinėje bendruomenėje ir diplomatiniai sukrėtimai" },
          { id: "f3a8ba02-88e6-47cf-86f2-909cb3290d8e", label: "Dviejų karų po pasaulinių karų panašumai ir skirtumai: Lietuvos nepriklausomybės karo (1918–1920 m.) ir Partizanų karo (1944–1953 m.) palyginimas" },
          { id: "94988120-b6a3-4bfc-a653-4093db949eac", label: "Valstybingumas be valstybės (1940–1990 m.): sovietų ir nacių okupacijos, sovietinės aneksijos nepripažinimo politika Vakaruose" },
        ] },
        { title: "Religija ir mentalitetai", subtopics: [
          { id: "7c6ad866-e35d-40ed-bef7-a9c6871156ba", label: "Didžiosios Artimųjų Rytų monoteistinės religijos: judaizmo ir islamo religinių sistemų įtaka individo gyvenimui" },
          { id: "b887801b-7e09-491c-8f15-88439e490d81", label: "Krikščionybės genezė ir plitimas: nuo judėjų krikščionybės iki viduramžių katalikybės" },
          { id: "77c4954b-285a-43c5-be2b-13b4235b334c", label: "Ikimoderniųjų laikų didieji krikščionybės lūžiai ir naujų konfesinių bendruomenių formavimasis: teologinės skirtys ir jų įtaka visuomenėms" },
          { id: "ab66a505-1510-4720-b5bb-6aa74fbf899a", label: "Ar Dievas mirė? Laisvamanybė, sekuliarizacija ir ateizmas XVIII–XX a." },
          { id: "91b98a1b-08a3-43e3-97bf-1ddb01c5f938", label: "Baltų religija ir mitologija: šaltiniai, rekonstrukcija, pasaulėžiūra" },
          { id: "38d0a249-43e8-48e1-be21-1369aaeea6ed", label: "Lietuvos valstybės ir visuomenės krikščionėjimo iššūkiai XIII–XV a." },
          { id: "7baa4012-8cde-4aa9-b08c-e838ccc3c331", label: "LDK konfesinis pliuralizmas ir (ne)sugyvenimas XVI–XVIII a." },
          { id: "f1e4d3cd-4d0c-44a6-8b15-2a186d62f1dd", label: "Religijos reikšmė tapatybei XIX–XX a. pirmosios pusės Lietuvoje" },
          { id: "be649075-992f-462e-ab53-f79728aec2a8", label: "Sovietinė Lietuvos visuomenės ateizacija ir pasipriešinimas jai" },
        ] },
        { title: "Visuomenė: socialinė struktūra, ekonomika, pamatiniai lūžiai", subtopics: [
          { id: "cdc8d7f5-3150-4a5f-8ba8-e7ed7a49100e", label: "Senųjų civilizacijų socialinė-ekonominė struktūra: elitas ir vergovė, miestas ir stambūs ūkiai" },
          { id: "2833dd78-e6c3-4dd1-8be9-0745dbdfc070", label: "Ikimodernioji visuomenė ir jos ekonomika: luomų formavimasis ir visuomenės grupių funkcijos" },
          { id: "1be8d61d-1803-422e-bea3-beff2b8d19c5", label: "Industrinė revoliucija ir visuomenės transformacija" },
          { id: "17d74bc2-d851-4137-a309-e59f0447c674", label: "XX a. moderni visuomenė ir kova už visuotines žmogaus teises" },
          { id: "e2877f7c-e622-4f56-8416-25d2d0a3d533", label: "XX a. pasaulinės ekonomikos asimetrijos: laisvoji rinka, etatizmas ir planinė (totalitarinė) ekonomika" },
          { id: "081c29a3-f197-4a78-9eaf-ebe54b766862", label: "LDK socialinė-ekonominė struktūra XIV–XVIII a.: esminiai lūžiai, socialinės grupės ir jų santykiai" },
          { id: "c4827bb1-9bf4-44a3-af4c-d632a7d27b58", label: "XIX–XX a. pradžios socialinė-ekonominė Lietuvos visuomenės transformacija: agrarinės reformos, visuotinis raštingumas ir lituanizacija" },
          { id: "0075f8f1-8fef-4cdb-a435-f70513635b80", label: "Pasaulio Lietuva: keturios emigracijos bangos ir diaspora pasaulyje XIX a. pab.–XXI a. pr." },
          { id: "d04efc31-40b1-4de7-a1a0-379a129336bf", label: "Okupuotos Lietuvos visuomenės naikinimas, jo pasekmės ir vertinimai: Holokaustas, gyventojų deportacijos, kolektyvizacija" },
          { id: "14309e10-95d7-4609-bfc2-e4a4eba3d7ea", label: "(Po)sovietinė visuomenė ir jos transformacija XX a. pabaigoje" },
        ] },
      ],
      "11": [
        { title: "Istorikas, istorija ir istorinė kultūra", subtopics: [
          { id: "5c687e89-9ab2-480c-80f0-fd9b756ae2bd", label: "Istorija – gyvenimo mokytoja: istorijos samprata ir raida nuo Antikos iki XIX a." },
          { id: "a6def2c4-9fd7-4326-bae2-77059f66762f", label: "Istoriko laboratorija: istorijos šaltinių įvairovė ir istorinis tyrimas" },
          { id: "22a3959a-8fea-4e45-a428-ff401769867a", label: "Istorinio tyrimo ir pasakojimo žanrai ir formos" },
          { id: "ca12abb7-3dc4-4c11-a326-45a3dc61e6f2", label: "Istorijos politika ir atminties karai" },
        ] },
        { title: "Valstybingumas: suverenitetas, idėjos, formos", subtopics: [
          { id: "c2f3b5cb-5da3-4192-894a-f9d5b8dc291d", label: "Senovės pasaulio valstybingumo idėjos ir formos: Rytų despotijos, Atėnų demokratija, Romos imperija" },
          { id: "e56671ef-2854-446f-8c76-7ffd2c196ca8", label: "Ikimoderniųjų laikų valstybė" },
          { id: "0f2aca0a-d388-4ca0-b57d-07b3c3f8dfbf", label: "Ilgojo XIX a. valstybingumo virsmas: tarp dinastinių imperijų ir nacionalinių valstybių" },
          { id: "4142482c-25ce-4b0e-a7cd-46a6596a16d5", label: "Valstybės santykis su visuomene ir individu XX a.: demokratija, autoritarizmas, totalitarizmas" },
          { id: "2059f6f4-2644-4bf3-a384-7a389ade2efb", label: "Valstybingumo transformacijos XX a. antrojoje pusėje: dekolonizacija ir eurointegracija" },
          { id: "ce03f92e-3156-4ec5-82ce-a7718dc76e65", label: "XIII–XVI a. Lietuvos Didžioji Kunigaikštystė: ankstyvoji ir luominė monarchija, personalinė unija su Lenkijos karalyste" },
          { id: "7ea22185-1a11-4faf-a925-b31fd35ec2a5", label: "Abiejų Tautų Respublika: LDK santykis su Lenkijos karalyste ir savarankiškumo problema" },
          { id: "a17cfa11-b691-4a74-9f48-cce0408b09fc", label: "Senojo ir naujojo valstybingumo idėjos XIX a.–XX a. pr.: tarp LDK atkūrimo ir autonomijos" },
          { id: "b197446c-e60a-4b97-a92a-08382141b31e", label: "Lietuvos valstybės atkūrimo (1918–1922 m.) ir nepriklausomybės atkūrimo (1990–1993 m.) skirtumai ir panašumai" },
          { id: "20cb7490-65ad-43c9-877f-f55f717ccc26", label: "Pirmosios ir antrosios Lietuvos Respublikų valstybingumo raidos ypatumai" },
        ] },
        { title: "Kultūra ir mokslas", subtopics: [
          { id: "e29996b5-9a15-45e1-b60d-3827884ffdd2", label: "Antikos pasiekimai ir jų reikšmė kultūros raidai" },
          { id: "25da4b67-edd7-4038-89f5-a8564ad4c7df", label: "Ikimoderniųjų laikų kultūros raiškos formos ir lūžiai: teologija ir literatūra, Gutenbergo ir mokslo revoliucijos" },
          { id: "a6d46b07-692e-4c67-9c6a-205e432e3a39", label: "Apšvieta ir modernybė XVIII a.–XX a. pr.: politinė filosofija, gamtos mokslai ir modernaus meno pradžia" },
          { id: "2d242faf-efb3-411a-bfbc-8acd1f2870cc", label: "Kultūra ir menininko (ne)laisvė XX a. totalitarinėse santvarkose" },
          { id: "54ed6948-041e-4417-b3d0-7a788c00df3f", label: "Pasaulio kultūros paveldas ir jo apsauga: priežastys, objektai, tikslai" },
          { id: "c372f36d-5b49-43ff-ba15-906c4c66e84a", label: "Mokslo ir pažinimo galimybės bei problemos: dirbtinis intelektas, mokslo etinės problemos, humanitarikos reikšmės klausimas" },
          { id: "8b1445e8-57a2-43c4-867e-4f0bb1bba1dc", label: "Lietuvos visuomenės europeizacija XIV–XVIII a." },
          { id: "65e74279-7964-44b5-abe4-48a5f5f7f496", label: "Lietuvos daugiasluoksniškumas XIX–XX a. pr.: viena kitą papildančios ar (ir) tarpusavyje konkuruojančios kultūros" },
          { id: "2623e336-fade-4eee-ad22-4da87fe81cc0", label: "Pirmosios Lietuvos Respublikos kultūros modernėjimas ir mokslo pažanga" },
          { id: "59d811dd-5912-4f68-b1fc-e70f793b7218", label: "Kultūra okupuotoje Lietuvoje: ideologizacija, cenzūra ir sovietinis modernizmas" },
          { id: "aa95e09f-b3c4-449e-ba7b-409a611ddc2e", label: "XX–XXI a. sandūros Lietuva ir atvira visuomenė: kultūros ir mokslo pasiekimai" },
        ] },
        { title: "Žmogus ir aplinka", subtopics: [
          { id: "197c78bc-534b-4c49-b906-abf84e8d58ba", label: "Senųjų civilizacijų individo santykis su gamta: gamtos įvaldymo būdai (didieji projektai), požiūris į gamtą, pasaulio sandaros aiškinimas" },
          { id: "f608146f-989c-45ae-b7f3-04f0ba7e8362", label: "Gyvenimas patogenų „malonėje“: infekcinių ligų protrūkių poveikis individo ir visuomenės gyvenimui ikimoderniaisiais laikais" },
          { id: "6d94d413-07f8-40e2-b929-77e719ffcab9", label: "Naujų energijos šaltinių ir transporto sistemos plėtros poveikis gamtinei aplinkai XIX–XX a. pr." },
          { id: "307b7ad0-0208-424e-9950-7d3676f535c3", label: "XX a. antrosios pusės ekologinės katastrofos ir ekologiniai judėjimai" },
          { id: "dff683d3-1e6b-4b28-93de-92f5e8104d00", label: "Globali klimato kaita kaip XX–XXI a. sandūros pasaulinė politinė problema" },
          { id: "06e31bf3-7226-49d9-8ded-a4b25659b953", label: "LDK kraštovaizdžio ir demografijos kaita" },
          { id: "f5a9a9ed-7a5c-41bc-94e8-fb4efbf942a4", label: "Aplinkos suvaldymas ir žmogaus veiklos pasekmės gamtinei aplinkai XIX–XX a. pradžioje" },
          { id: "10c1b8d8-e5f2-46f8-940a-45b666a9a9ab", label: "Sovietinė modernizacija ir jos poveikis aplinkai" },
        ] },
      ],
      "10": [
        { title: "Naujausieji laikai (1918 m. dabartis)", subtopics: [
          { id: "090cc6ca-c9b0-4dc6-956b-3b088a965481", label: "Įvadas į epochą: globalizacija ir neeuropinio pasaulio iškilimas" },
        ] },
        { title: "Tarpukario Europa", subtopics: [
          { id: "ee052fd0-8edd-4e12-81a9-df96dfb29052", label: "Tarpukario Europos kryžkelė: tarp demokratijos ir totalitarizmo" },
          { id: "cddaa995-2fd2-41a7-a981-e74aed4bbaae", label: "Tarpukario visuomenės kryžkelėje: tarp karų ir krizių" },
          { id: "6564cb56-0d5e-4e07-aa72-64d26a5e1cda", label: "Tarpukario kultūrinis gyvenimas: tarp laisvės ir suvaržymų" },
        ] },
        { title: "Antrasis pasaulinis karas", subtopics: [
          { id: "9997fc13-c730-46d3-9180-1ba0bfc26443", label: "Antrasis pasaulinis karas: žmogiškumo išbandymas" },
        ] },
        { title: "Pasaulis, padalytas geležinės uždangos", subtopics: [
          { id: "8b48b038-7b72-4cab-a207-39fb40327718", label: "Šaltasis karas: pasaulis tarp demokratijos ir komunizmo" },
          { id: "aae5c74c-3bb5-4d84-98c4-61186d3dde92", label: "Visuomenės tarp kapitalizmo ir komunizmo" },
          { id: "760acf69-d3c6-41d7-a28f-301f1a38acb0", label: "Kultūra tarp elitiškumo, masiškumo ir ideologijos" },
        ] },
        { title: "Globalizacija ir pasaulis po 1990-ųjų", subtopics: [
          { id: "486ca4ab-2ff9-45cf-87e2-d68fd5963fb8", label: "Globalaus pasaulio pranašumai ir iššūkiai" },
          { id: "8462dea0-e0b9-4a48-aa61-5dbccdf57a78", label: "Paveldas ir istorinė atmintis: XX a. atmintis ir jos paveldas dabartinėje Lietuvoje" },
        ] },
      ],
      "9": [
        { title: "Naujieji laikai", subtopics: [
          { id: "e83c3683-f287-4b59-8988-e0af1b492204", label: "Įvadas į epochą: modernios visuomenės ir šiuolaikinės valstybės susikūrimas" },
          { id: "9b2229fb-95d0-44b6-a57c-61c4d09153e1", label: "Apšvietos sąjūdis ir šiuolaikinės demokratinės politinės sistemos kūrimosi pradžia" },
          { id: "5a853905-955f-47b6-b815-0c3ae06dda87", label: "XIX a. politinė Europa: revoliucijos ir tautiniai sąjūdžiai, nacionalinės valstybės ir globalios imperijos" },
          { id: "73b6c0a9-b8cc-4002-b28c-d4156f29dbcd", label: "Industrinės visuomenės kūrimasis ir lietuviškasis pasaulis XIX–XX a. pr." },
          { id: "7f9c6a5c-bd3c-41c8-af09-adec5b0f2ee7", label: "Modernusis pasaulis ir masinės kultūros radimasis XIX–XX a. pr." },
          { id: "fb69da75-92ef-449c-9749-473500093be1", label: "Pirmasis pasaulinis karas ir Europos imperijų griūtis." },
          { id: "52e8bddb-c451-4449-9882-5d8cefad50da", label: "Paveldas ir istorinė atmintis: Abiejų Tautų Respublikos atmintis ir nacionalinės valstybės gimimas." },
        ] },
      ]
    }
  },
  Geografija: {
    label: "Geografija",
    topicsByClass: {
      "12": [
        { title: "Ekonominio lygio skirtumai pasaulyje, nelygybės mažinimas", subtopics: [
          { id: "6c28e204-1d91-4de7-b5e9-67f712d8cb79", label: "Valstybių gerovės samprata" },
          { id: "63a9aeee-c186-4545-9a0e-1ab0627ff0e8", label: "Pažangos rodikliai" },
          { id: "f2c2d163-6e83-4ad4-9936-8e29dde54932", label: "Ekonominė plėtra" },
          { id: "0a70a589-67fb-49a4-9188-2372adbdc2ca", label: "Švietimas" },
          { id: "d2c0c941-5b4f-461d-8974-6715e8f1613f", label: "Valstybių nelygybės mažinimas" },
          { id: "2e7bf548-8c44-424e-916b-e07f3e507359", label: "Bendradarbiavimas" },
        ] },
        { title: "Besikeičianti pasaulio ekonomika", subtopics: [
          { id: "5ef83ee9-cdd6-4ad1-97f5-f173ce48f13c", label: "Ekonomikos sektoriai" },
          { id: "0a72dff0-5c55-48ea-8466-a4c17e5e5690", label: "Pramonės kaita" },
          { id: "c7888ac2-69bc-4c52-b1ef-aee09d797def", label: "Pramonės ir paslaugų sektoriaus išsidėstymas" },
          { id: "5c0fefc7-7984-4d3f-9def-ad58da6492b6", label: "Inovacijos" },
          { id: "e50bd4c1-d3de-4868-b936-6f5355ac9e81", label: "Tausojanti ekonomika" },
          { id: "d7bb0674-fffd-46e0-a4ff-7582e7b84d0e", label: "Žemės ūkis" },
          { id: "9f535088-c4de-4672-bd54-eec03d9d3802", label: "Lietuvos žemės ūkis" },
          { id: "797d12f0-eadc-4191-aa1b-472e4192407e", label: "Žemės ūkio specializacija ir intensyvumas" },
        ] },
        { title: "Globalus pasaulis", subtopics: [
          { id: "f1645c45-e2ef-463b-9971-d916b43ef3b9", label: "Globali kultūra" },
          { id: "62097283-ca5f-4d35-a610-d3fa619c8265", label: "Turizmo ištekliai" },
          { id: "97572e44-b34b-4427-a6bb-c66e99371840", label: "Turizmo sektorius" },
          { id: "e129e10a-249a-4df9-b0dc-145b59dd9960", label: "Tarptautinė prekyba" },
          { id: "310a316b-af39-4f39-a553-75bbe5644e7f", label: "Tarptautinės bendrovės" },
          { id: "0ecc5912-0d47-499b-92e5-d6b76b5e47dd", label: "Protekcionizmas" },
        ] },
        { title: "Ištekliai ir darnus jų valdymas", subtopics: [
          { id: "f89965b9-d15a-4a4c-aa01-b4f096bb637f", label: "Maisto, vandens ir energijos išteklių tarpusavio ryšiai ir priklausomybė" },
          { id: "017ca682-08b7-4fd0-bed3-0e65529ed74e", label: "Maisto ištekliai" },
          { id: "c87de884-65d4-4159-be49-61db1dbe7e1b", label: "Vandens ir maisto pasiskirstymas" },
          { id: "e34bdfe4-ef52-4800-a748-b0cadc4a58ff", label: "Geriamo vandens ištekliai" },
          { id: "9a76dee2-a51d-4f23-a5b9-47db94940641", label: "Požeminiai vandenys" },
          { id: "168fc49b-6a30-4ac8-942a-2c87cfe0ca86", label: "Energetiniai ištekliai" },
          { id: "e62192b6-56f0-4c7f-9d13-9a4279ab4618", label: "Energetinių išteklių pasiskirstymas" },
          { id: "92e55bac-4f63-4ffd-8df6-aa01c7e2ea88", label: "Atsinaujinanti energetika" },
        ] },
        { title: "Klimato kaita", subtopics: [
          { id: "5c8c369e-ce0d-445c-b4a7-8c194bf1efbe", label: "Pasaulio temperatūriniai pokyčiai" },
          { id: "3c2c2af0-cb17-440a-9f2e-d77d0a5a6d82", label: "Šiltnamio efektas" },
          { id: "e1830461-695a-431f-922d-1b2d3fe208a0", label: "Antropogeniniai veiksniai klimatui" },
          { id: "4c47407c-a3af-4653-bb38-5c832a6cb7ad", label: "Pokytis geosferose" },
          { id: "02bce328-9780-447c-8fe0-ba93f74110b8", label: "Klimato kaitos padariniai" },
          { id: "fc567ae2-ead8-4850-b710-f3a9b95a7918", label: "Susitarimai ir priemonės" },
          { id: "a99944c8-7eb8-430f-988f-f5de7c7f63d4", label: "Neutralaus gyvenimo būdo principai" },
        ] },
      ],
      "11": [
          { title: "Geografinis mąstymas, Žemės sistema ir globalieji iššūkiai žmonijai", subtopics: [
          { id: "03e58dc0-ae0f-4aeb-b965-621a27465e3c", label: "Geografinis mąstymas" },
          { id: "dd21544d-9cc7-4a74-b94a-2de387982a14", label: "Geosferos" },
          { id: "7a48086f-59cd-4c88-baea-8d9e4cbb6a95", label: "Darnus vystymasis" },
          { id: "a94f0718-b2dc-4279-bf09-8101126eb423", label: "Darnaus vystymosi rodikliai" },
        ] },
          { title: "Vidinės ir išorinės Žemės jėgos bei reljefo kaita", subtopics: [
          { id: "558f629d-053d-48e5-9c0a-2d86612dcfb7", label: "Žemės vidinė sandara" },
          { id: "6260bc84-5622-4ecd-bfc8-83b4a8fa6468", label: "Litosferos plokštės" },
          { id: "e911b00a-5b80-4093-aec1-7dcc2f671403", label: "Vidinės Žemės jėgos" },
          { id: "5edba6c5-d5d1-4beb-9252-d37ec941fa63", label: "Vulkanizmas" },
          { id: "e1a85b94-db92-4455-a297-9c118991940c", label: "Žemės drebėjimai" },
          { id: "f2aec8e8-68c0-4b85-b623-e7545a451c72", label: "Lietuvos gelmių turtai" },
          { id: "3063caba-156e-4584-9ac7-20251b6b3e11", label: "Pasaulio gelmių turtai" },
          { id: "f0f54beb-14ee-4f56-be37-ca28d0ce1586", label: "Dūlėjimas" },
          { id: "a7bfa3a8-df71-43cd-92eb-eabe475b91d3", label: "Gravitacinis medžiagų judėjimas" },
          { id: "4de572c7-a9a4-40a9-a5b5-e26eb0da7be3", label: "Išorinės Žemės jėgos" },
          { id: "8027ff74-f484-46e5-b34f-927ad821fe20", label: "Ledynai" },
          { id: "088cac0f-29ba-445a-ae16-17ccab97c199", label: "Krantai" },
          { id: "ae070eae-e700-44d5-bb0a-3fa3b2c1eb3b", label: "Upės" },
          { id: "a9c11ce3-fc13-46fd-9f36-563e94dd5ec5", label: "Vėjas" },
          { id: "32cda8bc-af36-4c53-8f39-c91fb8baa858", label: "Karstinis reljefas" },
        ] },
          { title: "Atmosferos ir vandenyno procesai", subtopics: [
          { id: "ef73157a-1bd1-4931-b58a-020b52acf1eb", label: "Atmosferos reikšmė" },
          { id: "2402703f-f8dd-49d4-8b11-2fef2b4c5932", label: "Šilumos pasiskirstymas" },
          { id: "bfcf0ad5-fd79-420e-8ab1-7646adbcc87a", label: "Saulės spinduliuotė" },
          { id: "b88f7656-da19-4fe1-a56f-caa3ab55aeca", label: "Atmosferos cirkuliacija" },
          { id: "8f7ad620-1765-409c-9d68-7de1de30c52b", label: "Ciklonai ir anticiklonai" },
          { id: "c8263b6f-3a2b-4b18-acc8-1d05e861e2a3", label: "Tropinė cirkuliacija" },
          { id: "6a5ebddd-84fd-4e05-a6be-add7b49b13a0", label: "Klimato klasifikacija" },
          { id: "ed864fbe-124b-4cdb-8c34-b0ddcb06efa5", label: "Klimato veiksniai" },
          { id: "0c464f08-e6b9-4e17-b70f-df37def35d51", label: "Mikroklimatas" },
          { id: "4c6bd8b3-f4a7-4fd8-839e-dd0e8ba2cb96", label: "Sausumos ir vandens sąveika" },
          { id: "34a2910e-c800-461d-9782-076d5d46dc24", label: "Vandenynai" },
          { id: "31341c0b-4412-403d-9053-edad008552ac", label: "Cirkuliacijos reiškiniai" },
          { id: "3d6c16c5-0c24-47c9-ae9f-898692ebe76b", label: "Tropiniai ciklonai" },
        ] },
          { title: "Geografinis zoniškumas ir dirvožemis", subtopics: [
          { id: "adf15e88-0885-4405-8068-a38ad9f4fd2d", label: "Platuminis geografinis zoniškumas" },
          { id: "464d4f7c-ec40-4177-9e69-5a834356d5a3", label: "Vertikalusis zoniškumas" },
          { id: "35d791df-7156-4dcf-b586-7ef6d595669e", label: "Klimato kaita biosferoms" },
          { id: "663d7e3e-c9e9-46bf-b5c1-31f64c3a2cee", label: "Miškai" },
          { id: "9d7aef90-4414-4a57-adf1-3f624a3f71b3", label: "Dykumos" },
          { id: "685d4bfd-34ca-4faf-aae9-c63ac1915e8c", label: "Dirvožemis" },
          { id: "11366229-9357-4841-9db5-2f98690eac33", label: "Dirvožemių derlingumas" },
        ] },
          { title: "Gyventojai ir migracijos", subtopics: [
          { id: "1c59afee-de3e-4300-816f-c0744c6957ae", label: "Demografiniai rodikliai" },
          { id: "d886662d-c369-4e68-999c-eba257a52440", label: "Socialinės ir ekonominės problemos" },
          { id: "e4ab8c3e-a690-4c37-9056-837de1aef78f", label: "Demografijos politika" },
          { id: "f34ce789-19cb-43a3-b6ce-6b0f4275c7ec", label: "Gyventojų kaita" },
          { id: "dbb36a50-f3ca-4c6d-bc29-619eb351ad4f", label: "Vidinė migracija" },
          { id: "12af877f-35ae-496e-becd-fb2f4ed4bf2c", label: "Išorinė migracija" },
          { id: "d27ac31b-04e4-4024-b256-0c17fee3f005", label: "Diasporos" },
          { id: "c38aa7cf-ef53-4ba1-8ff3-0269187ebab7", label: "Priverstinė migracija" },
        ] },
         { title: "Urbanizacija", subtopics: [
          { id: "3c20f4ad-031d-4487-a60e-c6ad14b823d4", label: "Miestai" },
          { id: "8ab126bb-f834-4f87-bef0-dc024d8c6cd2", label: "Urbanizacija" },
          { id: "4cd05f5b-2818-446e-ac88-be2aa1ce19f9", label: "Hiperurbanizacija" },
          { id: "fc6d4613-ee3b-4166-a4ad-d5bfee388f1e", label: "Miestų funkcinės zonos" },
          { id: "16d9b03a-e783-441b-bbd4-201ded66c648", label: "Miestų mikroklimatas" },
          { id: "3672f954-82b3-4232-8fb5-b4e3899fdf69", label: "Miestų infrastruktūra" },
          { id: "ebd4d8a8-9e38-44dc-8984-213e2ee2a0e9", label: "Ateities miestai" },
        ] },
      ],
      "10": [
        { title: "Kartografinė vizualizacija ir komunikacija", subtopics: [
          { id: "4143d0df-2d73-46e7-b7f8-6052a5561728", label: "Vizualizacija ir komunikacija" },
        ] },
        { title: "Ekonominiai procesai pasaulyje ir Lietuvoje", subtopics: [
          { id: "87c1b12e-36d3-49ba-ad74-f310cce6ade9", label: "Ekonomikos struktūra" },
          { id: "64a138c3-73ea-4ccb-a767-0371d9936b54", label: "Ekonominė geografija" },
          { id: "734ac0c0-c7dc-41bb-a690-abbdc5b9a8e9", label: "Žemės ūkis" },
          { id: "99f5efb2-db25-4918-9003-f727c9745549", label: "Žemės ūkio poveikis gamtai ir technologijos" },
          { id: "c13fab31-c423-4afa-b345-162be0f60b50", label: "Tarptautinės bendrovės" },
        ] },
        { title: "Globalizacija ir pasaulio prekyba", subtopics: [
          { id: "4a4a6665-23bc-49cc-9c86-c96198433a4b", label: "Globalizacija" },
          { id: "c68c1590-ad48-4e5b-a5eb-70cc7d3edc9c", label: "Skaitmeninimo procesas" },
          { id: "geo-physical-1", label: "Jūrų ir oro transportas" },
        ] },
        { title: "Klimato kaita ir klimato apsauga", subtopics: [
          { id: "5b72f1f2-7ab1-46e7-aed5-3d5a7d865163", label: "Klimato kaita" },
          { id: "38dad3cd-ad3f-4b13-8e41-3c45f5dc6540", label: "Klimato apsauga" },
        ] },
        { title: "Praktikos ir tiriamieji darbai", subtopics: [
          { id: "ef4aa466-b9ab-4432-916c-e815fde38111", label: "Praktikos darbai" },
          { id: "4dfb016f-d282-4fa5-9510-72ca048521fe", label: "Tiriamieji darbai" },

        ] },
      ],
      "9": [
        { title: "Pasaulio politinis žemėlapis ir valstybių ekonominės galios skirtumai", subtopics: [
          { id: "43c65769-ff6e-4e11-9b0c-c1ee167a5e78", label: "Pasaulio politinis žemėlapis" },
          { id: "72ab59f9-505a-4055-bb37-6df9dfd18367", label: "Valstybių ekonominiai rodikliai" },
          { id: "02b842a1-bcb2-46b8-a748-f6a484fb9c64", label: "Darnus vystymasis" },
          { id: "6c8beb6c-3602-4da4-b72a-a61ec0c59530", label: "ES regionai" },
        ] },
        { title: "Lietuvos ir pasaulio gyventojai, migracija", subtopics: [
          { id: "a60cfdd2-d988-4d1c-8dc7-a588b744cf44", label: "Gyventojų pasiskirstymas" },
          { id: "b516ba03-2c81-48be-8048-51fe0dfbc538", label: "Gyventojų kaita" },
          { id: "f12c0701-a0b8-4cc3-9d11-3a959f6a21d4", label: "Gyventojų sudėtis" },
          { id: "a22ce91f-f529-4a5f-9288-e2dd84660783", label: "Migracija" },
          { id: "8683be6b-cd9f-4bb5-9f6e-e791ab1fbec9", label: "Demografijos politika" },
        ] },
        { title: "Urbanizacija Lietuvoje ir pasaulyje", subtopics: [
          { id: "72986d31-acae-49ed-970d-58ae19e0c940", label: "Urbanizacija" },
          { id: "42d5e601-3166-4d3d-89aa-0bf460ffaf6a", label: "Megapoliai" },
          { id: "4d482e85-55e8-4d47-ab20-95c48d2014a8", label: "Darnus miestų vystymas" },
        ] },
        { title: "Gamtos ištekliai ir darnus jų naudojimas", subtopics: [
          { id: "c8b595fc-b808-4ec8-8585-229d4eaed397", label: "Gamtos ištekliai" },
          { id: "94bbdc1f-d046-4e88-8ad8-441e8ba86e4d", label: "Vandens ištekliai" },
          { id: "5b8fa012-8c3d-4c50-b169-dc4ba4177e1d", label: "Iškastiniai ištekliai" },
          { id: "5a016d21-1379-403a-9e12-14e0141a2899", label: "Energetiniai ištekliai" },
          { id: "20474fb1-b0b6-4c98-90ab-3906aab3d040", label: "Darnus išteklių naudojimas" },
        ] },
        { title: "Pasaulinis vandenynas ir darnus jo naudojimas", subtopics: [
          { id: "58b98dd1-550c-4d32-8ed5-cbe932f3d959", label: "Pasaulio vandenynai" },
          { id: "7791455c-d523-4642-87fb-5a259e6976ff", label: "Žmogaus ūkinė veikla" },
        ] },
        { title: "Praktikos ir tiriamieji darbai", subtopics: [
          { id: "f7cdaa98-7899-4a5b-9198-9c80e7975185", label: "Praktikos darbai" },
          { id: "608e1db6-f4a9-4a00-995e-c735c01e6579", label: "Tiriamieji darbai" },
        ] },
      ]
    }
  },
};