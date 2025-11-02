document.addEventListener("DOMContentLoaded", () => {
  const input  = document.getElementById("search");
  const select = document.getElementById("filter");
  const cards  = Array.from(document.querySelectorAll("#recipesGrid .recipe-card"));

  // normalizează: litere mici + fără diacritice + spații curate
  const norm = (s="") =>
    s.toLowerCase()
     .normalize("NFD")
     .replace(/\p{Diacritic}/gu, "")
     .replace(/[^a-z0-9\s]/g, " ")
     .replace(/\s+/g, " ")
     .trim();

  // indexăm textul vizibil + atribute utile
  const index = new Map();
  cards.forEach(card => {
    const title = card.querySelector(".card-title")?.textContent || "";
    const dataTitle = card.dataset.title || "";
    const tags = card.dataset.tags || "";
    const course = card.dataset.course || "";
    const cat = card.dataset.category || "";
    index.set(card, norm(`${title} ${dataTitle} ${tags} ${course} ${cat}`));
  });

  // sinonime pentru categorii (merge fără să modifici cardurile)
  const CATEGORY = {
  "toate": null,
  "supe/ciorbe": ["supa","supe","ciorba","ciorbe","bors"],
  "mancaruri": ["mancaruri","felul2","friptura","fripturi","vita","porc","shaorma","frigarui","paste","legume","tocanita"],
  "deserturi": ["desert","deserturi","dulciuri","prajitura","cheesecake","papanasi","brownies","ciocolata"]
};


  function applyFilters() {
    const q = norm(input?.value || "");
    const tokens = q ? q.split(" ") : [];
    const selRaw = (select?.value || "toate").toLowerCase();
    const selKey = norm(selRaw);
    const synonyms = CATEGORY[selRaw] || CATEGORY[selKey] || null;

    cards.forEach(card => {
      const hay = index.get(card);
      const cardCat = norm(card.dataset.category || ""); // dacă mai târziu adaugi data-category

      // filtrul pe categorie: dacă avem sinonime, e suficient să găsim una
      let matchesFilter = true;
      if (synonyms) {
        matchesFilter =
          (cardCat && synonyms.includes(cardCat)) || // preferă data-category dacă există
          synonyms.some(tok => hay.includes(tok));
      }

      // filtrul de căutare: toate cuvintele din query trebuie să apară
      const matchesQuery =
        tokens.length === 0 || tokens.every(tok => hay.includes(tok));

      card.classList.toggle("d-none", !(matchesFilter && matchesQuery));
    });
  }

  // --- PRESELECTARE CATEGORIE DIN URL (?cat=supe / mancaruri / deserturi)
  (function presetCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    let cat = (params.get("cat") || "").toLowerCase();

    // suport și pentru hash #cat=supe, dacă îl folosești
    if (!cat && location.hash.startsWith("#cat=")) {
      cat = location.hash.replace("#cat=", "").toLowerCase();
    }

    if (!select) return;

    // mapări robuste între cod și opțiunile vizibile în select
    const map = {
      "supe": "Supe/Ciorbe",
      "ciorbe": "Supe/Ciorbe",
      "supe-ciorbe": "Supe/Ciorbe",
      "mancaruri": "Mancaruri",
      "deserturi": "Deserturi",
      "toate": "Toate"
    };

    const targetLabel = map[cat];
    if (!targetLabel) return;

    // setează selectul indiferent de capitalizare/accente
    const norm = s => s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu,"").trim();
    const wanted = norm(targetLabel);

    Array.from(select.options).forEach(opt => {
      if (norm(opt.textContent || opt.value) === wanted) {
        select.value = opt.value; // suportă și cazul în care value!=label
      }
    });
  })();

  // rulează filtrarea o dată la încărcare (va prinde și categoria presetată)
  applyFilters();

  input?.addEventListener("input", applyFilters);
  select?.addEventListener("change", applyFilters);
  applyFilters();
});
