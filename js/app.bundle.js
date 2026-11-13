(() => {
  // js/icons.js
  var NS = 'xmlns="http://www.w3.org/2000/svg"';
  function svg(inner, { size = 28, className = "", view = "0 0 24 24" } = {}) {
    return `<span class="ico ${className}" aria-hidden="true"><svg ${NS} width="${size}" height="${size}" viewBox="${view}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${inner}</svg></span>`;
  }
  function terrainPng(file, className, size = 28) {
    return `<span class="ico ico-terrain ${className}" aria-hidden="true"><img class="ico-img" src="./img/terrain/${file}.png" alt="" width="${size}" height="${size}" decoding="async" /></span>`;
  }
  function schoolPng(file, className, size = 28) {
    const src = file === "kot" ? "./img/schools/kot-v10.png?v=10" : `./img/schools/${file}.png?v=10`;
    return `<span class="ico ico-school-img ${className}" aria-hidden="true"><img class="ico-img" src="${src}" alt="" width="${size}" height="${size}" decoding="async" /></span>`;
  }
  function actionPng(file, className = "", { width = 72, height = 28 } = {}) {
    return `<span class="ico ico-action ${className}" aria-hidden="true"><img class="ico-img ico-action-img" src="./img/actions/${file}.png" alt="" width="${width}" height="${height}" decoding="async" /></span>`;
  }
  var ACTION_ICON_FILE = {
    schoolTrain: "action-school-train-b",
    trailGold: "action-trail-gold",
    dicePoker: "action-dice-poker",
    cleanPool: "action-clean-pool",
    trashDraw: "action-trash-draw",
    defenseLevel: "action-defense-level",
    alchemyLevel: "action-alchemy-level",
    specialtyLevel: "action-specialty-level",
    attackLevel: "action-attack-level",
    gainElixir: "action-gain-elixir",
    cintraElixir: "action-gain-elixir"
  };
  var GOLD_COIN_IMAGES = [
    "./img/gold/coin-copper.png?v=4",
    "./img/gold/coin-silver.png?v=4",
    "./img/gold/coin-gold.png?v=4"
  ];
  var ACTION_CARD_IMAGE = "./img/cards/hand-card.png?v=4";
  var CARD_ASPECT = 1024 / 623;
  function goldCoinsHtml(count, { size = 30, className = "", hiddenLabel = true, layout = "inline" } = {}) {
    const full = Math.max(0, Number(count) || 0);
    const cap = layout === "stack" ? 12 : 24;
    const n = Math.max(0, Math.min(cap, full));
    const aria = hiddenLabel ? ` aria-label="${full} z\u0142ota"` : "";
    if (n === 0) {
      return `<span class="gold-coins gold-coins--empty ${className}"${aria}></span>`;
    }
    const stack = layout === "stack" ? " gold-coins--stack" : "";
    const stackStyle = layout === "stack" ? ` style="--coin-size:${size}px;--coin-count:${n}"` : "";
    const imgs = Array.from({ length: n }, (_, i) => {
      const src = GOLD_COIN_IMAGES[i % GOLD_COIN_IMAGES.length];
      const zi = layout === "stack" ? ` style="--i:${i};z-index:${i + 1}"` : "";
      return `<img class="gold-coin-img" src="${src}" alt="" width="${size}" height="${size}" decoding="async" loading="lazy" draggable="false"${zi} />`;
    }).join("");
    const more = full > n ? `<span class="gold-coins__more" title="+${full - n}">+${full - n}</span>` : "";
    return `<span class="gold-coins${stack} ${className}"${stackStyle}${aria}>${imgs}${more}</span>`;
  }
  function actionCardsHtml(count, { height = 36, className = "", hiddenLabel = true, layout = "inline" } = {}) {
    const full = Math.max(0, Number(count) || 0);
    const cap = layout === "fan" ? 10 : 10;
    const n = Math.max(0, Math.min(cap, full));
    const aria = hiddenLabel ? ` aria-label="${full} kart na r\u0119ce"` : "";
    if (n === 0) {
      return `<span class="action-cards action-cards--empty ${className}"${aria}></span>`;
    }
    const w = Math.round(height * CARD_ASPECT);
    const mid = (n - 1) / 2;
    const fan = layout === "fan" ? " action-cards--fan" : "";
    const stepDeg = n === 1 ? 0 : n === 2 ? 24 : n === 3 ? 21 : n === 4 ? 18 : 15;
    const spreadPx = n === 1 ? 0 : n === 2 ? 10 : n === 3 ? 9 : 8;
    const fanStyle = layout === "fan" ? ` style="--card-h:${height}px;--card-w:${w}px;--n:${n}"` : "";
    const imgs = Array.from({ length: n }, (_, i) => {
      if (layout !== "fan") {
        return `<img class="action-card-img" src="${ACTION_CARD_IMAGE}" alt="" width="${w}" height="${height}" decoding="async" loading="lazy" draggable="false" />`;
      }
      const off = i - mid;
      const rot = (i - mid) * stepDeg;
      const z = 50 - Math.round(Math.abs(off) * 12);
      const spread = off * spreadPx;
      const zi = ` style="--fan-rot:${rot}deg;--fan-x:${spread}px;z-index:${z}"`;
      return `<img class="action-card-img" src="${ACTION_CARD_IMAGE}" alt="" width="${w}" height="${height}" decoding="async" loading="lazy" draggable="false"${zi} />`;
    }).join("");
    const more = full > n ? `<span class="action-cards__more" title="+${full - n}">+${full - n}</span>` : "";
    return `<span class="action-cards${fan} ${className}"${fanStyle}${aria}>${imgs}${more}</span>`;
  }
  function orderStartResourcesHtml(cards, gold, opts = {}) {
    const cardHeight = opts.cardHeight ?? 148;
    const coinSize = opts.coinSize ?? 56;
    return `<span class="order-res">
    <span class="order-res__pile order-res__pile--cards">
      <span class="order-res__lbl">Karty</span>
      ${actionCardsHtml(cards, { height: cardHeight, layout: "fan" })}
    </span>
    <span class="order-res__pile order-res__pile--gold">
      <span class="order-res__lbl">Z\u0142oto</span>
      ${goldCoinsHtml(gold, { size: coinSize, layout: "stack" })}
    </span>
  </span>`;
  }
  function actionIconHtml(actionKey, opts = {}) {
    const file = ACTION_ICON_FILE[actionKey];
    if (!file) return "";
    const wide = ["schoolTrain", "trailGold", "cleanPool", "trashDraw"].includes(actionKey);
    return actionPng(file, `ico-action-${actionKey}`, {
      width: opts.width ?? (wide ? 110 : 72),
      height: opts.height ?? 32
    });
  }
  var ICO = {
    /** Żeton las — asset Gemini (3 świerki). */
    forest: () => terrainPng("forest", "ico-forest"),
    /** Żeton góry — asset Gemini (szczyty ze śniegiem). */
    mountain: () => terrainPng("mountain", "ico-mountain"),
    /** Żeton woda — asset Gemini (fale). */
    water: () => terrainPng("water", "ico-water"),
    /** Symbol na karcie: las + góry + woda w jednym okręgu (asset Gemini). */
    wild: () => terrainPng("wild", "ico-wild"),
    gold: () => svg(
      `<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/><path d="M12 8.5v7M9.5 10.5c.6-.7 1.5-1 2.5-1s2 .4 2.5 1M9.5 13.5c.6.7 1.5 1 2.5 1s2-.4 2.5-1"/>`,
      { className: "ico-gold" }
    ),
    shield: () => svg(
      `<path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"/>`,
      { className: "ico-shield" }
    ),
    attack: () => svg(
      `<path d="M14.5 4.5l5 5"/><path d="M16 6l2.5 2.5"/><path d="M13 7L6 14l-1.5 5.5L10 18l7-7"/><path d="M9 15l-2 2"/>`,
      { className: "ico-attack" }
    ),
    defense: () => svg(
      `<path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"/><path d="M9 12l2 2 4-4"/>`,
      { className: "ico-defense" }
    ),
    alchemy: () => svg(
      `<path d="M9 3h6"/><path d="M10 3v4L6 17a4 4 0 004 4h4a4 4 0 004-4l-4-10V3"/><path d="M8.5 14h7"/>`,
      { className: "ico-alchemy" }
    ),
    specialty: () => svg(
      `<path d="M12 3l2.2 4.5L19 8.5l-3.5 3.4.8 4.9L12 14.8 7.7 16.8l.8-4.9L5 8.5l4.8-1L12 3Z"/>`,
      { className: "ico-specialty" }
    ),
    cardBlue: () => svg(
      `<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>`,
      { className: "ico-card-blue" }
    ),
    cardRed: () => svg(
      `<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M12 8v8M9 11h6"/>`,
      { className: "ico-card-red" }
    ),
    cardGreen: () => svg(
      `<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 14c2-4 6-4 8 0"/><circle cx="12" cy="9" r="1.5"/>`,
      { className: "ico-card-green" }
    ),
    cardYellow: () => svg(
      `<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M12 7v5l3 2"/><circle cx="12" cy="17" r="1"/>`,
      { className: "ico-card-yellow" }
    ),
    cardPurple: () => svg(
      `<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 16c0-3 6-3 6-7a3 3 0 10-6 0"/>`,
      { className: "ico-card-purple" }
    ),
    monster: () => svg(
      `<circle cx="12" cy="10" r="5"/><path d="M8 14c0 3 2.5 5 4 5s4-2 4-5"/><path d="M9 9h.01M15 9h.01"/><path d="M6 7l2 1M18 7l-2 1"/>`,
      { className: "ico-monster" }
    ),
    quest: () => svg(
      `<path d="M8 4h8a2 2 0 012 2v14l-6-3-6 3V6a2 2 0 012-2Z"/><path d="M10 9h4M10 13h3"/>`,
      { className: "ico-quest" }
    ),
    dice: () => svg(
      `<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="9" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="9" cy="15" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r="1.2" fill="currentColor" stroke="none"/>`,
      { className: "ico-dice" }
    ),
    move: () => svg(
      `<path d="M5 12h11"/><path d="M12 7l5 5-5 5"/><circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/>`,
      { className: "ico-move" }
    ),
    trophy: () => svg(
      `<path d="M8 5h8v3a4 4 0 01-8 0V5Z"/><path d="M8 6H5a2 2 0 002 3"/><path d="M16 6h3a2 2 0 01-2 3"/><path d="M12 12v3"/><path d="M9 20h6"/><path d="M10 17h4v3h-4z"/>`,
      { className: "ico-trophy" }
    ),
    phase1: () => svg(`<circle cx="12" cy="12" r="9"/><path d="M11 8v8"/><path d="M9.5 8H13"/>`, { className: "ico-phase" }),
    phase2: () => svg(
      `<circle cx="12" cy="12" r="9"/><path d="M9 9.5c0-1.5 1.2-2.5 3-2.5s3 1 3 2.5-1.2 2-3 2.5-3 1.2-3 2.5 1.2 2.5 3 2.5 3-1 3-2.5"/>`,
      { className: "ico-phase" }
    ),
    phase3: () => svg(
      `<circle cx="12" cy="12" r="9"/><path d="M9 9.5c.4-1.4 1.5-2.5 3.2-2.5 1.7 0 2.8 1 2.8 2.4S14 12 12.2 12H11"/><path d="M9 14.5c.4 1.4 1.5 2.5 3.2 2.5 1.7 0 2.8-1 2.8-2.4"/>`,
      { className: "ico-phase" }
    ),
    schoolWilk: () => schoolPng("wilk", "ico-school"),
    schoolGryf: () => schoolPng("gryf", "ico-school"),
    schoolNiedzwiedz: () => schoolPng("niedzwiedz", "ico-school"),
    schoolKot: () => schoolPng("kot", "ico-school"),
    schoolZmija: () => schoolPng("zmija", "ico-school"),
    schoolMantikora: () => schoolPng("mantikora", "ico-school"),
    /** Znaki akcji obszarów (Gemini). */
    actionAttack: () => actionPng("action-attack-level", "ico-loc-action", { width: 72, height: 32 }),
    actionDefense: () => actionPng("action-defense-level", "ico-loc-action", { width: 72, height: 32 }),
    actionAlchemy: () => actionPng("action-alchemy-level", "ico-loc-action", { width: 72, height: 32 }),
    actionSpecialty: () => actionPng("action-specialty-level", "ico-loc-action", { width: 72, height: 32 }),
    actionSchool: () => actionPng("action-school-train-b", "ico-loc-action", { width: 110, height: 32 }),
    actionElixir: () => actionPng("action-gain-elixir", "ico-loc-action", { width: 72, height: 32 }),
    actionDice: () => actionPng("action-dice-poker", "ico-loc-action", { width: 56, height: 32 }),
    actionTrail: () => actionPng("action-trail-gold", "ico-loc-action", { width: 110, height: 32 }),
    actionTrash: () => actionPng("action-trash-draw", "ico-loc-action", { width: 110, height: 32 }),
    actionClean: () => actionPng("action-clean-pool", "ico-loc-action", { width: 110, height: 32 }),
    actionQuest: () => actionPng("action-quest-mark", "ico-loc-action", { width: 56, height: 32 }),
    attrAttackPng: () => actionPng("attr-attack", "", { width: 28, height: 28 }),
    attrDefensePng: () => actionPng("attr-defense", "", { width: 28, height: 28 }),
    attrAlchemyPng: () => actionPng("attr-alchemy", "", { width: 28, height: 28 }),
    attrSpecialtyPng: () => actionPng("attr-specialty", "", { width: 28, height: 28 }),
    elixir: () => svg(
      `<path d="M10 3h4"/><path d="M11 3v3.5L7.5 14a4.2 4.2 0 003.8 6h1.4a4.2 4.2 0 003.8-6L13 6.5V3"/><path d="M9 15c1.5 1 4.5 1 6 0"/><circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none"/>`,
      { className: "ico-elixir" }
    ),
    burn: () => svg(
      `<path d="M12 21c3.5 0 5.5-2.2 5.5-5.2 0-2.6-1.6-4.2-3.2-5.6.2 1.6-.4 2.6-1.3 3.2.1-2.4-1.1-4.4-3.5-6.4 0 2.8-1.2 4.4-2.4 5.6C5.8 14.2 6.5 21 12 21Z"/>`,
      { className: "ico-burn" }
    ),
    discard: () => svg(
      `<rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 9l6 6M15 9l-6 6"/>`,
      { className: "ico-discard" }
    ),
    fatigue: () => svg(
      `<path d="M5 19h14"/><path d="M8 19V9l4-4 4 4v10"/><path d="M10 13h4M10 16h4"/>`,
      { className: "ico-fatigue" }
    ),
    reputation: () => svg(
      `<circle cx="12" cy="12" r="9"/><path d="M8 14l2.5-5L12 12l1.5-3L16 14"/><path d="M7 17h10"/>`,
      { className: "ico-reputation" }
    ),
    hand: () => svg(
      `<path d="M7 11V8.5a1.5 1.5 0 013 0V11"/><path d="M10 11V7.5a1.5 1.5 0 013 0V11"/><path d="M13 11V8a1.5 1.5 0 013 0v6.5a4.5 4.5 0 01-4.5 4.5H12a5 5 0 01-5-5V12"/><path d="M7 12H5.5A1.5 1.5 0 004 13.5v.5"/>`,
      { className: "ico-hand" }
    )
  };
  var SCHOOL_ICON = {
    wilk: ICO.schoolWilk,
    gryf: ICO.schoolGryf,
    niedzwiedz: ICO.schoolNiedzwiedz,
    kot: ICO.schoolKot,
    zmija: ICO.schoolZmija,
    mantikora: ICO.schoolMantikora
  };
  function chip(iconFn, label) {
    return `<span class="ico-chip">${iconFn()}${label}</span>`;
  }
  function iconsLegendHtml() {
    const row = (items, rowClass = "") => `<div class="ico-legend-row${rowClass ? ` ${rowClass}` : ""}">${items.map(([fn, label, hint]) => {
      const text = hint ? `<div class="ico-legend-text"><strong>${label}</strong><span>${hint}</span></div>` : `<div class="ico-legend-text"><strong>${label}</strong></div>`;
      return `<div class="ico-legend-item"><div class="ico-legend-ico">${fn()}</div>${text}</div>`;
    }).join("")}</div>`;
    return `
    <h3>Teren</h3>
    ${row(
      [
        [ICO.forest, "Las"],
        [ICO.mountain, "G\xF3ry"],
        [ICO.water, "Woda"],
        [ICO.wild, "Uniwersalny"]
      ],
      "ico-legend-row--terrain"
    )}

    <h3>Znaki lokacji</h3>
    <p class="note">Akcje fazy I \u2014 opcjonalne, raz na tur\u0119. Walka z potworem to osobny wyb\xF3r w fazie II.</p>
    ${row([
      [ICO.actionSchool, "Szko\u0142a", "Z\u0142oto = poziom docelowy \u2192 +1 atak/obrona/alchemia; specjalno\u015B\u0107 tylko we w\u0142asnej szkole."],
      [ICO.actionAttack, "+ Atak", "Atak \u2264 poziom \u2192 +1 atak (Ard Modron)."],
      [ICO.actionDefense, "+ Obrona", "Obrona \u2264 poziom \u2192 +1 obrona (Cidaris)."],
      [ICO.actionAlchemy, "+ Alchemia", "Alchemia \u2264 poziom \u2192 +1 alchemia + eliksir (Ban Ard)."],
      [ICO.actionSpecialty, "+ Specjalno\u015B\u0107", "Specjalno\u015B\u0107 \u2264 poziom \u2192 +1 (Glenmore)."],
      [ICO.actionElixir, "+ Eliksir", "Dobierz 1 eliksir, max 4 (Beauclair, Dhuwod, Cintra)."],
      [ICO.actionDice, "Poker", "Ko\u015Bciany poker z miejscowymi (Novigrad, Loc Ichaer)."],
      [ICO.actionTrail, "Tropienie", "+1 z\u0142oto; opcja 1 z\u0142oto \u2192 zadanie tropienia (Hengfors, Doldeth)."],
      [ICO.actionClean, "Wyzima", "0 z\u0142ota \u2192 +1; mo\u017Cesz spali\u0107 karty z puli (p\u0142omienie)."],
      [ICO.actionTrash, "Vengerberg", "Usu\u0144 1 z r\u0119ki \u2192 kup 1 z puli (koszt \u2264+1)."]
    ])}

    <h3>Atrybuty i zasoby</h3>
    ${row([
      [ICO.attrAttackPng, "Atak", "Dob\xF3r kart w walce"],
      [ICO.attrDefensePng, "Obrona", "+1 obrona \u2192 +1 tarcza"],
      [ICO.attrAlchemyPng, "Alchemia", "Limit eliksir\xF3w w walce"],
      [ICO.attrSpecialtyPng, "Zdolno\u015B\u0107 szko\u0142y", "Raz na walk\u0119; trening tylko w swojej szkole"],
      [ICO.gold, "Z\u0142oto"],
      [ICO.shield, "Tarcza", "Po walce reset do obrony"],
      [ICO.trophy, "Trofeum"],
      [ICO.elixir, "Eliksir", "Max 4"],
      [ICO.dice, "Ko\u015Bci"],
      [ICO.hand, "R\u0119ka", "Limit 7"]
    ])}

    <h3>Karty i reputacja</h3>
    ${row([
      [ICO.burn, "Usu\u0144 z gry", "Do pude\u0142ka na sta\u0142e"],
      [ICO.discard, "Odrzu\u0107", "Na stos odrzuconych"],
      [ICO.fatigue, "Zm\u0119czenie", "Usu\u0144 karty wg toru reputacji"],
      [ICO.reputation, "Reputacja", "4 z walki = wygrana"],
      [ICO.move, "Ruch"],
      [ICO.monster, "Potw\xF3r"],
      [ICO.quest, "Zadanie"]
    ])}

    <h3>Szko\u0142y</h3>
    ${row(
      [
        [ICO.schoolWilk, "Wilk", "Szermierka \xB7 Kaer Morhen"],
        [ICO.schoolGryf, "Gryf", "Magia \xB7 Kaer Seren"],
        [ICO.schoolNiedzwiedz, "Nied\u017Awied\u017A", "Zbroja \xB7 Haern Caduch"],
        [ICO.schoolKot, "Kot", "Szybko\u015B\u0107 \xB7 Stygga"],
        [ICO.schoolZmija, "\u017Bmija", "Zatruta stal \xB7 Gorthur Gvaed"],
        [ICO.schoolMantikora, "Mantikora", "Behelt Nar (#0)"]
      ],
      "ico-legend-row--schools"
    )}
  `;
  }

  // js/sources.js
  var SCHOOLS = [
    { id: "wilk", name: "Szko\u0142a Wilka", short: "Wilk" },
    { id: "gryf", name: "Szko\u0142a Gryfa", short: "Gryf" },
    { id: "niedzwiedz", name: "Szko\u0142a Nied\u017Awiedzia", short: "Nied\u017Awied\u017A" },
    { id: "kot", name: "Szko\u0142a Kota", short: "Kot" },
    { id: "zmija", name: "Szko\u0142a \u017Bmii", short: "\u017Bmija" }
  ];
  var SCHOOL_ID_ALIASES = {
    wolf: "wilk",
    wilk: "wilk",
    griffin: "gryf",
    gryf: "gryf",
    bear: "niedzwiedz",
    niedzwiedz: "niedzwiedz",
    cat: "kot",
    kot: "kot",
    viper: "zmija",
    zmija: "zmija"
  };
  function canonicalSchoolId(schoolId) {
    const raw = String(schoolId || "").trim().toLowerCase();
    if (!raw) return SCHOOLS[0].id;
    if (SCHOOLS.some((s) => s.id === raw)) return raw;
    const mapped = SCHOOL_ID_ALIASES[raw];
    if (mapped && SCHOOLS.some((s) => s.id === mapped)) return mapped;
    return SCHOOLS[0].id;
  }
  var SOURCES = [
    {
      id: "rebel-rules",
      title: "Oficjalna instrukcja PL (Rebel)",
      url: "https://files.rebel.pl/files/instrukcje/Instrukcja_Wiedzmin-Stary-Swiat.pdf",
      kind: "instrukcja",
      notes: "\u0179r\xF3d\u0142o nadrz\u0119dne dla setupu, 3 faz tury, walki, solo."
    },
    {
      id: "rebel-faq",
      title: "Oficjalne FAQ PL v1.0 (jesie\u0144 2023) \u2014 sekcja podstawki",
      url: "https://files.rebel.pl/files/instrukcje/Wiedzmin-FAQ_PL_02-Q4_2023.pdf",
      kind: "faq",
      notes: "Wyja\u015Bnienia: atak, kombinacje, tropy, limit r\u0119ki, kupno w fazie III, tarcza po +obronie."
    },
    {
      id: "yt-ontable",
      title: "On Table \u2014 wideoinstrukcja (rozdzia\u0142y)",
      url: "https://ontable.pl/wiedzmin-stary-swiat%E2%94%82-zasady-gry-%E2%94%82-jak-grac/",
      kind: "youtube-outline",
      notes: "PL: setup 00:22\u201309:20, faza I 10:26\u201320:39, faza II walka/eksploracja/medytacja 21:07\u201346:16, faza III 46:46\u201349:00. Bez dodatk\xF3w w g\u0142\xF3wnej \u015Bcie\u017Cce."
    },
    {
      id: "yt-hkzl",
      title: "YouTube: Wied\u017Amin Stary \u015Awiat | Gra Planszowa (HKzLXVLM53M)",
      url: "https://www.youtube.com/watch?v=HKzLXVLM53M",
      kind: "youtube-transcript-partial",
      notes: "Fragmenty napis\xF3w/opisu: 5 szk\xF3\u0142, 18 lokacji, 3 poziomy potwor\xF3w, start od 3 potwor\xF3w I, zdarzenia nienumerowane tasowaniem, eksploracja miasto/dzikie, karty akcji do ruchu i kombinacji kolor\xF3w w walce, trofea = wygrana."
    },
    {
      id: "yt-fight",
      title: "YouTube: fighting in the old world (Rw3qTgcxuIw)",
      url: "https://www.youtube.com/watch?v=Rw3qTgcxuIw",
      kind: "youtube-transcript-partial",
      notes: "Walka: obra\u017Cenia zrzucaj\u0105 karty z talii potwora; dob\xF3r = atak \xB1 modyfikatory; tarcza/Quen; zdolno\u015Bci potwor\xF3w (np. harpia obni\u017Ca atak w 1. turze)."
    },
    {
      id: "yt-bgs",
      title: "Board Game Shortcut \u2014 How to Play (EN, rozdzia\u0142y)",
      url: "https://boardgamegeek.com/video/572652/the-witcher-old-world/how-to-play-the-witcher-the-old-world-board-game-s",
      kind: "youtube-outline",
      notes: "Setup \u2192 faza I (ruch, poker, szko\u0142y, eliksiry, tropy) \u2192 faza II (eksploracja, medytacja, walka) \u2192 rozstrzygni\u0119cia walk \u2192 faza III i zwyci\u0119stwo. Bez Monster Trail w tym filmie."
    },
    {
      id: "faq-dieneverdies",
      title: "FAQ spo\u0142eczno\u015Bci (The Die Never Dies)",
      url: "https://thedieneverdies.net/faq-the-witcher-old-world/",
      kind: "forum-faq",
      notes: "Must move przed akcj\u0105 startow\u0105; trash/burn = usuni\u0119cie z gry; eliksiry max 4, w walce \u0142\u0105cznie \u2264 alchemii; tarcza \u2264 obrona, po walce reset do obrony; awans gdy wszystkie atrybuty > poziomu."
    },
    {
      id: "reddit-newplayer",
      title: "Reddit r/TheWitcherOldWorld \u2014 pytania nowych graczy",
      url: "https://www.reddit.com/r/TheWitcherOldWorld/comments/14io00u/few_questions_from_new_player/",
      kind: "forum",
      notes: "Obra\u017Cenia: tarcza \u2192 talia wytrzyma\u0142o\u015Bci \u2192 r\u0119ka. Szko\u0142a: koszt = poziom docelowy. Darmowy trening tylko gdy atrybut \u2264 poziomu wied\u017Amina."
    }
  ];
  var RULE_CORRECTIONS = [
    {
      title: "Start tury \u2014 najpierw ruch",
      body: "Instrukcja: na pocz\u0105tku fazy I musisz wykona\u0107 1 obowi\u0105zkowy ruch albo przej\u015B\u0107 do fazy II. Nie zaczynasz tury akcj\u0105 obszaru, na kt\xF3rym ju\u017C stoisz."
    },
    {
      title: "Faza III \u2014 dob\xF3r do 3 (nie do 7)",
      body: "Po opcjonalnym odrzuceniu dobierasz, by mie\u0107 3 karty na r\u0119ce, potem kupujesz 1. Limit 7 to osobny sufit (FAQ Rebel #25)."
    },
    {
      title: "Usuwanie kart \u2260 odrzucenie",
      body: "\u201EUsu\u0144 z gry\u201D / trash / burn / zm\u0119czenie = karta wraca do pude\u0142ka na sta\u0142e. Odrzucenie = na Tw\xF3j stos odrzuconych."
    },
    {
      title: "Limit r\u0119ki 7",
      body: "Poza walk\u0105: je\u015Bli dob\xF3r przekroczy\u0142by 7, najpierw odrzu\u0107 z r\u0119ki tak, by po dobraniu mie\u0107 \u22647 (FAQ Rebel #25). W walce: przy 7 kartach nie dobierasz dalej."
    },
    {
      title: "Faza III \u2014 kupno",
      body: "Koszt karty z puli = odrzucenie kart z r\u0119ki (nie z\u0142oto), wg nadruku \xB1 pole. Kupno obowi\u0105zkowe; FAQ Rebel #26: je\u015Bli obiektywnie nie mo\u017Cesz \u2014 pomijasz."
    },
    {
      title: "Eliksiry",
      body: "Max 4 na stole (niezale\u017Cnie od alchemii). W ca\u0142ej walce mo\u017Cesz zu\u017Cy\u0107 \u0142\u0105cznie tyle eliksir\xF3w, ile wynosi poziom alchemii."
    },
    {
      title: "Tarcza",
      body: "Nigdy powy\u017Cej obrony. Po walce ustaw tarcz\u0119 na poziom obrony. +1 obrona zawsze daje +1 tarcz\u0119 (nawet gdy tarcza by\u0142a 0) \u2014 FAQ #21."
    },
    {
      title: "Szko\u0142a \u2014 koszt treningu",
      body: "Koszt w z\u0142ocie = aktualny poziom atrybutu + 1 (czyli tyle, ile wynosi poziom docelowy). Zdolno\u015B\u0107 specjaln\u0105 rozwijasz tylko w swojej szkole."
    },
    {
      title: "Tropy / \u017Ceton tropu",
      body: "\u017Beton tropu = \u017Ceton obszaru odwr\xF3cony na symbol terenu (po wykonaniu zadania tropienia). Zadanie: najpierw \u017Ceton nazw\u0105 do g\xF3ry + z\u0142oto na nim; po wej\u015Bciu na lokacj\u0119 bierzesz z\u0142oto i odwracasz. Trop \u2192 cz\u0119sto Ty zaczynasz walk\u0119 z tym potworem. Max 1 na rodzaj terenu; konflikt \u2192 stare znika bez z\u0142ota (FAQ #10)."
    },
    {
      title: "Koszt karty z eksploracji",
      body: "Gdy efekt ka\u017Ce wzi\u0105\u0107 kart\u0119 o koszcie X \u2014 liczy si\u0119 koszt nadrukowany, nie pole \u22121/+1 (to tylko faza III) \u2014 FAQ #11."
    },
    {
      title: "Medytacja nie ko\u0144czy gry",
      body: "4. reputacji wygrywa tylko trofeum z walki. Medytacja jako \u201Eostatnie\u201D trofeum: bierzesz kart\u0119, bez +reputacji i bez ko\u0144ca gry."
    }
  ];
  function sourcesHtml() {
    const list = SOURCES.map(
      (s) => `
    <li>
      <strong><a href="${s.url}" target="_blank" rel="noopener">${s.title}</a></strong>
      <span class="badge">${s.kind}</span>
      <div>${s.notes}</div>
    </li>`
    ).join("");
    const fixes = RULE_CORRECTIONS.map(
      (f) => `<li><strong>${f.title}</strong><div>${f.body}</div></li>`
    ).join("");
    return `
    <p class="lead">Zasady w helperze s\u0105 oparte na instrukcji Rebel + FAQ oficjalnym. Poni\u017Cej skr\xF3ty film\xF3w/for\xF3w (tylko podstawka).</p>
    <p class="note">YouTube blokuje bezpo\u015Brednie pobieranie napis\xF3w z serwer\xF3w chmurowych \u2014 w projekcie jest pakiet <code>research/</code> ze spisami rozdzia\u0142\xF3w YT, cytatami z PDF Rebel i FAQ spo\u0142eczno\u015Bci.</p>
    <h3>\u0179r\xF3d\u0142a</h3>
    <ul class="checklist">${list}</ul>
    <h3>Pu\u0142apki i doprecyzowania (zweryfikowane)</h3>
    <ul class="checklist">${fixes}</ul>
    <h3>Faza III \u2014 nie myli\u0107 z limitem 7</h3>
    <p class="tip">Instrukcja: dobierz do <strong>3</strong> kart na r\u0119ce, potem kup 1. Limit <strong>7</strong> to sufit (FAQ #25), nie cel doboru w fazie III.</p>
  `;
  }

  // js/school-trophy-prep.js
  var TROPHY_BACK_FALLBACK = "./img/trophies/school/niedzwiedz-back.png";
  function schoolTrophyBackSrc(schoolId) {
    const id = canonicalSchoolId(schoolId);
    return `./img/trophies/school/${id}-back.png`;
  }
  var POOL_SIZE = 4;
  var TROPHY_PICK_ROMAN = ["I", "II", "III", "IV"];
  function trophyPickRoman(pickCount) {
    return TROPHY_PICK_ROMAN[pickCount - 1] ?? String(pickCount);
  }
  function trophyTitle(pickCount) {
    const r = trophyPickRoman(pickCount);
    if (pickCount === 1) return `${r} karta trofeum`;
    return `${r} karty trofeum`;
  }
  function trophyInsertPhrase(pickCount) {
    if (pickCount === 1) return "W\u0142\xF3\u017C 1 kart\u0119";
    return `W\u0142\xF3\u017C ${pickCount} karty`;
  }
  function trophyRestPhrase(restToBox) {
    if (restToBox <= 0) return "";
    if (restToBox === 1) return " Pozosta\u0142\u0105 kart\u0119 schowaj do pude\u0142ka.";
    return ` Pozosta\u0142e ${restToBox} karty schowaj do pude\u0142ka.`;
  }
  function schoolTrophyPrepScenario(playerCount) {
    const n = Math.min(5, Math.max(2, Number(playerCount) || 2));
    const opponents = n - 1;
    const pickCount = opponents;
    const restToBox = POOL_SIZE - pickCount;
    const insertPart = trophyInsertPhrase(pickCount);
    const instruction = `Potasuj 4 karty trofeum. ${insertPart} w g\xF3rn\u0105 cz\u0119\u015B\u0107 planszetki po lewej stronie (jedna na drug\u0105).` + trophyRestPhrase(restToBox);
    return {
      playerCount: n,
      opponents,
      pickCount,
      poolSize: POOL_SIZE,
      restToBox,
      title: trophyTitle(pickCount),
      instruction
    };
  }

  // js/content.js
  var PLAYER_BOARD_SCAN_SRC = "./img/setup/planszetka-gracza.png";
  var PLAYER_BOARD_MAT_SRC = "./img/setup/planszetka-mat.png";
  var PLAYER_BOARD_POLA_SRC = "./img/setup/planszetka-pola.png";
  var START_RESOURCES = {
    1: [{ cards: 5, gold: 3 }],
    2: [
      { cards: 3, gold: 2 },
      { cards: 5, gold: 4 }
    ],
    3: [
      { cards: 3, gold: 2 },
      { cards: 4, gold: 4 },
      { cards: 5, gold: 6 }
    ],
    4: [
      { cards: 2, gold: 4 },
      { cards: 3, gold: 5 },
      { cards: 4, gold: 6 },
      { cards: 5, gold: 7 }
    ],
    5: [
      { cards: 2, gold: 5 },
      { cards: 3, gold: 5 },
      { cards: 4, gold: 5 },
      { cards: 4, gold: 7 },
      { cards: 5, gold: 7 }
    ]
  };
  var PLAYER_LABELS = [
    "Pierwszy gracz",
    "Drugi gracz",
    "Trzeci gracz",
    "Czwarty gracz",
    "Pi\u0105ty gracz"
  ];
  var SOLO_POKER_TABLE = `
  <table class="table">
    <thead><tr><th>Uk\u0142ad</th><th>Nagroda ze banku</th></tr></thead>
    <tbody>
      <tr><td>Para</td><td>0 z\u0142ota</td></tr>
      <tr><td>Dwie pary</td><td>1 z\u0142oto</td></tr>
      <tr><td>Tr\xF3jka</td><td>2 z\u0142ota</td></tr>
      <tr><td>Ma\u0142y strit</td><td>3 z\u0142ota</td></tr>
      <tr><td>Du\u017Cy strit</td><td>3 z\u0142ota</td></tr>
      <tr><td>Full</td><td>4 z\u0142ota</td></tr>
      <tr><td>Kareta</td><td>5 z\u0142ota</td></tr>
      <tr><td>Poker</td><td>6 z\u0142ota</td></tr>
    </tbody>
  </table>
`;
  var SOLO_SCORE_TABLE = `
  <table class="table">
    <thead><tr><th>Liczba tur</th><th>Wynik</th></tr></thead>
    <tbody>
      <tr><td>13+</td><td>Nie\u017Ale jak na \u017C\xF3\u0142todzioba\u2026</td></tr>
      <tr><td>11\u201312</td><td>Mo\u017Cna na Tobie polega\u0107.</td></tr>
      <tr><td>9\u201310</td><td>Profesjonalista \u2014 \u015Bwiat Ci\u0119 potrzebuje.</td></tr>
      <tr><td>7\u20138</td><td>Na drodze do legendy.</td></tr>
      <tr><td>6 i mniej</td><td>\u017Bywa legenda!</td></tr>
    </tbody>
  </table>
`;
  function buildSetupSteps(playerCount, roster = []) {
    if (playerCount === 1) return buildSoloSetupSteps(roster[0]);
    return buildMultiSetupSteps(playerCount, roster);
  }
  function buildSoloSetupSteps(player) {
    const who = player ? `<strong>${escapeLite(player.name)}</strong>` : "Ty";
    return [
      {
        id: "intro",
        title: "Solo \u2014 zaczynamy",
        body: `
        <p class="lead">Wariant <strong>solo</strong> (1 osoba). Przygotowanie jak dla 2\u20133 graczy, z kilku wa\u017Cnymi zmianami z instrukcji (str. 33).</p>
        <div class="badge-row">
          <span class="badge">Solo</span>
          <span class="badge">Tylko podstawka</span>
          <span class="badge">Cel: 3 potwory + trofeum atrybutu</span>
        </div>
        <p class="tip">Gracz: ${who}. Helper <strong>sam liczy tury</strong> (wida\u0107 je w zak\u0142adce Tura).</p>
      `
      },
      {
        id: "board",
        title: "Plansza na \u015Brodku",
        body: ``
      },
      {
        id: "action-deck",
        title: "Wsp\xF3lna talia akcji",
        body: ``
      },
      {
        id: "monsters",
        title: "Potwory na start (solo!)",
        body: `
        <ol class="checklist">
          <li><strong>Zamiast 3\xD7 poziom I:</strong> dobierz <strong>po 1 \u017Cetonie</strong> z wierzchu stos\xF3w <strong>I, II i III</strong>.</li>
          <li>Odkryj \u017Cetony \u2192 przenie\u015B na obszary z \u017Ceton\xF3w obszar\xF3w \u2192 dopasuj karty potwor\xF3w.</li>
          <li><strong>W helperze:</strong> przy 3 ikonach terenu podaj <strong>numer obszaru</strong> z \u017Cetonu (strza\u0142ki albo wpisz) i ustaw poziom \u2014 potem w fazie II walka opcjonalna po wej\u015Bciu.</li>
        </ol>
        <p class="note">Jeden potw\xF3r na teren (las / g\xF3ry / woda).</p>
      `
      },
      {
        id: "map-pawns",
        title: "\u017Betony i figurki na mapie",
        mapPawnsPrep: true
      },
      {
        id: "solo-help",
        title: "Karta pomocy solo",
        body: `
        <p>We\u017A <strong>kart\u0119 pomocy do wariantu solo</strong> i po\u0142\xF3\u017C obok planszetki. Przyda si\u0119 do ko\u015Bcianego pokera.</p>
        <p>We\u017A te\u017C zwyk\u0142e karty pomocy (przebieg tury itd.), je\u015Bli chcesz mie\u0107 \u015Bci\u0105g\u0119 przy r\u0119ce.</p>
      `
      },
      {
        id: "player-solo",
        title: player ? `Tw\xF3j wied\u017Amin (${escapeLite(player.name)})` : "Tw\xF3j wied\u017Amin",
        body: `
        <ol class="checklist">
          <li><strong>1.</strong> We\u017A planszetk\u0119 szko\u0142y, kt\xF3r\u0105 wybra\u0142e\u015B w helperze (albo inn\u0105 \u2014 zaktualizuj potem w zak\u0142adce Gracze).</li>
          <li><strong>2.</strong> \u017Beton reputacji szko\u0142y na 0 na torze reputacji.</li>
          <li><strong>3.</strong> Figurka na obszarze <strong>swojej szko\u0142y</strong>.</li>
          <li><strong>4.</strong> 5 znacznik\xF3w na najni\u017Cszych polach atrybut\xF3w + poziomu wied\u017Amina.</li>
          <li><strong>5.</strong> Trofea szko\u0142y przeciwnik\xF3w \u2014 <strong>pomijasz</strong> (nie ma pojedynk\xF3w PvP).</li>
          <li><strong>6.</strong> Tarcza na polu <strong>\u201E1\u201D</strong>.</li>
          <li><strong>7.</strong> Potasuj 10 startowych kart akcji swojej szko\u0142y \u2192 talia z lewej.</li>
          <li><strong>8. Start solo:</strong> <strong>3 z\u0142ota</strong> z banku + <strong>5 kart</strong> na r\u0119k\u0119.</li>
        </ol>
        <p class="tip"><strong>Helper dopisa\u0142 trackerowi:</strong> ${actionCardsHtml(5, { height: 28 })} ${goldCoinsHtml(3, { size: 26 })}</p>
        <p class="note">Niewykorzystane zestawy wr\xF3\u0107 do pude\u0142ka.</p>
      `
      },
      {
        id: "cleanup",
        title: "Cel i zasady wygranej (solo)",
        body: `
        <p class="lead">Wygrywasz, gdy masz <strong>4 reputacji</strong>, ale musisz spe\u0142ni\u0107 oba warunki:</p>
        <ol class="checklist">
          <li>Zdoby\u0107 <strong>3 trofea za pokonane potwory</strong> (nie odp\u0119dzone).</li>
          <li>Zdoby\u0107 <strong>odkryte trofeum atrybutu</strong> z przygotowania (medytacja przy V).</li>
        </ol>
        <p class="warn">Trofeum atrybutu <strong>nie mo\u017Ce by\u0107 ostatnim</strong> \u2014 najpierw medytacja, potem 3. potw\xF3r. Po wygranej wynik liczysz wg tabeli (zale\u017Cnie od liczby tur z helpera).</p>
        <h3>Tabela wyniku po wygranej</h3>
        ${SOLO_SCORE_TABLE}
      `
      },
      {
        id: "ready",
        title: "Gotowy \u2014 ruszamy",
        body: `
        <p class="lead">Plansza gotowa. Prowadz\u0119 Ci\u0119 tur\u0119 po turze w trybie solo.</p>
        <p>Pami\u0119taj o r\xF3\u017Cnicach: poker vs tabela, atak potwora z ko\u015Bci, bez nowego potwora po zabiciu, specjalna faza III.</p>
      `,
        nextMode: "turn"
      }
    ];
  }
  function escapeLite(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function buildMultiSetupSteps(n, roster = []) {
    const steps = [
      {
        id: "board",
        title: "Plansza na \u015Brodku",
        body: ``
      },
      {
        id: "action-deck",
        title: "Wsp\xF3lna talia akcji",
        body: ``
      },
      {
        id: "monsters",
        title: "Potwory na start",
        body: buildMonsterSetupHtml(n)
      },
      {
        id: "map-pawns",
        title: "\u017Betony i figurki na mapie",
        mapPawnsPrep: true
      },
      {
        id: "first-player",
        title: "Pierwszy gracz i karty pomocy",
        body: `
        <p>Pierwszy gracz: kto <strong>ostatnio czyta\u0142 ksi\u0105\u017Ck\u0119 o wied\u017Aminie</strong> (albo inaczej).</p>
        <p>Ka\u017Cdy bierze <strong>po 1 karcie pomocy ka\u017Cdego rodzaju</strong>.</p>
        <p class="tip">Przygotowanie: od osoby <strong>po prawej</strong> pierwszego, <strong>przeciwnie do zegara</strong>. Pierwszy wybiera wied\u017Amina jako <strong>ostatni</strong>.</p>
      `
      }
    ];
    for (let i = 0; i < n; i++) {
      const turnOrderIndex = n - 1 - i;
      steps.push(buildPlayerSetupStep(n, turnOrderIndex, i + 1, roster[turnOrderIndex]));
    }
    if (n >= 4) {
      steps.push({
        id: "extra-4-5",
        title: "Dodatki dla 4\u20135 graczy",
        body: `
        <ol class="checklist">
          <li><strong>Dodatkowy stos I:</strong> ${n === 4 ? "1 \u017Ceton" : "2 \u017Cetony"} z poziomu I \u2014 przed poziomem II.</li>
          <li><strong>Atrybut +1:</strong> ka\u017Cdy podnosi 1 atrybut o 1 (od pierwszego, zgodnie z zegarem).</li>
        </ol>
      `
      });
    }
    steps.push({
      id: "cleanup",
      title: "Schowa\u0107 nadmiar",
      body: `
      <p>Niewykorzystane zestawy \u2192 do pude\u0142ka.</p>
      <p class="tip"><strong>Cel:</strong> 4 reputacji. Trofea: potw\xF3r / walka z wied\u017Aminem / medytacja. Medytacja <em>nie ko\u0144czy</em> gry przy 4. reputacji.</p>
    `
    });
    steps.push({
      id: "ready",
      title: "Gotowi do gry!",
      body: `
      <p class="lead">Plansza gotowa. Prowadz\u0119 tur\u0119 po turze.</p>
      <p>Kolejno\u015B\u0107: zgodnie z zegarem, zaczyna <strong>pierwszy gracz</strong>.</p>
    `,
      nextMode: "turn"
    });
    return steps;
  }
  function buildMonsterSetupHtml(n) {
    const special2 = n === 2 ? `<li><strong>3.</strong> <strong>2\xD7 poziom I</strong> + <strong>1\xD7 poziom II</strong>. Pierwszy gracz wybiera miejsce dla II.</li>` : `<li><strong>3.</strong> <strong>3 \u017Cetony poziomu I</strong> \u2014 po 1 przy ka\u017Cdym \u017Cetonie obszaru.</li>`;
    return `
    <ol class="checklist">
      <li><strong>1.</strong> Karty potwor\xF3w: stosy I / II / III (odkryte).</li>
      <li><strong>2.</strong> \u017Betony: stosy I / II / III (zakryte, pomieszane).</li>
      ${special2}
      <li><strong>4\u20136.</strong> Odkryj \u2192 przenie\u015B na obszary \u2192 dopasuj karty.</li>
      <li><strong>W helperze:</strong> 3 ikony terenu \u2192 numer obszaru z \u017Cetonu + poziom (<strong>max 1 na teren</strong>).</li>
      <li><strong>7.</strong> Potasuj karty walki potwor\xF3w.</li>
    </ol>
  `;
  }
  function buildPlayerSetupStep(playerCount, turnOrderIndex, prepNumber, rosterEntry) {
    const label = PLAYER_LABELS[turnOrderIndex];
    const res = START_RESOURCES[playerCount][turnOrderIndex];
    const schoolTrophies = playerCount - 1;
    const isFirst = turnOrderIndex === 0;
    const isLastPrep = prepNumber === playerCount;
    const named = rosterEntry ? ` <strong>${escapeLite(rosterEntry.name)}</strong>` : "";
    return {
      id: `player-${turnOrderIndex}`,
      title: `Gracz ${prepNumber}/${playerCount}: ${label}${rosterEntry ? ` \u2014 ${escapeLite(rosterEntry.name)}` : ""}`,
      body: `
      <p class="lead">Teraz przygotowuje si\u0119:${named} (${label})${isFirst ? " \u2014 wybiera wied\u017Amina jako ostatni" : ""}.</p>
      <ol class="checklist">
        <li><strong>1. Planszetka:</strong> ${rosterEntry ? `We\u017A szko\u0142\u0119 przypisan\u0105 w helperze (albo zgodnie z wyborem przy stole).` : isLastPrep && playerCount === 5 ? "Bierze ostatni\u0105 niewybran\u0105." : "Wybiera; potem los 2 z niewybranych, zatrzymuje 1."}</li>
        <li><strong>2.</strong> \u017Beton reputacji na 0.</li>
        <li><strong>3.</strong> Figurka na obszarze swojej szko\u0142y.</li>
        <li><strong>4.</strong> 5 znacznik\xF3w na torach atrybut\xF3w + poziomu.</li>
        <li><strong>5.</strong> <strong>${schoolTrophies}</strong> trofe\xF3w szko\u0142y (tylu przeciwnik\xF3w) \u2014 zakryte pod g\xF3rn\u0105 kraw\u0119dzi\u0105.</li>
        <li><strong>6.</strong> Tarcza na \u201E1\u201D.</li>
        <li><strong>7.</strong> Talia 10 startowych kart szko\u0142y.</li>
        <li><strong>8.</strong> Z banku i talii: ${goldCoinsHtml(res.gold, { size: 28 })} + ${actionCardsHtml(res.cards, { height: 28 })} na r\u0119k\u0119.</li>
      </ol>
      <p class="tip"><strong>Helper dopisa\u0142 trackerowi:</strong> ${actionCardsHtml(res.cards, { height: 24 })} ${goldCoinsHtml(res.gold, { size: 24 })} (kolejno\u015B\u0107 przy stole = pozycja gracza).</p>
    `
    };
  }
  function buildPlayerBoardSteps({ playerCount, solo }) {
    const n = Math.max(1, Number(playerCount) || 1);
    const trophies = Math.max(0, n - 1);
    const steps = [
      {
        id: "mat-intro",
        focus: "none",
        minimal: true,
        boardImg: PLAYER_BOARD_MAT_SRC,
        boardVer: 1
      },
      {
        id: "mat-cubes",
        focus: "none",
        boardImg: PLAYER_BOARD_MAT_SRC,
        boardOverlayImg: PLAYER_BOARD_POLA_SRC,
        boardVer: 1,
        title: "Imi\u0119 i klocki",
        body: "Wybierz imi\u0119 wied\u017Amina z dost\u0119pnych<br />i po\u0142\xF3\u017C klocki w odpowiednie pola."
      },
      ...solo ? [] : [
        {
          id: "trophies",
          focus: "trophies",
          boardImg: PLAYER_BOARD_MAT_SRC,
          boardVer: 1,
          schoolTrophyPrep: true
        }
      ],
      {
        id: "deck",
        focus: "deck",
        boardImg: PLAYER_BOARD_MAT_SRC,
        boardVer: 1,
        schoolActionDeckPrep: true
      },
      {
        id: "figure-ring",
        focus: "none",
        figurePrep: true
      }
    ];
    return steps;
  }
  var MOVE_HELP = `
  <h3>${chip(ICO.move, "Jak si\u0119 ruszy\u0107?")}</h3>
  <ul class="checklist">
    <li>${ICO.forest()}${ICO.mountain()}${ICO.water()} Odrzu\u0107 kart\u0119 z <strong>pasuj\u0105cym terenem</strong> (las / g\xF3ry / woda) na s\u0105siedni obszar.</li>
    <li>Albo <strong>2 dowolne</strong> karty \u2192 dowolny s\u0105siad.</li>
    <li>Albo <strong>1 karta + ${chip(ICO.gold, "1 z\u0142oto")}</strong> \u2192 dowolny s\u0105siad.</li>
    <li>${chip(ICO.wild, "Uniwersalny")} na <em>karcie</em> (woda+las+g\xF3ry) = 1 karta na dowolny s\u0105siad \u2014 to nie \u017Ceton z pude\u0142ka.</li>
  </ul>
`;
  function phase1AfterMove(isSolo2) {
    return `
  <h3>Po ruchu mo\u017Cesz (w dowolnej kolejno\u015Bci)</h3>
  <ul class="checklist">
    <li><strong>Akcja obszaru</strong> \u2014 ka\u017Cd\u0105 konkretn\u0105 akcj\u0119 obszaru najwy\u017Cej raz na tur\u0119 (nawet po wyj\u015Bciu i powrocie). Tropienie = zobacz \u015Bci\u0105g\u0119 \u201E\u017Beton tropu\u201D.</li>
    <li><strong>Poker</strong> \u2014 ${isSolo2 ? "z miejscowymi (solo: vs tabela na karcie pomocy)" : "z wied\u017Aminem na tym samym obszarze (raz z ka\u017Cdym; oboje \u22651 z\u0142oto)"}.</li>
    <li><strong>Zadanie tropienia:</strong> je\u015Bli wesz\u0142e\u015B na obszar z nazwy na \u017Cetonie \u2192 zbierz z\u0142oto i odwr\xF3\u0107 \u017Ceton (masz trop). Zapisz doj\u015Bcie jako <em>zadanie u g\xF3ry</em>.</li>
    <li><strong>Zadanie z eksploracji</strong> (Event #): opcjonalnie w fazie I \u2014 przeczytaj kart\u0119 zdarzenia o danym numerze.</li>
    <li><strong>Potw\xF3r na polu:</strong> wej\u015Bcie <em>nie</em> wymusza walki. W fazie II wybierasz 1 z: walka (opcjonalna) / medytacja / eksploracja.</li>
  </ul>
  ${isSolo2 ? `<details style="margin-top:0.8rem"><summary><strong>Poker solo \u2014 jak gra\u0107</strong></summary>
        <ol class="checklist">
          <li>Wp\u0142a\u0107 <strong>1 z\u0142oto</strong> do puli.</li>
          <li>Rzu\u0107 5 ko\u015B\u0107mi, raz przerzu\u0107 wybrane (opcjonalnie).</li>
          <li>Por\xF3wnaj uk\u0142ad z kart\u0105 pomocy solo / tabel\u0105 poni\u017Cej \u2014 we\u017A nagrod\u0119 z banku.</li>
        </ol>
        ${SOLO_POKER_TABLE}
      </details>` : `<p class="warn">Poker z kim\u015B = <strong>nie walczysz</strong> z nim w fazie II tej tury.</p>`}
`;
  }
  function phase2Choices(isSolo2, {
    meditateEnabled = true,
    meditateHint = "",
    fightEnabled = true,
    fightHint = ""
  } = {}) {
    const medClass = meditateEnabled ? "choice choice-meditate-ready" : "choice choice-disabled";
    const medSpan = meditateEnabled ? meditateHint || "Atrybut na V \u2014 mo\u017Cesz wzi\u0105\u0107 trofeum" : meditateHint || "Zablokowane \u2014 \u017Caden atrybut nie jest na V";
    const fightClass = fightEnabled ? "choice" : "choice choice-disabled";
    const fightSpan = fightEnabled ? fightHint || (isSolo2 ? "Je\u015Bli \u017Ceton na stole" : "Potw\xF3r (st\xF3\u0142) lub wied\u017Amin") : fightHint || "Brak lokacji";
    if (isSolo2) {
      return `
      <p class="lead">Wybierz <strong>dok\u0142adnie 1</strong> opcj\u0119. Potem nie wracasz do ruchu.</p>
      <div class="choice-grid" data-choices="phase2">
        <button class="${fightClass}" data-goto="fight-monster" ${fightEnabled ? "" : "disabled"}><strong>Walka z potworem</strong><span>${fightSpan}</span></button>
        <button class="${medClass}" data-goto="meditate" ${meditateEnabled ? "" : "disabled"}><strong>Medytacja</strong><span>${medSpan}</span></button>
        <button class="choice" data-goto="explore"><strong>Eksploracja</strong><span>Sam czytasz kart\u0119 ostro\u017Cnie</span></button>
      </div>
      <p class="note">Walka jest <strong>opcjonalna</strong> (instrukcja: \u201Emo\u017Cesz walczy\u0107\u201D). W solo nie ma walki z innymi wied\u017Aminami. Bez celu walki i bez medytacji helper idzie do eksploracji.</p>
    `;
    }
    return `
    <p class="lead">Wybierz <strong>dok\u0142adnie 1</strong> opcj\u0119. Potem nie wracasz do ruchu w tej turze.</p>
    <div class="choice-grid" data-choices="phase2">
      <button class="${fightClass}" data-goto="fight" ${fightEnabled ? "" : "disabled"}><strong>Walka</strong><span>${fightSpan}</span></button>
      <button class="${medClass}" data-goto="meditate" ${meditateEnabled ? "" : "disabled"}><strong>Medytacja</strong><span>${medSpan}</span></button>
      <button class="choice" data-goto="explore"><strong>Eksploracja</strong><span>Miasto albo dzikie ost\u0119py</span></button>
    </div>
    <p class="note">Walka jest <strong>opcjonalna</strong> \u2014 nawet z potworem na polu mo\u017Cesz wybra\u0107 medytacj\u0119 albo eksploracj\u0119. Bez celu walki i bez medytacji helper idzie do eksploracji.</p>
  `;
  }
  function fightBranchHtml({ monsterEnabled = true, witcherEnabled = true, hint = "" } = {}) {
    const mClass = monsterEnabled ? "choice" : "choice choice-disabled";
    const wClass = witcherEnabled ? "choice" : "choice choice-disabled";
    return `
  <div class="choice-grid" data-choices="fight-type">
    <button class="${mClass}" data-goto="fight-monster" ${monsterEnabled ? "" : "disabled"}><strong>Walka z potworem</strong><span>${monsterEnabled ? "Je\u015Bli \u017Ceton stoi na stole na Twoim polu" : "Brak lokacji"}</span></button>
    <button class="${wClass}" data-goto="fight-witcher" ${witcherEnabled ? "" : "disabled"}><strong>Walka z wied\u017Aminem</strong><span>${witcherEnabled ? "Na tym samym obszarze" : "Brak innego wied\u017Amina tu"}</span></button>
  </div>
  ${hint ? `<p class="note">${hint}</p>` : ""}
  <p class="note">Tylko 1 walka na tur\u0119. <strong>Walka z wied\u017Aminem</strong> zabroniona na szkole i na zamkni\u0119tej karczmie. Bez walki z kim\u015B po pokerze w tej turze.</p>
`;
  }
  var FIGHT_BRANCH = fightBranchHtml();
  function fightMonster(isSolo2) {
    return `
  <div class="tip">
    <strong>Bardzo prosto (jak dla dziecka):</strong>
    <ol class="checklist">
      <li><strong>Tarcza</strong> = zbroja. Jak spadnie do 0, dalej \u017Cyjesz. Po prostu nast\u0119pnym razem boli bardziej.</li>
      <li><strong>Talia wytrzyma\u0142o\u015Bci</strong> = Twoje \u017Cycie (stos kart obok). Jak kto\u015B Ci\u0119 bije i nie masz tarczy, zdejmujesz karty z tego stosu.</li>
      <li><strong>R\u0119ka</strong> = karty, kt\xF3rymi bijesz / bronisz w tej chwili.</li>
      <li>Bijecie si\u0119 na zmian\u0119: Ty \u2192 potw\xF3r \u2192 Ty \u2192 potw\xF3r\u2026</li>
      <li>Potw\xF3r \u201Eumiera\u201D, gdy sko\u0144cz\u0105 mu si\u0119 karty w jego stosie walki.</li>
      <li>Ty \u201Epadasz\u201D, dopiero gdy <em> Tw\xF3j stos \u017Cycia jest pusty i nie masz ju\u017C kart na r\u0119ce</em>. Samo \u201Etarcza 0\u201D to NIE padni\u0119cie.</li>
      <li>Jak padniesz, a potworowi zosta\u0142o ma\u0142o kart (&lt;2) = prawie wygra\u0142e\u015B \u2192 <strong>odp\u0119dzenie</strong> (dostajesz z\u0142oto).</li>
      <li>Jak padniesz, a potworowi zosta\u0142o du\u017Co (\u22652) = <strong>przegrana</strong> (dostajesz trop + s\u0142absz\u0105 faz\u0119 III).</li>
    </ol>
  </div>

  <p class="tip"><strong>Jeste\u015B tu\u017C po przygotowaniu?</strong> Tali\u0119 + odrzucone z\u0142o\u017Cy\u0142e\u015B w <em>tali\u0119 wytrzyma\u0142o\u015Bci</em>, r\u0119ka zosta\u0142a (nawet 1 karta) \u2014 <strong>OK, tak ma by\u0107</strong>. Dalej idzie naprzemienna walka.</p>

  <h3>0. Start walki (checklist)</h3>
  <ol class="checklist">
    <li>Przeczytaj <strong>zdolno\u015B\u0107 specjaln\u0105</strong> na karcie potwora (czasem koszt wej\u015Bcia, np. odrzu\u0107 eliksir).</li>
    <li>Twoja <strong>talia wytrzyma\u0142o\u015Bci</strong> = stara talia akcji + stos odrzuconych (tasowane). <strong>R\u0119ka nie wchodzi</strong> do tej talii.</li>
    <li>Potw\xF3r: we\u017A z talii walki potwor\xF3w tyle kart, ile wynosi jego <strong>PW</strong> na karcie \u2014 to jego \u201E\u017Cycie\u201D (zakryta talia).</li>
    <li><strong>Kto zaczyna?</strong> Masz <em>\u017Ceton tropu</em> tego potwora \u2192 <strong>Ty</strong>. Nie masz \u2192 <strong>potw\xF3r</strong>.</li>
  </ol>

  <h3>1. Twoja tura walki (gdy Ty grasz)</h3>
  <ol class="checklist">
    <li><strong>Opcjonalnie:</strong> wypij eliksir(y) \u0142\u0105cznie \u2264 alchemii w ca\u0142ej walce; raz na walk\u0119 zdolno\u015B\u0107 szko\u0142y / efekty trofe\xF3w.</li>
    <li><strong>Kombinacja (obowi\u0105zkowa, je\u015Bli masz karty na r\u0119ce):</strong> zagraj \u22651 kart\u0119 z r\u0119ki. Kolejne karty musz\u0105 pasowa\u0107 kolorami/przed\u0142u\u017Ceniami do poprzedniej (jak na karcie pomocy). Przy 1 karcie na r\u0119ce: grasz w\u0142a\u015Bnie t\u0119 jedn\u0105.</li>
    <li><strong>Obra\u017Cenia:</strong> policz symbole obra\u017Ce\u0144 (miecze itp.) na zagranych kartach + efekty eliksir\xF3w.
      <div>Potw\xF3r <strong>zrzuca z wierzchu swojej talii walki</strong> tyle kart (odkryte na bok). To \u201Erani\u201D potwora. Jak talia potwora spadnie do <strong>0</strong> \u2192 pokonany.</div>
    </li>
    <li>Inne symbole na kartach (tarcza, dob\xF3r \xB1, wr\xF3\u0107 kart\u0119 na r\u0119k\u0119\u2026) \u2014 rozpatrz wg ikon / karty pomocy.</li>
    <li><strong>Dob\xF3r na koniec Twojej tury:</strong> dobierz z <em>talii wytrzyma\u0142o\u015Bci</em> tyle kart, ile wynosi Tw\xF3j <strong>Atak</strong> \xB1 modyfikatory z kombinacji. Trafiaj\u0105 na r\u0119k\u0119. Limit 7: przy 7 w walce nie dobierasz dalej. Zagrane karty \u2192 na Tw\xF3j stos odrzuconych.</li>
  </ol>
  <p class="warn"><strong>Przy 1 karcie na r\u0119ce:</strong> i tak musisz j\u0105 zagra\u0107 (masz karty = musisz zagra\u0107 kombinacj\u0119 \u22651). Potem dobierasz wg Ataku \u2014 r\u0119ka si\u0119 uzupe\u0142nia.</p>
  <p class="warn"><strong>Karta tylko z tarczami (0 mieczy)?</strong> Te\u017C grasz j\u0105. <em>Nie zadajesz obra\u017Ce\u0144</em> w tym ataku \u2014 tylko podnosisz tarcz\u0119 o symbole na karcie (tarcza nigdy &gt; obrona). Potem normalnie dobierasz wg Ataku. To nie jest \u201Ez\u0142a\u201D tura: prze\u017Cywasz i dobierasz lepsze karty.</p>
  <p class="tip"><strong>Bez \u017Cetonu tropu:</strong> <em>najpierw tura potwora</em>, dopiero potem Twoja. Przygotuj tarcz\u0119 / czytaj zdolno\u015B\u0107 potwora zanim odkryjecie jego kart\u0119 ataku.</p>

  <h3>2. Tura potwora</h3>
  <ol class="checklist">
    <li>${isSolo2 ? `<strong>Solo:</strong> rzu\u0107 ko\u015Bci\u0105 \u2014 <strong>1\u20133 szar\u017Ca</strong>, <strong>4\u20136 ugryzienie</strong>.` : `Kontroluj\u0105cy potwora wybiera: <strong>szar\u017Ca</strong> albo <strong>ugryzienie</strong>.`}</li>
    <li>Odkryj <strong>1 kart\u0119</strong> z wierzchu talii wytrzyma\u0142o\u015Bci potwora (jego talii walki) i rozpatrz efekt wybranego ataku + tekst karty.</li>
    <li><strong>Obra\u017Cenia na Ciebie</strong> (typowo): najpierw obni\u017C <strong>tarcz\u0119</strong>; jak zabraknie \u2014 zrzucaj karty z wierzchu <em>Twojej</em> talii wytrzyma\u0142o\u015Bci (czasem te\u017C r\u0119ka \u2014 czytaj kart\u0119).</li>
  </ol>
  <p class="warn"><strong>Tarcza spad\u0142a do 0?</strong> To jeszcze <em>nie</em> przegrana. Tarcza to tylko bufor. Walka trwa, dop\xF3ki masz karty w <strong>talii wytrzyma\u0142o\u015Bci</strong> albo na <strong>r\u0119ce</strong>. Jeste\u015B <em>powalony</em> dopiero gdy talia wytrzyma\u0142o\u015Bci jest pusta <strong>i</strong> nie masz kart na r\u0119ce (po rozpatrzeniu zagranych kart).</p>

  <h3>3. Powtarzaj</h3>
  <p class="lead">Ty \u2192 potw\xF3r \u2192 Ty \u2192 \u2026 a\u017C talia potwora = 0 (pokonany) albo Ty jeste\u015B powalony.</p>

  <h3>4. Wynik \u2014 gdy jeste\u015B powalony / potw\xF3r pada</h3>
  <ul class="checklist">
    <li><strong>Pokonanie</strong> (Ty stoisz, talia potwora = 0): <strong>2 z\u0142ota</strong>, odwr\xF3\u0107 kart\u0119 potwora, +reputacja, zm\u0119czenie, trofeum.
      ${isSolo2 ? ` <strong>Solo: NIE dobieraj nowego potwora</strong>.` : ` Potem zwykle nowy potw\xF3r (poziom +1; III\u2192III).`}
    </li>
    <li><strong>Odp\u0119dzenie</strong> (Ty powalony, a u potwora zosta\u0142o <strong>&lt; 2</strong> kart): +2 z\u0142ota; odrzu\u0107 kart\u0119 potwora / \u017Ceton na stos odp\u0119dzonych; we\u017A 1 kart\u0119 kosztu 0 z puli na swoje odrzucone; nowy potw\xF3r <strong>tego samego poziomu</strong>.</li>
    <li><strong>Kl\u0119ska</strong> (Ty powalony, a u potwora zosta\u0142o <strong>\u2265 2</strong> kart): we\u017A \u017Ceton tropu terenu potwora (je\u015Bli go nie masz); we\u017A 1 kart\u0119 kosztu 0 z puli na odrzucone; w tej turze w fazie III dobierasz o 1 mniej. Potw\xF3r zostaje (przy nast\u0119pnej walce z nim b\u0119dzie mocniejszy wg instrukcji).</li>
  </ul>
  <p class="tip">Po ka\u017Cdej walce: tarcza z powrotem = obrona; z\u0142\xF3\u017C tali\u0119 akcji na nowo (talia wytrzyma\u0142o\u015Bci + odrzucone \u2014 wg instrukcji). Potem \u2192 <strong>Faza III</strong>.</p>
`;
  }
  var FIGHT_WITCHER = `
  <ol class="checklist">
    <li>Obaj: talie wytrzyma\u0142o\u015Bci (talia + odrzucone; r\u0119ka zostaje).</li>
    <li>Pozostali mog\u0105 obstawi\u0107 (1 z\u0142oto).</li>
    <li>Atakuj\u0105cy zaczyna; naprzemiennie a\u017C kto\u015B padnie.</li>
    <li>Zwyci\u0119zca: trofeum szko\u0142y, z\u0142oto wg reputacji, +reputacja, zm\u0119czenie.</li>
    <li>Przegrany: karta kosztu 0 na odrzucone.</li>
    <li>Obaj: tarcza = obrona, nowa talia; dob\xF3r wg wyniku.</li>
    <li>\u017Beton <strong>zamkni\u0119tej karczmy</strong> na obszarze.</li>
  </ol>
`;
  function meditate(isSolo2) {
    return `
  <p>Medytacja tylko gdy:</p>
  <ul class="checklist">
    <li>Atrybut na poziomie <strong>V</strong>,</li>
    <li>dost\u0119pne trofeum tego atrybutu${isSolo2 ? " (to odkryte obok planszy)" : ""},</li>
    <li>nie masz ju\u017C takiego samego.</li>
  </ul>
  <ol class="checklist">
    <li>We\u017A trofeum, wsu\u0144 odkryte pod doln\u0105 kraw\u0119d\u017A.</li>
    <li>Je\u015Bli reputacja &lt; 3: +1 reputacja i <strong>zm\u0119czenie</strong>.</li>
    <li>Id\u017A do fazy III.</li>
  </ol>
  <p class="warn">${isSolo2 ? "W solo musisz wzi\u0105\u0107 trofeum atrybutu <strong>zanim</strong> pokonasz 3. potwora. Medytacja i tak nie domyka wygranej jako ostatnie trofeum." : "Je\u015Bli to by\u0142oby 4. trofeum z medytacji \u2014 bierzesz kart\u0119, ale bez +reputacji / zm\u0119czenia i gra si\u0119 <strong>nie ko\u0144czy</strong>."}</p>
`;
  }
  function phase3(isSolo2) {
    return `
  <ol class="checklist">
    <li><strong>Opcjonalnie</strong> odrzu\u0107 dowoln\u0105 liczb\u0119 kart z r\u0119ki (instrukcja).</li>
    <li>Dobierz tyle, by mie\u0107 <strong>dok\u0142adnie 3</strong> karty na r\u0119ce (nie myli\u0107 z limitem 7). Pusta talia \u2192 tasuj odrzucone.</li>
    <li>Kup <strong>1 kart\u0119</strong> z puli. <strong>Koszt = odrzucenie tylu kart z r\u0119ki</strong>, ile wynosi koszt nadrukowany \xB1 pole \u22121/+1 \u2014 <em>nie p\u0142acisz z\u0142otem</em>. We\u017A kart\u0119 na r\u0119k\u0119, przesu\u0144 pul\u0119 w prawo, odkryj now\u0105 na skrajne lewe.</li>
    ${isSolo2 ? `<li><strong>Solo:</strong> je\u015Bli kupi\u0142e\u015B kart\u0119 <em>nie</em> ze skrajnie prawego pola \u2014 na koniec fazy <strong>odrzu\u0107 kart\u0119 ze skrajnie prawego pola</strong> na wsp\xF3lny stos odrzuconych.</li>` : ""}
  </ol>
  <p class="tip">Limit r\u0119ki: <strong>7</strong>. Kupno jest standardowo obowi\u0105zkowe \u2014 <em>FAQ Rebel:</em> je\u015Bli obiektywnie nie mo\u017Cesz kupi\u0107, pomijasz.</p>
  ${isSolo2 ? `<p class="lead">Koniec tury \u2014 zaznacz +1 tur\u0119, potem zn\xF3w Faza I.</p>
         <p class="tip">Wygrana: 3 pokonane potwory + trofeum atrybutu \u2192 tabela wyniku (\u0179r\xF3d\u0142a / \u015Aci\u0105ga).</p>` : `<p class="lead">Koniec tury \u2014 nast\u0119pny gracz zgodnie z zegarem.</p>`}
`;
  }
  var TRAIL_HELP = `
  <h3>${ICO.monster()}${ICO.quest()} \u017Beton tropu \u2014 co to jest?</h3>
  <p class="lead">To <strong>ten sam drewniany/kartonowy \u017Ceton obszaru</strong> (las / g\xF3ry / woda), tylko w innej roli. Masz trzy stosy \u017Ceton\xF3w obszar\xF3w obok planszy \u2014 z nich bierzesz tropy.</p>
  <ol class="checklist">
    <li><strong>Akcja tropienia (faza I, na obszarze z tak\u0105 akcj\u0105):</strong>
      <div>
        1) We\u017A <strong>1 z\u0142oto</strong> z banku do swojej kieszeni.<br>
        2) Wybierz <strong>1 potwora</strong> na mapie, kt\xF3rego chcesz tropi\u0107.<br>
        3) Dobierz <strong>wierzchni \u017Ceton</strong> ze stosu terenu, na kt\xF3rym <em>teraz stoi ten potw\xF3r</em> (np. potw\xF3r w g\xF3rach \u2192 stos g\xF3r).<br>
        4) Po\u0142\xF3\u017C \u017Ceton <strong>odkryty nazw\u0105 obszaru do g\xF3ry</strong> na swojej planszetce i po\u0142\xF3\u017C na nim <strong>1 z\u0142oto z banku</strong> \u2014 to jest <em>zadanie tropienia</em>.<br>
        5) Nazwa na \u017Cetonie <strong>nie mo\u017Ce</strong> by\u0107 Twoj\u0105 obecn\u0105 lokacj\u0105 \u2014 wtedy dobierz kolejny i wtasuj z\u0142y z powrotem.
      </div>
    </li>
    <li><strong>Wykonanie zadania:</strong> w kt\xF3rej\u015B kolejnej turze <strong>wejd\u017A ruchem</strong> na obszar z nazwy na \u017Cetonie.
      <div>
        \u2192 Zabierz z\u0142oto z \u017Cetonu do siebie.<br>
        \u2192 <strong>Odwr\xF3\u0107</strong> \u017Ceton na stron\u0119 z symbolem terenu \u2014 od tej chwili to ju\u017C <strong>\u017Ceton tropu</strong> tego potwora (le\u017Cy przy Twojej planszetce).
      </div>
    </li>
    <li><strong>Po co \u017Ceton tropu?</strong> Gdy walczysz z potworem, do kt\xF3rego masz trop (ten sam rodzaj terenu / ten trop) \u2014 <strong>Ty zaczynasz walk\u0119</strong> (zamiast potwora). To du\u017Ca przewaga.</li>
    <li><strong>Limit:</strong> mo\u017Cesz mie\u0107 najwy\u017Cej <strong>1 \u017Ceton tropu na ka\u017Cdy rodzaj terenu</strong> (1 las, 1 g\xF3ry, 1 woda). FAQ: nowy trop tego samego terenu \u2192 odrzucasz stare zadanie/trop <em>bez</em> zbierania z\u0142ota z \u017Cetonu.</li>
    <li><strong>Pusty stos:</strong> brak \u017Ceton\xF3w danego terenu = nie startujesz zadania tropienia na ten teren.</li>
    <li><strong>\u201EWe\u017A dowolny \u017Ceton tropu\u201D na karcie:</strong> bierzesz \u017Ceton obszaru (jako trop) wg tekstu karty \u2014 zwykle zakryty / wg instrukcji efektu; nie myl z zadaniem tropienia z akcji obszaru.</li>
  </ol>
  <p class="tip"><strong>Przyk\u0142ad (instrukcja):</strong> harpie w Doldeth (g\xF3ry) \u2192 bierzesz \u017Ceton g\xF3rski \u2192 wypada \u201EArd Modron\u201D + 1 z\u0142oto na \u017Cetonie. Gdy dojdziesz do Ard Modron: bierzesz z\u0142oto, odwracasz \u017Ceton \u2192 masz trop harpii.</p>
`;
  var LOCATION_ACTIONS = `
  <h3>Szybka \u015Bci\u0105ga akcji obszar\xF3w</h3>
  <p class="note">Znaki Gemini pod nazw\u0105 miejscowo\u015Bci. Akcja fazy I \u2014 opcjonalna, raz na tur\u0119.</p>
  <ul class="checklist">
    <li>${actionIconHtml("schoolTrain")} <strong>Szko\u0142y (0, 1, 3, 10, 15, 17):</strong> koszt ${ICO.gold()} = poziom docelowy \u2192 +1 atak/obrona/alchemia; specjalno\u015B\u0107 tylko we w\u0142asnej szkole.</li>
    <li>${actionIconHtml("defenseLevel")} Cidaris \xB7 ${actionIconHtml("alchemyLevel")} Ban Ard \xB7 ${actionIconHtml("specialtyLevel")} Glenmore \xB7 ${actionIconHtml("attackLevel")} Ard Modron \u2014 darmowy trening gdy atrybut \u2264 poziom wied\u017Amina (alchemia przy awansie daje te\u017C eliksir).</li>
    <li>${actionIconHtml("gainElixir")} <strong>Eliksir:</strong> Beauclair, Dhuwod, Cintra (limit 4).</li>
    <li>${actionIconHtml("dicePoker")} <strong>Poker:</strong> Novigrad (6), Loc Ichaer (14).</li>
    <li>${actionIconHtml("cleanPool")} <strong>Wyzima (7):</strong> 0 z\u0142ota \u2192 +1 z\u0142oto; mo\u017Cesz spali\u0107 karty z puli na polach z p\u0142omieniem.</li>
    <li>${actionIconHtml("trashDraw")} <strong>Vengerberg (8):</strong> usu\u0144 1 kart\u0119 z r\u0119ki \u2192 kup 1 z puli (koszt \u2264+1).</li>
    <li>${actionIconHtml("trailGold")} <strong>Tropienie:</strong> Hengfors (2), Doldeth (13) \u2014 +1 z\u0142oto, opcja zadania tropienia.</li>
  </ul>
  <h3>Tereny na planszy (ruch)</h3>
  <ul class="checklist">
    <li>${ICO.water()} <strong>Woda:</strong> Kaer Seren, Ban Ard, Cidaris, Cintra, Glenmore, Gorthur Gvaed</li>
    <li>${ICO.forest()} <strong>Las:</strong> Novigrad, Wyzima, Vengerberg, Loc Ichaer, Dhuwod, Stygga (+ Mantikora 0)</li>
    <li>${ICO.mountain()} <strong>G\xF3ry:</strong> Hengfors, Kaer Morhen, Haern Caduch, Beauclair, Doldeth, Ard Modron</li>
  </ul>
  ${TRAIL_HELP}
`;
  function quickRef(isSolo2) {
    return `
  <h3>Z\u0142ota zasada</h3>
  <p>Tekst na kartach ma pierwsze\u0144stwo przed instrukcj\u0105.</p>
  <h3>Struktura tury</h3>
  <p><strong>I</strong> ruch i akcje \u2192 <strong>II</strong> walka / medytacja / eksploracja \u2192 <strong>III</strong> dob\xF3r i obowi\u0105zkowy zakup.</p>
  ${isSolo2 ? `<h3>Solo \u2014 skr\xF3t r\xF3\u017Cnic</h3>
         <ul class="checklist">
           <li>Start: 3 z\u0142ota, 5 kart; potwory I+II+III; 1 odkryte trofeum atrybutu.</li>
           <li>Poker: vs tabela nagr\xF3d.</li>
           <li>Atak potwora: ko\u015B\u0107 1\u20133 szar\u017Ca / 4\u20136 ugryzienie.</li>
           <li>Po zabiciu: bez nowego potwora; po odp\u0119dzeniu: nowy tego poziomu.</li>
           <li>Faza III: kupno nie z prawego skraju \u2192 odrzu\u0107 praw\u0105 kart\u0119 puli.</li>
           <li>Wygrana: 3 pokonane + trofeum atrybutu; helper liczy tury.</li>
         </ul>
         <h3>Wynik solo</h3>
         ${SOLO_SCORE_TABLE}
         <h3>Poker solo</h3>
         ${SOLO_POKER_TABLE}` : `<h3>Awans</h3>
         <p>Wszystkie atrybuty powy\u017Cej poziomu \u2192 awans. II/III: +1 karta; IV/V: +2.</p>
         <h3>Powi\u0105zania</h3>
         <p>+1 obrona \u2192 +1 tarcza. +1 alchemia \u2192 +1 eliksir. Atrybutu na V nie obni\u017Casz.</p>`}
`;
  }

  // js/school-action-deck-prep.js
  var ACTION_CARD_ASPECT_W = 769;
  var ACTION_CARD_ASPECT_H = 1175;
  var ACTION_DECK_ASSET_V = "10";
  var COMMON_ACTION_DECK_BACK_SRC = "./img/cards/action/common-back.png";
  var COMMON_ACTION_DECK_CARD_COUNT = 90;
  var COMMON_ACTION_DECK_STACK_SIZE = 7;
  var COMMON_ACTION_DECK_ASSET_V = "3";
  var ACTION_DECK_SLOT = {
    leftFrac: 0,
    topFrac: 0.19,
    widthFrac: 0.135,
    heightFrac: 0.6
  };
  var ACTION_DECK_BOARD_WIDTH_FRAC = 0.62;
  var ACTION_DECK_CARDS_SHIFT_LEFT_FRAC = 0.11;
  var ACTION_DECK_CARDS_SHIFT_EXTRA_CARD_W_FRAC = 0.5;
  var ACTION_DECK_CARDS_SHIFT_DOWN_FRAC = 0.022;
  var ACTION_DECK_CARD_BOARD_HEIGHT_FRAC = 0.8;
  var ACTION_DECK_HINT_GAP_PX = 6;
  var ACTION_DECK_HINT_EXTRA_GAP_CARD_W_FRAC = 0.48;
  var GUIDE_ACTION_DECK_CARDS = [1, 2, 3, 4, 5, 6, 7].map(
    (n) => `./img/cards/action/niedzwiedz/card-0${n}.png`
  );
  var GUIDE_ACTION_DECK_LOGO = "./img/cards/action/niedzwiedz/logo.png";
  var ACTION_DECK_POOL_SIZE = 10;
  function guideActionDeckShuffleSrcs(poolSize = ACTION_DECK_POOL_SIZE) {
    const back = schoolActionDeckBackSrc("niedzwiedz");
    return Array.from({ length: poolSize }, () => back);
  }
  function guideActionDeckFallbackSrc() {
    return schoolActionDeckBackSrc("niedzwiedz");
  }
  function guideActionDeckLogoHintSrc() {
    return GUIDE_ACTION_DECK_LOGO;
  }
  function guideActionDeckHintCardSrc() {
    return GUIDE_ACTION_DECK_CARDS[0];
  }
  function schoolActionDeckBackSrc(schoolId) {
    const id = canonicalSchoolId(schoolId);
    return `./img/cards/action/${id}-back.png`;
  }
  function schoolActionDeckPrepScenario() {
    return {
      poolSize: ACTION_DECK_POOL_SIZE,
      title: "Talia startowa",
      instruction: "Potasuj 10 kart akcji ze znakiem szko\u0142y (prawy g\xF3rny r\xF3g). U\u0142\xF3\u017C zakryt\u0105 tali\u0119 w wyci\u0119ciu z lewej strony planszetki."
    };
  }

  // js/player-board-action-deck.js
  var CARD_ASPECT2 = ACTION_CARD_ASPECT_W / ACTION_CARD_ASPECT_H;
  function deckCardImg(src, fallbackSrc) {
    const v = ACTION_DECK_ASSET_V;
    return `<img class="pb-prep-card__img" src="${src}?v=${v}" data-fallback="${fallbackSrc}?v=${v}" alt="" decoding="async" />`;
  }
  function playerBoardActionDeckMainHtml({ boardSrc, boardV }) {
    const sc = schoolActionDeckPrepScenario();
    const cardSrcs = guideActionDeckShuffleSrcs(sc.poolSize);
    const cardFallback = guideActionDeckFallbackSrc();
    const logoHint = guideActionDeckLogoHintSrc();
    const hintCard = guideActionDeckHintCardSrc();
    const logoHintBesideDeck = logoHint && hintCard ? `<aside class="pb-action-school-mark pb-action-school-mark--deck-corner" aria-hidden="true">
        <div class="pb-action-school-mark__sample">
          <img class="pb-action-school-mark__face" src="${hintCard}?v=${ACTION_DECK_ASSET_V}" alt="" decoding="async" />
          <img class="pb-action-school-mark__logo pb-action-school-mark__logo--pulse" src="${logoHint}?v=${ACTION_DECK_ASSET_V}" alt="" decoding="async" />
        </div>
      </aside>` : "";
    const shuffleCards = cardSrcs.map(
      (src, i) => `
    <div class="pb-prep-shuffle-card pb-action-shuffle-card" style="--i: ${i}" data-shuffle-i="${i}">
      ${deckCardImg(src, cardFallback)}
    </div>`
    ).join("");
    return `
    <div class="player-board-prep-layout player-board-action-layout" id="pb-action-layout">
      <div class="player-board-prep-stage player-board-action-stage">
        <header class="player-board-prep-panel player-board-prep-panel--action-caption">
          <h2 class="player-board-prep-panel__title">${sc.title}</h2>
          <p class="player-board-prep-panel__body">${sc.instruction}</p>
        </header>
        <div class="player-board-action-compose" style="--pb-board-width: ${ACTION_DECK_BOARD_WIDTH_FRAC}">
          <figure class="player-board-scan" id="player-board-scan">
            <div class="player-board-scan__stack player-board-scan__stack--compact player-board-scan__stack--action-deck">
              <img
                class="player-board-scan__img"
                src="${boardSrc}?v=${boardV}"
                alt=""
                width="1024"
                height="425"
                loading="eager"
                decoding="async"
              />
              <div class="player-board-action-deck-zone">
                <div class="player-board-action-shuffle-wrap">
                  ${logoHintBesideDeck}
                  <div class="pb-prep-shuffle pb-action-shuffle" id="pb-action-shuffle" aria-hidden="true">
                    ${shuffleCards}
                  </div>
                </div>
              </div>
            </div>
          </figure>
        </div>
      </div>
    </div>`;
  }
  function sleep(ms) {
    return new Promise((r) => window.setTimeout(r, ms));
  }
  function remixActionShuffleFaces(root) {
    const pool = [...guideActionDeckShuffleSrcs()];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const v = ACTION_DECK_ASSET_V;
    const fb = guideActionDeckFallbackSrc();
    root.querySelectorAll("#pb-action-shuffle .pb-prep-card__img").forEach((img, i) => {
      const src = pool[i % pool.length];
      img.src = `${src}?v=${v}`;
      img.setAttribute("data-fallback", `${fb}?v=${v}`);
    });
  }
  function bindPrepCardImages(root) {
    root.querySelectorAll(".pb-prep-card__img, .pb-trophy-card__img").forEach((img) => {
      img.addEventListener(
        "error",
        () => {
          const fb = img.getAttribute("data-fallback");
          if (fb && img.src !== fb) img.src = fb;
        },
        { once: true }
      );
    });
  }
  function bindActionDeckLayoutSync(root) {
    const stack = root.querySelector(".player-board-scan__stack--action-deck");
    const shuffle = root.querySelector("#pb-action-shuffle");
    const wrap = root.querySelector(".player-board-action-shuffle-wrap");
    const zone = root.querySelector(".player-board-action-deck-zone");
    if (!stack || !shuffle || !wrap) return () => {
    };
    const img = stack.querySelector(".player-board-scan__img");
    const sync = () => {
      const boardRect = (img || stack).getBoundingClientRect();
      const boardW = boardRect.width;
      const boardH = boardRect.height;
      if (boardH < 40 || boardW < 40) return;
      let cardH = boardH * ACTION_DECK_CARD_BOARD_HEIGHT_FRAC;
      let cardW = cardH * CARD_ASPECT2;
      shuffle.style.setProperty("--pb-shuffle-w", `${cardW}px`);
      shuffle.style.setProperty("--pb-shuffle-h", `${cardH}px`);
      shuffle.style.width = `${cardW}px`;
      shuffle.style.height = `${cardH}px`;
      wrap.style.setProperty("--pb-shuffle-w", `${cardW}px`);
      wrap.style.setProperty("--pb-shuffle-h", `${cardH}px`);
      const hintGap = ACTION_DECK_HINT_GAP_PX + cardW * ACTION_DECK_HINT_EXTRA_GAP_CARD_W_FRAC;
      wrap.style.setProperty("--pb-hint-gap", `${hintGap}px`);
      if (zone) {
        zone.style.left = `${ACTION_DECK_SLOT.leftFrac * 100}%`;
        zone.style.top = "50%";
        zone.style.width = "auto";
        zone.style.height = "auto";
        zone.style.bottom = "auto";
        const shiftLeftPx = boardW * ACTION_DECK_CARDS_SHIFT_LEFT_FRAC + cardW * ACTION_DECK_CARDS_SHIFT_EXTRA_CARD_W_FRAC;
        const shiftDownPx = boardH * ACTION_DECK_CARDS_SHIFT_DOWN_FRAC;
        zone.style.transform = `translate(${-shiftLeftPx}px, calc(-50% + ${shiftDownPx}px))`;
        const hintAside = root.querySelector(".pb-action-school-mark--deck-corner");
        if (hintAside) hintAside.style.transform = "";
        requestAnimationFrame(() => {
          const caption = root.querySelector(".player-board-prep-panel--action-caption");
          const hint = root.querySelector(".pb-action-school-mark__sample");
          if (!caption || !hint || !hintAside) return;
          const delta = Math.round(hint.getBoundingClientRect().left - caption.getBoundingClientRect().left);
          if (Math.abs(delta) > 1) {
            hintAside.style.transform = `translateX(${-delta}px)`;
          }
        });
      }
    };
    const ro = new ResizeObserver(() => sync());
    ro.observe(stack);
    if (img) {
      ro.observe(img);
      if (!img.complete) img.addEventListener("load", sync, { once: true });
    }
    sync();
    requestAnimationFrame(sync);
    return () => ro.disconnect();
  }
  function bindSchoolActionDeckStep(root) {
    const shuffle = root.querySelector("#pb-action-shuffle");
    bindPrepCardImages(root);
    remixActionShuffleFaces(root);
    const disconnectLayout = bindActionDeckLayoutSync(root);
    if (!shuffle) {
      disconnectLayout();
      return disconnectLayout;
    }
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stop = false;
    if (reduce) {
      shuffle.classList.add("is-idle");
      return disconnectLayout;
    }
    async function runShufflePasses() {
      for (let pass = 0; pass < 3 && !stop; pass++) {
        remixActionShuffleFaces(root);
        shuffle.classList.remove("is-shuffling");
        void shuffle.offsetWidth;
        shuffle.classList.add("is-shuffling");
        await sleep(850);
        shuffle.classList.remove("is-shuffling");
        await sleep(180);
      }
    }
    async function loop() {
      shuffle.classList.add("is-idle");
      while (!stop) {
        await runShufflePasses();
        if (stop) break;
        await sleep(700);
      }
    }
    loop();
    return () => {
      stop = true;
      disconnectLayout();
    };
  }

  // js/player-board-trophies.js
  function trophyCardImg(back) {
    return `<img class="pb-trophy-card__img" src="${back}?v=1" data-fallback="${TROPHY_BACK_FALLBACK}?v=1" alt="" decoding="async" />`;
  }
  function playerBoardTrophyMainHtml({
    boardSrc,
    boardV,
    schoolId,
    playerCount
  }) {
    const sc = schoolTrophyPrepScenario(playerCount);
    const back = schoolTrophyBackSrc(schoolId);
    const shuffleCards = Array.from({ length: sc.poolSize }, (_, i) => `
    <div class="pb-trophy-shuffle-card" style="--i: ${i}" data-shuffle-i="${i}">
      ${trophyCardImg(back)}
    </div>`).join("");
    return `
    <div class="player-board-trophy-layout" id="pb-trophy-layout" data-pick="${sc.pickCount}">
      <div class="player-board-trophy-layout__mat">
        <figure class="player-board-scan" id="player-board-scan">
          <div class="player-board-scan__stack player-board-scan__stack--compact player-board-scan__stack--trophy">
            <div class="pb-trophy-under" id="pb-trophy-under" aria-hidden="true"></div>
            <div class="pb-trophy-fly-layer" id="pb-trophy-fly" aria-hidden="true"></div>
            <img
              class="player-board-scan__img"
              src="${boardSrc}?v=${boardV}"
              alt=""
              width="1024"
              height="425"
              loading="eager"
              decoding="async"
            />
            <div class="pb-trophy-insert-slot" id="pb-trophy-insert-slot" aria-hidden="true"></div>
            <div class="pb-trophy-edge" id="pb-trophy-edge" aria-hidden="true"></div>
          </div>
        </figure>
      </div>
      <div class="player-board-trophy-aside">
        <aside class="player-board-trophy-panel">
          <h2 class="player-board-trophy-panel__title">${sc.title}</h2>
          <p class="player-board-trophy-panel__body">${sc.instruction}</p>
        </aside>
        <div class="player-board-trophy-shuffle-col">
          <div class="pb-trophy-shuffle" id="pb-trophy-shuffle" aria-hidden="true">
            ${shuffleCards}
          </div>
        </div>
      </div>
    </div>`;
  }
  function sleep2(ms) {
    return new Promise((r) => window.setTimeout(r, ms));
  }
  function waitTransition(el, prop = "transform") {
    return new Promise((resolve) => {
      let done = false;
      const finish = (ev) => {
        if (ev && ev.propertyName && ev.propertyName !== prop) return;
        if (done) return;
        done = true;
        el.removeEventListener("transitionend", finish);
        resolve();
      };
      el.addEventListener("transitionend", finish);
      window.setTimeout(finish, 820);
    });
  }
  function layoutFlyCard(card, from, to, w, h, { fly = false } = {}) {
    card.style.setProperty("--w", `${w}px`);
    card.style.setProperty("--h", `${h}px`);
    card.style.setProperty("--x0", `${from.x}px`);
    card.style.setProperty("--y0", `${from.y}px`);
    card.style.setProperty("--x1", `${to.x}px`);
    card.style.setProperty("--y1", `${to.y}px`);
    card.classList.toggle("is-flying", Boolean(fly));
  }
  function measureTargets(stack, shuffle, slot) {
    const sr = stack.getBoundingClientRect();
    const dr = shuffle.getBoundingClientRect();
    const sl = slot.getBoundingClientRect();
    const deckX = dr.left - sr.left + dr.width / 2;
    const deckY = dr.top - sr.top + dr.height / 2;
    const edgeY = sl.bottom - sr.top;
    const slotLeft = sl.left - sr.left;
    const slotW = sl.width;
    return { sr, deckX, deckY, edgeY, slotLeft, slotW };
  }
  function bindTrophyCardImages(root) {
    root.querySelectorAll(".pb-trophy-card__img").forEach((img) => {
      img.addEventListener(
        "error",
        () => {
          const fb = img.getAttribute("data-fallback");
          if (fb && img.src !== fb) img.src = fb;
        },
        { once: true }
      );
    });
  }
  function bindSchoolTrophyStep(root, opts) {
    const layout = root.querySelector("#pb-trophy-layout");
    const shuffle = root.querySelector("#pb-trophy-shuffle");
    const stack = root.querySelector(".player-board-scan__stack--trophy");
    const slot = root.querySelector("#pb-trophy-insert-slot");
    const fly = root.querySelector("#pb-trophy-fly");
    const under = root.querySelector("#pb-trophy-under");
    const back = root.querySelector(".pb-trophy-shuffle-card img")?.getAttribute("src") || `${TROPHY_BACK_FALLBACK}?v=1`;
    bindTrophyCardImages(root);
    if (!layout || !shuffle || !stack || !slot || !fly || !under || !opts?.pickCount) {
      return;
    }
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stop = false;
    const pickCount = opts.pickCount;
    async function runShufflePasses() {
      for (let pass = 0; pass < 3 && !stop; pass++) {
        shuffle.classList.remove("is-shuffling");
        void shuffle.offsetWidth;
        shuffle.classList.add("is-shuffling");
        await sleep2(850);
        shuffle.classList.remove("is-shuffling");
        await sleep2(180);
      }
    }
    async function flyCardsIn() {
      fly.replaceChildren();
      under.replaceChildren();
      const { sr, deckX, deckY, edgeY, slotLeft, slotW } = measureTargets(
        stack,
        shuffle,
        slot
      );
      const targetW = Math.min(sr.width * 0.2, slotW * 0.92);
      const targetH = targetW * (819 / 532);
      const startW = targetW * 0.42;
      const startH = startW * (819 / 532);
      const tx = slotLeft + (slotW - targetW) / 2;
      const stackStep = pickCount > 1 ? Math.min(targetH * 0.17, 32) : 0;
      for (let i = 0; i < pickCount && !stop; i++) {
        const el = document.createElement("div");
        el.className = "pb-trophy-fly-card";
        el.style.setProperty("--stack-i", String(i));
        el.innerHTML = trophyCardImg(back);
        fly.appendChild(el);
        bindTrophyCardImages(el);
        const ty = edgeY - targetH / 2 + i * stackStep;
        const from = { x: deckX - startW / 2, y: deckY - startH / 2 };
        const midDeck = { x: deckX - targetW / 2, y: deckY - targetH / 2 };
        const to = { x: tx, y: ty };
        layoutFlyCard(el, from, from, startW, startH);
        el.style.opacity = "1";
        await sleep2(40);
        void el.offsetWidth;
        layoutFlyCard(el, midDeck, to, targetW, targetH, { fly: true });
        await waitTransition(el);
        if (stop) break;
        el.classList.remove("is-flying");
        el.classList.add("is-inserted");
        under.appendChild(el);
      }
      await sleep2(2200);
      fly.replaceChildren();
      under.replaceChildren();
    }
    async function loop() {
      shuffle.classList.add("is-idle");
      if (reduce) {
        slot.classList.add("is-static-demo");
        return;
      }
      while (!stop) {
        await runShufflePasses();
        if (stop) break;
        await flyCardsIn();
        await sleep2(600);
      }
    }
    loop();
    return () => {
      stop = true;
    };
  }

  // js/map-prep-pawns.js
  var MAP_PREP_PAWN_ASSET_V = "3";
  var REP_TOKEN_FALLBACK = "./img/tokens/reputation/wilk.png";
  var WITCHER_FIGURE_SRC = "./img/pawns/witcher-figure.png";
  var PAWN_BASE_RING_SRC = "./img/pawns/base-ring-gray.png";
  function schoolRepTokenSrc(schoolId) {
    const id = canonicalSchoolId(schoolId);
    return `./img/tokens/reputation/${id}.png`;
  }
  function schoolRepTokenFallbackSrc() {
    return REP_TOKEN_FALLBACK;
  }

  // js/player-board-figure-prep.js
  var PYRAMID_TOP_IDX = [0, 1];
  var PYRAMID_BOT_IDX = [2, 3, 4];
  function playerBoardFigurePrepScenario() {
    return {
      title: "Figurka, podstawka i \u017Ceton szko\u0142y",
      instruction: "Wybierz figurk\u0119 wied\u017Amina z pude\u0142ka. Za\u0142\xF3\u017C na figurk\u0119 podstawk\u0119 w kolorze szko\u0142y oraz wyci\u0105gnij \u017Ceton szko\u0142y wied\u017Ami\u0144skiej."
    };
  }
  function prepImg(src, fallback, className) {
    const v = MAP_PREP_PAWN_ASSET_V;
    return `<img class="pb-figure-prep-img ${className}" src="${src}?v=${v}" data-fallback="${fallback}?v=${v}" alt="" decoding="async" />`;
  }
  function pyramidHtml(cellFn) {
    const row = (indices) => `<ul class="pb-figure-pyramid__row" role="list">${indices.map((i) => cellFn(SCHOOLS[i])).join("")}</ul>`;
    return `
    <div class="pb-figure-pyramid">
      ${row(PYRAMID_TOP_IDX)}
      ${row(PYRAMID_BOT_IDX)}
    </div>`;
  }
  function basePlateHtml(school) {
    const v = MAP_PREP_PAWN_ASSET_V;
    return `
    <li class="pb-figure-plate pb-figure-plate--base" data-school="${school.id}">
      <img
        class="pb-figure-prep-img pb-figure-base-plate-img pb-figure-base-plate-img--${school.id}"
        src="${PAWN_BASE_RING_SRC}?v=${v}"
        data-fallback="${PAWN_BASE_RING_SRC}?v=${v}"
        alt=""
        decoding="async"
      />
    </li>`;
  }
  function tokenPlateHtml(school, tokFb) {
    return `
    <li class="pb-figure-plate pb-figure-plate--token" data-school="${school.id}">
      ${prepImg(schoolRepTokenSrc(school.id), tokFb, "pb-figure-plate__token")}
    </li>`;
  }
  function basesPyramidHtml() {
    return pyramidHtml((s) => basePlateHtml(s));
  }
  function tokensPyramidHtml(tokFb) {
    return pyramidHtml((s) => tokenPlateHtml(s, tokFb));
  }
  function playerBoardFigureMainHtml({
    schoolId,
    schoolName,
    playerName,
    playerSlot,
    solo
  }) {
    const sc = playerBoardFigurePrepScenario();
    const tokFb = schoolRepTokenFallbackSrc();
    return `
    <div class="player-board-figure-layout" id="pb-figure-layout" data-school="${schoolId}">
      <header class="player-board-prep-panel player-board-figure-caption">
        <h2 class="player-board-prep-panel__title">${sc.title}</h2>
        <p class="player-board-prep-panel__body">${sc.instruction}</p>
      </header>
      <div class="pb-figure-stage" aria-hidden="true">
        <div class="pb-figure-col pb-figure-col--pick">
          <p class="pb-figure-col__label">Figurka</p>
          <div class="pb-figure-pick-frame">
            ${prepImg(WITCHER_FIGURE_SRC, WITCHER_FIGURE_SRC, "pb-figure-pick-img")}
          </div>
        </div>
        <div class="pb-figure-col pb-figure-col--stand">
          <p class="pb-figure-col__label">Podstawki</p>
          <div class="pb-figure-stand">${basesPyramidHtml()}</div>
        </div>
        <div class="pb-figure-col pb-figure-col--tokens">
          <p class="pb-figure-col__label">\u017Betony szk\xF3\u0142</p>
          <div class="pb-figure-token-mount">${tokensPyramidHtml(tokFb)}</div>
        </div>
      </div>
    </div>`;
  }
  function bindPlayerBoardFigureStep(root) {
    root.querySelectorAll(".pb-figure-prep-img").forEach((img) => {
      img.addEventListener(
        "error",
        () => {
          const fb = img.getAttribute("data-fallback");
          if (!fb) return;
          if (img.src !== fb) img.src = fb;
        },
        { once: true }
      );
    });
  }

  // js/map-data.js
  var TERRAIN = {
    /* Kolory zbliżone do żetonów na fizycznej planszy (las / góry / woda). */
    forest: { id: "forest", label: "Las", color: "#3f6f3a", ink: "#f3efe4" },
    mountain: { id: "mountain", label: "G\xF3ry", color: "#6e737c", ink: "#f3efe4" },
    water: { id: "water", label: "Woda", color: "#3a6ea0", ink: "#f3efe4" },
    wild: { id: "wild", label: "Uniwersalny", color: "#7a6b4a", ink: "#f3efe4" },
    school: { id: "school", label: "Szko\u0142a", color: "#c4a14a", ink: "#1a1814" }
  };
  var LOCATION_ACTION_HINTS = {
    schoolTrain: "Szko\u0142a: zap\u0142a\u0107 z\u0142oto = poziom docelowy (aktualny+1, zwykle 2\u20135) \u2192 +1 atak / obrona / alchemia. Specjalno\u015B\u0107 tylko we w\u0142asnej szkole.",
    trailGold: "+1 z\u0142oto z banku. Opcja: zap\u0142a\u0107 1 z\u0142oto \u2192 zadanie tropienia (\u017Ceton terenu wybranego potwora + 1 z\u0142oto na \u017Cetonie).",
    dicePoker: "Ko\u015Bciany poker z miejscowymi: 1 z\u0142oto do puli (+2 z banku); gracz po prawej rzuca za miejscowych.",
    cleanPool: "Je\u015Bli masz 0 z\u0142ota \u2192 we\u017A +1 z\u0142oto. Mo\u017Cesz te\u017C spali\u0107 (usun\u0105\u0107 z gry) 1\u20132 karty z puli na polach z p\u0142omieniem.",
    trashDraw: "Usu\u0144 1 kart\u0119 z r\u0119ki z gry \u2192 kup 1 kart\u0119 z odkrytej puli (koszt nowej: \u2264, = albo o 1 wy\u017Cszy od usuni\u0119tej).",
    defenseLevel: "Darmowy trening: obrona \u2264 poziom wied\u017Amina \u2192 +1 obrona (i +1 tarcza).",
    alchemyLevel: "Darmowy trening: alchemia \u2264 poziom wied\u017Amina \u2192 +1 alchemia (przy podniesieniu alchemii zawsze dobierasz 1 eliksir).",
    specialtyLevel: "Darmowy trening: zdolno\u015B\u0107 specjalna \u2264 poziom wied\u017Amina \u2192 +1 specjalno\u015B\u0107.",
    attackLevel: "Darmowy trening: atak \u2264 poziom wied\u017Amina \u2192 +1 atak.",
    gainElixir: "Dobierz 1 kart\u0119 eliksiru (limit 4 przy sobie).",
    cintraElixir: "Dobierz 1 kart\u0119 eliksiru (limit 4 przy sobie)."
  };
  var LOCATIONS = [
    {
      id: "kaer-seren",
      name: "Kaer Seren",
      number: 1,
      terrain: "water",
      school: "gryf",
      x: 22,
      y: 10,
      actionKey: "schoolTrain"
    },
    {
      id: "hengfors",
      name: "Hengfors",
      number: 2,
      terrain: "mountain",
      x: 48,
      y: 16,
      actionKey: "trailGold"
    },
    {
      id: "kaer-morhen",
      name: "Kaer Morhen",
      number: 3,
      terrain: "mountain",
      school: "wilk",
      x: 72,
      y: 12,
      actionKey: "schoolTrain"
    },
    {
      id: "ban-ard",
      name: "Ban Ard",
      number: 4,
      terrain: "water",
      x: 78,
      y: 28,
      actionKey: "alchemyLevel"
    },
    {
      id: "cidaris",
      name: "Cidaris",
      number: 5,
      terrain: "water",
      x: 14,
      y: 28,
      actionKey: "defenseLevel"
    },
    {
      id: "novigrad",
      name: "Novigrad",
      number: 6,
      terrain: "forest",
      x: 32,
      y: 30,
      actionKey: "dicePoker"
    },
    {
      id: "wyzima",
      name: "Wyzima",
      number: 7,
      terrain: "forest",
      x: 48,
      y: 34,
      actionKey: "cleanPool"
    },
    {
      id: "vengerberg",
      name: "Vengerberg",
      number: 8,
      terrain: "forest",
      x: 68,
      y: 38,
      actionKey: "trashDraw"
    },
    {
      id: "cintra",
      name: "Cintra",
      number: 9,
      terrain: "water",
      x: 20,
      y: 46,
      actionKey: "cintraElixir"
    },
    {
      id: "haern-caduch",
      name: "Haern Caduch",
      number: 10,
      terrain: "mountain",
      school: "niedzwiedz",
      x: 42,
      y: 48,
      actionKey: "schoolTrain"
    },
    {
      id: "beauclair",
      name: "Beauclair",
      number: 11,
      terrain: "mountain",
      x: 62,
      y: 50,
      actionKey: "gainElixir"
    },
    {
      id: "glenmore",
      name: "Glenmore",
      number: 12,
      terrain: "water",
      x: 28,
      y: 62,
      actionKey: "specialtyLevel"
    },
    {
      id: "doldeth",
      name: "Doldeth",
      number: 13,
      terrain: "mountain",
      x: 44,
      y: 68,
      actionKey: "trailGold"
    },
    {
      id: "loc-ichaer",
      name: "Loc Ichaer",
      number: 14,
      terrain: "forest",
      x: 56,
      y: 62,
      actionKey: "dicePoker"
    },
    {
      id: "gorthur-gvaed",
      name: "Gorthur Gvaed",
      number: 15,
      terrain: "water",
      school: "zmija",
      x: 82,
      y: 58,
      actionKey: "schoolTrain"
    },
    {
      id: "dhuwod",
      name: "Dhuwod",
      number: 16,
      terrain: "forest",
      x: 48,
      y: 78,
      actionKey: "gainElixir"
    },
    {
      id: "stygga",
      name: "Stygga",
      number: 17,
      terrain: "forest",
      school: "kot",
      x: 66,
      y: 74,
      actionKey: "schoolTrain"
    },
    {
      id: "ard-modron",
      name: "Ard Modron",
      number: 18,
      terrain: "mountain",
      x: 86,
      y: 74,
      actionKey: "attackLevel"
    },
    {
      id: "behelt-nar",
      name: "Behelt Nar",
      number: 0,
      terrain: "wild",
      school: "mantikora",
      x: 88,
      y: 44,
      actionKey: "schoolTrain"
    }
  ];
  var ROADS = (() => {
    const pairs = [
      // 0 Behelt Nar
      ["behelt-nar", "vengerberg"],
      ["behelt-nar", "ban-ard"],
      ["behelt-nar", "beauclair"],
      ["behelt-nar", "gorthur-gvaed"],
      // 1 Kaer Seren
      ["kaer-seren", "cintra"],
      ["kaer-seren", "cidaris"],
      ["kaer-seren", "novigrad"],
      ["kaer-seren", "hengfors"],
      // 2 Hengfors
      ["hengfors", "novigrad"],
      ["hengfors", "wyzima"],
      ["hengfors", "kaer-morhen"],
      // 3 Kaer Morhen
      ["kaer-morhen", "wyzima"],
      ["kaer-morhen", "ban-ard"],
      // 4 Ban Ard
      ["ban-ard", "vengerberg"],
      ["ban-ard", "wyzima"],
      // 5 Cidaris
      ["cidaris", "cintra"],
      ["cidaris", "novigrad"],
      // 6 Novigrad
      ["novigrad", "cintra"],
      ["novigrad", "wyzima"],
      // 7 Wyzima
      ["wyzima", "cintra"],
      ["wyzima", "vengerberg"],
      ["wyzima", "beauclair"],
      ["wyzima", "haern-caduch"],
      // 8 Vengerberg
      ["vengerberg", "beauclair"],
      // 9 Cintra
      ["cintra", "glenmore"],
      ["cintra", "haern-caduch"],
      // 10 Haern Caduch
      ["haern-caduch", "glenmore"],
      ["haern-caduch", "loc-ichaer"],
      ["haern-caduch", "beauclair"],
      // 11 Beauclair
      ["beauclair", "loc-ichaer"],
      ["beauclair", "ard-modron"],
      ["beauclair", "gorthur-gvaed"],
      // 12 Glenmore
      ["glenmore", "doldeth"],
      ["glenmore", "loc-ichaer"],
      // 13 Doldeth
      ["doldeth", "loc-ichaer"],
      ["doldeth", "dhuwod"],
      // 14 Loc Ichaer
      ["loc-ichaer", "dhuwod"],
      ["loc-ichaer", "stygga"],
      ["loc-ichaer", "ard-modron"],
      ["loc-ichaer", "gorthur-gvaed"],
      // 15 Gorthur Gvaed
      ["gorthur-gvaed", "ard-modron"],
      // 16 Dhuwod
      ["dhuwod", "stygga"],
      // 17 Stygga
      ["stygga", "ard-modron"]
    ];
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    for (const [a, b] of pairs) {
      const key = a < b ? `${a}|${b}` : `${b}|${a}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push([a, b]);
    }
    return out;
  })();
  var SCHOOL_START = {
    wilk: "kaer-morhen",
    gryf: "kaer-seren",
    niedzwiedz: "haern-caduch",
    kot: "stygga",
    zmija: "gorthur-gvaed",
    mantikora: "behelt-nar"
  };
  function locById(id) {
    return LOCATIONS.find((l) => l.id === id);
  }
  function schoolStartId(schoolId) {
    return SCHOOL_START[schoolId] || null;
  }
  function isSchoolLocationId(locId) {
    const loc = locById(locId);
    return Boolean(loc?.school && loc.school !== "mantikora");
  }
  function placeAtSchool(player, { force = false } = {}) {
    if (!player) return null;
    const start = schoolStartId(player.schoolId);
    if (!start) return null;
    if (force || !player.locationId || isSchoolLocationId(player.locationId) || player.locationId === schoolStartId(player._prevSchoolId)) {
      player.locationId = start;
    }
    return start;
  }
  function neighborsOf(id) {
    const out = [];
    for (const [a, b] of ROADS) {
      if (a === id) out.push(b);
      else if (b === id) out.push(a);
    }
    return out;
  }
  function actionHintFor(loc) {
    if (!loc?.actionKey) return "";
    return LOCATION_ACTION_HINTS[loc.actionKey] || "";
  }
  var FATIGUE_ON_REP = { 1: 1, 2: 2, 3: 3, 4: 4 };
  function fatigueForReputation(rep) {
    return FATIGUE_ON_REP[rep] ?? 0;
  }

  // js/player-state.js
  var ATTR_KEYS = [
    { id: "attack", label: "Atak" },
    { id: "defense", label: "Obrona" },
    { id: "alchemy", label: "Alchemia" },
    { id: "specialty", label: "Specjalno\u015B\u0107" }
  ];
  var TRAIL_TERRAINS = ["forest", "mountain", "water"];
  function ensureCombatTrack(p) {
    if (!p.attrs || typeof p.attrs !== "object") {
      p.attrs = { attack: 1, defense: 1, alchemy: 1, specialty: 1, level: 1 };
    }
    for (const k of ["attack", "defense", "alchemy", "specialty", "level"]) {
      if (typeof p.attrs[k] !== "number") p.attrs[k] = 1;
      p.attrs[k] = Math.max(1, Math.min(5, p.attrs[k]));
    }
    if (typeof p.shield !== "number") p.shield = p.attrs.defense;
    if (!Array.isArray(p.attrTrophies)) p.attrTrophies = [];
    if (!Array.isArray(p.quests)) p.quests = [];
    if (!p.trails || typeof p.trails !== "object") {
      p.trails = { forest: null, mountain: null, water: null };
    }
    for (const t of TRAIL_TERRAINS) {
      if (p.trails[t] === void 0) p.trails[t] = null;
      const slot = p.trails[t];
      if (slot && slot.kind === "quest") {
        const loc = slot.locId ? locById(slot.locId) : null;
        const label = TERRAIN[t]?.label || t;
        const already = p.quests.some(
          (q) => q.locationId === slot.locId && String(q.title || "").includes("tropienia")
        );
        if (slot.locId && !already) {
          p.quests.push({
            id: `q-trail-${t}-${slot.locId}`,
            title: `Zadanie tropienia (${label})`,
            locationId: slot.locId,
            eventCard: "",
            note: loc ? `Wejd\u017A na ${loc.name}: zbierz z\u0142oto z \u017Cetonu i odwr\xF3\u0107 \u2192 \u017Ceton tropu.` : "Wejd\u017A na nazw\u0119 z \u017Cetonu: zbierz z\u0142oto i odwr\xF3\u0107 \u2192 \u017Ceton tropu."
          });
        }
        p.trails[t] = null;
      }
    }
    if (typeof p.resourcesApplied !== "boolean") p.resourcesApplied = false;
    return p;
  }
  function applyStartResources(roster, players, { force = false } = {}) {
    const n = players;
    (roster || []).forEach((p, i) => {
      ensureCombatTrack(p);
      const start = START_RESOURCES[n]?.[i] || { cards: 5, gold: 3 };
      if (force || !p.resourcesApplied) {
        p.cards = start.cards;
        p.gold = start.gold;
        p.resourcesApplied = true;
      }
    });
  }
  function startResourcesFor(players, index) {
    return START_RESOURCES[players]?.[index] || { cards: 5, gold: 3 };
  }
  function meditationStatus(player, { isSolo: isSolo2 = false } = {}) {
    ensureCombatTrack(player);
    const readyAttrs = ATTR_KEYS.filter((a) => (player.attrs[a.id] || 1) >= 5).map((a) => a.id);
    const owned = new Set(player.attrTrophies || []);
    const available = readyAttrs.filter((id) => !owned.has(id));
    const can = available.length > 0;
    return {
      can,
      readyAttrs,
      available,
      owned: [...owned],
      reason: can ? `Mo\u017Cesz medytowa\u0107: ${available.map((id) => ATTR_KEYS.find((a) => a.id === id)?.label || id).join(", ")} na V.` : readyAttrs.length ? "Masz atrybut na V, ale to trofeum ju\u017C masz \u2014 medytacja zablokowana." : "Medytacja zablokowana: \u017Caden atrybut nie jest na poziomie V.",
      soloNote: isSolo2 ? "Solo: we\u017A odkryte trofeum atrybutu z przygotowania, zanim pokonasz 3. potwora." : "Multi: trofeum ze stosu atrybut\xF3w. 4. reputacja z medytacji nie ko\u0144czy gry."
    };
  }
  function phase2FightOptions(player, { board, roster = [], isSolo: isSolo2 = false } = {}) {
    const locId = player?.locationId || null;
    const m = locId ? board?.monsters?.[locId] : null;
    const canMonster = Boolean(locId && m && m.count > 0);
    const others = (roster || []).filter(
      (r) => r && r !== player && r.locationId && locId && r.locationId === locId
    );
    const canWitcher = !isSolo2 && others.length > 0;
    const can = canMonster || canWitcher;
    let reason;
    if (!locId) {
      reason = "Walka zablokowana: brak lokacji (wybierz szko\u0142\u0119 w Graczach).";
    } else if (canMonster && canWitcher) {
      reason = `Mo\u017Cesz walczy\u0107 z potworem albo z: ${others.map((o) => o.name).join(", ")}.`;
    } else if (canMonster) {
      reason = "Na Twoim polu stoi potw\xF3r \u2014 walka opcjonalna (mo\u017Cesz te\u017C medytowa\u0107 / eksplorowa\u0107).";
    } else if (canWitcher) {
      reason = `Brak potwora na polu. Mo\u017Cesz walczy\u0107 z: ${others.map((o) => o.name).join(", ")}.`;
    } else {
      reason = "Walka zablokowana: na tym polu nie ma potwora (oznacz go na mapie, je\u015Bli stoi na stole).";
    }
    return {
      can,
      canMonster,
      canWitcher,
      others,
      monster: canMonster ? m : null,
      reason
    };
  }
  var TRAIL_ICON = {
    forest: () => ICO.forest(),
    mountain: () => ICO.mountain(),
    water: () => ICO.water()
  };
  function trailsHtml(player, { editable = false, board = null } = {}) {
    ensureCombatTrack(player);
    const monsters = monstersForTrails(board);
    if (!editable) {
      const rows = TRAIL_TERRAINS.map((t) => {
        const slot = player.trails[t];
        const label = TERRAIN[t]?.label || t;
        const loc = slot?.locId ? locById(slot.locId) : null;
        const status = slot?.kind === "trail" ? `trop${loc ? ` \xB7 ${loc.name}` : ""}` : "brak";
        return `<li>${TRAIL_ICON[t]?.() || ""} <strong>${label}:</strong> ${status}</li>`;
      }).join("");
      return `
      <div class="guide-box">
        <p class="step-kicker" style="margin:0">${ICO.monster()} \u017Betony tropu</p>
        <ul class="checklist">${rows}</ul>
      </div>`;
    }
    const buttons = TRAIL_TERRAINS.map((t) => {
      const label = TERRAIN[t]?.label || t;
      const opts = monsters[t] || [];
      const slot = player.trails[t];
      const primary = opts[0] || null;
      if (!primary?.loc) {
        return `
        <button type="button" class="trail-token-btn is-empty" disabled data-trail-terrain="${t}" title="Brak potwora na tym terenie">
          <span class="trail-token-ico">${TRAIL_ICON[t]?.() || ""}</span>
          <strong>${escapeHtmlLite(label)}</strong>
          <span class="trail-token-meta">niedost\u0119pne</span>
          <span class="trail-token-status">ustaw potwora w panelu</span>
        </button>`;
      }
      const loc = primary.loc;
      const hasTrop = slot?.kind === "trail";
      const nextKind = hasTrop ? "clear" : "trail";
      const statusTxt = hasTrop ? "trop \xB7 klik \u2192 wyczy\u015B\u0107" : "klik \u2192 we\u017A trop";
      const meta = primary.level != null && primary.level !== "" ? `poz. ${escapeHtmlLite(String(primary.level))}` : escapeHtmlLite(label);
      return `
      <button type="button" class="trail-token-btn ${hasTrop ? "active is-trail" : ""}" data-trail-monster="${t}" data-loc="${escapeHtmlLite(
        loc.id
      )}" data-kind="${nextKind}" title="${escapeHtmlLite(label)}">
        <span class="trail-token-ico">${TRAIL_ICON[t]?.() || ""}</span>
        <strong>${escapeHtmlLite(loc.name || label)}</strong>
        <span class="trail-token-meta">${meta}</span>
        <span class="trail-token-status">${statusTxt}</span>
      </button>`;
    }).join("");
    return `
    <div class="guide-box trail-tokens-box">
      <p class="step-kicker" style="margin:0">${ICO.monster()} \u017Betony tropu</p>
      <p class="lead" style="margin:0.3rem 0 0">Przy <strong>akcji tropienia</strong> wybierasz <strong>1</strong> teren potwora ze sto\u0142u. Klik = masz trop (zaczynasz walk\u0119). Doj\u015Bcie z \u017Cetonu zapisuj jako zadanie u g\xF3ry.</p>
      <div class="trail-token-grid" role="group" aria-label="\u017Betony tropu">${buttons}</div>
    </div>`;
  }
  function attrsAdjustHtml(player) {
    ensureCombatTrack(player);
    const a = player.attrs;
    return `
    <div class="guide-box resource-adjust">
      <p class="step-kicker" style="margin:0">Planszetka \u2014 atrybuty</p>
      <p class="lead" style="margin:0.3rem 0 0">Poziom <strong>${a.level}</strong> \xB7 tarcza <strong>${player.shield ?? a.defense}</strong> (max = obrona)</p>
      <div class="tracker-grid" style="margin-top:0.65rem">
        ${ATTR_KEYS.map(
      (k) => `
          <label>${k.label}
            <div class="num-row">
              <button type="button" class="btn btn-secondary" data-attr="${k.id}" data-delta="-1">\u2212</button>
              <strong class="num-val">${a[k.id]}</strong>
              <button type="button" class="btn btn-secondary" data-attr="${k.id}" data-delta="1">+</button>
            </div>
          </label>`
    ).join("")}
        <label>Poziom
          <div class="num-row">
            <button type="button" class="btn btn-secondary" data-attr="level" data-delta="-1">\u2212</button>
            <strong class="num-val">${a.level}</strong>
            <button type="button" class="btn btn-secondary" data-attr="level" data-delta="1">+</button>
          </div>
        </label>
        <label>Tarcza
          <div class="num-row">
            <button type="button" class="btn btn-secondary" data-shield-delta="-1">\u2212</button>
            <strong class="num-val">${player.shield ?? a.defense}</strong>
            <button type="button" class="btn btn-secondary" data-shield-delta="1">+</button>
          </div>
        </label>
      </div>
    </div>`;
  }
  function hasTrailForMonster(player, monsterLoc) {
    ensureCombatTrack(player);
    if (!monsterLoc) return false;
    const terrain = monsterLoc.terrain;
    const slot = player.trails?.[terrain];
    return Boolean(slot && slot.kind === "trail");
  }
  function monstersForTrails(board) {
    const byTerrain = { forest: [], mountain: [], water: [] };
    for (const [locId, m] of Object.entries(board?.monsters || {})) {
      if (!m || !(m.count > 0)) continue;
      const loc = locById(locId);
      if (!loc || !byTerrain[loc.terrain]) continue;
      byTerrain[loc.terrain].push({
        locId,
        loc,
        count: m.count,
        level: m.level || null,
        label: m.label || null
      });
    }
    return byTerrain;
  }
  function levelUpStatus(player) {
    ensureCombatTrack(player);
    const level = player.attrs.level || 1;
    const attrs = ATTR_KEYS.map((a) => ({
      id: a.id,
      label: a.label,
      value: player.attrs[a.id] || 1
    }));
    const allAbove = attrs.every((a) => a.value > level);
    const can = allAbove && level < 5;
    return {
      level,
      attrs,
      can,
      reason: can ? `Wszystkie atrybuty > poziom ${level} \u2192 podnie\u015B poziom wied\u017Amina do ${level + 1}.` : level >= 5 ? "Poziom ju\u017C na maksimum (5)." : `Awans zablokowany: potrzebujesz wszystkich atrybut\xF3w > ${level} (teraz: ${attrs.map((a) => `${a.label} ${a.value}`).join(", ")}).`
    };
  }
  function fieldChangePrompt(player, loc) {
    ensureCombatTrack(player);
    const level = player.attrs.level || 1;
    const actions = [];
    const key = loc?.actionKey;
    const freeAttr = (attrId, label) => {
      const cur = player.attrs[attrId] || 1;
      const ok = cur <= level && cur < 5;
      actions.push({
        id: `attr:${attrId}`,
        kind: "attr",
        attrId,
        label: `+1 ${label}`,
        detail: ok ? `${label} ${cur} \u2264 poziom ${level} \u2192 mo\u017Cesz podnie\u015B\u0107 do ${cur + 1}.` : cur >= 5 ? `${label} ju\u017C na V.` : `${label} ${cur} > poziom ${level} \u2014 ten darmowy trening nie dzia\u0142a.`,
        enabled: ok,
        defaultOn: ok
      });
    };
    if (key === "schoolTrain") {
      for (const a of ATTR_KEYS) {
        const cur = player.attrs[a.id] || 1;
        const target = cur + 1;
        const cost = target;
        const ok = cur < 5 && (player.gold || 0) >= cost;
        actions.push({
          id: `school:${a.id}`,
          kind: "school",
          attrId: a.id,
          goldCost: cost,
          label: `Szko\u0142a: +1 ${a.label} (\u2212${cost} z\u0142)`,
          detail: ok ? `Zap\u0142a\u0107 ${cost} z\u0142 (poziom docelowy) \u2192 ${a.label} ${cur}\u2192${target}.` : cur >= 5 ? `${a.label} ju\u017C na V.` : `Za ma\u0142o z\u0142ota (${player.gold || 0}/${cost}) albo atrybut max.`,
          enabled: ok,
          defaultOn: false
        });
      }
    } else if (key === "defenseLevel") freeAttr("defense", "Obrona");
    else if (key === "attackLevel") freeAttr("attack", "Atak");
    else if (key === "specialtyLevel") freeAttr("specialty", "Specjalno\u015B\u0107");
    else if (key === "alchemyLevel") {
      const ok = (player.elixirs || 0) < 4;
      actions.push({
        id: "elixir:1",
        kind: "elixir",
        label: "+1 eliksir",
        detail: ok ? `Alchemia \u2264 poziom? Sprawd\u017A na planszy. Eliksiry: ${player.elixirs || 0}/4.` : "Masz ju\u017C 4 eliksiry (limit).",
        enabled: ok && (player.attrs.alchemy || 1) <= level,
        defaultOn: ok && (player.attrs.alchemy || 1) <= level
      });
    } else if (key === "gainElixir" || key === "cintraElixir") {
      const ok = (player.elixirs || 0) < 4;
      actions.push({
        id: "elixir:1",
        kind: "elixir",
        label: "+1 eliksir",
        detail: ok ? `Eliksiry: ${player.elixirs || 0}/4.` : "Limit 4 eliksiry.",
        enabled: ok,
        defaultOn: ok
      });
    } else if (key === "trailGold") {
      actions.push({
        id: "gold:1",
        kind: "gold",
        label: "+1 z\u0142oto (znak pola)",
        detail: "We\u017A 1 z\u0142oto z banku. Opcja tropienia \u2014 osobno w \u017Cetonach tropu.",
        enabled: true,
        defaultOn: true
      });
    }
    const lvl = levelUpStatus(player);
    actions.push({
      id: "level:up",
      kind: "level",
      label: lvl.can ? `+1 poziom wied\u017Amina (${lvl.level}\u2192${lvl.level + 1})` : "Awans poziomu",
      detail: lvl.reason,
      enabled: lvl.can,
      defaultOn: lvl.can
    });
    return {
      loc,
      level,
      attrs: { ...player.attrs },
      gold: player.gold || 0,
      elixirs: player.elixirs || 0,
      actions,
      hint: actionHintFor(loc) || ""
    };
  }
  function applyFieldChange(player, actionId) {
    ensureCombatTrack(player);
    if (!actionId) return { ok: false, reason: "Brak akcji." };
    if (actionId === "level:up") {
      const st = levelUpStatus(player);
      if (!st.can) return { ok: false, reason: st.reason };
      player.attrs.level += 1;
      return { ok: true };
    }
    if (actionId === "gold:1") {
      player.gold = (player.gold || 0) + 1;
      return { ok: true };
    }
    if (actionId === "elixir:1") {
      if ((player.elixirs || 0) >= 4) return { ok: false, reason: "Limit 4 eliksiry." };
      player.elixirs = (player.elixirs || 0) + 1;
      return { ok: true };
    }
    if (actionId.startsWith("attr:")) {
      const attrId = actionId.slice(5);
      const cur = player.attrs[attrId] || 1;
      if (cur >= 5) return { ok: false, reason: "Atrybut max." };
      if (cur > (player.attrs.level || 1)) return { ok: false, reason: "Atrybut > poziom \u2014 darmowy trening nie dzia\u0142a." };
      player.attrs[attrId] = cur + 1;
      if (attrId === "defense") player.shield = Math.max(player.shield || 0, player.attrs.defense);
      return { ok: true };
    }
    if (actionId.startsWith("school:")) {
      const attrId = actionId.slice(7);
      const cur = player.attrs[attrId] || 1;
      if (cur >= 5) return { ok: false, reason: "Atrybut max." };
      const cost = cur + 1;
      if ((player.gold || 0) < cost) return { ok: false, reason: `Brak z\u0142ota (${player.gold || 0}/${cost}).` };
      player.gold -= cost;
      player.attrs[attrId] = cur + 1;
      if (attrId === "defense") player.shield = Math.max(player.shield || 0, player.attrs.defense);
      if (attrId === "alchemy" && (player.elixirs || 0) < 4) {
        player.elixirs = (player.elixirs || 0) + 1;
      }
      return { ok: true };
    }
    return { ok: false, reason: "Nieznana akcja." };
  }
  function fieldChangeModalHtml(player, loc) {
    const prompt = fieldChangePrompt(player, loc);
    const a = prompt.attrs;
    return `
    <div class="field-modal" id="field-change-modal" role="dialog" aria-modal="true" aria-labelledby="field-modal-title">
      <div class="field-modal-card">
        <p class="step-kicker" style="margin:0">Po wej\u015Bciu na pole</p>
        <h2 id="field-modal-title" style="margin:0.25rem 0 0.4rem">${escapeHtmlLite(loc?.name || "?")}${typeof loc?.number === "number" ? ` (#${loc.number})` : ""}</h2>
        <p class="lead" style="margin:0">Teraz: poziom <strong>${prompt.level}</strong> \xB7 atak ${a.attack} \xB7 obrona ${a.defense} \xB7 alchemia ${a.alchemy} \xB7 specjalno\u015B\u0107 ${a.specialty} \xB7 z\u0142oto ${prompt.gold} \xB7 eliksiry ${prompt.elixirs}</p>
        ${prompt.hint ? `<p class="note" style="margin:0.45rem 0 0"><strong>Znak:</strong> ${escapeHtmlLite(prompt.hint)}</p>` : ""}
        <p class="tip" style="margin:0.65rem 0 0.35rem"><strong>Zaznacz, co zmieniasz na planszetce</strong>, potem Potwierd\u017A.</p>
        <div class="field-modal-actions">
          ${prompt.actions.map(
      (act) => `
            <label class="field-modal-row ${act.enabled ? "" : "is-disabled"}">
              <input type="checkbox" data-field-action="${escapeHtmlLite(act.id)}" ${act.enabled && act.defaultOn ? "checked" : ""} ${act.enabled ? "" : "disabled"} />
              <span>
                <strong>${escapeHtmlLite(act.label)}</strong>
                <span class="note" style="display:block;margin:0.15rem 0 0">${escapeHtmlLite(act.detail)}</span>
              </span>
            </label>`
    ).join("")}
        </div>
        <p class="note" style="margin:0.65rem 0 0"><strong>Poziom:</strong> awansujesz, gdy <em>wszystkie</em> atrybuty s\u0105 wy\u017Csze ni\u017C aktualny poziom wied\u017Amina (potem +1 poziom).</p>
        <div class="actions" style="margin-top:0.85rem">
          <button type="button" class="btn btn-primary" id="field-modal-confirm">Potwierd\u017A i dalej</button>
        </div>
      </div>
    </div>
  `;
  }
  function escapeHtmlLite(s) {
    return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // js/start-resources-screen.js
  var RES_OPTS = { cardHeight: 140, coinSize: 56 };
  function schoolById(id) {
    return SCHOOLS.find((s) => s.id === id) || SCHOOLS[0];
  }
  function schoolArtSrc(id) {
    return `./img/schools/${id === "kot" ? "kot-v10" : id}.png?v=10`;
  }
  function dealItemHtml(player, index, playerCount) {
    const res = startResourcesFor(playerCount, index);
    const sid = player.schoolId || SCHOOLS[0].id;
    const school = schoolById(sid);
    return `
    <li class="deal-item order-item" data-idx="${index}">
      <span class="order-pos">${index + 1}</span>
      <span class="splash-medal-disc splash-medal-disc--${sid} order-medal" aria-hidden="true">
        <img class="school-art school-art--${sid}" src="${schoolArtSrc(sid)}" alt="" width="72" height="72" decoding="async" />
      </span>
      <strong class="order-name">${escapeHtmlLite(player.name)}</strong>
      <span class="order-school">${escapeHtmlLite(school.short)}</span>
      ${orderStartResourcesHtml(res.cards, res.gold, RES_OPTS)}
    </li>`;
  }
  function startResourcesDealIntro(solo) {
    if (solo) {
      return {
        title: "Dobierz karty i z\u0142oto",
        lead: "We\u017A podane poni\u017Cej karty z talii akcji oraz z\u0142oto z banku i u\u0142\xF3\u017C je na planszecie."
      };
    }
    return {
      title: "Dobierz karty i z\u0142oto",
      lead: ""
    };
  }
  function startResourcesDealListHtml({ roster, playerCount }) {
    const list = roster || [];
    return `
    <ul class="deal-list order-list" data-count="${list.length}" style="--order-cols:${list.length}">
      ${list.map((p, i) => dealItemHtml(p, i, playerCount)).join("")}
    </ul>`;
  }

  // js/screen-transition.js
  var FLOW_DURATION_MS = 380;
  function motionEnabled() {
    return typeof window.matchMedia !== "function" || !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function viewTransitionsSupported() {
    return typeof document.startViewTransition === "function";
  }
  function legacyPanelLeaveThen(next) {
    const appEl2 = document.getElementById("app");
    const panel = appEl2?.querySelector(".panel");
    if (!panel || !motionEnabled()) {
      next();
      return Promise.resolve();
    }
    if (panel.classList.contains("is-leaving")) {
      return new Promise((resolve) => {
        window.setTimeout(() => {
          next();
          resolve();
        }, FLOW_DURATION_MS + 30);
      });
    }
    panel.classList.add("is-leaving");
    return new Promise((resolve) => {
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        panel.removeEventListener("animationend", onEnd);
        next();
        resolve();
      };
      const onEnd = (event) => {
        if (event.target === panel) finish();
      };
      panel.addEventListener("animationend", onEnd);
      window.setTimeout(finish, FLOW_DURATION_MS + 40);
    });
  }
  function markPanelEntering() {
    if (viewTransitionsSupported() || !motionEnabled()) return;
    const appEl2 = document.getElementById("app");
    const panel = appEl2?.querySelector(".panel");
    if (!panel) return;
    panel.classList.remove("is-leaving");
    panel.classList.add("is-entering");
    const done = () => {
      panel.classList.remove("is-entering");
      panel.removeEventListener("animationend", onEnd);
    };
    const onEnd = (event) => {
      if (event.target === panel) done();
    };
    panel.addEventListener("animationend", onEnd);
    window.setTimeout(done, FLOW_DURATION_MS + 50);
  }
  function runScreenTransition(update, { direction = "forward" } = {}) {
    const root = document.documentElement;
    if (!motionEnabled()) {
      update();
      return Promise.resolve();
    }
    root.dataset.vtDir = direction;
    if (viewTransitionsSupported()) {
      try {
        const vt = document.startViewTransition(() => {
          update();
        });
        return vt.finished.catch(() => {
        }).finally(() => {
          delete root.dataset.vtDir;
        });
      } catch {
        delete root.dataset.vtDir;
      }
    }
    return legacyPanelLeaveThen(() => {
      update();
      markPanelEntering();
      delete root.dataset.vtDir;
    });
  }

  // js/map-setup-pawns.js
  function schoolById2(id) {
    return SCHOOLS.find((s) => s.id === id) || SCHOOLS[0];
  }
  function mapPawnsPrepCopy() {
    return {
      title: "\u017Betony i figurki na mapie",
      lead: "Po\u0142\xF3\u017C \u017Ceton szko\u0142y na polu <strong>0</strong> toru reputacji (lewy dolny r\xF3g mapy). Figurki wied\u017Amin\xF3w ustaw na obszarach startowych szk\xF3\u0142 \u2014 jak na podgl\u0105dzie."
    };
  }
  function mapPawnsRosterHintHtml(roster) {
    return (roster || []).map((p, i) => {
      const sid = p.schoolId || SCHOOLS[0].id;
      const school = schoolById2(sid);
      const start = locById(schoolStartId(sid));
      const where = start?.name || "\u2014";
      return `<li><strong>${escapeHtmlLite(p.name || `Gracz ${i + 1}`)}</strong> \xB7 ${escapeHtmlLite(school.short)} \u2192 ${escapeHtmlLite(where)}</li>`;
    }).join("");
  }
  function mapPawnsPrepPanelHtml({ roster }) {
    const sc = mapPawnsPrepCopy();
    const list = mapPawnsRosterHintHtml(roster);
    return `
    <div class="map-pawns-prep-caption player-board-prep-panel">
      <h2 class="player-board-prep-panel__title">${sc.title}</h2>
      <p class="player-board-prep-panel__body">${sc.lead}</p>
      ${list ? `<ul class="checklist map-pawns-prep-list">${list}</ul>` : ""}
    </div>`;
  }

  // js/lexicon.js
  var ATTRIBUTES = [
    {
      id: "atak",
      name: "Atak",
      body: "Ile kart dobierasz na koniec swojej tury walki (po kombinacji), \xB1 modyfikatory z kart."
    },
    {
      id: "obrona",
      name: "Obrona",
      body: "Limit tarczy. +1 obrona \u2192 natychmiast +1 tarcza (max 5). Tarcza nigdy > obrona. Po walce ustaw tarcz\u0119 = obrona."
    },
    {
      id: "alchemia",
      name: "Alchemia",
      body: "+1 alchemia \u2192 dobierz 1 eliksir. W ca\u0142ej walce mo\u017Cesz zu\u017Cy\u0107 \u0142\u0105cznie tyle eliksir\xF3w, ile wynosi alchemia. Limit posiadania: 4 eliksiry."
    },
    {
      id: "zdolnosc",
      name: "Zdolno\u015B\u0107 specjalna (szko\u0142a)",
      body: "Unikalna dla szko\u0142y. Raz na walk\u0119 (chyba \u017Ce inaczej). Po podniesieniu poziomu nie u\u017Cywasz efekt\xF3w ni\u017Cszych poziom\xF3w. Trening tylko w swojej szkole."
    }
  ];
  var SCHOOL_SPECIALTIES = [
    {
      id: "wilk",
      name: "Szko\u0142a Wilka \u2014 szermierka",
      body: "Raz na walk\u0119, gdy zagrasz kombinacj\u0119 3+ kart: mo\u017Cesz zada\u0107 dodatkowe obra\u017Cenia; od II poziomu tak\u017Ce dobra\u0107 dodatkowe karty (wg ikon na torze)."
    },
    {
      id: "gryf",
      name: "Szko\u0142a Gryfa \u2014 magia",
      body: "Raz na walk\u0119: dobierz 1 kart\u0119 z wierzchu stosu odrzuconych, potem mo\u017Cesz odrzuci\u0107 cz\u0119\u015B\u0107 kart z r\u0119ki. Na IV\u2013V: przejrzyj ca\u0142y stos odrzuconych i we\u017A dowoln\u0105 1 na r\u0119k\u0119."
    },
    {
      id: "niedzwiedz",
      name: "Szko\u0142a Nied\u017Awiedzia \u2014 zbroja",
      body: "Raz na walk\u0119, w Twojej turze walki, gdy tarcza = 0: natychmiast dobierz z talii wytrzyma\u0142o\u015Bci; od II tak\u017Ce podnie\u015B tarcz\u0119 (wg ikon)."
    },
    {
      id: "kot",
      name: "Szko\u0142a Kota \u2014 szybko\u015B\u0107",
      body: "Raz na walk\u0119, w pierwszej turze walki: podejrzyj wierzchnie karty talii wytrzyma\u0142o\u015Bci; cz\u0119\u015B\u0107 od\u0142\xF3\u017C na wierzch w wybranej kolejno\u015Bci, reszt\u0119 we\u017A na r\u0119k\u0119. Na I, IV i V: wszystkie podejrzane zostaj\u0105 na r\u0119ce."
    },
    {
      id: "zmija",
      name: "Szko\u0142a \u017Bmii \u2014 zatruta stal",
      body: "Raz na walk\u0119, gdy przeciwnik odrzuca karty w wyniku Twojego ataku: podejrzyj/przestaw wierzchnie karty jego talii (liczba z toru); od II mo\u017Cesz te\u017C odrzuci\u0107 wskazan\u0105 liczb\u0119 \u2014 wtedy musisz to zrobi\u0107."
    }
  ];
  var COMBAT_STEPS = `
  <h3>Tura walki wied\u017Amina (4 kroki)</h3>
  <ol class="checklist">
    <li><strong>1. Eliksiry / zdolno\u015B\u0107 / ekwipunek i trofea</strong> \u2014 eliksiry \u0142\u0105cznie \u2264 alchemii w ca\u0142ej walce; zdolno\u015B\u0107 raz na walk\u0119; efekty \u201Eraz na walk\u0119\u201D opcjonalne.</li>
    <li><strong>2. Kombinacja</strong> \u2014 zagraj \u22651 kart\u0119 z r\u0119ki (obowi\u0105zkowe, je\u015Bli masz karty). Kolejne musz\u0105 pasowa\u0107 przed\u0142u\u017Ceniami. 1 karta na r\u0119ce = grasz t\u0119 jedn\u0105.</li>
    <li><strong>3. Rozpatrzenie</strong> \u2014 suma symboli obra\u017Ce\u0144: potw\xF3r zrzuca tyle kart ze swojej talii walki. Inne symbole (tarcza, \xB1dob\xF3r\u2026) wg ikon.</li>
    <li><strong>4. Dob\xF3r</strong> \u2014 z talii wytrzyma\u0142o\u015Bci dobierz = poziom <strong>Ataku</strong> \xB1 modyfikatory. Na r\u0119k\u0119. Limit 7 w walce = stop.</li>
  </ol>
  <p class="tip"><strong>Co liczy\u0107?</strong> Obra\u017Cenia = liczba mieczy/symboli obra\u017Ce\u0144 na zagranych kartach (i eliksirach). Atak na planszetce = ile kart dobierasz po swoim ataku. Talia potwora = jego \u017Cycie.</p>
  <p class="tip">Potw\xF3r: szar\u017Ca albo ugryzienie \u2192 odkryj 1 kart\u0119 walki \u2192 efekty. Solo: ko\u015B\u0107 1\u20133 szar\u017Ca / 4\u20136 ugryzienie.</p>
  <p class="warn">Obra\u017Cenia na Ciebie: najpierw tarcza, potem wierzch Twojej talii wytrzyma\u0142o\u015Bci, potem r\u0119ka (typowo; wyj\u0105tki na karcie potwora).</p>
`;
  var LEVEL_UP = `
  <h3>Awans poziomu wied\u017Amina</h3>
  <p>Gdy <strong>wszystkie 4</strong> znaczniki atrybut\xF3w s\u0105 <em>powy\u017Cej</em> aktualnego poziomu wied\u017Amina \u2192 awans natychmiast.</p>
  <ul class="checklist">
    <li>Na poziom II lub III: dobierz <strong>1</strong> kart\u0119 z talii akcji.</li>
    <li>Na poziom IV lub V: dobierz <strong>2</strong> karty.</li>
    <li>Poziom wied\u017Amina nie spada, nawet gdy atrybuty spadn\u0105.</li>
    <li>Atrybut na V nie mo\u017Ce by\u0107 obni\u017Cony.</li>
  </ul>
`;
  var TRAIL_LEXICON = `
  <h3>\u017Beton obszaru vs \u017Ceton tropu</h3>
  <ul class="checklist">
    <li><strong>\u017Beton obszaru</strong> \u2014 \u017Ceton z puli las/g\xF3ry/woda obok planszy. Jedna strona: nazwa lokacji, druga: symbol terenu.</li>
    <li><strong>Zadanie tropienia</strong> \u2014 \u017Ceton le\u017Cy u Ciebie <em>nazw\u0105 do g\xF3ry</em> + 1 z\u0142oto na nim. Cel: doj\u015B\u0107 ruchem na t\u0119 lokacj\u0119.</li>
    <li><strong>\u017Beton tropu</strong> \u2014 po doj\u015Bciu zbierasz z\u0142oto i odwracasz \u017Ceton na symbol terenu. Oznacza, \u017Ce tropisz potwora z tego terenu \u2192 w walce z nim cz\u0119sto <strong>zaczynasz pierwszy</strong>.</li>
    <li>Max <strong>1 trop na rodzaj terenu</strong>. Konflikt (nowy tego samego) \u2192 stare zadanie/trop znika bez z\u0142ota z \u017Cetonu (FAQ #10).</li>
  </ul>
`;
  var WHAT_WE_DONT_HAVE = `
  <h3>Czego helper NIE zast\u0105pi</h3>
  <p class="lead">Nie mam dost\u0119pu do pe\u0142nej bazy ilustracji ani pe\u0142nych tekst\xF3w wszystkich kart z pude\u0142ka.</p>
  <ul class="checklist">
    <li><strong>28 kart potwor\xF3w</strong> \u2014 PW i zdolno\u015B\u0107 czytaj z karty na stole (helper prowadzi procedur\u0119 walki).</li>
    <li><strong>90 kart akcji + startowe</strong> \u2014 teksty i symbole z kart fizycznych.</li>
    <li><strong>28 eliksir\xF3w, ekwipunek, towarzysze</strong> \u2014 efekty z karty / zdarzenia.</li>
    <li><strong>72 eksploracji + 56 zdarze\u0144</strong> \u2014 fabularne teksty zawsze z karty (helper m\xF3wi tylko <em>jak</em> czyta\u0107 A/B).</li>
  </ul>
  <p class="tip">Tak ma by\u0107: przy stole karty = tre\u015B\u0107, telefon/laptop = kto kiedy co robi i FAQ. Pe\u0142ne skopiowanie wszystkich kart do sieci \u0142ama\u0142oby prawa CDPR/Go On Board.</p>
`;
  function lexiconHtml() {
    const attrs = ATTRIBUTES.map(
      (a) => `<li><strong>${a.name}</strong><div>${a.body}</div></li>`
    ).join("");
    const schools = SCHOOL_SPECIALTIES.map(
      (s) => `<li><strong>${s.name}</strong><div>${s.body}</div></li>`
    ).join("");
    return `
    ${WHAT_WE_DONT_HAVE}
    <h3>Atrybuty (wszyscy)</h3>
    <ul class="checklist">${attrs}</ul>
    ${LEVEL_UP}
    <h3>Zdolno\u015Bci szk\xF3\u0142 (podstawka)</h3>
    <ul class="checklist">${schools}</ul>
    <p class="note">Dok\u0142adne liczby obra\u017Ce\u0144/doboru na ka\u017Cdym poziomie I\u2013V s\u0105 na <strong>planszetce</strong> (ikony obok toru) \u2014 helper nie zast\u0119puje ikon.</p>
    ${TRAIL_LEXICON}
    ${COMBAT_STEPS}
  `;
  }

  // js/guide.js
  var MOVE_COSTS = [
    {
      id: "match",
      title: "1 karta terenu",
      short: "Pasuj\u0105cy las / g\xF3ry / woda",
      cards: 1,
      gold: 0,
      tip: "Odrzu\u0107 1 kart\u0119 z ikon\u0105 terenu takiego jak miejsce, na kt\xF3re idziesz."
    },
    {
      id: "wild",
      title: "1 karta uniwersalna",
      short: "Woda+las+g\xF3ry na karcie",
      cards: 1,
      gold: 0,
      tip: "Symbol uniwersalny = woda + las + g\xF3ry w jednym okr\u0119gu. Liczy si\u0119 jak dowolny teren. To nie \u017Ceton z planszy."
    },
    {
      id: "two",
      title: "2 dowolne karty",
      short: "Bez dopasowania terenu",
      cards: 2,
      gold: 0,
      tip: "Odrzu\u0107 dowolne 2 karty \u2192 mo\u017Cesz wej\u015B\u0107 na dowolnego s\u0105siada."
    },
    {
      id: "card_gold",
      title: "1 karta + 1 z\u0142oto",
      short: "Mieszany koszt",
      cards: 1,
      gold: 1,
      tip: "Odrzu\u0107 1 dowoln\u0105 kart\u0119 i zap\u0142a\u0107 1 z\u0142oto \u2192 dowolny s\u0105siad."
    }
  ];
  function moveCostById(id) {
    return MOVE_COSTS.find((c) => c.id === id);
  }
  function applyMoveCost(player, costId) {
    const cost = moveCostById(costId);
    if (!player || !cost) return { ok: false, reason: "Brak gracza / kosztu." };
    if ((player.cards || 0) < cost.cards) {
      return { ok: false, reason: `Za ma\u0142o kart na r\u0119ce (potrzeba ${cost.cards}).` };
    }
    if ((player.gold || 0) < cost.gold) {
      return { ok: false, reason: `Za ma\u0142o z\u0142ota (potrzeba ${cost.gold}).` };
    }
    player.cards = Math.max(0, (player.cards || 0) - cost.cards);
    player.gold = Math.max(0, (player.gold || 0) - cost.gold);
    player.lastMoveCost = costId;
    return { ok: true, cost };
  }
  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function terrainChip(terrainId) {
    const t = TERRAIN[terrainId];
    if (!t) return "";
    const ico = terrainId === "forest" ? ICO.forest() : terrainId === "mountain" ? ICO.mountain() : terrainId === "water" ? ICO.water() : "";
    return `${ico} <strong>${escapeHtml(t.label)}</strong>`;
  }
  function moveCostChooserHtml({ fromLoc, toLoc, playerName, selectedCostId }) {
    const to = toLoc;
    const from = fromLoc;
    const terrainLine = to ? `Cel: <strong>${escapeHtml(to.name)}</strong> (#${to.number}) \u2014 teren ${terrainChip(to.terrain)}` : "Wybierz s\u0105siada na mapie / li\u015Bcie.";
    const fromLine = from ? `Z: <strong>${escapeHtml(from.name)}</strong> (#${from.number})` : "";
    return `
    <div class="guide-box guide-move" role="region" aria-label="Koszt ruchu">
      <p class="step-kicker" style="margin:0">Ruch \u2014 prowadzenie</p>
      <h3 style="margin:0.25rem 0 0.4rem">Dok\u0105d idziesz${playerName ? `, ${escapeHtml(playerName)}` : ""}?</h3>
      <p class="lead" style="margin:0">${terrainLine}</p>
      ${fromLine ? `<p class="note" style="margin:0.35rem 0 0">${fromLine}</p>` : ""}
      <p class="tip" style="margin:0.65rem 0 0.4rem"><strong>Za ten ruch musisz co\u015B odda\u0107.</strong> Kliknij, co wybra\u0142e\u015B z r\u0119ki:</p>
      <div class="choice-grid move-cost-grid">
        ${MOVE_COSTS.map(
      (c) => `
          <button type="button" class="choice ${selectedCostId === c.id ? "active" : ""}" data-move-cost="${c.id}">
            <strong>${escapeHtml(c.title)}</strong>
            <span>${escapeHtml(c.short)}</span>
            <span class="note">${escapeHtml(c.tip)}</span>
          </button>`
    ).join("")}
      </div>
      <p class="note" style="margin:0.55rem 0 0">Po klikni\u0119ciu helper odejmie karty / z\u0142oto w trackerze (mo\u017Cesz potem poprawi\u0107 r\u0119cznie).</p>
    </div>
  `;
  }
  function affordNote(player, cardsNeed, goldNeed) {
    if (!player) return "";
    const cardsOk = (player.cards || 0) >= cardsNeed;
    const goldOk = (player.gold || 0) >= goldNeed;
    if (cardsOk && goldOk) return "masz zasoby";
    const miss = [];
    if (!cardsOk) miss.push(`kart ${player.cards || 0}/${cardsNeed}`);
    if (!goldOk) miss.push(`z\u0142ota ${player.gold || 0}/${goldNeed}`);
    return `uwaga: ${miss.join(", ")}`;
  }
  function destinationPreviewHtml(toId, { player, roster = [], monsters = {} } = {}) {
    const to = locById(toId);
    if (!to) return `<p class="warn">Nieznane pole.</p>`;
    const mon = monsters?.[toId];
    const others = (roster || []).filter(
      (r) => r && r !== player && r.locationId === toId
    );
    const t = TERRAIN[to.terrain];
    return `
    <div class="guide-box guide-dest-preview">
      <p class="step-kicker" style="margin:0">Cel ruchu</p>
      <h3 style="margin:0.25rem 0 0.4rem">${escapeHtml(to.name)} (#${to.number})</h3>
      <p class="lead" style="margin:0">Teren: ${terrainChip(to.terrain)} ${t ? escapeHtml(t.label) : ""}</p>
      ${mon ? `<p class="warn" style="margin-top:0.55rem">${ICO.monster()} <strong>Potw\xF3r</strong> na polu${mon.level ? ` (poz. ${escapeHtml(String(mon.level))})` : ""} \u2014 w fazie II mo\u017Cesz walczy\u0107 (opcjonalnie).</p>` : ""}
      ${others.length ? `<p class="warn" style="margin-top:0.55rem">${ICO.specialty()} Inny wied\u017Amin: <strong>${others.map((o) => escapeHtml(o.name)).join(", ")}</strong> \u2014 mo\u017Cliwa walka / poker.</p>` : ""}
      ${locationActionGuideHtml(to, { heading: "Co zyskasz / zrobisz na tym polu (znak)" })}
    </div>
  `;
  }
  function mapLocPopupHtml(toId, { player, roster = [], monsters = {} } = {}) {
    const to = locById(toId);
    if (!to) return "";
    const mon = monsters?.[toId];
    const others = (roster || []).filter(
      (r) => r && r !== player && r.locationId === toId
    );
    const t = TERRAIN[to.terrain];
    const hint = actionHintFor(to) || LOCATION_ACTION_HINTS[to.actionKey] || "";
    return `
    <p class="step-kicker" style="margin:0">Cel ruchu</p>
    <h3 class="map-loc-popup-title">${escapeHtml(to.name)} <span class="loc-num">#${to.number}</span></h3>
    <p class="map-loc-popup-meta">${terrainChip(to.terrain)} ${t ? escapeHtml(t.label) : ""}${to.school ? " \xB7 szko\u0142a" : ""}</p>
    ${to.actionKey ? `<div class="map-loc-popup-action">${actionIconHtml(to.actionKey, { width: 100, height: 34 })}${hint ? `<p class="map-loc-popup-hint">${escapeHtml(hint)}</p>` : ""}</div>` : hint ? `<p class="map-loc-popup-hint"><strong>Znak:</strong> ${escapeHtml(hint)}</p>` : ""}
    ${mon ? `<p class="warn" style="margin:0.45rem 0 0">${ICO.monster()} <strong>Potw\xF3r</strong>${mon.level ? ` (poz. ${escapeHtml(String(mon.level))})` : ""} \u2014 walka opcjonalna (faza II)</p>` : ""}
    ${others.length ? `<p class="warn" style="margin:0.45rem 0 0">${ICO.specialty()} Inny wied\u017Amin: <strong>${others.map((o) => escapeHtml(o.name)).join(", ")}</strong></p>` : ""}
  `;
  }
  function neighborPickerHtml(fromId, { player, monsters } = {}) {
    const from = locById(fromId);
    if (!from) {
      return `<p class="warn">Brak pozycji startowej \u2014 wr\xF3\u0107 do <strong>Gracze</strong> i wybierz szko\u0142\u0119 (pionek stawia si\u0119 automatycznie na szkole).</p>`;
    }
    const neigh = neighborsOf(fromId).map((id) => locById(id)).filter(Boolean);
    if (!neigh.length) {
      return `<p class="warn">Brak s\u0105siad\xF3w w schemacie \u2014 sprawd\u017A map\u0119.</p>`;
    }
    const hasMonster = (locId) => {
      const m = monsters?.[locId];
      return Boolean(m && m.count > 0);
    };
    return `
    <div class="guide-box guide-destinations">
      <p class="step-kicker" style="margin:0">Dok\u0105d mo\u017Cesz i\u015B\u0107</p>
      <p class="lead" style="margin:0.35rem 0 0">Stoisz na <strong>${escapeHtml(from.name)}</strong> (#${from.number}). Kliknij cel \u2014 potem wybierzesz dok\u0142adny koszt z r\u0119ki.</p>
      <div class="choice-grid move-dest-grid">
        ${neigh.map((n) => {
      const t = TERRAIN[n.terrain];
      const tLabel = t?.label || n.terrain;
      const matchOk = affordNote(player, 1, 0);
      const twoOk = affordNote(player, 2, 0);
      const mixOk = affordNote(player, 1, 1);
      const mon = hasMonster(n.id);
      return `
          <button type="button" class="choice ${mon ? "choice-danger" : ""}" data-move-to="${n.id}">
            <strong>${escapeHtml(n.name)} (#${n.number})${mon ? ` ${ICO.monster()} potw\xF3r!` : ""}</strong>
            <span>Teren celu: ${terrainChip(n.terrain)}</span>
            ${mon ? `<span class="warn" style="margin:0.25rem 0 0">Wej\u015Bcie \u2192 helper odpala walk\u0119</span>` : ""}
            <span class="move-cost-lines">
              <span><strong>Najtaniej:</strong> 1 karta ${escapeHtml(tLabel)} <em>(${escapeHtml(matchOk)})</em></span>
              <span><strong>Albo:</strong> 1\xD7 uniwersalna (3 tereny) \xB7 2 dowolne karty <em>(${escapeHtml(twoOk)})</em> \xB7 1 karta + 1 z\u0142oto <em>(${escapeHtml(mixOk)})</em></span>
            </span>
          </button>`;
    }).join("")}
      </div>
      <p class="note" style="margin:0.55rem 0 0">Na mapie (St\xF3\u0142) s\u0105siedzi s\u0105 pod\u015Bwietleni na z\u0142oto, gdy ruszasz si\u0119 w turze.</p>
    </div>
  `;
  }
  function locationActionSteps(loc) {
    if (!loc) {
      return {
        title: "Brak lokacji",
        steps: ["Wybierz szko\u0142\u0119 w zak\u0142adce Gracze \u2014 pionek staje na szkole startowej."],
        tip: ""
      };
    }
    const key = loc.actionKey;
    const hint = actionHintFor(loc) || LOCATION_ACTION_HINTS[key] || "";
    const base = {
      title: `${loc.name} (#${loc.number})`,
      tip: hint
    };
    switch (key) {
      case "schoolTrain":
        return {
          ...base,
          steps: [
            "To szko\u0142a wied\u017Ami\u0144ska (z\u0142oty punkt na schemacie).",
            "Wybierz 1 atrybut: atak / obrona / alchemia / specjalno\u015B\u0107.",
            "Zap\u0142a\u0107 z\u0142otem tyle, ile wynosi poziom DOCZELOWY (aktualny + 1) \u2014 zwykle 2, 3, 4 albo 5.",
            "Podnie\u015B ten atrybut o +1 na swojej planszy.",
            "Zdolno\u015B\u0107 szko\u0142y: tylko we w\u0142asnej szkole (nie w cudzej).",
            "T\u0119 konkretn\u0105 akcj\u0119 szko\u0142y najwy\u017Cej raz na tur\u0119."
          ]
        };
      case "trailGold":
        return {
          ...base,
          steps: [
            "We\u017A od razu +1 z\u0142oto do kieszeni (z banku).",
            "Opcja \u2014 zadanie tropienia: zap\u0142a\u0107 1 z\u0142oto.",
            "Dobierz \u017Ceton obszaru o terenie takim, jak teren POTWORA, kt\xF3rego tropisz (las/g\xF3ry/woda).",
            "Po\u0142\xF3\u017C \u017Ceton nazw\u0105 do g\xF3ry na planszy gracza i po\u0142\xF3\u017C na nim 1 z\u0142oto z banku.",
            "Gdy wejdziesz p\xF3\u017Aniej na t\u0119 nazw\u0119: zbierz z\u0142oto z \u017Cetonu i odwr\xF3\u0107 go \u2192 masz \u017Ceton tropu.",
            "Limit: max 1 trop na ka\u017Cdy rodzaj terenu."
          ]
        };
      case "dicePoker":
        return {
          ...base,
          steps: [
            "To pole z ikon\u0105 ko\u015Bci \u2014 poker z miejscowymi.",
            "Multi: Ty i przeciwnik musicie mie\u0107 \u22651 z\u0142oto; wp\u0142acacie do puli (zwykle + bank).",
            "Solo: wp\u0142a\u0107 1 z\u0142oto i graj vs tabela na karcie pomocy solo.",
            "Rzu\u0107 5 ko\u015B\u0107mi, raz mo\u017Cesz przerzuci\u0107 wybrane.",
            "Najlepszy uk\u0142ad wygrywa pul\u0119 / nagrod\u0119 z tabeli.",
            "Uwaga: po pokerze z kim\u015B nie walczysz z nim w fazie II tej tury."
          ]
        };
      case "cleanPool":
        return {
          ...base,
          steps: [
            "G\xF3ra znaku: masz 0 z\u0142ota \u2192 bierz +1 z\u0142oto (darmowy zastrzyk).",
            "D\xF3\u0142 znaku: pola puli kart z p\u0142omieniem = mo\u017Cesz SPALI\u0106 (usun\u0105\u0107 z gry) kart\u0119 z tego slotu.",
            "Na Wyzimie zwykle mo\u017Cesz wyczy\u015Bci\u0107 wskazane sloty (2. i 4.) \u2014 sp\xF3jrz na plansz\u0119.",
            "Akcj\u0119 obszaru (ka\u017Cdy konkretny efekt) najwy\u017Cej raz na tur\u0119."
          ]
        };
      case "trashDraw":
        return {
          ...base,
          steps: [
            "Znak Vengerberg: usu\u0144 1 kart\u0119 z r\u0119ki z gry.",
            "Kup 1 kart\u0119 z odkrytej puli na planszy.",
            "Koszt nowej karty mo\u017Ce by\u0107 ni\u017Cszy, r\xF3wny albo o 1 wy\u017Cszy od kosztu usuni\u0119tej.",
            "We\u017A kupion\u0105 kart\u0119 na r\u0119k\u0119. Raz na tur\u0119."
          ]
        };
      case "defenseLevel":
        return {
          ...base,
          steps: [
            "Znak: OBRONA \u2264 POZIOM wied\u017Amina.",
            "Sprawd\u017A: Tw\xF3j poziom obrony \u2264 Tw\xF3j poziom postaci?",
            "Je\u015Bli tak \u2192 +1 obrona (i zwykle tarcza dogania obron\u0119 przy awansie).",
            "Je\u015Bli nie \u2014 nie bierzesz darmowego treningu obrony tutaj."
          ]
        };
      case "alchemyLevel":
        return {
          ...base,
          steps: [
            "Znak: + alchemia (tylko gdy alchemia \u2264 poziom wied\u017Amina).",
            "Podnie\u015B alchemi\u0119 o +1.",
            "Przy ka\u017Cdym podniesieniu alchemii dobierasz 1 kart\u0119 eliksiru (limit 4)."
          ]
        };
      case "specialtyLevel":
        return {
          ...base,
          steps: [
            "Znak: ZDOLNO\u015A\u0106 SPECJALNA \u2264 POZIOM.",
            "Je\u015Bli specjalno\u015B\u0107 \u2264 poziom wied\u017Amina \u2192 +1 specjalno\u015B\u0107.",
            "Raz na tur\u0119 ta akcja."
          ]
        };
      case "attackLevel":
        return {
          ...base,
          steps: [
            "Znak: ATAK \u2264 POZIOM.",
            "Je\u015Bli atak \u2264 poziom wied\u017Amina \u2192 +1 atak.",
            "Darmowy trening \u2014 bez p\u0142acenia z\u0142otem (w przeciwie\u0144stwie do szko\u0142y)."
          ]
        };
      case "gainElixir":
      case "cintraElixir":
        return {
          ...base,
          steps: [
            "Znak: + eliksir (butelka / karta eliksiru).",
            "Dobierz 1 kart\u0119 eliksiru.",
            "Limit: maksymalnie 4 eliksiry.",
            "Raz na tur\u0119 ta akcja obszaru."
          ]
        };
      default:
        return {
          ...base,
          steps: [
            hint || "Sp\xF3jrz na znak pod nazw\u0105 lokacji na planszy i wykonaj go raz w tej turze.",
            "Potem mo\u017Cesz i\u015B\u0107 dalej (kolejny ruch za kart\u0119) albo przej\u015B\u0107 do fazy II."
          ]
        };
    }
  }
  function locationActionGuideHtml(loc, { heading = "Akcja tego pola (znaki na planszy)" } = {}) {
    const g = locationActionSteps(loc);
    if (!loc) {
      return `<div class="guide-box"><p class="warn">${escapeHtml(g.steps[0])}</p></div>`;
    }
    const icon = actionIconHtml(loc.actionKey, { width: 120, height: 40 });
    return `
    <div class="guide-box guide-loc" role="region" aria-label="Akcja obszaru">
      <p class="step-kicker" style="margin:0">${escapeHtml(heading)}</p>
      <h3 style="margin:0.25rem 0 0.35rem">${escapeHtml(g.title)}</h3>
      ${icon ? `<div class="loc-action-icon" title="Znak pod nazw\u0105 miejscowo\u015Bci">${icon}</div>` : ""}
      ${g.tip ? `<p class="lead" style="margin:0.35rem 0 0">${escapeHtml(g.tip)}</p>` : ""}
      <ol class="checklist guide-steps">
        ${g.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}
      </ol>
      <p class="note">Akcja <strong>fazy I</strong> \u2014 opcjonalna, raz na tur\u0119. Nie myl z faz\u0105 II (walka / medytacja / eksploracja).</p>
    </div>
  `;
  }
  function exploreGuideHtml(loc, isSolo2) {
    const locBlock = loc ? locationActionGuideHtml(loc, {
      heading: "Znaki na Twoim polu (przypomnienie \u2014 to by\u0142a faza I)"
    }) : `<p class="note">Nie masz ustawionej lokacji \u2014 ustaw j\u0105 na Stole, \u017Ceby zobaczy\u0107 znaki pola.</p>`;
    const phase2 = isSolo2 ? `
      <ol class="checklist">
        <li>Wybierz tali\u0119: <strong>miasto</strong> albo <strong>dzikie ost\u0119py</strong>.</li>
        <li>Dobierz kart\u0119 sam.</li>
        <li>Zakryj rezultaty \u2014 czytasz tylko wst\u0119p i 2 opcje.</li>
        <li>Wybierz opcj\u0119; odczytaj tylko jej rezultat.</li>
        <li>Karta do pude\u0142ka albo zostaje jako <strong>zadanie</strong>.</li>
      </ol>` : `
      <ol class="checklist">
        <li>Wybierz: <strong>miasto</strong> albo <strong>dzikie ost\u0119py</strong>.</li>
        <li>Gracz po prawej dobiera i czyta wst\u0119p + opcje <strong>bez</strong> rezultat\xF3w.</li>
        <li>Ty wybierasz; s\u0142yszysz tylko wybrany rezultat.</li>
        <li>Karta do pude\u0142ka albo jako <strong>zadanie</strong>.</li>
      </ol>`;
    return `
    <div class="guide-box guide-explore">
      <p class="step-kicker" style="margin:0">Faza II \u2014 eksploracja (karty)</p>
      <h3 style="margin:0.25rem 0 0.4rem">Co robi\u0107 teraz</h3>
      <p class="lead" style="margin:0">To NIE jest znak pod nazw\u0105 miasta \u2014 to dob\xF3r karty eksploracji.</p>
      ${phase2}
      <p class="note">Brak z\u0142ota na opcj\u0119 z karty = nie mo\u017Cesz jej wybra\u0107.</p>
    </div>
    ${locBlock}
  `;
  }
  function nowDoingGuideHtml(player, { isSolo: isSolo2 = false } = {}) {
    const loc = player?.locationId ? locById(player.locationId) : null;
    const now = player?.nowDoing || "czekam";
    if (now === "faza1") {
      return `
      <div class="guide-inline">
        <p class="tip"><strong>Faza I:</strong> najpierw obowi\u0105zkowy ruch (albo od razu faza II). Po ruchu mo\u017Cesz zrobi\u0107 akcj\u0119 ze znaku na polu.</p>
        ${loc ? locationActionGuideHtml(loc) : `<p class="warn">Brak lokacji \u2014 wr\xF3\u0107 do Graczy i wybierz szko\u0142\u0119 (start automatyczny).</p>`}
      </div>`;
    }
    if (now === "poker") {
      if (loc) {
        return `<div class="guide-inline">${locationActionGuideHtml(loc, { heading: "Poker / akcja obszaru na tym polu" })}</div>`;
      }
      return `
      <div class="guide-inline">
        <div class="guide-box">
          <p class="tip">Je\u015Bli pole ma ko\u015Bci \u2014 graj poker. Inaczej wykonaj znak obszaru (patrz panel lokacji).</p>
        </div>
      </div>`;
    }
    if (now === "eksploracja") {
      return `<div class="guide-inline">${exploreGuideHtml(loc, isSolo2)}</div>`;
    }
    if (now === "walka") {
      return `<div class="guide-inline"><p class="tip">Id\u017A do zak\u0142adki <strong>Tura \u2192 Faza II \u2192 Walka</strong> \u2014 tam jest rozpisane krok po kroku (tarcza \u2260 \u015Bmier\u0107).</p></div>`;
    }
    if (now === "medytacja") {
      return `<div class="guide-inline"><p class="tip">Medytacja tylko przy atrybucie na <strong>V</strong> + wolne trofeum. Potem zwykle +reputacja i zm\u0119czenie.</p></div>`;
    }
    if (now === "faza3") {
      return `<div class="guide-inline"><p class="tip">Faza III: odrzu\u0107 ile chcesz \u2192 dobierz do <strong>3</strong> \u2192 kup 1 z puli (p\u0142acisz odrzuceniem kart, nie z\u0142otem).</p></div>`;
    }
    return "";
  }

  // js/map/constants.js
  var MAP_FLAG = {
    yTop: 0.6,
    w: 3.35,
    h: 5.8,
    notch: 0.85,
    edgePad: 4.4,
    woodX: 100,
    woodW: 58.5,
    get viewW() {
      return this.woodX + this.woodW + 0.6;
    },
    get shellW() {
      return this.woodX + this.woodW - 0.6;
    }
  };
  var CARD_SLOT_WIDTH_FRAC = 0.7;

  // js/map/wood-card-layout.js
  var ACTION_DECK_SLOT_ID = "6";
  function woodCardLayout() {
    const { yTop, w: flagW, h: flagH, edgePad, woodX, woodW } = MAP_FLAG;
    const tokenR = 2.2;
    const colGap = 4.2;
    const rightPad = 1.25;
    const woodRight = woodX + woodW;
    const leftSlotX = woodX + edgePad + flagW;
    const slotWMax = (woodRight - rightPad - leftSlotX - colGap) / 2;
    const slotW = slotWMax * CARD_SLOT_WIDTH_FRAC;
    const slotInsetX = (slotWMax - slotW) / 2;
    const leftSlotW = slotW;
    const leftSlotXAdj = leftSlotX + slotInsetX;
    const rightSlotX = leftSlotX + slotWMax + colGap + slotInsetX;
    const rightSlotW = slotW;
    const woodBottom = yTop + 83.8;
    const rightTopStart = yTop + flagH - 1.15;
    const bottomPad = edgePad;
    const slotGap = 1.55;
    const firstBreak = slotGap;
    const rightCount = 7;
    const rightAvail = woodBottom - bottomPad - rightTopStart;
    const slotH = (rightAvail - (rightCount - 1) * slotGap) / rightCount;
    return {
      yTop,
      flagW,
      flagH,
      edgePad,
      woodX,
      woodW,
      woodRight,
      tokenR,
      rightPad,
      leftSlotX: leftSlotXAdj,
      leftSlotW,
      rightSlotX,
      rightSlotW,
      slotWMax,
      slotX: leftSlotXAdj,
      slotW: leftSlotW,
      slotH,
      slotGap,
      firstBreak,
      rightTopStart,
      woodBottom,
      bottomPad,
      rightCount
    };
  }
  var LIP_INSET = 0.35;
  function actionDeckSlotSvgRect() {
    const L = woodCardLayout();
    return {
      x: L.rightSlotX,
      y: L.rightTopStart,
      w: L.rightSlotW,
      h: L.slotH,
      lipInset: LIP_INSET
    };
  }
  function actionDeckLipSvgRect() {
    const L = woodCardLayout();
    return {
      x: L.rightSlotX + LIP_INSET,
      y: L.rightTopStart + LIP_INSET,
      w: L.rightSlotW - 2 * LIP_INSET,
      h: L.slotH - 2 * LIP_INSET
    };
  }

  // js/map/shell-geometry.js
  function bottomNotches() {
    const { leftSlotX: lx, leftSlotW: lw, rightSlotX: rx, rightSlotW: rw } = woodCardLayout();
    const depth = 1.45;
    const angleDeg = 70;
    const sideInset = depth / Math.tan(angleDeg * Math.PI / 180);
    const make = (x, w) => ({
      x0: x,
      x1: x + w,
      xt0: x + sideInset,
      xt1: x + w - sideInset,
      d: depth
    });
    return [make(lx, lw), make(rx, rw)];
  }
  function notchPathSeg(n, y1) {
    return [`H${n.x1}`, `L${n.xt1} ${y1 - n.d}`, `H${n.xt0}`, `L${n.x0} ${y1}`].join(" ");
  }
  function boardShellPath() {
    const x0 = 0.6;
    const y0 = 0.6;
    const x1 = x0 + MAP_FLAG.shellW;
    const y1 = y0 + 83.8;
    const [nL, nR] = bottomNotches();
    return [`M${x0} ${y0}`, `H${x1}`, `V${y1}`, notchPathSeg(nR, y1), notchPathSeg(nL, y1), `H${x0}`, `Z`].join(
      " "
    );
  }
  function woodFacePath() {
    const { woodX: x, yTop: y, woodW: w } = woodCardLayout();
    const y1 = y + 83.8;
    const x1 = x + w;
    const [nL, nR] = bottomNotches();
    return [`M${x} ${y}`, `H${x1}`, `V${y1}`, notchPathSeg(nR, y1), notchPathSeg(nL, y1), `H${x}`, `Z`].join(" ");
  }

  // js/map/svg-defs.js
  function mapSvgDefsHtml(uid) {
    return `
          <defs>
            <linearGradient id="${uid}-land" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#8fa57a"/>
              <stop offset="38%" stop-color="#c2b48a"/>
              <stop offset="72%" stop-color="#9aaf7e"/>
              <stop offset="100%" stop-color="#7e9470"/>
            </linearGradient>
            <radialGradient id="${uid}-mist" cx="50%" cy="42%" r="62%">
              <stop offset="0%" stop-color="rgba(255,248,230,0.28)"/>
              <stop offset="100%" stop-color="rgba(70,90,55,0.12)"/>
            </radialGradient>
            <radialGradient id="${uid}-water" cx="12%" cy="18%" r="28%">
              <stop offset="0%" stop-color="rgba(70,120,150,0.28)"/>
              <stop offset="100%" stop-color="rgba(70,120,150,0)"/>
            </radialGradient>
            <radialGradient id="${uid}-peak" cx="88%" cy="14%" r="24%">
              <stop offset="0%" stop-color="rgba(210,215,220,0.35)"/>
              <stop offset="100%" stop-color="rgba(210,215,220,0)"/>
            </radialGradient>
            <linearGradient id="${uid}-wood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#6b4a2e"/>
              <stop offset="35%" stop-color="#8a623c"/>
              <stop offset="70%" stop-color="#734f30"/>
              <stop offset="100%" stop-color="#5c3f28"/>
            </linearGradient>
            <linearGradient id="${uid}-wood-shine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="rgba(255,230,190,0.14)"/>
              <stop offset="45%" stop-color="rgba(255,230,190,0)"/>
              <stop offset="100%" stop-color="rgba(30,18,8,0.18)"/>
            </linearGradient>
            <clipPath id="${uid}-shell">
              <path d="${boardShellPath()}"/>
            </clipPath>
          </defs>`;
  }

  // js/map/compose-stage.js
  function mapWrapOpen({ setupFill = false, rot = 0 } = {}) {
    return `
      <div class="map-wrap${setupFill ? " map-wrap--setup-fill" : ""}" style="--map-rot:${rot}deg">
        <div class="map-layer map-layer--svg" data-map-layer="svg">`;
  }
  function mapSvgOpen({ setupFill = false, uid = "m" } = {}) {
    return `
        <svg class="map-svg${setupFill ? " map-svg--setup-fill" : ""}" viewBox="-13 -12.5 ${MAP_FLAG.viewW + 13} 105.5"${setupFill ? ' preserveAspectRatio="xMidYMin meet"' : ""} role="img" aria-label="Mapa obszar\xF3w" data-map-layer="board">`;
  }
  function mapSvgClose() {
    return `
          <path class="map-board-outline" d="${boardShellPath()}" fill="none" stroke="#5a4530" stroke-width="0.55"/>
        </svg>
        </div>
        <div class="map-layer map-layer--overlay" data-map-layer="overlay" aria-hidden="true"></div>
      </div>`;
  }
  function mapStageOpen({ setupFill = false, hasPopup = false } = {}) {
    return `
    <div class="map-stage${hasPopup ? " map-stage--has-popup" : ""}${setupFill ? " map-stage--setup-fill" : ""}">`;
  }
  function mapStageClose({ popupHtml = null } = {}) {
    return `
      ${popupHtml ? `<div class="map-loc-popup" id="map-loc-popup" role="dialog" aria-live="polite">${popupHtml}</div>` : ""}
    </div>`;
  }

  // js/map/layers/wood-panel.js
  function woodCardPanelSvg(uid = "m") {
    const { woodX: x, woodW: w, yTop: y } = woodCardLayout();
    const h = 83.8;
    const face = woodFacePath();
    const notchD = bottomNotches()[0].d;
    const plankH = h / 9;
    const seams = Array.from({ length: 8 }, (_, i) => {
      const yy = y + plankH * (i + 1);
      if (yy > y + h - notchD - 0.3) return "";
      return `<line class="map-wood-seam" x1="${x}" y1="${yy}" x2="${x + w}" y2="${yy}"/>`;
    }).join("");
    const grains = [0.12, 0.28, 0.47, 0.63].map(
      (t, i) => `<path class="map-wood-grain" d="M${x + 1.2 + i * 0.15} ${y + h * t} Q${x + w * 0.45} ${y + h * t - 1.2}, ${x + w - 1.4} ${y + h * t + 0.6}" fill="none"/>`
    ).join("");
    return `
    <g class="map-wood-panel" data-map-layer="wood" aria-label="St\xF3\u0142 na karty">
      <path class="map-wood-face" d="${face}" fill="url(#${uid}-wood)"/>
      <path d="${face}" fill="url(#${uid}-wood-shine)"/>
      ${seams}
      ${grains}
      <line class="map-wood-join" x1="${x}" y1="${y}" x2="${x}" y2="${y + h}"/>
    </g>`;
  }

  // js/map/slot-registry.js
  var MAP_SLOT = {
    ACTION_POOL: "action-pool",
    ELIXIR: "elixir",
    TROPHY: "trophy",
    MONSTER_FIGHT: "monster-fight",
    GOLD_BANK: "gold-bank",
    DICE_TRAY: "dice-tray"
  };
  var MAP_SLOT_SELECTOR = Object.fromEntries(
    Object.entries(MAP_SLOT).map(([k, v]) => [k, `[data-map-slot="${v}"]`])
  );
  function queryMapSlot(root, mapSlot) {
    if (!root || !mapSlot) return null;
    return root.querySelector(`[data-map-slot="${mapSlot}"]`);
  }

  // js/map/card-field-spec.js
  function htmlCardFitVarsForLip(lipBox) {
    const { unrotated } = cardFitInLipRect({
      x: 0,
      y: 0,
      w: lipBox.width,
      h: lipBox.height
    });
    return { fitRotW: unrotated.w, fitRotH: unrotated.h };
  }
  function mainDeckSeatScaleForPortraitInLip(lipBox, portraitW, portraitH) {
    const { visual } = cardFitInLipRect({
      x: 0,
      y: 0,
      w: lipBox.width,
      h: lipBox.height
    });
    const rw = portraitH > 0 ? visual.w / portraitH : 1;
    const rh = portraitW > 0 ? visual.h / portraitW : 1;
    return Math.min(rw, rh);
  }
  function cardFitInLipRect(lip) {
    const aspect = ACTION_CARD_ASPECT_W / ACTION_CARD_ASPECT_H;
    let uw = lip.h;
    let uh = uw / aspect;
    if (uh > lip.w) {
      uh = lip.w;
      uw = uh * aspect;
    }
    const cx = lip.x + lip.w / 2;
    const cy = lip.y + lip.h / 2;
    return {
      aspect,
      unrotated: { w: uw, h: uh, x: cx - uw / 2, y: cy - uh / 2 },
      visual: { w: uh, h: uw },
      center: { cx, cy }
    };
  }
  function rightColumnCardFieldSpec() {
    const L = woodCardLayout();
    const well = actionDeckSlotSvgRect();
    const lip = actionDeckLipSvgRect();
    const fit = cardFitInLipRect(lip);
    return {
      lipInset: LIP_INSET,
      well,
      lip,
      fit,
      column: {
        x: L.rightSlotX,
        wellW: L.rightSlotW,
        wellH: L.slotH,
        topY: L.rightTopStart,
        gap: L.slotGap,
        count: L.rightCount
      }
    };
  }
  function rightColumnSlotY(columnIndex) {
    const { column } = rightColumnCardFieldSpec();
    return column.topY + columnIndex * (column.wellH + column.gap);
  }

  // js/map/layers/card-slots.js
  function lipRectFromWell(x, y, w, h) {
    return {
      x: x + LIP_INSET,
      y: y + LIP_INSET,
      w: w - 2 * LIP_INSET,
      h: h - 2 * LIP_INSET
    };
  }
  function cardImageInLipSvg(lipR, { className = "map-action-deck-card-svg" } = {}) {
    const { unrotated, center } = cardFitInLipRect(lipR);
    const href = `${COMMON_ACTION_DECK_BACK_SRC}?v=${COMMON_ACTION_DECK_ASSET_V}`;
    return `
        <g class="map-action-deck-card-layer" pointer-events="none">
          <g transform="rotate(-90 ${center.cx} ${center.cy})">
            <image class="${className}" href="${href}" x="${unrotated.x}" y="${unrotated.y}" width="${unrotated.w}" height="${unrotated.h}" preserveAspectRatio="xMidYMid meet"/>
          </g>
        </g>`;
  }
  function woodCardSlotsSvg() {
    const {
      yTop,
      flagH,
      tokenR,
      leftSlotX,
      leftSlotW,
      rightSlotX,
      rightSlotW,
      slotH,
      slotGap,
      rightTopStart,
      woodBottom,
      bottomPad,
      rightCount
    } = woodCardLayout();
    const topStart = yTop + flagH + 1.4;
    const leftBottomH = 3 * slotH + 2 * slotGap;
    const leftBottomStart = woodBottom - bottomPad - leftBottomH;
    const diamondHtml = (x, y, w, h) => {
      const cx = x + w / 2;
      const cy = y + h / 2;
      const rw2 = Math.min(w * 0.22, h * 0.55);
      const rh2 = Math.min(h * 0.38, w * 0.16);
      return `<path class="map-card-diamond" d="M${cx} ${cy - rh2} L${cx + rw2} ${cy} L${cx} ${cy + rh2} L${cx - rw2} ${cy} Z"/>`;
    };
    const CARD_TOKEN_TERRAINS = ["forest", "water", "mountain"];
    const fieldSpec = rightColumnCardFieldSpec();
    const slotHtml = (i, x, y, w, h, withToken, withDiamond = false, terrain = null, mapSlot = null) => {
      const token = withToken ? `<g class="map-token-slot" data-slot="card-token-${i}" data-terrain="${terrain || ""}" aria-label="\u017Beton obszaru \u2014 ${terrain === "forest" ? "Las" : terrain === "water" ? "Woda" : terrain === "mountain" ? "G\xF3ry" : "\u017Beton"}">
          <circle class="map-token-slot-well" cx="${x + w}" cy="${y + h / 2}" r="${tokenR}"/>
          <circle class="map-token-slot-lip" cx="${x + w}" cy="${y + h / 2}" r="${tokenR - 0.45}"/>
        </g>` : "";
      const deckMarker = withDiamond ? `<g class="map-card-deck-marker" aria-hidden="true">${diamondHtml(x, y, w, h)}</g>` : "";
      const mapSlotAttr = mapSlot ? ` data-map-slot="${mapSlot}"` : "";
      const lipClass = withDiamond ? "map-card-slot-lip map-action-deck-lip" : "map-card-slot-lip";
      const lipR = lipRectFromWell(x, y, w, h);
      const cardImg = withDiamond ? cardImageInLipSvg(lipR) : "";
      const foHost = withDiamond ? `
        <foreignObject class="map-action-deck-fo" x="${lipR.x}" y="${lipR.y}" width="${lipR.w}" height="${lipR.h}" overflow="visible">
          <div xmlns="http://www.w3.org/1999/xhtml" class="map-action-deck-fo-host" data-map-slot="action-pool-host"></div>
        </foreignObject>` : "";
      return `
      <g class="map-card-slot${withDiamond ? " map-action-deck-slot" : ""} map-card-slot--right-col" data-slot="${i}"${mapSlotAttr}${withDiamond ? ` data-action-deck="pool"` : ""}${terrain ? ` data-terrain="${terrain}"` : ""} data-well-w="${w}" data-well-h="${h}" data-lip-w="${lipR.w}" data-lip-h="${lipR.h}">
        <rect class="map-card-slot-well" x="${x}" y="${y}" width="${w}" height="${h}" rx="0.5"/>
        <rect class="${lipClass}" x="${lipR.x}" y="${lipR.y}" width="${lipR.w}" height="${lipR.h}" rx="0.3"/>
        ${deckMarker}
        ${cardImg}
        ${foHost}
        ${token}
      </g>`;
    };
    const slots = [];
    for (let i = 0; i < 3; i++) {
      slots.push(
        slotHtml(
          i,
          leftSlotX,
          topStart + i * (slotH + slotGap),
          leftSlotW,
          slotH,
          true,
          false,
          CARD_TOKEN_TERRAINS[i]
        )
      );
    }
    for (let i = 0; i < 3; i++) {
      slots.push(slotHtml(3 + i, leftSlotX, leftBottomStart + i * (slotH + slotGap), leftSlotW, slotH, false));
    }
    const rw = fieldSpec.column.wellW;
    const rh = fieldSpec.column.wellH;
    for (let i = 0; i < rightCount; i++) {
      const y = rightColumnSlotY(i);
      slots.push(
        slotHtml(
          6 + i,
          rightSlotX,
          y,
          rw,
          rh,
          false,
          i === 0,
          null,
          i === 0 ? MAP_SLOT.ACTION_POOL : null
        )
      );
    }
    const [nL, nR] = bottomNotches();
    const notchSlot = (id, label, notch, extraClass, mapSlot) => {
      const w = notch.x1 - notch.x0;
      const h = Math.max(slotH * 0.72, notch.d * 4.2);
      const x = notch.x0;
      const y = woodBottom - notch.d;
      return `
      <g class="map-card-slot ${extraClass}" data-slot="${id}" data-map-slot="${mapSlot}" aria-label="${label}">
        <rect class="map-card-slot-well ${extraClass}-well" x="${x}" y="${y}" width="${w}" height="${h}" rx="0.45"/>
        <rect class="map-card-slot-lip" x="${x + 0.3}" y="${y + 0.3}" width="${w - 0.6}" height="${h - 0.6}" rx="0.3"/>
      </g>`;
    };
    slots.push(notchSlot("elixir", "Talia eliksir\xF3w", nR, "map-elixir-slot", MAP_SLOT.ELIXIR));
    slots.push(notchSlot("trophy", "Trofea atrybut\xF3w", nL, "map-trophy-slot", MAP_SLOT.TROPHY));
    return `<g class="map-card-slots" data-map-layer="card-slots" aria-label="Pola na karty">${slots.join("")}</g>`;
  }

  // js/map/layers/round-flags.js
  function monsterFlagLayout() {
    const { edgePad, woodX, w: flagW } = MAP_FLAG;
    const { slotX, slotW } = woodCardLayout();
    return [
      { roman: "I", level: 1, x: edgePad },
      { roman: "II", level: 2, x: woodX + edgePad },
      { roman: "III", level: 3, x: slotX + slotW }
    ].map((f) => ({ ...f, cx: f.x + flagW / 2 }));
  }
  function roundFlagSvg(board = null) {
    const active = String(board?.roundFlag || board?.pendingMonsterLevel || "I").toUpperCase();
    const activeRoman = active === "III" || active === "3" ? "III" : active === "II" || active === "2" ? "II" : "I";
    const flags = monsterFlagLayout();
    const { yTop, w, h, notch } = MAP_FLAG;
    const cloth = (roman, x) => `
    <g class="map-round-flag${roman === activeRoman ? " map-round-flag--active" : ""}" transform="translate(${x}, ${yTop})" aria-label="Poziom ${roman}">
      <path class="map-round-flag-cloth" d="M0,0 L${w},0 L${w},${h - notch} L${w / 2},${h} L0,${h - notch} Z"/>
      <text class="map-round-flag-num" x="${w / 2}" y="${h * 0.52}" text-anchor="middle" dominant-baseline="middle">${roman}</text>
    </g>`;
    return `<g class="map-round-flags" data-map-layer="round-flags">${flags.map((f) => cloth(f.roman, f.x)).join("")}</g>`;
  }

  // js/map/layers/monster-stacks.js
  function hexagonPath(cx, cy, r) {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 180 * (60 * i - 30);
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    }
    return `M${pts.join(" L")} Z`;
  }
  function monsterLevelStacksSvg() {
    const { yTop, w: flagW } = MAP_FLAG;
    const { slotH } = woodCardLayout();
    const cardW = Math.max(flagW * 1.85, 5.8);
    const cardH = Math.max(slotH * 1.05, 7.2);
    const tokenR = { 1: 2.05, 2: 2.55, 3: 3.15 };
    const stacks = monsterFlagLayout().map((f) => {
      const cardX = f.cx - cardW / 2;
      const cardY = yTop - cardH - 0.35;
      const tokenCx = f.cx + cardW / 2 + tokenR[f.level] + 0.85;
      const tokenCy = cardY + cardH * 0.55;
      return `
      <g class="map-monster-stack" data-monster-level="${f.level}" data-slot="monster-${f.level}" aria-label="Potwory ${f.roman}">
        <g class="map-card-slot map-monster-card-slot" data-slot="monster-card-${f.level}">
          <rect class="map-card-slot-well map-monster-card-well" x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="0.45"/>
          <rect class="map-card-slot-lip" x="${cardX + 0.28}" y="${cardY + 0.28}" width="${cardW - 0.56}" height="${cardH - 0.56}" rx="0.3"/>
          <text class="map-monster-card-lvl" x="${f.cx}" y="${cardY + cardH * 0.52}" text-anchor="middle" dominant-baseline="middle">${f.roman}</text>
        </g>
        <g class="map-monster-token" data-slot="monster-token-${f.level}" data-token-level="${f.level}">
          <path class="map-monster-token-well" d="${hexagonPath(tokenCx, tokenCy, tokenR[f.level])}"/>
          <text class="map-monster-token-num" x="${tokenCx}" y="${tokenCy + 0.15}" text-anchor="middle" dominant-baseline="middle">${f.roman}</text>
        </g>
      </g>`;
    });
    return `<g class="map-monster-stacks" data-map-layer="monster-stacks" aria-label="Stosy potwor\xF3w I\u2013III">${stacks.join("")}</g>`;
  }

  // js/map/layers/location-fight.js
  function locationTokensAndFightDeckSvg() {
    const { yTop, woodX } = MAP_FLAG;
    const fightW = 7.6;
    const fightH = 10.6;
    const mapGap = 0.2;
    const rightPad = 0.35;
    const fightX = woodX - fightW - rightPad;
    const fightY = yTop - fightH - mapGap;
    const r = 3.15;
    const img = 4.5;
    const tokenGap = 7.05;
    const tokenRight = fightX - 0.85 - r;
    const terrains = [
      { id: "forest", label: "Las", file: "forest" },
      { id: "mountain", label: "G\xF3ry", file: "mountain" },
      { id: "water", label: "Woda", file: "water" }
    ].map((t, i, arr) => ({
      ...t,
      x: tokenRight - (arr.length - 1 - i) * tokenGap
    }));
    const cy = yTop - r - mapGap;
    const tokens = terrains.map(
      (t) => `
      <g class="map-loc-token-stack" data-slot="loc-token-${t.id}" data-terrain="${t.id}" aria-label="\u017Betony obszar\xF3w \u2014 ${t.label}">
        <circle class="map-loc-token-well" cx="${t.x}" cy="${cy}" r="${r}" fill="none"/>
        <image href="./img/terrain/${t.file}.png" x="${t.x - img / 2}" y="${cy - img / 2}" width="${img}" height="${img}" preserveAspectRatio="xMidYMid meet"/>
      </g>`
    ).join("");
    const fight = `
    <g class="map-card-slot map-fight-deck-slot" data-slot="monster-fight" data-map-slot="${MAP_SLOT.MONSTER_FIGHT}" aria-label="Talia walki potwor\xF3w">
      <rect class="map-card-slot-well map-fight-deck-well" x="${fightX}" y="${fightY}" width="${fightW}" height="${fightH}" rx="0.5"/>
      <rect class="map-card-slot-lip" x="${fightX + 0.3}" y="${fightY + 0.3}" width="${fightW - 0.6}" height="${fightH - 0.6}" rx="0.35"/>
      <text class="map-fight-deck-label" x="${fightX + fightW / 2}" y="${fightY + fightH * 0.52}" text-anchor="middle" dominant-baseline="middle">\u2694</text>
    </g>`;
    return `<g class="map-loc-fight-setup" data-map-layer="loc-fight" aria-label="\u017Betony obszar\xF3w i talia walki">${tokens}${fight}</g>`;
  }

  // js/map/layers/gold-dice.js
  function goldBankAndDiceSvg() {
    const { yTop } = woodCardLayout();
    const cx = -6.2;
    const dieSize = 2.85;
    const dieGap = 0.38;
    const step = dieSize + dieGap;
    const diceY0 = yTop + 1.15;
    const diceCells = [
      [-1, 0],
      [0, 0],
      [1, 0],
      [-0.5, 1],
      [0.5, 1]
    ];
    const pip = (x, y) => `<circle class="map-die-pip" cx="${x}" cy="${y}" r="0.26"/>`;
    const pipLayouts = [
      [[0.5, 0.5]],
      [
        [0.28, 0.28],
        [0.72, 0.72]
      ],
      [
        [0.28, 0.28],
        [0.5, 0.5],
        [0.72, 0.72]
      ],
      [
        [0.28, 0.28],
        [0.72, 0.28],
        [0.28, 0.72],
        [0.72, 0.72]
      ],
      [
        [0.28, 0.28],
        [0.72, 0.28],
        [0.5, 0.5],
        [0.28, 0.72],
        [0.72, 0.72]
      ]
    ];
    const dice = diceCells.map(([gx, gy], i) => {
      const x = cx + gx * step - dieSize / 2;
      const y = diceY0 + gy * step;
      const pips = pipLayouts[i].map(([px, py]) => pip(x + dieSize * px, y + dieSize * py)).join("");
      return `
      <g class="map-die-slot" data-slot="die-${i}" data-die="${i}">
        <rect class="map-die-well" x="${x}" y="${y}" width="${dieSize}" height="${dieSize}" rx="0.45"/>
        ${pips}
      </g>`;
    }).join("");
    const goldR = 2.05;
    const goldCy = diceY0 + 2 * step + goldR + 1.35;
    const goldOffsets = [
      [-1.55, -0.55],
      [1.35, -0.75],
      [-0.15, 0.95],
      [1.65, 0.85],
      [-1.7, 1.15]
    ];
    const golds = goldOffsets.map(
      ([dx, dy], i) => `
      <g class="map-gold-coin" data-gold="${i}" transform="translate(${cx + dx}, ${goldCy + dy})">
        <circle class="map-gold-coin-outer" r="${goldR}"/>
        <circle class="map-gold-coin-inner" r="${goldR * 0.58}"/>
        <text class="map-gold-coin-mark" text-anchor="middle" dominant-baseline="middle">z\u0142</text>
      </g>`
    ).join("");
    return `
    <g class="map-gold-dice-setup" data-map-layer="gold-dice" aria-label="Bank z\u0142ota i ko\u015Bci">
      <g class="map-dice-tray" data-slot="dice-tray" data-map-slot="${MAP_SLOT.DICE_TRAY}" aria-label="Ko\u015Bci do gry">${dice}</g>
      <g class="map-gold-bank" data-slot="gold-bank" data-map-slot="${MAP_SLOT.GOLD_BANK}" aria-label="Bank z\u0142ota">${golds}</g>
    </g>`;
  }

  // js/board.js
  var NOW_ACTIONS = [
    { id: "czekam", label: "Czeka" },
    { id: "faza1", label: "Faza I \u2014 ruch" },
    { id: "poker", label: "Poker / akcja obszaru" },
    { id: "walka", label: "Walka" },
    { id: "medytacja", label: "Medytacja" },
    { id: "eksploracja", label: "Eksploracja" },
    { id: "faza3", label: "Faza III \u2014 dob\xF3r/kupno" }
  ];
  function defaultBoard() {
    return {
      rotation: 0,
      tool: "select",
      selectedLoc: null,
      placePlayer: 0,
      /** locId → { count, label?, level? } */
      monsters: {},
      /** { playerIdx, fromId, toId, costId? } — komunikat po przesunięciu pionka */
      movePrompt: null,
      /** Podświetl sąsiadów z tej lokacji (ruch) */
      highlightFrom: null,
      /** Poziom ustawiany przyciskiem I/II/III przed oznaczeniem */
      pendingMonsterLevel: "I",
      /** Komunikat gdy kliknięcie nie może postawić potwora (ten sam teren itd.) */
      placeError: null,
      /** schoolId ostatniego gracza, który zdobył dany poziom reputacji (0–4) */
      repClaim: [null, null, null, null, null],
      /** Flaga poziomu na mapie (I / II / III) */
      roundFlag: "I"
    };
  }
  function noteReputationClaim(board, schoolId, level) {
    if (!board) return;
    if (!Array.isArray(board.repClaim) || board.repClaim.length !== 5) {
      board.repClaim = [null, null, null, null, null];
    }
    const n = Math.min(4, Math.max(0, Math.round(Number(level) || 0)));
    board.repClaim[n] = schoolId || null;
  }
  function ensureReputationClaims(board, roster = []) {
    if (!board) return false;
    if (!Array.isArray(board.repClaim) || board.repClaim.length !== 5) {
      board.repClaim = [null, null, null, null, null];
    }
    const byRep = { 0: [], 1: [], 2: [], 3: [], 4: [] };
    for (const p of roster || []) {
      if (!p) continue;
      const r = Math.min(4, Math.max(0, Math.round(Number(p.reputation) || 0)));
      byRep[r].push(p.schoolId || "wilk");
    }
    let changed = false;
    for (let n = 0; n <= 4; n++) {
      const present = byRep[n];
      if (!present.length) continue;
      const cur = board.repClaim[n];
      const needFresh = n === 0 ? !cur || !present.includes(cur) : !cur;
      if (needFresh) {
        board.repClaim[n] = present[Math.floor(Math.random() * present.length)];
        changed = true;
      }
    }
    return changed;
  }
  function monsterAt(board, locId) {
    const m = board?.monsters?.[locId];
    if (!m || !(m.count > 0)) return null;
    return m;
  }
  function monstersList(board) {
    return Object.entries(board?.monsters || {}).filter(([, m]) => m && m.count > 0).map(([id, m]) => ({ id, loc: locById(id), ...m })).filter((row) => row.loc);
  }
  var MONSTER_TERRAINS = ["forest", "mountain", "water"];
  function locationsForTerrain(terrain) {
    return LOCATIONS.filter(
      (l) => l.terrain === terrain && typeof l.number === "number" && l.number !== 0 && l.id !== "behelt-nar"
    ).sort((a, b) => a.number - b.number);
  }
  function monsterOccupyingTerrain(board, terrain, exceptLocId = null) {
    if (!terrain || !MONSTER_TERRAINS.includes(terrain)) return null;
    for (const row of monstersList(board)) {
      if (exceptLocId && row.id === exceptLocId) continue;
      if (row.loc.terrain === terrain) return row;
    }
    return null;
  }
  function setMonsterForTerrain(board, terrain, locId, { level } = {}) {
    if (!MONSTER_TERRAINS.includes(terrain)) {
      return { ok: false, reason: "Nieznany teren." };
    }
    for (const row of monstersList(board)) {
      if (row.loc.terrain === terrain) delete board.monsters[row.id];
    }
    if (!locId) {
      board.placeError = null;
      return { ok: true, cleared: true };
    }
    const loc = locById(locId);
    if (!loc) return { ok: false, reason: "Nieznana lokacja." };
    if (loc.terrain !== terrain) {
      return {
        ok: false,
        reason: `Lokacja ${loc.name} to ${TERRAIN[loc.terrain]?.label || loc.terrain}, nie ${TERRAIN[terrain]?.label || terrain}.`
      };
    }
    if (loc.number === 0 || loc.id === "behelt-nar") {
      return {
        ok: false,
        reason: "Behelt Nar (0) nie ma \u017Cetonu obszaru \u2014 tu nie stawia si\u0119 potwor\xF3w."
      };
    }
    const lv = level || "I";
    board.monsters[locId] = { count: 1, level: lv, label: `Poz. ${lv}` };
    board.placeError = null;
    board.selectedLoc = locId;
    return { ok: true, placed: true, level: lv, loc };
  }
  function cycleMonsterTerrain(board, terrain, delta) {
    const opts = locationsForTerrain(terrain);
    if (!opts.length) return { ok: false, reason: "Brak lokacji." };
    const cur = monsterOccupyingTerrain(board, terrain);
    let idx = cur ? opts.findIndex((l) => l.id === cur.id) : -1;
    if (idx < 0) idx = delta > 0 ? -1 : 0;
    const next = opts[(idx + delta + opts.length) % opts.length];
    const level = cur?.level || "I";
    return setMonsterForTerrain(board, terrain, next.id, { level });
  }
  function setMonsterTerrainByNumber(board, terrain, number, { level } = {}) {
    const n = Number(number);
    if (!Number.isFinite(n)) return { ok: false, reason: "Podaj numer obszaru." };
    const loc = locationsForTerrain(terrain).find((l) => l.number === n);
    if (!loc) {
      const nums = locationsForTerrain(terrain).map((l) => l.number).join(", ");
      return {
        ok: false,
        reason: `Numer ${n} nie nale\u017Cy do terenu \u201E${TERRAIN[terrain]?.label || terrain}\u201D. Dost\u0119pne: ${nums}.`
      };
    }
    const cur = monsterOccupyingTerrain(board, terrain);
    return setMonsterForTerrain(board, terrain, loc.id, {
      level: level || cur?.level || "I"
    });
  }
  function setMonsterTerrainLevel(board, terrain, level) {
    const cur = monsterOccupyingTerrain(board, terrain);
    if (!cur) {
      return { ok: false, reason: "Najpierw wybierz numer obszaru dla tego terenu." };
    }
    board.monsters[cur.id] = {
      count: 1,
      level,
      label: `Poz. ${level}`
    };
    board.placeError = null;
    return { ok: true };
  }
  function sanitizeMonstersUniqueTerrain(board) {
    if (!board?.monsters) return board;
    const seen = /* @__PURE__ */ Object.create(null);
    for (const id of Object.keys(board.monsters)) {
      const m = board.monsters[id];
      if (!m || !(m.count > 0)) {
        delete board.monsters[id];
        continue;
      }
      const loc = locById(id);
      if (!loc || !MONSTER_TERRAINS.includes(loc.terrain) || loc.number === 0 || loc.id === "behelt-nar") {
        delete board.monsters[id];
        continue;
      }
      m.count = 1;
      if (seen[loc.terrain]) {
        delete board.monsters[id];
        continue;
      }
      seen[loc.terrain] = id;
    }
    return board;
  }
  function monsterEncounterHtml(loc, monster) {
    if (!loc || !monster) return "";
    const lvl = monster.level ? ` poziom ${escapeHtml2(String(monster.level))}` : "";
    const label = monster.label ? ` \u2014 ${escapeHtml2(monster.label)}` : "";
    return `
    <div class="guide-box guide-monster-hit" role="status">
      <p class="step-kicker" style="margin:0">${ICO.monster()} Potw\xF3r na polu</p>
      <h3 style="margin:0.25rem 0 0.4rem">Na <strong>${escapeHtml2(loc.name)}</strong> stoi potw\xF3r${lvl}${label}</h3>
      <p class="lead" style="margin:0"><strong>Nie musisz walczy\u0107.</strong> Instrukcja: w fazie II <em>mo\u017Cesz</em> walczy\u0107 z potworem na tym samym obszarze \u2014 albo wybra\u0107 medytacj\u0119 albo eksploracj\u0119.</p>
      <p class="note" style="margin:0.45rem 0 0">Teraz jeste\u015B w fazie I: akcje obszaru / zadanie / kolejny ruch. Walka dopiero gdy w fazie II wybierzesz \u201EWalka\u201D.</p>
    </div>
  `;
  }
  var LEVEL_ORDER = ["I", "II", "III"];
  function normalizeMonsterLevel(level) {
    const s = String(level || "I").toUpperCase();
    if (s === "1" || s === "I") return "I";
    if (s === "2" || s === "II") return "II";
    if (s === "3" || s === "III") return "III";
    return LEVEL_ORDER.includes(s) ? s : "I";
  }
  function nextMonsterLevelAfterDefeat(level) {
    const lv = normalizeMonsterLevel(level);
    if (lv === "I") return "II";
    return "III";
  }
  function monsterFightOutcomePlan({ kind, isSolo: isSolo2, loc, monster }) {
    const level = normalizeMonsterLevel(monster?.level);
    const terrain = loc?.terrain || null;
    const terrainLabel = terrain ? TERRAIN[terrain]?.label || terrain : "?";
    const locName = loc?.name || "?";
    if (kind === "loss") {
      return {
        kind,
        removeMonster: false,
        needsSpawn: false,
        spawnLevel: null,
        terrain,
        terrainLabel,
        oldLevel: level,
        title: "Kl\u0119ska",
        summary: `Potw\xF3r zostaje na <strong>${escapeHtml2(locName)}</strong> (poz. ${escapeHtml2(
          level
        )}). Przy nast\u0119pnej walce ma pe\u0142n\u0105 tali\u0119. We\u017A trop terenu \u201E${escapeHtml2(
          terrainLabel
        )}\u201D (je\u015Bli go nie masz) i 1 kart\u0119 kosztu 0 na odrzucone; w tej turze w fazie III dobierasz o 1 mniej.`,
        spawnHint: null
      };
    }
    if (kind === "drive") {
      return {
        kind,
        removeMonster: true,
        needsSpawn: true,
        spawnLevel: level,
        terrain,
        terrainLabel,
        oldLevel: level,
        title: "Odp\u0119dzenie",
        summary: `Zdejmij \u017Ceton z <strong>${escapeHtml2(locName)}</strong>. +2 z\u0142ota; \u017Ceton na stos odp\u0119dzonych; 1 karta kosztu 0 na odrzucone.`,
        spawnHint: `Nowy potw\xF3r: <strong>poziom ${escapeHtml2(
          level
        )}</strong> (ten sam), teren <strong>${escapeHtml2(
          terrainLabel
        )}</strong> \u2014 dobierz \u017Ceton obszaru tego terenu i wpisz jego numer poni\u017Cej.`
      };
    }
    if (isSolo2) {
      return {
        kind,
        removeMonster: true,
        needsSpawn: false,
        spawnLevel: null,
        terrain,
        terrainLabel,
        oldLevel: level,
        title: "Pokonanie (solo)",
        summary: `Zdejmij \u017Ceton z <strong>${escapeHtml2(
          locName
        )}</strong>. +2 z\u0142ota, trofeum, +reputacja, zm\u0119czenie. <strong>Solo: nie dobierasz nowego potwora</strong> po pokonaniu.`,
        spawnHint: null
      };
    }
    const nextLv = nextMonsterLevelAfterDefeat(level);
    return {
      kind,
      removeMonster: true,
      needsSpawn: true,
      spawnLevel: nextLv,
      terrain,
      terrainLabel,
      oldLevel: level,
      title: "Pokonanie",
      summary: `Zdejmij \u017Ceton z <strong>${escapeHtml2(
        locName
      )}</strong>. +2 z\u0142ota, trofeum, +reputacja, zm\u0119czenie.`,
      spawnHint: `Nowy potw\xF3r: <strong>poziom ${escapeHtml2(
        nextLv
      )}</strong> (${escapeHtml2(level)}\u2192${escapeHtml2(
        nextLv
      )}), teren <strong>${escapeHtml2(
        terrainLabel
      )}</strong> \u2014 dobierz \u017Ceton obszaru tego samego terenu i wpisz numer poni\u017Cej.`
    };
  }
  function monsterSpawnSlotHtml(board, { terrain, level }) {
    if (!terrain || !MONSTER_TERRAINS.includes(terrain)) return "";
    const t = TERRAIN[terrain];
    const opts = locationsForTerrain(terrain);
    const cur = monsterOccupyingTerrain(board, terrain);
    const num = cur?.loc?.number;
    const name = cur?.loc?.name || "\u2014 ustaw numer z \u017Cetonu \u2014";
    const lv = normalizeMonsterLevel(level || cur?.level || "I");
    return `
    <div class="monster-terrain-slot is-filled monster-spawn-slot" data-terrain-slot="${terrain}">
      <div class="monster-terrain-head">
        <span class="monster-terrain-ico">${terrainIcon(terrain)}</span>
        <strong>${escapeHtml2(t.label)}</strong>
        <span class="monster-terrain-meta">${escapeHtml2(name)} \xB7 poz. ${escapeHtml2(lv)}</span>
      </div>
      <div class="monster-terrain-pick" role="group" aria-label="Numer nowego obszaru">
        <button type="button" class="btn btn-secondary monster-num-btn" data-monster-cycle="${terrain}" data-delta="-1" title="Poprzedni">\u25C0</button>
        <input type="number" class="monster-num-input" data-monster-num="${terrain}" min="0" max="18" inputmode="numeric" value="${num != null ? escapeHtml2(String(num)) : ""}" placeholder="#" aria-label="Numer obszaru" />
        <button type="button" class="btn btn-secondary monster-num-btn" data-monster-cycle="${terrain}" data-delta="1" title="Nast\u0119pny">\u25B6</button>
      </div>
      <p class="note monster-terrain-hint">Poziom ustawiony na <strong>${escapeHtml2(
      lv
    )}</strong> \xB7 numery: ${opts.map((l) => l.number).join(", ")}</p>
    </div>
  `;
  }
  function monstersPanelHtml(board) {
    const levels = ["I", "II", "III"];
    const slots = MONSTER_TERRAINS.map((terrain) => {
      const t = TERRAIN[terrain];
      const opts = locationsForTerrain(terrain);
      const cur = monsterOccupyingTerrain(board, terrain);
      const num = cur?.loc?.number;
      const name = cur?.loc?.name || "\u2014 wybierz numer \u2014";
      const level = cur?.level || "I";
      const filled = Boolean(cur);
      return `
      <div class="monster-terrain-slot ${filled ? "is-filled" : "is-empty"}" data-terrain-slot="${terrain}">
        <div class="monster-terrain-head">
          <span class="monster-terrain-ico">${terrainIcon(terrain)}</span>
          <strong>${escapeHtml2(t.label)}</strong>
          <span class="monster-terrain-meta">${filled ? escapeHtml2(name) : "brak \u017Cetonu"}</span>
        </div>
        <div class="monster-terrain-pick" role="group" aria-label="Numer obszaru: ${escapeHtml2(t.label)}">
          <button type="button" class="btn btn-secondary monster-num-btn" data-monster-cycle="${terrain}" data-delta="-1" title="Poprzedni obszar">\u25C0</button>
          <input type="number" class="monster-num-input" data-monster-num="${terrain}" min="0" max="18" inputmode="numeric" value="${num != null ? escapeHtml2(String(num)) : ""}" placeholder="#" aria-label="Numer obszaru ${escapeHtml2(t.label)}" />
          <button type="button" class="btn btn-secondary monster-num-btn" data-monster-cycle="${terrain}" data-delta="1" title="Nast\u0119pny obszar">\u25B6</button>
          <button type="button" class="btn btn-secondary" data-monster-terrain-clear="${terrain}" ${filled ? "" : "disabled"}>Usu\u0144</button>
        </div>
        <div class="monster-terrain-levels" role="group" aria-label="Poziom potwora ${escapeHtml2(t.label)}">
          ${levels.map(
        (lv) => `<button type="button" class="btn ${filled && level === lv ? "btn-primary" : "btn-secondary"}" data-monster-terrain-level="${terrain}" data-level="${lv}" ${filled ? "" : "disabled"}>Poz. ${lv}</button>`
      ).join("")}
        </div>
        <p class="note monster-terrain-hint">Numery ${opts.map((l) => l.number).join(", ")}</p>
      </div>`;
    }).join("");
    return `
    <div class="monsters-panel">
      <h3>${ICO.monster()} Potwory na mapie</h3>
      <p class="lead" style="margin:0">Trzy \u017Cetony obszar\xF3w = <strong>3 r\xF3\u017Cne tereny</strong>. Podaj <strong>numer</strong> z \u017Cetonu (strza\u0142ki albo wpisz) \u2014 drugi potw\xF3r na ten sam teren jest niemo\u017Cliwy. Szko\u0142a (np. Kaer Seren) jest OK, je\u015Bli tak wysz\u0142o na \u017Cetonie; <strong>Behelt Nar (0)</strong> nie ma \u017Cetonu.</p>
      ${board.placeError ? `<p class="warn" style="margin:0.45rem 0 0" role="alert">${escapeHtml2(board.placeError)}</p>` : ""}
      <div class="monster-terrain-grid">${slots}</div>
      <p class="note" style="margin:0.45rem 0 0">Walka w fazie II jest <strong>opcjonalna</strong> \u2014 tylko gdy \u017Ceton stoi na Twoim polu.</p>
    </div>
  `;
  }
  function ensurePlayerTrack(p, startCards = 5, startGold = 3) {
    if (typeof p.reputation !== "number") p.reputation = 0;
    if (typeof p.cards !== "number") p.cards = startCards;
    if (typeof p.gold !== "number") p.gold = startGold;
    if (!p.locationId) p.locationId = null;
    if (!p.nowDoing) p.nowDoing = "czekam";
    if (typeof p.elixirs !== "number") p.elixirs = 0;
    if (!Array.isArray(p.quests)) p.quests = [];
    if (!p.attrs || typeof p.attrs !== "object") {
      p.attrs = { attack: 1, defense: 1, alchemy: 1, specialty: 1, level: 1 };
    }
    if (typeof p.shield !== "number") p.shield = p.attrs.defense || 1;
    if (!Array.isArray(p.attrTrophies)) p.attrTrophies = [];
    if (!p.trails || typeof p.trails !== "object") {
      p.trails = { forest: null, mountain: null, water: null };
    }
    if (typeof p.resourcesApplied !== "boolean") p.resourcesApplied = false;
    return p;
  }
  function handAfterFatigue(cards, rep) {
    const lose = fatigueForReputation(rep);
    const after = Math.max(0, cards - lose);
    return { lose, after, before: cards };
  }
  function phase3DrawHint(cardsInHand) {
    const phase3Target = 3;
    const hardLimit = 7;
    const afterDiscardAssume = Math.min(cardsInHand, phase3Target);
    const need = Math.max(0, phase3Target - afterDiscardAssume);
    return {
      limit: hardLimit,
      phase3Target,
      drawUpTo: need,
      afterDraw: phase3Target,
      note: cardsInHand > phase3Target ? `Masz ${cardsInHand} \u2192 w fazie III zwykle odrzucasz (dowoln\u0105 liczb\u0119), potem dobierasz do 3, potem kupujesz 1 (limit r\u0119ki nadal 7).` : cardsInHand < phase3Target ? `Dobierz do 3: +${need} kart(y), potem kup 1 z puli (limit r\u0119ki 7).` : "Masz 3 \u2014 w fazie III mo\u017Cesz odrzuci\u0107 cz\u0119\u015B\u0107 i dobra\u0107 z powrotem do 3, potem kup 1."
    };
  }
  function escapeXml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function mapSvgHtml(board, roster, {
    schoolById: schoolById4,
    highlightFromId,
    showDisclaimer = false,
    popupHtml = null,
    setupCoachPhase = null,
    setupPreview = false,
    setupMapPawns = false
  } = {}) {
    const setupLite = (setupPreview || setupCoachPhase != null) && !setupMapPawns;
    const setupFill = setupPreview || setupMapPawns || setupCoachPhase != null;
    const locMap = Object.fromEntries(LOCATIONS.map((l) => [l.id, l]));
    const fromId = highlightFromId || board.highlightFrom || null;
    const reachable = new Set(fromId ? neighborsOf(fromId) : []);
    const roadSeg = ([a, b], cls) => {
      const A = locMap[a];
      const B = locMap[b];
      if (!A || !B) return "";
      const lit = fromId && (a === fromId && reachable.has(b) || b === fromId && reachable.has(a));
      return `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" class="${cls}${lit ? " map-road-lit" : ""}" />`;
    };
    const roadsUnder = ROADS.map((pair) => roadSeg(pair, "map-road-under")).join("");
    const roads = ROADS.map((pair) => roadSeg(pair, "map-road")).join("");
    const rot = board.rotation || 0;
    const labelUpright = -rot;
    const uid = `m${Math.random().toString(36).slice(2, 9)}`;
    const nodes = LOCATIONS.map((loc) => {
      const t = TERRAIN[loc.terrain] || TERRAIN.forest;
      const fill = t.color;
      const selected = board.selectedLoc === loc.id ? " map-node-selected" : "";
      const here = fromId === loc.id ? " map-node-here" : "";
      const reach = reachable.has(loc.id) ? " map-node-reach" : "";
      const terrainClass = ` map-node--${loc.terrain || "forest"}`;
      const monsters = board.monsters[loc.id];
      const witches = roster.map((p, i) => ({ p, i })).filter(({ p }) => p.locationId === loc.id);
      const numLabel = typeof loc.number === "number" ? String(loc.number) : "";
      const name = String(loc.name || "");
      const nameLen = name.length;
      const fontPx = nameLen >= 12 ? 1.55 : nameLen >= 9 ? 1.75 : 1.95;
      const sidePad = 2.4;
      const labelW = Math.min(30, Math.max(9.5, nameLen * fontPx * 0.62 + sidePad * 2));
      const labelH = 2.85;
      const labelX = -labelW / 2;
      const labelY = -labelH / 2;
      const clipId = `${uid}-lbl-${loc.id}`;
      const clipPad = 0.55;
      const isWild = loc.terrain === "wild" || loc.id === "behelt-nar";
      const monsterBadge = monsters ? `<g class="map-monster-badge" transform="translate(${loc.x + 3.4},${loc.y - 4}) rotate(${labelUpright})">
           <circle r="2.15" fill="#6b3a2f" stroke="#f0e6d2" stroke-width="0.35"/>
           <text y="0.85" text-anchor="middle" class="map-badge-text">${escapeXml(String(monsters.count || 1))}</text>
         </g>` : "";
      const setupSchoolPawns = setupMapPawns && loc.school ? (roster || []).map((p, i) => ({ p, i })).filter(({ p }) => schoolStartId(p.schoolId) === loc.id).map(({ p, i }, idx) => {
        const sid = p.schoolId || "wilk";
        const ox = -2.6 + idx * 2.4;
        const src = `${schoolRepTokenSrc(sid)}?v=${MAP_PREP_PAWN_ASSET_V}`;
        return `<g class="map-setup-school-pawn" transform="translate(${loc.x + ox},${loc.y + 3.6})">
            <circle r="2.05" fill="rgba(20,18,14,0.35)" stroke="#d4b05a" stroke-width="0.35"/>
            <image class="map-setup-school-pawn__art" href="${src}" x="-1.85" y="-1.85" width="3.7" height="3.7" preserveAspectRatio="xMidYMid meet"/>
            <text y="3.35" text-anchor="middle" class="map-badge-text map-setup-school-pawn__lbl">${escapeXml(String(i + 1))}</text>
          </g>`;
      }).join("") : "";
      const witchBadges = setupSchoolPawns ? setupSchoolPawns : setupLite || loc.school ? "" : witches.map(({ i }, idx) => {
        const ox = -3.2 + idx * 2.4;
        return `<g transform="translate(${loc.x + ox},${loc.y + 4.4}) rotate(${labelUpright})">
          <circle r="1.7" fill="#244833" stroke="#d4b05a" stroke-width="0.35"/>
          <text y="0.7" text-anchor="middle" class="map-badge-text">${i + 1}</text>
        </g>`;
      }).join("");
      const disc = isWild ? `<circle class="map-node-soft" cx="${loc.x}" cy="${loc.y}" r="4.4" fill="#7a6b4a" opacity="0.2"/>
        <image class="map-node-wild" href="./img/terrain/wild.png" x="${loc.x - 3.55}" y="${loc.y - 3.55}" width="7.1" height="7.1" preserveAspectRatio="xMidYMid slice"/>
        <circle class="map-node-disc" cx="${loc.x}" cy="${loc.y}" r="3.55" fill="none" stroke="#f4ebd6" stroke-width="0.55"/>` : `<circle class="map-node-soft" cx="${loc.x}" cy="${loc.y}" r="4.4" fill="${fill}" opacity="0.18"/>
        <circle class="map-node-disc" cx="${loc.x}" cy="${loc.y}" r="3.55" fill="${fill}" stroke="#f4ebd6" stroke-width="0.55"/>
        <circle cx="${loc.x}" cy="${loc.y}" r="2.55" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="0.4"/>`;
      return `
      <g class="map-node${terrainClass}${selected}${here}${reach}" data-loc="${loc.id}" style="cursor:pointer">
        ${reach ? `<circle cx="${loc.x}" cy="${loc.y}" r="5" fill="none" stroke="#b8923e" stroke-width="0.5" stroke-dasharray="1.1 0.7" opacity="0.95"/>` : ""}
        ${disc}
        <text x="${loc.x}" y="${loc.y + 1.1}" text-anchor="middle" class="map-num">${escapeXml(numLabel)}</text>
        <g class="map-label-g" transform="translate(${loc.x}, ${loc.y - 5.2}) rotate(${labelUpright})">
          <clipPath id="${clipId}"><rect x="${labelX + clipPad}" y="${labelY}" width="${labelW - clipPad * 2}" height="${labelH}" rx="0.25"/></clipPath>
          <rect class="map-label-bg" x="${labelX}" y="${labelY}" width="${labelW}" height="${labelH}" rx="0.35"/>
          <text y="0" text-anchor="middle" dominant-baseline="central" class="map-label" style="font-size:${fontPx}px" clip-path="url(#${clipId})">${escapeXml(name)}</text>
        </g>
        ${monsterBadge}
        ${witchBadges}
      </g>`;
    }).join("");
    return `
    ${mapStageOpen({ setupFill, hasPopup: Boolean(popupHtml) })}
      ${mapWrapOpen({ setupFill, rot })}
      ${mapSvgOpen({ setupFill, uid })}
          ${mapSvgDefsHtml(uid)}
          <g class="map-board-united" clip-path="url(#${uid}-shell)">
            <g class="map-land" data-map-layer="land">
              <rect class="map-board-face" x="0.6" y="0.6" width="99.4" height="83.8" fill="url(#${uid}-land)"/>
              <rect x="0.6" y="0.6" width="99.4" height="83.8" fill="url(#${uid}-mist)"/>
              <ellipse cx="14" cy="16" rx="22" ry="16" fill="url(#${uid}-water)"/>
              <ellipse cx="86" cy="14" rx="18" ry="14" fill="url(#${uid}-peak)"/>
              <ellipse cx="78" cy="70" rx="20" ry="14" fill="url(#${uid}-peak)" opacity="0.7"/>
              <g class="map-roads-under">${roadsUnder}</g>
              <g class="map-roads">${roads}</g>
              <g class="map-nodes">${nodes}</g>
              ${setupLite && !setupMapPawns ? "" : reputationTrackSvg(roster, board, { useTokenArt: setupMapPawns })}
            </g>
            ${woodCardPanelSvg(uid)}
            ${woodCardSlotsSvg()}
            ${roundFlagSvg(board)}
            ${setupCoachPhase != null && setupCoachPhase >= 6 ? monsterLevelStacksSvg() : ""}
            ${setupCoachPhase != null && setupCoachPhase >= 7 ? locationTokensAndFightDeckSvg() : ""}
          </g>
          ${setupCoachPhase != null && setupCoachPhase >= 8 ? goldBankAndDiceSvg() : ""}
      ${mapSvgClose()}
      ${mapStageClose({ popupHtml })}
    ${showDisclaimer ? `<p class="note">Schemat: numery 0\u201318, tereny i drogi.</p>` : ""}
  `;
  }
  var SCHOOL_REP_COLOR = {
    wilk: "#3a2210",
    gryf: "#6e5410",
    niedzwiedz: "#541010",
    kot: "#142448",
    zmija: "#14341c",
    mantikora: "#5c2c0c"
  };
  function schoolRepFill(schoolId) {
    return SCHOOL_REP_COLOR[schoolId] || SCHOOL_REP_COLOR.wilk;
  }
  function reputationTrackSvg(roster = [], board = null, { useTokenArt = false } = {}) {
    const cy0 = 80.6;
    const edgePad = 85 - cy0;
    const cx = edgePad;
    const gap = 5.05;
    if (board) ensureReputationClaims(board, roster);
    const claims = Array.isArray(board?.repClaim) ? board.repClaim : [null, null, null, null, null];
    const byRep = { 0: [], 1: [], 2: [], 3: [], 4: [] };
    (roster || []).forEach((p, i) => {
      if (!p) return;
      const r = Math.min(4, Math.max(0, Math.round(Number(p.reputation) || 0)));
      byRep[r].push({ i, schoolId: p.schoolId || "wilk" });
    });
    const slots = [0, 1, 2, 3, 4].map((n) => {
      const cy = cy0 - n * gap;
      const present = byRep[n];
      let leadSchool = claims[n] || null;
      const leadPlayer = present.find((p) => p.schoolId === leadSchool) || present[0] || null;
      if (leadPlayer) leadSchool = leadPlayer.schoolId;
      const others = leadPlayer ? present.filter((p) => p.i !== leadPlayer.i) : present;
      const lead = leadSchool && useTokenArt ? `<image class="map-rep-token-art map-rep-lead" href="${schoolRepTokenSrc(leadSchool)}?v=${MAP_PREP_PAWN_ASSET_V}" x="${cx - 1.95}" y="${cy - 1.95}" width="3.9" height="3.9" preserveAspectRatio="xMidYMid meet"/>` : leadSchool ? `<circle class="map-rep-lead map-rep-pawn-disc" cx="${cx}" cy="${cy}" r="1.9" fill="${schoolRepFill(leadSchool)}"/>` : "";
      const othersHtml = others.map(({ i, schoolId }, idx) => {
        const ox = 3.55 + idx * 2.85;
        const oy = -idx * 0.55;
        return `
        <g class="map-rep-other" style="--i:${idx}" transform="translate(${cx + ox}, ${cy + oy})" data-player="${i}">
          ${useTokenArt ? `<image class="map-rep-token-art" href="${schoolRepTokenSrc(schoolId)}?v=${MAP_PREP_PAWN_ASSET_V}" x="-1.35" y="-1.35" width="2.7" height="2.7" preserveAspectRatio="xMidYMid meet"/>` : `<circle class="map-rep-pawn-disc" r="1.35" fill="${schoolRepFill(schoolId)}" cx="0" cy="0"/>`}
        </g>`;
      }).join("");
      const hasMore = others.length > 0;
      return `
      <g class="map-rep-slot${leadSchool ? " map-rep-slot--claimed" : ""}${hasMore ? " map-rep-slot--has-more" : ""}" data-rep="${n}">
        <circle class="map-rep-hit" cx="${cx}" cy="${cy}" r="3.1"/>
        <circle class="map-rep-ring" cx="${cx}" cy="${cy}" r="2.35"/>
        <text x="${cx}" y="${cy + 0.9}" text-anchor="middle" class="map-rep-num">${n}</text>
        ${lead}
        <g class="map-rep-others">${othersHtml}</g>
      </g>`;
    }).join("");
    return `
    <g class="map-rep-track" aria-label="Reputacja graczy 0\u20134">
      ${slots}
    </g>`;
  }
  var _mapPopupCleanup = null;
  function bindMapLocPopup(root, { timeoutMs = 3e3 } = {}) {
    if (typeof _mapPopupCleanup === "function") {
      _mapPopupCleanup();
      _mapPopupCleanup = null;
    }
    const popup = root?.querySelector?.("#map-loc-popup");
    if (!popup) return () => {
    };
    let gone = false;
    let outsideTimer = null;
    const hide = () => {
      if (gone) return;
      gone = true;
      popup.classList.add("map-loc-popup--gone");
      window.clearTimeout(timer);
      if (outsideTimer) window.clearTimeout(outsideTimer);
      document.removeEventListener("pointerdown", onOutside, true);
      if (_mapPopupCleanup === hide) _mapPopupCleanup = null;
    };
    const onOutside = (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (popup.contains(t)) return;
      if (t.closest(".map-node-reach")) return;
      hide();
    };
    const timer = window.setTimeout(hide, timeoutMs);
    outsideTimer = window.setTimeout(() => {
      if (!gone) document.addEventListener("pointerdown", onOutside, true);
    }, 0);
    _mapPopupCleanup = hide;
    return hide;
  }
  function mapToolbarHtml() {
    return "";
  }
  function escapeHtml2(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function terrainIcon(id) {
    if (id === "forest") return ICO.forest();
    if (id === "mountain") return ICO.mountain();
    if (id === "water") return ICO.water();
    return "";
  }
  function selectedLocPanel(board, roster) {
    const loc = locById(board.selectedLoc);
    if (!loc) {
      return `<p class="lead">Kliknij lokacj\u0119 na mapie. Potwory ustawiasz numerami w panelu (1 na teren).</p>`;
    }
    const t = TERRAIN[loc.terrain];
    const m = monsterAt(board, loc.id);
    const here = roster.map((p, i) => ({ p, i })).filter(({ p }) => p.locationId === loc.id);
    const hint = actionHintFor(loc);
    const neigh = neighborsOf(loc.id).map((id) => locById(id)).filter(Boolean).map((n) => `${n.name}${typeof n.number === "number" ? ` (${n.number})` : ""}`).join(", ");
    const otherSame = !m && MONSTER_TERRAINS.includes(loc.terrain) ? monsterOccupyingTerrain(board, loc.terrain) : null;
    return `
    <div class="loc-panel">
      <h3>${escapeHtml2(loc.name)}${typeof loc.number === "number" ? ` <span class="loc-num">#${loc.number}</span>` : ""}</h3>
      <p class="lead" style="margin:0">${terrainIcon(loc.terrain)} Teren ruchu: <strong>${t.label}</strong>${loc.school ? ` \xB7 szko\u0142a wied\u017Ami\u0144ska` : ""}</p>
      ${loc.actionKey ? `<div class="loc-action-icon">${actionIconHtml(loc.actionKey, { width: 130, height: 40 })}</div>` : ""}
      ${hint ? `<p class="loc-action"><strong>Znak na planszy:</strong> ${escapeHtml2(hint)}</p>` : ""}
      <p class="note" style="margin:0.4rem 0 0">S\u0105siedzi (\u015Bcie\u017Cki): ${neigh ? escapeHtml2(neigh) : "\u2014"}</p>
      <p class="tip" style="margin:0.5rem 0 0">Po ruchu helper poka\u017Ce kroki tej akcji (faza I, opcjonalna).</p>
      ${m ? `<p class="warn" style="margin:0.45rem 0 0">${ICO.monster()} Potw\xF3r tu: poz. <strong>${escapeHtml2(
      String(m.level || "?")
    )}</strong></p>` : otherSame ? `<p class="note" style="margin:0.45rem 0 0">${ICO.monster()} Slot \u201E${escapeHtml2(
      t.label
    )}\u201D zaj\u0119ty przez <strong>${escapeHtml2(otherSame.loc.name)}</strong> (#${otherSame.loc.number}).</p>` : `<p class="note" style="margin:0.45rem 0 0">${ICO.monster()} Brak potwora na tym polu \u2014 ustaw numer w panelu poni\u017Cej.</p>`}
      <p>Wied\u017Amini:
        ${here.length ? here.map(
      ({ p, i }) => `<span class="player-chip">${i + 1}. ${escapeHtml2(p.name)}</span>`
    ).join(" ") : "\u2014"}
      </p>
    </div>
  `;
  }
  function movePromptHtml(board, roster) {
    const mp = board.movePrompt;
    if (!mp) return "";
    const p = roster[mp.playerIdx];
    if (!p) return "";
    return moveCostChooserHtml({
      fromLoc: locById(mp.fromId),
      toLoc: locById(mp.toId),
      playerName: p.name,
      selectedCostId: mp.costId || null
    });
  }
  function playerTrackerHtml(roster, { schoolById: schoolById4, activeIndex, START_RESOURCES: START_RESOURCES2, players, isSolo: isSolo2 }) {
    return roster.map((p, i) => {
      const school = schoolById4(p.schoolId);
      const iconFn = SCHOOL_ICON[p.schoolId] || ICO.specialty;
      const loc = p.locationId ? locById(p.locationId) : null;
      const fat = fatigueForReputation(Math.min(4, (p.reputation || 0) + 1));
      const nextRep = Math.min(4, (p.reputation || 0) + 1);
      const afterFat = handAfterFatigue(p.cards || 0, nextRep);
      const draw = phase3DrawHint(p.cards || 0);
      const start = START_RESOURCES2[players]?.[i] || { cards: 5, gold: 3 };
      const guide = nowDoingGuideHtml(p, { isSolo: !!isSolo2 });
      return `
        <article class="tracker-card ${i === activeIndex ? "tracker-active" : ""}" data-track="${i}">
          <header>
            <span class="player-chip">${iconFn()}${escapeHtml2(p.name)} <span>${school.short}</span></span>
            ${i === activeIndex ? `<span class="badge">Teraz gra</span>` : ""}
          </header>

          <div class="tracker-grid">
            <label>Reputacja (0\u20134)
              <div class="rep-row">
                ${[0, 1, 2, 3, 4].map(
        (n) => `<button type="button" class="rep-btn ${(p.reputation || 0) === n ? "active" : ""}" data-rep="${n}" data-idx="${i}">${n}</button>`
      ).join("")}
              </div>
            </label>

            <label>Karty na r\u0119ce
              <div class="num-row num-row--cards">
                <button type="button" class="btn btn-secondary" data-cards-delta="-1" data-idx="${i}">\u2212</button>
                <span class="num-val num-val--cards">${actionCardsHtml(p.cards ?? start.cards, { height: 22 })}</span>
                <button type="button" class="btn btn-secondary" data-cards-delta="1" data-idx="${i}">+</button>
              </div>
            </label>

            <label>Z\u0142oto
              <div class="num-row num-row--gold">
                <button type="button" class="btn btn-secondary" data-gold-delta="-1" data-idx="${i}">\u2212</button>
                <span class="num-val num-val--coins">${goldCoinsHtml(p.gold ?? start.gold, { size: 24 })}</span>
                <button type="button" class="btn btn-secondary" data-gold-delta="1" data-idx="${i}">+</button>
              </div>
            </label>

            <label>Eliksiry (max 4)
              <div class="num-row">
                <button type="button" class="btn btn-secondary" data-elixir-delta="-1" data-idx="${i}">\u2212</button>
                <strong class="num-val">${p.elixirs ?? 0}</strong>
                <button type="button" class="btn btn-secondary" data-elixir-delta="1" data-idx="${i}">+</button>
              </div>
            </label>
          </div>

          <p class="tip"><strong>Lokalizacja:</strong> ${loc ? escapeHtml2(loc.name) : "szko\u0142a startowa (ustawi si\u0119 po wyborze szko\u0142y)"}</p>

          ${(p.quests || []).length ? `<div class="tracker-quests">
                  <p class="step-kicker" style="margin:0.35rem 0 0.25rem">${ICO.quest()} Zadania (${p.quests.length})</p>
                  <ul class="checklist">
                    ${p.quests.map((q) => {
        const ql = q.locationId ? locById(q.locationId) : null;
        return `<li>
                          <strong>${escapeHtml2(q.title || "Zadanie")}</strong>
                          \u2192 ${ql ? escapeHtml2(ql.name) : "?"}
                          ${q.eventCard ? ` \xB7 Event <strong>#${escapeHtml2(String(q.eventCard))}</strong>` : ""}
                          <button type="button" class="btn btn-secondary" data-quest-done="${escapeHtml2(q.id)}" data-idx="${i}">Usu\u0144</button>
                        </li>`;
      }).join("")}
                  </ul>
                </div>` : ""}

          <div class="now-row">
            <span class="step-kicker" style="margin:0">Co robi teraz</span>
            <div class="choice-grid now-actions">
              ${NOW_ACTIONS.map(
        (a) => `
                <button type="button" class="choice ${(p.nowDoing || "czekam") === a.id ? "active" : ""}" data-now="${a.id}" data-idx="${i}">
                  <strong>${a.label}</strong>
                </button>`
      ).join("")}
            </div>
          </div>

          ${guide}

          <details class="tracker-math">
            <summary><strong>Ile kart: traci / zostaje / dobiera</strong></summary>
            <ul class="checklist">
              <li><strong>Teraz na r\u0119ce:</strong> ${p.cards ?? 0} (sufit 7; w fazie III cel doboru = <strong>3</strong>)</li>
              <li><strong>Przy +1 reputacji (\u2192 ${nextRep}):</strong> zm\u0119czenie usuwa z gry <strong>${afterFat.lose}</strong> kart(y)
                \u2192 r\u0119ka orientacyjnie <strong>${afterFat.after}</strong> (je\u015Bli usuwasz z r\u0119ki)
                <div>Instrukcja: mo\u017Cesz usuwa\u0107 z r\u0119ki / talii / odrzuconych; potem tasujesz tali\u0119. Przyk\u0142ad: 1. trofeum = 1 karta.</div>
              </li>
              <li><strong>Faza III (dob\xF3r do 3):</strong> ${escapeHtml2(draw.note)}
                <div>Po kroku doboru orientacyjnie: ${draw.afterDraw} na r\u0119ce, potem kup 1 z puli.</div>
              </li>
              <li><strong>Start tej pozycji przy stole:</strong> ${actionCardsHtml(start.cards, { height: 20 })} ${goldCoinsHtml(start.gold, { size: 22 })}</li>
            </ul>
            <div class="actions" style="margin-top:0.6rem">
              <button type="button" class="btn btn-primary" data-apply-fatigue data-idx="${i}">
                +1 reputacja i odejmij zm\u0119czenie z r\u0119ki (${fat} kart)
              </button>
              <button type="button" class="btn btn-secondary" data-apply-draw7 data-idx="${i}">
                Ustaw r\u0119k\u0119 jak po doborze fazy III (3)
              </button>
            </div>
          </details>
        </article>
      `;
    }).join("");
  }

  // js/map/svg-projection.js
  function projectSvgElementToHost(geomEl, hostEl) {
    if (!geomEl || !hostEl || typeof geomEl.getBBox !== "function") return null;
    const ctm = geomEl.getScreenCTM?.();
    if (!ctm) return null;
    let bb;
    try {
      bb = geomEl.getBBox();
    } catch {
      return null;
    }
    if (!(bb.width > 0) || !(bb.height > 0)) return null;
    const hostR = hostEl.getBoundingClientRect();
    const corners = [
      [bb.x, bb.y],
      [bb.x + bb.width, bb.y],
      [bb.x + bb.width, bb.y + bb.height],
      [bb.x, bb.y + bb.height]
    ];
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const [x, y] of corners) {
      const sx = ctm.a * x + ctm.c * y + ctm.e;
      const sy = ctm.b * x + ctm.d * y + ctm.f;
      minX = Math.min(minX, sx);
      minY = Math.min(minY, sy);
      maxX = Math.max(maxX, sx);
      maxY = Math.max(maxY, sy);
    }
    if (!Number.isFinite(minX)) return null;
    return {
      left: minX - hostR.left,
      top: minY - hostR.top,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  // js/map/coach-slot-metrics.js
  function queryActionDeckSlot(searchRoot) {
    if (!searchRoot) return null;
    return queryMapSlot(searchRoot, MAP_SLOT.ACTION_POOL) || searchRoot.querySelector(".map-action-deck-slot") || searchRoot.querySelector(`.map-card-slot[data-slot="${ACTION_DECK_SLOT_ID}"]`);
  }
  function queryActionDeckLip(searchRoot) {
    const slot = queryActionDeckSlot(searchRoot);
    return slot?.querySelector(".map-action-deck-lip") || slot?.querySelector(".map-card-slot-lip") || null;
  }
  function resolveMapWrap(layerOrRoot) {
    return layerOrRoot?.closest?.(".map-wrap") || layerOrRoot?.querySelector?.(".map-wrap") || null;
  }
  function pickSlotGeom(slotEl, metric) {
    if (!slotEl) return null;
    const lip = slotEl.querySelector?.(".map-card-slot-lip");
    const well = slotEl.querySelector?.(".map-card-slot-well");
    if (metric === "lip" && lip) return lip;
    if (metric === "well" && well) return well;
    return well || lip || slotEl;
  }
  function measureSvgGeomInLayer(positionRoot, geomEl) {
    if (!positionRoot || !geomEl) return null;
    const svg2 = geomEl.ownerSVGElement;
    if (!svg2 || typeof geomEl.getBBox !== "function") return null;
    let bb;
    try {
      bb = geomEl.getBBox();
    } catch {
      return null;
    }
    if (!(bb.width > 0) || !(bb.height > 0)) return null;
    const ctm = geomEl.getScreenCTM?.();
    if (!ctm) return null;
    const pt = svg2.createSVGPoint();
    const layerR = positionRoot.getBoundingClientRect();
    const corners = [
      [bb.x, bb.y],
      [bb.x + bb.width, bb.y],
      [bb.x + bb.width, bb.y + bb.height],
      [bb.x, bb.y + bb.height]
    ];
    const xs = [];
    const ys = [];
    for (const [x, y] of corners) {
      pt.x = x;
      pt.y = y;
      const sc = pt.matrixTransform(ctm);
      xs.push(sc.x - layerR.left);
      ys.push(sc.y - layerR.top);
    }
    const left = Math.min(...xs);
    const top = Math.min(...ys);
    const width = Math.max(...xs) - left;
    const height = Math.max(...ys) - top;
    if (width < 1 || height < 1) return null;
    return { left, top, width, height };
  }
  function measureActionDeckLipFromViewBox(mapWrap, positionRoot) {
    const svg2 = mapWrap?.querySelector?.(".map-svg");
    if (!svg2 || !positionRoot) return null;
    const ctm = svg2.getScreenCTM?.();
    if (!ctm) return null;
    const { x, y, w, h } = actionDeckLipSvgRect();
    const pt = svg2.createSVGPoint();
    const layerR = positionRoot.getBoundingClientRect();
    const corners = [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h]
    ];
    const xs = [];
    const ys = [];
    for (const [cx, cy] of corners) {
      pt.x = cx;
      pt.y = cy;
      const sc = pt.matrixTransform(ctm);
      xs.push(sc.x - layerR.left);
      ys.push(sc.y - layerR.top);
    }
    const left = Math.min(...xs);
    const top = Math.min(...ys);
    const width = Math.max(...xs) - left;
    const height = Math.max(...ys) - top;
    if (width < 1 || height < 1) return null;
    return { left, top, width, height };
  }
  function measureClientRectInLayer(positionRoot, target) {
    const layerR = positionRoot.getBoundingClientRect();
    const targetR = target.getBoundingClientRect();
    if (layerR.width < 4 || targetR.width < 1) return null;
    return {
      left: targetR.left - layerR.left,
      top: targetR.top - layerR.top,
      width: targetR.width,
      height: targetR.height
    };
  }
  function measureSlotBoxInLayer(positionRoot, slotEl, { metric = "lip" } = {}) {
    if (!positionRoot || !slotEl) return null;
    const geom = pickSlotGeom(slotEl, metric);
    if (geom instanceof SVGElement) {
      const projected = projectSvgElementToHost(geom, positionRoot);
      if (projected) return projected;
    }
    const fromSvg = measureSvgGeomInLayer(positionRoot, geom);
    if (fromSvg) return fromSvg;
    const mapWrap = resolveMapWrap(positionRoot);
    if (metric === "lip" && slotEl.classList?.contains("map-action-deck-slot") && mapWrap) {
      const fallback = measureActionDeckLipFromViewBox(mapWrap, positionRoot);
      if (fallback) return fallback;
    }
    const target = geom || slotEl;
    return measureClientRectInLayer(positionRoot, target);
  }
  function measureActionDeckLipBox(positionRoot, searchRoot) {
    if (!positionRoot) return null;
    const lip = queryActionDeckLip(searchRoot);
    if (lip) {
      const m = measureSvgGeomInLayer(positionRoot, lip);
      if (m) return m;
    }
    const mapWrap = resolveMapWrap(positionRoot) || resolveMapWrap(searchRoot);
    return mapWrap ? measureActionDeckLipFromViewBox(mapWrap, positionRoot) : null;
  }

  // js/map/overlay-layer.js
  function getMapOverlayLayer(mapWrap) {
    if (!mapWrap) return null;
    return mapWrap.querySelector('[data-map-layer="overlay"]') || mapWrap;
  }
  function getMapPositionRoot(mapWrap) {
    return getMapOverlayLayer(mapWrap) || mapWrap;
  }
  function mountCoachOverlays(preview) {
    const mapWrap = preview?.querySelector?.(".map-wrap") ?? null;
    const overlay = getMapOverlayLayer(mapWrap);
    const positionRoot = getMapPositionRoot(mapWrap);
    if (!preview || !overlay) {
      return { mapWrap, overlay, positionRoot };
    }
    preview.querySelectorAll(".setup-deal").forEach((el) => {
      if (el.parentElement !== overlay) overlay.appendChild(el);
    });
    return { mapWrap, overlay, positionRoot };
  }
  function queryActionDeckSlot2(searchRoot) {
    return queryMapSlot(searchRoot, MAP_SLOT.ACTION_POOL) || searchRoot?.querySelector?.(".map-action-deck-slot") || searchRoot?.querySelector?.('.map-card-slot[data-slot="6"]') || null;
  }

  // js/map/action-deck-mount.js
  function queryActionDeckForeignHost(searchRoot) {
    if (!searchRoot) return null;
    return searchRoot.querySelector(".map-action-deck-fo-host");
  }
  function mountMainDeckInForeignObject(preview, dealRoot) {
    const host = queryActionDeckForeignHost(preview);
    if (!host || !dealRoot) return false;
    if (dealRoot.parentElement !== host) host.appendChild(dealRoot);
    dealRoot.classList.add("is-svg-anchored");
    return true;
  }
  function unmountMainDeckToOverlay(preview, dealRoot) {
    const overlay = preview?.querySelector?.('[data-map-layer="overlay"]');
    if (!overlay || !dealRoot) return;
    if (dealRoot.parentElement !== overlay) overlay.appendChild(dealRoot);
    dealRoot.classList.remove("is-svg-anchored");
  }
  function isMainDeckSvgAnchored(dealRoot) {
    return Boolean(dealRoot?.classList?.contains("is-svg-anchored"));
  }

  // js/quests.js
  function escapeHtml3(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function ensureQuests(player) {
    if (!player) return;
    if (!Array.isArray(player.quests)) player.quests = [];
    return player.quests;
  }
  function newQuestId() {
    return `q-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  }
  function exploreDeckChooserHtml({ selected = null } = {}) {
    return `
    <div class="explore-chooser">
      <h2 class="explore-chooser-title">Co eksplorujesz?</h2>
      <p class="lead" style="margin:0">Kliknij kart\u0119: <strong>dzikie ost\u0119py</strong> albo <strong>miasto</strong>.</p>
      <div class="explore-card-grid" role="group" aria-label="Talia eksploracji">
        <div class="explore-card-slot">
          <button type="button" class="explore-card ${selected === "wilds" ? "active" : ""}" data-explore-deck="wilds" aria-label="Dzikie ost\u0119py" aria-pressed="${selected === "wilds" ? "true" : "false"}">
            <img src="./img/explore/wilds.png" alt="" width="180" height="272" decoding="async" draggable="false" />
          </button>
          <span class="explore-card-label"><strong>Dzikie ost\u0119py</strong></span>
        </div>
        <div class="explore-card-slot">
          <button type="button" class="explore-card ${selected === "city" ? "active" : ""}" data-explore-deck="city" aria-label="Miasto" aria-pressed="${selected === "city" ? "true" : "false"}">
            <img src="./img/explore/city.png" alt="" width="180" height="272" decoding="async" draggable="false" />
          </button>
          <span class="explore-card-label"><strong>Miasto</strong></span>
        </div>
      </div>
    </div>
  `;
  }
  function exploreResolveHtml({ deck, isSolo: isSolo2, player }) {
    const deckLabel = deck === "wilds" ? "dzikie ost\u0119py" : "miasto";
    const steps = isSolo2 ? `
      <ol class="checklist">
        <li>Dobierz kart\u0119 z talii <strong>${escapeHtml3(deckLabel)}</strong> (sam).</li>
        <li>Zakryj rezultaty \u2014 czytaj tylko wst\u0119p i 2 opcje.</li>
        <li>Wybierz opcj\u0119 A albo B; odczytaj <strong>tylko jej</strong> rezultat.</li>
        <li>Efekt natychmiastowy \u2192 zastosuj poni\u017Cej (z\u0142oto / karty). Potem karta do pude\u0142ka.</li>
        <li>Je\u015Bli wynik ma s\u0142owo <strong>Zadanie / Quest</strong> \u2192 dodaj zadanie poni\u017Cej (lokacja + nr karty zdarzenia).</li>
      </ol>` : `
      <ol class="checklist">
        <li>Gracz po prawej dobiera z talii <strong>${escapeHtml3(deckLabel)}</strong>.</li>
        <li>Czyta wst\u0119p + opcje <strong>bez</strong> rezultat\xF3w.</li>
        <li>Ty wybierasz; s\u0142yszysz tylko wybrany rezultat.</li>
        <li>Efekt natychmiastowy \u2192 dostosuj z\u0142oto/karty poni\u017Cej. Albo zapisz <strong>zadanie</strong>.</li>
      </ol>`;
    return `
    ${questAddFormHtml()}
    ${questsListHtml(player)}
    <div class="guide-box">
      <p class="step-kicker" style="margin:0">Karta przeczytana \xB7 ${escapeHtml3(deckLabel)}</p>
      <h3 style="margin:0.25rem 0 0.4rem">Zastosuj efekt</h3>
      ${steps}
      <p class="note">Brak z\u0142ota na opcj\u0119 = nie mo\u017Cesz jej wybra\u0107. Robisz tyle efektu, ile da si\u0119.</p>
      <p class="tip">Je\u015Bli karta daje <strong>\u017Ceton tropu</strong> \u2014 zaznacz 1 trop poni\u017Cej. <strong>Zadanie</strong> (lokacja + nr Event) zapisuj <strong>u g\xF3ry</strong>. Brak \u017Ceton\xF3w w stosie = ten fragment efektu przepada.</p>
    </div>
    ${resourceAdjustHtml(player, { title: "Po karcie \u2014 popraw tracker" })}
  `;
  }
  function resourceAdjustHtml(player, { title = "Zasoby" } = {}) {
    if (!player) return "";
    return `
    <div class="guide-box resource-adjust">
      <p class="step-kicker" style="margin:0">${escapeHtml3(title)}</p>
      <p class="lead" style="margin:0.3rem 0 0">Teraz: <strong>${player.cards ?? 0}</strong> kart \xB7 <strong>${player.gold ?? 0}</strong> z\u0142ota \xB7 <strong>${player.elixirs ?? 0}</strong> eliksir\xF3w</p>
      <div class="tracker-grid" style="margin-top:0.65rem">
        <label>Karty
          <div class="num-row">
            <button type="button" class="btn btn-secondary" data-adj="cards" data-delta="-1">\u2212</button>
            <strong class="num-val">${player.cards ?? 0}</strong>
            <button type="button" class="btn btn-secondary" data-adj="cards" data-delta="1">+</button>
          </div>
        </label>
        <label>Z\u0142oto (monety)
          <div class="num-row">
            <button type="button" class="btn btn-secondary" data-adj="gold" data-delta="-1">\u2212</button>
            <strong class="num-val">${player.gold ?? 0}</strong>
            <button type="button" class="btn btn-secondary" data-adj="gold" data-delta="1">+</button>
          </div>
        </label>
        <label>Eliksiry
          <div class="num-row">
            <button type="button" class="btn btn-secondary" data-adj="elixirs" data-delta="-1">\u2212</button>
            <strong class="num-val">${player.elixirs ?? 0}</strong>
            <button type="button" class="btn btn-secondary" data-adj="elixirs" data-delta="1">+</button>
          </div>
        </label>
      </div>
    </div>
  `;
  }
  function questAddFormHtml() {
    const opts = LOCATIONS.map(
      (l) => `<option value="${escapeHtml3(l.id)}">${escapeHtml3(l.name)} (#${l.number})</option>`
    ).join("");
    return `
    <div class="guide-box quest-add">
      <p class="step-kicker" style="margin:0">${ICO.quest()} Zadania (u g\xF3ry)</p>
      <p class="lead" style="margin:0.3rem 0 0">Tu zapisujesz zadania z kart (lokacja + nr Event) oraz doj\u015Bcie z \u017Cetonu tropienia. Po wej\u015Bciu na pole helper przypomni o karcie zdarzenia.</p>
      <label>Tytu\u0142 / skr\xF3t z karty
        <input type="text" id="quest-title" maxlength="80" placeholder="np. Quest: Kaer Seren / trop" />
      </label>
      <label>Lokacja do doj\u015Bcia
        <select id="quest-loc">${opts}</select>
      </label>
      <label>Nr karty zdarzenia (Event) do przeczytania na miejscu
        <input type="text" id="quest-event" maxlength="12" placeholder="np. 33" />
      </label>
      <label>Notatka (opcjonalnie)
        <input type="text" id="quest-note" maxlength="120" placeholder="koszt wej\u015Bcia, teren \u017Cetonu\u2026" />
      </label>
      <div class="actions" style="margin-top:0.55rem">
        <button type="button" class="btn btn-primary" id="quest-add-btn">Dodaj zadanie</button>
      </div>
    </div>
  `;
  }
  function questsListHtml(player) {
    const list = ensureQuests(player);
    if (!list.length) {
      return `<p class="note">Brak aktywnych zada\u0144.</p>`;
    }
    return `
    <div class="quests-list">
      <h3>${ICO.quest()} Twoje zadania</h3>
      <ul class="checklist">
        ${list.map((q) => {
      const loc = locById(q.locationId);
      return `<li data-quest-id="${escapeHtml3(q.id)}">
              <strong>${escapeHtml3(q.title || "Zadanie")}</strong>
              \u2192 ${loc ? escapeHtml3(loc.name) : "?"}
              ${q.eventCard ? ` \xB7 Event <strong>#${escapeHtml3(String(q.eventCard))}</strong>` : ""}
              ${q.note ? `<div class="note">${escapeHtml3(q.note)}</div>` : ""}
              <button type="button" class="btn btn-secondary" data-quest-done="${escapeHtml3(q.id)}">Rozwi\u0105zane / usu\u0144</button>
            </li>`;
    }).join("")}
      </ul>
    </div>
  `;
  }
  function questArrivalHtml(player, locId) {
    const list = ensureQuests(player).filter((q) => q.locationId === locId);
    if (!list.length) return "";
    const loc = locById(locId);
    return `
    <div class="guide-box guide-quest-hit" role="alert">
      <p class="step-kicker" style="margin:0">${ICO.quest()} Zadanie na tym polu</p>
      <h3 style="margin:0.25rem 0 0.4rem">Jeste\u015B na <strong>${escapeHtml3(loc?.name || "?")}</strong></h3>
      <p class="lead" style="margin:0"><strong>Faza I</strong> \u2014 mo\u017Cesz <em>opcjonalnie</em> rozwi\u0105za\u0107 zadanie teraz (Event z nr poni\u017Cej). To <strong>nie</strong> jest faza II.</p>
      <p class="note" style="margin:0.35rem 0 0">Je\u015Bli na polu jest te\u017C potw\xF3r: zadanie rozwi\u0105zujesz w fazie I (opcjonalnie). W fazie II wybierasz <strong>tylko 1</strong> \u2014 walka jest <em>opcjonalna</em> (mo\u017Cesz zamiast niej medytowa\u0107 albo eksplorowa\u0107).</p>
      <ul class="checklist">
        ${list.map(
      (q) => `
          <li>
            <strong>${escapeHtml3(q.title || "Zadanie")}</strong>
            ${q.eventCard ? ` \u2014 gracz po prawej bierze kart\u0119 zdarzenia <strong>#${escapeHtml3(String(q.eventCard))}</strong> i czyta.` : " \u2014 sprawd\u017A kart\u0119 zadania (nr zdarzenia)."}
            ${q.note ? `<div class="note">${escapeHtml3(q.note)}</div>` : ""}
            <button type="button" class="btn btn-primary" data-quest-done="${escapeHtml3(q.id)}">Rozwi\u0105zane \u2014 usu\u0144 zadanie</button>
          </li>`
    ).join("")}
      </ul>
    </div>
  `;
  }
  function turnSummaryHtml(player, { phase3Hint, schoolName, turnNumber, isSolo: isSolo2 } = {}) {
    if (!player) return "";
    const loc = player.locationId ? locById(player.locationId) : null;
    const quests = ensureQuests(player);
    const cards = player.cards ?? 0;
    const gold = player.gold ?? 0;
    const elixirs = player.elixirs ?? 0;
    const hint = phase3Hint || {};
    const turnLine = turnNumber != null ? `<li><strong>Tura:</strong> ${Number(turnNumber)}${isSolo2 ? ' <span class="note">(helper liczy automatycznie)</span>' : ""}</li>` : "";
    return `
    <div class="guide-box turn-summary">
      <p class="step-kicker" style="margin:0">Koniec tury \u2014 podsumowanie</p>
      <h3 style="margin:0.25rem 0 0.45rem">${escapeHtml3(player.name)}${schoolName ? ` \xB7 ${escapeHtml3(schoolName)}` : ""}</h3>
      <ul class="checklist">
        ${turnLine}
        <li><strong>Lokalizacja:</strong> ${loc ? `${escapeHtml3(loc.name)} (#${loc.number})` : "\u2014"}</li>
        <li><strong>Karty na r\u0119ce:</strong> ${cards} <span class="note">(po fazie III zwykle 3 przed/po kupnie \u2014 limit 7)</span></li>
        <li><strong>Z\u0142oto:</strong> ${gold}</li>
        <li><strong>Eliksiry:</strong> ${elixirs} / 4</li>
        <li><strong>Reputacja:</strong> ${player.reputation ?? 0}</li>
        <li><strong>Zadania otwarte:</strong> ${quests.length}${quests.length ? ` \u2014 ${quests.map((q) => {
      const L = locById(q.locationId);
      return `${escapeHtml3(q.title || "zadanie")}@${L ? escapeHtml3(L.name) : "?"}`;
    }).join("; ")}` : ""}</li>
      </ul>
      ${hint.note ? `<p class="tip"><strong>Faza III (przypomnienie):</strong> ${escapeHtml3(hint.note)}</p>` : ""}
      <p class="note">Je\u015Bli co\u015B nie gra po efekcie karty \u2014 wr\xF3\u0107 do Sto\u0142u / tracker\xF3w i popraw \u2212/+.</p>
      ${questsListHtml(player)}
    </div>
  `;
  }

  // js/app.js
  var STORAGE_KEY = "wiedzmin-stary-swiat-helper-v4";
  var UI_SCALE_KEY = "wiedzmin-stary-swiat-ui-scale";
  var UI_SCALES = ["sm", "md", "lg"];
  var appEl = document.getElementById("app");
  function loadUiScale() {
    try {
      let raw = localStorage.getItem(UI_SCALE_KEY) || "md";
      if (raw === "xl") raw = "lg";
      return UI_SCALES.includes(raw) ? raw : "md";
    } catch {
      return "md";
    }
  }
  function applyUiScale(scale) {
    let next = scale === "xl" ? "lg" : scale;
    next = UI_SCALES.includes(next) ? next : "md";
    document.documentElement.setAttribute("data-ui-scale", next);
    try {
      localStorage.setItem(UI_SCALE_KEY, next);
    } catch {
    }
    return next;
  }
  applyUiScale(loadUiScale());
  if (!window.__wiedzminKeysBound) {
    window.__wiedzminKeysBound = true;
    document.addEventListener("keydown", (e) => {
      if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = e.target;
      const typing = tag && (tag.closest && tag.closest("textarea") || tag.matches && tag.matches("input, textarea, select, [contenteditable=true]"));
      if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && !typing) {
        const group = appEl?.querySelector(".player-count");
        if (group) {
          e.preventDefault();
          const opts = [...group.querySelectorAll("[data-players]")];
          if (!opts.length) return;
          const cur = Math.max(
            0,
            opts.findIndex((el) => el.classList.contains("is-selected") || el.getAttribute("aria-checked") === "true")
          );
          const delta = e.key === "ArrowRight" ? 1 : -1;
          const next = opts[(cur + delta + opts.length) % opts.length];
          next?.click();
          return;
        }
      }
      if (e.key !== "Enter") return;
      if (typing) return;
      if (tag && tag.matches && tag.matches("button, [contenteditable=true]")) return;
      const primary = appEl?.querySelector(".flow-actions .btn-primary:not([disabled])") || appEl?.querySelector(".btn-primary:not([disabled])") || appEl?.querySelector("#next:not([disabled]), #pb-next:not([disabled]), #to-roster, #to-setup, #to-turn, #confirm-order, #deal-next");
      if (!primary) return;
      e.preventDefault();
      primary.click();
    });
  }
  function defaultState() {
    return {
      view: "home",
      players: 3,
      roster: [],
      activeIndex: 0,
      setupIndex: 0,
      playerBoardIndex: 0,
      turnNumber: 1,
      adventureStarted: false,
      savedAt: null,
      turn: {
        phase: "hub",
        screen: "hub",
        moveTo: null,
        moveCost: null,
        exploreDeck: null,
        fightResult: null
      },
      board: defaultBoard(),
      orderDice: []
    };
  }
  function isSolo() {
    return state.players === 1;
  }
  function normalizeState(raw) {
    const base = defaultState();
    if (!raw || typeof raw !== "object") return base;
    const players = Math.min(5, Math.max(1, Number(raw.players) || 3));
    const turn = raw.turn && typeof raw.turn === "object" ? {
      phase: String(raw.turn.phase || "hub"),
      screen: String(raw.turn.screen || "hub"),
      moveTo: raw.turn.moveTo ? String(raw.turn.moveTo) : null,
      moveCost: raw.turn.moveCost ? String(raw.turn.moveCost) : null,
      exploreDeck: raw.turn.exploreDeck ? String(raw.turn.exploreDeck) : null,
      fightResult: raw.turn.fightResult && typeof raw.turn.fightResult === "object" ? raw.turn.fightResult : null
    } : base.turn;
    const board = raw.board && typeof raw.board === "object" ? {
      ...defaultBoard(),
      ...raw.board,
      monsters: raw.board.monsters || {},
      movePrompt: raw.board.movePrompt || null,
      highlightFrom: raw.board.highlightFrom || null,
      tool: raw.board.tool === "player" ? "select" : raw.board.tool || "select"
    } : defaultBoard();
    if (board.monsters?.oxenfurt) {
      board.monsters["loc-ichaer"] = board.monsters.oxenfurt;
      delete board.monsters.oxenfurt;
    }
    if (board.monsters?.mantikora) {
      board.monsters["behelt-nar"] = board.monsters.mantikora;
      delete board.monsters.mantikora;
    }
    if (board.selectedLoc === "oxenfurt") board.selectedLoc = "loc-ichaer";
    if (board.selectedLoc === "mantikora") board.selectedLoc = "behelt-nar";
    sanitizeMonstersUniqueTerrain(board);
    if (!board.pendingMonsterLevel) board.pendingMonsterLevel = "I";
    if (!Array.isArray(board.repClaim) || board.repClaim.length !== 5) {
      board.repClaim = [null, null, null, null, null];
    }
    const roster = Array.isArray(raw.roster) ? raw.roster.map((p) => {
      const copy = { ...p || {} };
      if (copy.locationId === "oxenfurt") copy.locationId = "loc-ichaer";
      if (copy.locationId === "mantikora") copy.locationId = "behelt-nar";
      if (copy.trails && typeof copy.trails === "object") {
        for (const t of Object.keys(copy.trails)) {
          const slot = copy.trails[t];
          if (slot?.locId === "oxenfurt") slot.locId = "loc-ichaer";
          if (slot?.locId === "mantikora") slot.locId = "behelt-nar";
        }
      }
      if (copy.locationId && !locByIdSafe(copy.locationId)) copy.locationId = null;
      if (copy.schoolId) copy.schoolId = canonicalSchoolId(copy.schoolId);
      return copy;
    }) : [];
    const views = /* @__PURE__ */ new Set([
      "home",
      "roster",
      "playerboard",
      "order",
      "deal",
      "setup",
      "board",
      "turn",
      "ref",
      "icons",
      "lexicon",
      "sources"
    ]);
    roster.forEach((p) => ensureCombatTrack(ensurePlayerTrack(p)));
    ensureReputationClaims(board, roster);
    const turnNumber = Math.max(1, Math.min(999, Number(raw.turnNumber) || 1));
    const setupIndex = Math.max(0, Number(raw.setupIndex) || 0);
    const playerBoardIndex = Math.max(0, Number(raw.playerBoardIndex) || 0);
    const view = views.has(raw.view) ? raw.view : "home";
    const adventureStarted = Boolean(
      raw.adventureStarted || view !== "home" && view !== "splash" || turnNumber > 1 || setupIndex > 0 || playerBoardIndex > 0 || Array.isArray(raw.orderDice) && raw.orderDice.length > 0
    );
    const savedAt = Number(raw.savedAt) || null;
    return {
      ...base,
      view,
      players,
      roster,
      activeIndex: Math.max(0, Number(raw.activeIndex) || 0),
      setupIndex,
      playerBoardIndex,
      turnNumber,
      adventureStarted,
      savedAt,
      turn,
      board,
      orderDice: Array.isArray(raw.orderDice) ? raw.orderDice.map(Number) : []
    };
  }
  function locByIdSafe(id) {
    return Boolean(locById(id));
  }
  function loadState() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return normalizeState(raw);
    } catch {
      return defaultState();
    }
  }
  var saveTimer = null;
  var state = loadState();
  var bootGate = !state.adventureStarted;
  function saveState({ immediate = false } = {}) {
    if (bootGate) return;
    clearTimeout(saveTimer);
    const write = () => {
      try {
        if (state.adventureStarted) state.savedAt = Date.now();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
      }
    };
    if (immediate) write();
    else saveTimer = setTimeout(write, 200);
  }
  function hasContinueSave() {
    return Boolean(state.adventureStarted);
  }
  function formatSavedAt(ts) {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleString("pl-PL", {
        dateStyle: "short",
        timeStyle: "short"
      });
    } catch {
      return "";
    }
  }
  function continueSummaryParts() {
    if (!hasContinueSave()) return null;
    const names = (state.roster || []).slice(0, state.players).map((p) => p?.name).filter(Boolean);
    const who = names.length ? names.join(" \xB7 ") : playersLabel(state.players);
    const when = formatSavedAt(state.savedAt);
    const bits = [
      playersLabel(state.players),
      state.turnNumber > 1 ? `tura ${state.turnNumber}` : null,
      when ? `zapis ${when}` : null
    ].filter(Boolean);
    return { who, bits: bits.join(" \xB7 ") };
  }
  function splashSchoolMedallionsHtml() {
    const schools = [
      ["wilk", "Wilk"],
      ["gryf", "Gryf"],
      ["niedzwiedz", "Nied\u017Awied\u017A"],
      ["kot", "Kot"],
      ["zmija", "\u017Bmija"],
      ["mantikora", "Mantikora"]
    ];
    return `
    <ul class="splash-medallions" aria-hidden="true">
      ${schools.map(
      ([id, label], i) => `
        <li class="splash-medal" style="--i:${i}">
          <span class="splash-medal-disc splash-medal-disc--${id}">
            <img class="school-art school-art--${id}" src="./img/schools/${id === "kot" ? "kot-v10" : id}.png?v=10" alt="" width="96" height="96" decoding="async" />
          </span>
          <span>${label}</span>
        </li>`
    ).join("")}
    </ul>`;
  }
  var splashLeaving = false;
  function leaveSplashThen(next) {
    if (splashLeaving) return;
    const root = appEl.querySelector(".splash-screen");
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!root || reduce) {
      next();
      return;
    }
    splashLeaving = true;
    root.classList.add("is-leaving");
    root.querySelectorAll("button").forEach((btn) => {
      btn.disabled = true;
    });
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      splashLeaving = false;
      root.removeEventListener("animationend", onEnd);
      next();
    };
    const onEnd = (event) => {
      if (event.target !== root) return;
      finish();
    };
    root.addEventListener("animationend", onEnd);
    window.setTimeout(finish, 420);
  }
  function startNewAdventure() {
    leaveSplashThen(() => {
      clearTimeout(saveTimer);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
      }
      Object.assign(state, defaultState());
      state.adventureStarted = true;
      state.view = "home";
      state.savedAt = Date.now();
      bootGate = false;
      saveState({ immediate: true });
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  function continueAdventure() {
    if (!hasContinueSave() || splashLeaving) return;
    leaveSplashThen(() => {
      if (!state.view || state.view === "splash") state.view = "home";
      bootGate = false;
      saveState({ immediate: true });
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  function goToTitle() {
    bootGate = true;
    clearTimeout(saveTimer);
    try {
      if (state.adventureStarted) {
        state.savedAt = Date.now();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch {
    }
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function ensureRoster() {
    const n = state.players;
    if (!Array.isArray(state.roster)) state.roster = [];
    if (!state.board) state.board = defaultBoard();
    while (state.roster.length < n) {
      const i = state.roster.length;
      const start = START_RESOURCES[n]?.[i] || { cards: 5, gold: 3 };
      const p = ensurePlayerTrack(
        {
          name: n === 1 ? "Ja" : `Gracz ${i + 1}`,
          schoolId: SCHOOLS[i % SCHOOLS.length].id
        },
        start.cards,
        start.gold
      );
      placeAtSchool(p, { force: true });
      p._prevSchoolId = p.schoolId;
      state.roster.push(p);
    }
    if (state.roster.length > n) state.roster = state.roster.slice(0, n);
    state.roster.forEach((p, i) => {
      const start = START_RESOURCES[n]?.[i] || { cards: 5, gold: 3 };
      ensurePlayerTrack(p, start.cards, start.gold);
      ensureCombatTrack(p);
      if (!p.locationId) {
        placeAtSchool(p, { force: true });
        p._prevSchoolId = p.schoolId;
      }
    });
    if (state.activeIndex >= n) state.activeIndex = 0;
    if (state.board.placePlayer >= n) state.board.placePlayer = 0;
  }
  function applySchoolStarts() {
    state.roster.forEach((p) => {
      const schoolChanged = p._prevSchoolId && p._prevSchoolId !== p.schoolId;
      if (!p.locationId || schoolChanged) {
        placeAtSchool(p, { force: true });
      }
      p._prevSchoolId = p.schoolId;
    });
  }
  function schoolById3(id) {
    return SCHOOLS.find((s) => s.id === id) || SCHOOLS[0];
  }
  function activePlayer() {
    ensureRoster();
    return state.roster[state.activeIndex] || state.roster[0];
  }
  function setPlayers(n, { rerender = true } = {}) {
    if (state.players === n && !rerender) return;
    state.players = n;
    state.setupIndex = 0;
    state.activeIndex = 0;
    ensureRoster();
    saveState();
    if (rerender) render();
  }
  function go(view, extras = {}, { direction = "forward", animate = true } = {}) {
    const apply = () => {
      state.view = view;
      Object.assign(state, extras);
      if (view !== "splash") state.adventureStarted = true;
      saveState({ immediate: true });
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    if (!animate) {
      apply();
      return;
    }
    runScreenTransition(apply, { direction });
  }
  function goBack(view, extras = {}) {
    go(view, extras, { direction: "back" });
  }
  function transitionRender(mutate, { direction = "forward" } = {}) {
    runScreenTransition(() => {
      mutate();
      saveState();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, { direction });
  }
  function render() {
    if (bootGate) {
      renderSplash();
      return;
    }
    ensureRoster();
    if (state.view === "home") renderHome();
    else if (state.view === "roster") renderRoster();
    else if (state.view === "playerboard") renderPlayerBoard();
    else if (state.view === "order") renderOrder();
    else if (state.view === "deal") renderDeal();
    else if (state.view === "setup") renderSetup();
    else if (state.view === "board") renderBoard();
    else if (state.view === "turn") renderTurn();
    else if (state.view === "ref") renderRef();
    else if (state.view === "icons") renderIcons();
    else if (state.view === "lexicon") renderLexicon();
    else if (state.view === "sources") renderSources();
    else renderHome();
  }
  function schoolIcon(schoolId) {
    const fn = SCHOOL_ICON[schoolId] || ICO.specialty;
    return fn();
  }
  function playersLabel(n) {
    if (n === 1) return "Solo";
    return `${n} graczy`;
  }
  function shell(inner) {
    const scale = loadUiScale();
    appEl.innerHTML = `
    <header class="topbar">
      <div class="brand-row">
        <div class="brand">
          Wied\u017Amin: Stary \u015Awiat
          ${isSolo() ? `<small>Solo</small>` : ""}
        </div>
        <button type="button" class="btn btn-ghost btn-exit" id="to-title" title="Wr\xF3\u0107 do ekranu startowego" aria-label="Wyj\u015Bcie">
          <svg class="btn-exit-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M7 20.5V10.1C7 7 9.2 4.5 12 3.6c2.8.9 5 3.4 5 6.5v10.4H7Z" opacity=".18"/>
            <path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" d="M7 20.5V10.1C7 7 9.2 4.5 12 3.6c2.8.9 5 3.4 5 6.5v10.4Z"/>
            <path fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" d="M9.4 20.3V9.6M12 20.3V7.5M14.6 20.3V9.6"/>
            <path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M7.7 12.1h8.6M7.7 15.9h8.6"/>
            <circle cx="14.55" cy="14" r="1.25" fill="none" stroke="currentColor" stroke-width="1.4"/>
            <circle cx="14.55" cy="14" r="0.32" fill="currentColor"/>
            <path fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" d="M6.4 20.5h11.2"/>
          </svg>
        </button>
      </div>
      <div class="top-actions">
        ${[
      ["roster", "Gracze"],
      ["board", "St\xF3\u0142"]
    ].map(
      ([id, label]) => `<button class="btn btn-ghost ${state.view === id ? "nav-active" : ""}" data-nav="${id}">${label}</button>`
    ).join("")}
        <div class="ui-scale" role="group" aria-label="Rozmiar tekstu">
          ${[
      ["sm", "A\u2212", "Mniejszy"],
      ["md", "A", "Domy\u015Blny"],
      ["lg", "A+", "Wi\u0119kszy"]
    ].map(
      ([id, label, title]) => `<button type="button" class="btn btn-ghost ${scale === id ? "nav-active" : ""}" data-ui-scale="${id}" title="${title}">${label}</button>`
    ).join("")}
        </div>
      </div>
    </header>
    ${inner}
    <p class="footer-note">Fanowski przewodnik</p>
  `;
    appEl.querySelectorAll("[data-ui-scale]").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyUiScale(btn.getAttribute("data-ui-scale"));
        render();
      });
    });
    appEl.querySelector("#to-title")?.addEventListener("click", () => goToTitle());
    appEl.querySelectorAll("[data-nav]").forEach((btn) => {
      btn.addEventListener("click", () => {
        go(btn.getAttribute("data-nav"));
      });
    });
  }
  function renderSplash() {
    const canContinue = hasContinueSave();
    const summary = continueSummaryParts();
    const scale = loadUiScale();
    appEl.innerHTML = `
    <div class="splash-screen">
      <header class="splash-chrome">
        <div class="ui-scale" role="group" aria-label="Rozmiar tekstu">
          ${[
      ["sm", "A\u2212", "Mniejszy"],
      ["md", "A", "Domy\u015Blny"],
      ["lg", "A+", "Wi\u0119kszy"]
    ].map(
      ([id, label, title]) => `<button type="button" class="btn btn-ghost ${scale === id ? "nav-active" : ""}" data-ui-scale="${id}" title="${title}">${label}</button>`
    ).join("")}
        </div>
      </header>

      <section class="splash-stage" aria-label="Ekran tytu\u0142owy">
        <p class="splash-kicker">Pomocnik przy stole</p>
        <h1 class="splash-brand">Wied\u017Amin<span>Stary \u015Awiat</span></h1>
        <div class="splash-rule" aria-hidden="true"></div>
        ${splashSchoolMedallionsHtml()}

        <div class="splash-paths">
          <button type="button" class="splash-path splash-path-new" id="new-adventure">
            <span class="splash-path-kicker">Nowa \u015Bcie\u017Cka</span>
            <strong>Rozpocznij now\u0105 przygod\u0119</strong>
          </button>

          <button type="button" class="splash-path splash-path-continue" id="continue-adventure" ${canContinue ? "" : "disabled"}>
            <span class="splash-path-kicker">Zapisana historia</span>
            <strong>Kontynuuj histori\u0119</strong>
            ${summary ? `<span class="splash-path-meta"><b>${escapeHtml4(summary.who)}</b>${escapeHtml4(summary.bits)}</span>` : ""}
          </button>
        </div>
      </section>

      <p class="footer-note">Fanowski przewodnik</p>
    </div>
  `;
    appEl.querySelectorAll("[data-ui-scale]").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyUiScale(btn.getAttribute("data-ui-scale"));
        render();
      });
    });
    appEl.querySelector("#new-adventure").addEventListener("click", () => startNewAdventure());
    appEl.querySelector("#continue-adventure")?.addEventListener("click", () => continueAdventure());
  }
  function renderHome() {
    const options = [
      { n: 1, title: "Solo" },
      { n: 2, title: "Duet" },
      { n: 3, title: "Tr\xF3jka" },
      { n: 4, title: "Czw\xF3rka" },
      { n: 5, title: "Pi\u0105tka" }
    ];
    shell(`
    <section class="panel home-hero">
      <div class="home-hero-stack">
        <header class="home-hero-head">
          <h1>Prowadz\u0119 Ci\u0119 przez gr\u0119</h1>
        </header>
        <div class="home-hero-rule" aria-hidden="true"></div>
        <h3 class="home-section-title" id="player-count-label">Ile os\xF3b gra?</h3>
        <div class="player-count" role="radiogroup" aria-labelledby="player-count-label">
          ${options.map(
      (o) => `
            <button type="button" role="radio" class="player-count-opt ${state.players === o.n ? "is-selected" : ""}" data-players="${o.n}" aria-checked="${state.players === o.n ? "true" : "false"}">
              <span class="player-count-num">${o.n}</span>
              <span class="player-count-title">${o.title}</span>
            </button>`
    ).join("")}
        </div>
        <div class="actions flow-actions home-hero-actions">
          <button type="button" class="btn btn-primary" id="to-roster">Dalej</button>
        </div>
      </div>
    </section>
  `);
    const opts = [...appEl.querySelectorAll("[data-players]")];
    const selectPlayers = (n) => {
      setPlayers(n, { rerender: false });
      opts.forEach((el) => {
        const on = Number(el.dataset.players) === n;
        el.classList.toggle("is-selected", on);
        el.setAttribute("aria-checked", on ? "true" : "false");
      });
    };
    opts.forEach((btn) => {
      btn.addEventListener("click", () => selectPlayers(Number(btn.dataset.players)));
    });
    appEl.querySelector("#to-roster").addEventListener("click", () => {
      go("roster");
    });
  }
  function schoolArtSrc2(id) {
    return `./img/schools/${id === "kot" ? "kot-v10" : id}.png?v=10`;
  }
  function renderRoster() {
    ensureRoster();
    shell(`
    <section class="panel roster-screen">
      <div class="roster-stack">
        <header class="roster-head">
          <div class="roster-title-row">
            <h1>Imiona i szko\u0142y</h1>
            <button type="button" class="btn btn-ghost btn-roster-dice" id="roll-schools" title="Wylosuj szko\u0142y dla wszystkich" aria-label="Wylosuj szko\u0142y">
              ${ICO.dice()}
            </button>
          </div>
          <div class="home-hero-rule" aria-hidden="true"></div>
        </header>
        <div class="roster-grid" id="roster-forms" data-count="${state.players}" style="--roster-cols:${state.players}">
          ${state.roster.map((p, i) => {
      const fallback = state.players === 1 ? "Ty" : `Gracz ${i + 1}`;
      const label = (p.name || "").trim() || fallback;
      const sid = p.schoolId || SCHOOLS[0].id;
      return `
              <div class="roster-card" data-idx="${i}">
                <div class="roster-card-top">
                  <span class="splash-medal-disc splash-medal-disc--${sid} roster-medal" data-medal>
                    <img class="school-art school-art--${sid}" src="${schoolArtSrc2(sid)}" alt="" width="64" height="64" decoding="async" />
                  </span>
                  <strong class="roster-card-label">${escapeHtml4(label)}</strong>
                </div>
                <label>Imi\u0119
                  <input type="text" data-field="name" value="${escapeAttr(p.name)}" maxlength="24" />
                </label>
                <label>Szko\u0142a
                  <select data-field="schoolId">
                    ${SCHOOLS.map(
        (s) => `<option value="${s.id}" ${sid === s.id ? "selected" : ""}>${s.name}</option>`
      ).join("")}
                  </select>
                </label>
                <p class="roster-start school-start-hint">Start: <strong>${escapeHtml4(
        locById(schoolStartId(sid))?.name || "\u2014"
      )}</strong></p>
              </div>`;
    }).join("")}
        </div>
        <div class="actions flow-actions">
          <button type="button" class="btn btn-secondary" id="back-home">Wstecz</button>
          <button type="button" class="btn btn-primary" id="to-order">Dalej</button>
        </div>
      </div>
    </section>
  `);
    function paintRosterCard(card, p, i) {
      const fallback = state.players === 1 ? "Ty" : `Gracz ${i + 1}`;
      const name = (p.name || "").trim() || fallback;
      const schoolId = p.schoolId || SCHOOLS[0].id;
      const label = card.querySelector(".roster-card-label");
      if (label) label.textContent = name;
      const nameInput = card.querySelector('[data-field="name"]');
      if (nameInput && document.activeElement !== nameInput) nameInput.value = p.name || "";
      const select = card.querySelector('[data-field="schoolId"]');
      if (select) select.value = schoolId;
      const hintStrong = card.querySelector(".school-start-hint strong");
      if (hintStrong) hintStrong.textContent = locById(schoolStartId(schoolId))?.name || "\u2014";
      const medal = card.querySelector("[data-medal]");
      const img = medal?.querySelector("img");
      if (medal) {
        medal.className = `splash-medal-disc splash-medal-disc--${schoolId} roster-medal`;
        medal.setAttribute("data-medal", "");
      }
      if (img) {
        img.className = `school-art school-art--${schoolId}`;
        img.src = schoolArtSrc2(schoolId);
      }
    }
    function assignSchool(player, schoolId) {
      const prevId = player.schoolId;
      player.schoolId = schoolId;
      if (!player.locationId || prevId !== schoolId) {
        placeAtSchool(player, { force: true });
      }
      player._prevSchoolId = schoolId;
    }
    function rollSchoolsForAll() {
      const ids = SCHOOLS.map((s) => s.id);
      for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = ids[i];
        ids[i] = ids[j];
        ids[j] = tmp;
      }
      state.roster.forEach((p, i) => assignSchool(p, ids[i % ids.length]));
      applySchoolStarts();
      appEl.querySelectorAll(".roster-card").forEach((card) => {
        const idx = Number(card.dataset.idx);
        paintRosterCard(card, state.roster[idx], idx);
      });
      const btn = appEl.querySelector("#roll-schools");
      if (btn) {
        btn.classList.remove("is-rolling");
        void btn.offsetWidth;
        btn.classList.add("is-rolling");
      }
      saveState();
    }
    function syncNamesFromDom() {
      appEl.querySelectorAll(".roster-card").forEach((card) => {
        const i = Number(card.dataset.idx);
        const fallback = state.players === 1 ? "Ty" : `Gracz ${i + 1}`;
        const typed = card.querySelector('[data-field="name"]').value.replace(/[<>]/g, "").trim();
        const prev = state.roster[i] || {};
        const start = START_RESOURCES[state.players]?.[i] || { cards: 5, gold: 3 };
        const next = ensurePlayerTrack(
          { ...prev, name: typed || fallback },
          start.cards,
          start.gold
        );
        ensureCombatTrack(next);
        state.roster[i] = next;
        const label = card.querySelector(".roster-card-label");
        if (label) label.textContent = next.name;
      });
      saveState();
    }
    function onSchoolPick(i, schoolId) {
      const player = state.roster[i];
      if (!player || player.schoolId === schoolId) return;
      if (!isSolo()) {
        const other = state.roster.findIndex((p, j) => j !== i && p.schoolId === schoolId);
        if (other >= 0) {
          const previous = player.schoolId;
          assignSchool(player, schoolId);
          assignSchool(state.roster[other], previous);
        } else {
          assignSchool(player, schoolId);
        }
      } else {
        assignSchool(player, schoolId);
      }
      applySchoolStarts();
      appEl.querySelectorAll(".roster-card").forEach((card) => {
        const idx = Number(card.dataset.idx);
        paintRosterCard(card, state.roster[idx], idx);
      });
      saveState();
    }
    appEl.querySelectorAll('.roster-card [data-field="name"]').forEach((el) => {
      el.addEventListener("input", syncNamesFromDom);
      el.addEventListener("change", syncNamesFromDom);
    });
    appEl.querySelectorAll('.roster-card [data-field="schoolId"]').forEach((el) => {
      el.addEventListener("change", () => {
        const card = el.closest(".roster-card");
        onSchoolPick(Number(card.dataset.idx), el.value);
      });
    });
    appEl.querySelector("#roll-schools")?.addEventListener("click", () => rollSchoolsForAll());
    appEl.querySelector("#back-home").addEventListener("click", () => {
      goBack("home");
    });
    appEl.querySelector("#to-order").addEventListener("click", () => {
      syncNamesFromDom();
      applySchoolStarts();
      state.playerBoardIndex = 0;
      if (isSolo()) {
        go("playerboard");
      } else {
        state.orderDice = [];
        go("order");
      }
    });
  }
  function playerBoardStepIndex(steps, stepId) {
    const i = steps.findIndex((s) => s.id === stepId);
    return i >= 0 ? i : Math.max(0, steps.length - 1);
  }
  function finishPlayerBoardPrep() {
    runScreenTransition(() => {
      applyStartResources(state.roster, state.players, { force: true });
      state.setupIndex = 0;
      _setupEnterBoard = true;
      state.view = "setup";
      saveState({ immediate: true });
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, { direction: "forward" });
  }
  function renderPlayerBoard() {
    ensureRoster();
    const steps = buildPlayerBoardSteps({ playerCount: state.players, solo: isSolo() });
    const index = Math.min(state.playerBoardIndex, steps.length - 1);
    const step = steps[index];
    const isLast = index >= steps.length - 1;
    const isDeckStep = step.id === "deck";
    const isFigureStep = step.id === "figure-ring";
    const boardSrc = step.boardImg || PLAYER_BOARD_SCAN_SRC;
    const boardV = step.boardVer ?? 5;
    const overlaySrc = step.boardOverlayImg || "";
    const overlayV = step.boardOverlayVer ?? boardV;
    const overlayPulse = step.boardOverlayPulse !== false && Boolean(overlaySrc);
    const trophyStep = Boolean(step.schoolTrophyPrep);
    const actionDeckStep = Boolean(step.schoolActionDeckPrep);
    const figureStep = Boolean(step.figurePrep);
    const active = activePlayer();
    const schoolId = canonicalSchoolId(active?.schoolId);
    const school = schoolById3(schoolId);
    const trophySc = trophyStep ? schoolTrophyPrepScenario(state.players) : null;
    shell(`
    <section class="panel player-board-screen" data-pb-focus="${escapeAttr(step.focus)}" data-pb-step="${escapeAttr(step.id || "")}">
      <div class="player-board-stack${step.minimal ? " player-board-stack--hero-mat" : trophyStep ? " player-board-stack--trophies" : actionDeckStep ? " player-board-stack--action-deck" : figureStep ? " player-board-stack--figure" : " player-board-stack--coach"}">
        <header class="player-board-head">
          <h1>Przygotuj planszetk\u0119</h1>
          <div class="home-hero-rule" aria-hidden="true"></div>
        </header>

        <div class="player-board-main">
          ${trophyStep ? playerBoardTrophyMainHtml({
      boardSrc,
      boardV,
      schoolId,
      playerCount: state.players
    }) : actionDeckStep ? playerBoardActionDeckMainHtml({
      boardSrc,
      boardV
    }) : figureStep ? playerBoardFigureMainHtml({
      schoolId,
      schoolName: school.name,
      playerName: active?.name || "",
      playerSlot: state.activeIndex + 1,
      solo: isSolo()
    }) : `
          <div class="player-board-stage" data-focus="${escapeAttr(step.focus)}" aria-live="polite">
            ${step.minimal ? "" : `<span class="player-board-focus" aria-hidden="true"></span>`}
            <figure class="player-board-scan" id="player-board-scan">
              <div class="player-board-scan__stack">
                <img
                  class="player-board-scan__img"
                  src="${boardSrc}?v=${boardV}"
                  alt=""
                  width="1024"
                  height="425"
                  loading="eager"
                  decoding="async"
                />
                ${overlaySrc ? `<img
                  class="player-board-scan__overlay${overlayPulse ? " player-board-scan__overlay--pulse" : ""}"
                  src="${overlaySrc}?v=${overlayV}"
                  alt=""
                  width="1024"
                  height="425"
                  loading="eager"
                  decoding="async"
                  aria-hidden="true"
                />` : ""}
              </div>
              ${step.boardCap ? `<figcaption class="player-board-scan__cap">${escapeHtml4(step.boardCap)}</figcaption>` : ""}
            </figure>
          </div>

          ${step.minimal ? "" : `<div class="player-board-step">
            <h2 class="player-board-step__title">${escapeHtml4(step.title)}</h2>
            <p class="player-board-step__body">${step.body}</p>
            ${step.hint ? `<p class="tip player-board-step__hint">${step.hint}</p>` : ""}
          </div>`}`}
        </div>

        <div class="actions flow-actions">
          <button type="button" class="btn btn-secondary" id="pb-prev">Wstecz</button>
          <button type="button" class="btn btn-primary" id="pb-next">Dalej</button>
        </div>
      </div>
    </section>
  `);
    const stackEl = appEl.querySelector(".player-board-stack");
    const nextBtn = appEl.querySelector("#pb-next");
    if (trophyStep && stackEl && trophySc) {
      bindSchoolTrophyStep(stackEl, { pickCount: trophySc.pickCount });
    }
    if (actionDeckStep && stackEl) {
      bindSchoolActionDeckStep(stackEl);
    }
    if (figureStep && stackEl) {
      bindPlayerBoardFigureStep(stackEl);
    }
    const scanFig = appEl.querySelector("#player-board-scan");
    const scanImg = scanFig?.querySelector(".player-board-scan__img");
    if (scanFig && scanImg) {
      scanFig.classList.remove("is-missing");
      scanImg.addEventListener(
        "error",
        () => {
          scanFig.classList.add("is-missing");
        },
        { once: true }
      );
      const overlayImg = scanFig.querySelector(".player-board-scan__overlay");
      if (overlayImg) {
        overlayImg.addEventListener(
          "error",
          () => {
            overlayImg.remove();
          },
          { once: true }
        );
      }
    }
    appEl.querySelector("#pb-prev").addEventListener("click", () => {
      if (isFigureStep) {
        goBack("deal");
        return;
      }
      if (index === 0) {
        goBack(isSolo() ? "roster" : "order");
        return;
      }
      transitionRender(() => {
        state.playerBoardIndex = index - 1;
      }, { direction: "back" });
    });
    appEl.querySelector("#pb-next").addEventListener("click", () => {
      if (isDeckStep) {
        go("deal");
        return;
      }
      if (isLast) {
        finishPlayerBoardPrep();
        return;
      }
      transitionRender(() => {
        state.playerBoardIndex = index + 1;
      });
    });
  }
  function paintOrderItem(el, player) {
    const sid = player.schoolId || SCHOOLS[0].id;
    const medal = el.querySelector(".order-medal");
    if (medal && medal.dataset.schoolId !== sid) {
      medal.dataset.schoolId = sid;
      medal.className = `splash-medal-disc splash-medal-disc--${sid} order-medal`;
      medal.setAttribute("draggable", "true");
      const img = medal.querySelector("img");
      if (img) {
        img.className = `school-art school-art--${sid}`;
        img.draggable = false;
        if (img.dataset.schoolId !== sid) {
          img.dataset.schoolId = sid;
          img.src = schoolArtSrc2(sid);
        }
      }
    }
    const nameEl = el.querySelector(".order-name");
    if (nameEl) nameEl.textContent = player.name || "";
    const schoolEl = el.querySelector(".order-school");
    if (schoolEl) schoolEl.textContent = schoolById3(sid).short;
  }
  function applyOrderRoster(list, nextRoster) {
    const items = [...list.querySelectorAll(".order-item")];
    const prevRoster = state.roster;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const firsts = /* @__PURE__ */ new Map();
    const movers = [];
    for (let i = 0; i < items.length; i++) {
      const player = nextRoster[i];
      if (player === prevRoster[i]) continue;
      const fromIdx = prevRoster.indexOf(player);
      const fromMedal = fromIdx >= 0 ? items[fromIdx].querySelector(".order-medal") : null;
      if (fromMedal) firsts.set(player, fromMedal.getBoundingClientRect());
      movers.push({ el: items[i], player, i });
    }
    state.roster = nextRoster;
    state.orderDice = [];
    if (!movers.length) {
      saveState();
      return;
    }
    const painted = movers.map(({ el, player }) => {
      el.classList.remove("dragging", "is-drop-target");
      el.classList.add("is-settling");
      paintOrderItem(el, player);
      return { el, player, medal: el.querySelector(".order-medal") };
    });
    saveState();
    const reveal = (el, medal) => {
      el.classList.remove("is-settling");
      if (medal) {
        medal.style.zIndex = "";
        medal.style.willChange = "";
      }
    };
    if (reduce) {
      painted.forEach(({ el, medal }) => reveal(el, medal));
      return;
    }
    requestAnimationFrame(() => {
      const runs = [];
      for (const m of painted) {
        const f = firsts.get(m.player);
        if (!m.medal || !f) {
          reveal(m.el, m.medal);
          continue;
        }
        const last = m.medal.getBoundingClientRect();
        const dx = f.left - last.left;
        const dy = f.top - last.top;
        if (!dx && !dy) {
          reveal(m.el, m.medal);
          continue;
        }
        runs.push({ ...m, dx, dy });
      }
      for (const m of runs) {
        m.medal.getAnimations().forEach((a) => a.cancel());
        m.medal.style.willChange = "transform";
        m.medal.style.zIndex = "6";
        const anim = m.medal.animate(
          [
            { transform: `translate3d(${m.dx}px, ${m.dy}px, 0)` },
            { transform: "translate3d(0, 0, 0)" }
          ],
          { duration: 300, easing: "cubic-bezier(0.2, 0, 0, 1)" }
        );
        anim.finished.then(() => reveal(m.el, m.medal)).catch(() => reveal(m.el, m.medal));
      }
    });
  }
  function renderOrder() {
    ensureRoster();
    if (isSolo()) {
      go("playerboard");
      return;
    }
    shell(`
    <section class="panel order-screen">
      <div class="order-stack">
        <header class="order-head">
          <div class="order-title-row">
            <h1>Kto pierwszy?</h1>
            <button type="button" class="btn btn-ghost btn-roster-dice" id="order-dice" title="Wylosuj kolejno\u015B\u0107" aria-label="Wylosuj kolejno\u015B\u0107">
              ${ICO.dice()}
            </button>
          </div>
          <div class="home-hero-rule" aria-hidden="true"></div>
        </header>

        <ul class="order-list" id="order-list" data-count="${state.roster.length}" style="--order-cols:${state.roster.length}">
          ${state.roster.map((p, i) => {
      const res = startResourcesFor(state.players, i);
      const sid = p.schoolId || SCHOOLS[0].id;
      return `
              <li class="order-item" data-idx="${i}">
                <span class="order-pos">${i + 1}</span>
                <span class="splash-medal-disc splash-medal-disc--${sid} order-medal" data-school-id="${sid}" draggable="true" title="Przeci\u0105gnij, by zmieni\u0107 kolejno\u015B\u0107">
                  <img class="school-art school-art--${sid}" data-school-id="${sid}" src="${schoolArtSrc2(sid)}" alt="" width="96" height="96" decoding="async" draggable="false" />
                </span>
                <strong class="order-name">${escapeHtml4(p.name)}</strong>
                <span class="order-school">${escapeHtml4(schoolById3(sid).short)}</span>
                ${orderStartResourcesHtml(res.cards, res.gold)}
              </li>`;
    }).join("")}
        </ul>

        <div class="actions flow-actions">
          <button type="button" class="btn btn-secondary" id="back-roster">Wstecz</button>
          <button type="button" class="btn btn-primary" id="confirm-order">Dalej</button>
        </div>
      </div>
    </section>
  `);
    const list = appEl.querySelector("#order-list");
    let dragFrom = null;
    list.querySelectorAll(".order-medal").forEach((medal) => {
      medal.addEventListener("dragstart", (e) => {
        const item = medal.closest(".order-item");
        if (!item) return;
        dragFrom = Number(item.dataset.idx);
        item.classList.add("dragging");
        try {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", String(dragFrom));
        } catch (_) {
        }
      });
      medal.addEventListener("dragend", () => {
        const item = medal.closest(".order-item");
        item?.classList.remove("dragging");
        list.querySelectorAll(".order-item.is-drop-target").forEach((el) => {
          el.classList.remove("is-drop-target");
        });
        dragFrom = null;
      });
    });
    list.querySelectorAll(".order-item").forEach((item) => {
      item.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (dragFrom === null) return;
        const to = Number(item.dataset.idx);
        list.querySelectorAll(".order-item.is-drop-target").forEach((el) => {
          if (el !== item) el.classList.remove("is-drop-target");
        });
        if (to !== dragFrom) item.classList.add("is-drop-target");
      });
      item.addEventListener("dragleave", () => item.classList.remove("is-drop-target"));
      item.addEventListener("drop", (e) => {
        e.preventDefault();
        item.classList.remove("is-drop-target");
        const to = Number(item.dataset.idx);
        if (dragFrom === null || dragFrom === to) return;
        const next = [...state.roster];
        const [moved] = next.splice(dragFrom, 1);
        next.splice(to, 0, moved);
        applyOrderRoster(list, next);
        dragFrom = null;
      });
    });
    appEl.querySelector("#order-dice")?.addEventListener("click", () => {
      const btn = appEl.querySelector("#order-dice");
      if (btn) {
        btn.classList.remove("is-rolling");
        void btn.offsetWidth;
        btn.classList.add("is-rolling");
      }
      if (state.roster.length < 2) return;
      const next = [...state.roster];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      applyOrderRoster(list, next);
    });
    appEl.querySelector("#back-roster").addEventListener("click", () => {
      goBack("roster");
    });
    appEl.querySelector("#confirm-order").addEventListener("click", () => {
      state.activeIndex = 0;
      state.playerBoardIndex = 0;
      state.orderDice = [];
      saveState();
      go("playerboard");
    });
  }
  function renderDeal() {
    ensureRoster();
    const intro = startResourcesDealIntro(isSolo());
    const steps = buildPlayerBoardSteps({ playerCount: state.players, solo: isSolo() });
    const deckPbIndex = playerBoardStepIndex(steps, "deck");
    const figurePbIndex = playerBoardStepIndex(steps, "figure-ring");
    shell(`
    <section class="panel deal-screen order-screen">
      <div class="order-stack deal-stack">
        <header class="order-head">
          <h1>${escapeHtml4(intro.title)}</h1>
          ${intro.lead ? `<p class="deal-lead">${escapeHtml4(intro.lead)}</p>` : ""}
          <div class="home-hero-rule" aria-hidden="true"></div>
        </header>
        ${startResourcesDealListHtml({ roster: state.roster, playerCount: state.players })}
        <div class="actions flow-actions">
          <button type="button" class="btn btn-secondary" id="deal-back">Wstecz</button>
          <button type="button" class="btn btn-primary" id="deal-next">Dalej</button>
        </div>
      </div>
    </section>
  `);
    appEl.querySelector("#deal-back")?.addEventListener("click", () => {
      state.playerBoardIndex = deckPbIndex;
      saveState();
      goBack("playerboard");
    });
    appEl.querySelector("#deal-next")?.addEventListener("click", () => {
      state.playerBoardIndex = figurePbIndex;
      saveState();
      go("playerboard");
    });
  }
  function escapeAttr(s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  var _setupEnterBoard = false;
  var _setupEnterCoach = false;
  var _setupMainDeckPlaced = false;
  var _setupDeckCoachPhase = 0;
  var SETUP_DECK_COACH_LAST = 10;
  var SETUP_CARD_TOKEN_TERRAINS = ["forest", "water", "mountain"];
  var _coachBindGen = 0;
  var _coachResizeAbort = null;
  var SETUP_POOL_ZERO_SLOTS = [10, 11, 12];
  var SETUP_POOL_REST_SLOTS = [7, 8, 9];
  var SETUP_EXPLORE_DECKS = [
    { slot: 3, id: "city", name: "Miasta", art: "./img/explore/city.png" },
    { slot: 4, id: "wilds", name: "Dzikie ost\u0119py", art: "./img/explore/wilds.png" },
    { slot: 5, id: "events", name: "Zdarzenia", art: "" }
  ];
  var SETUP_EXPLORE_SLOTS = SETUP_EXPLORE_DECKS.map((d) => d.slot);
  var SETUP_PREP_BEFORE_MONSTERS = /* @__PURE__ */ new Set(["intro", "board", "action-deck", "map-pawns"]);
  function leaveCoachThen(next, { keepDeals = false } = {}) {
    const coach = appEl.querySelector(".setup-coach");
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!coach || reduce) {
      next();
      return;
    }
    if (coach.classList.contains("is-leaving")) {
      window.setTimeout(next, keepDeals ? 160 : 280);
      return;
    }
    coach.classList.add("is-leaving");
    if (!keepDeals) {
      appEl.querySelector(".setup-head h1")?.classList.add("is-title-leaving");
    }
    appEl.querySelectorAll(
      ".map-card-slot.is-coach-target, .map-token-slot.is-coach-target, .map-monster-token.is-coach-target, .map-loc-token-stack.is-coach-target, .map-gold-bank.is-coach-target, .map-dice-tray.is-coach-target, .map-die-slot.is-coach-target, .map-node.is-coach-target"
    ).forEach((el) => {
      el.classList.add("is-coach-leaving");
    });
    if (!keepDeals) {
      appEl.querySelectorAll(".setup-deal").forEach((el) => el.classList.add("is-leaving"));
    }
    window.setTimeout(next, keepDeals ? 140 : 260);
  }
  function settleCoachDealRoot(root) {
    if (!root) return;
    root.classList.add("is-ready", "is-settled-layer", "is-positioned");
    root.classList.remove("is-leaving");
    root.querySelectorAll(".setup-deal-card").forEach((c) => {
      const horiz = c.classList.contains("setup-deal-card--pool");
      c.classList.add("is-dealt", "is-flipped", "is-settled");
      if (horiz) c.classList.add("is-slot-horizontal");
    });
    root.querySelectorAll(
      ".setup-loc-token-chip, .setup-monster-token-chip, .setup-gold-chip, .setup-die-chip, .setup-area-card-chip, .setup-spawn-token-chip"
    ).forEach((c) => c.classList.add("is-dealt"));
    if (root.id === "setup-deal-gold-dice") {
      root.classList.add("is-revealed-svg");
    }
  }
  function coachDealBuilders() {
    return {
      1: () => `<div class="setup-deal setup-deal--zero" id="setup-deal-zero" data-slots="zero" aria-hidden="true">${setupDealCardsHtml(
        { costs: [0, 0, 0], useCommonBack: true }
      )}</div>`,
      2: () => `<div class="setup-deal setup-deal--rest" id="setup-deal-rest" data-slots="rest" aria-hidden="true">${setupDealCardsHtml(
        { costs: [1, 2, 1] }
      )}</div>`,
      3: () => setupExploreDecksHtml(),
      4: () => setupElixirDeckHtml(),
      5: () => setupTrophyDeckHtml(),
      6: () => setupMonsterStacksHtml(),
      7: () => setupLocFightHtml(),
      8: () => setupGoldDiceHtml(),
      9: () => setupAreaTokensOnCardsHtml(),
      10: () => setupMonsterSpawnHtml()
    };
  }
  var COACH_DEAL_SELECTORS = {
    1: "#setup-deal-zero",
    2: "#setup-deal-rest",
    3: "#setup-deal-explore",
    4: "#setup-deal-elixir",
    5: "#setup-deal-trophy",
    6: "#setup-deal-monsters",
    7: "#setup-deal-loc-fight",
    8: "#setup-deal-gold-dice",
    9: "#setup-deal-area-cards",
    10: "#setup-deal-monster-spawn"
  };
  function startingMonsterLevels() {
    const n = state.players || 1;
    if (n === 1) return ["I", "II", "III"];
    if (n === 2) return ["I", "I", "II"];
    return ["I", "I", "I"];
  }
  function demoMonsterSetupRows() {
    const levels = startingMonsterLevels();
    return SETUP_CARD_TOKEN_TERRAINS.map((terrain, i) => {
      const opts = locationsForTerrain(terrain);
      const loc = opts[Math.min(1, Math.max(0, opts.length - 1))] || opts[0];
      return {
        terrain,
        slot: i,
        loc,
        level: levels[i] || "I",
        label: terrain === "forest" ? "Las" : terrain === "water" ? "Woda" : "G\xF3ry",
        src: `./img/terrain/${terrain}.png`
      };
    }).filter((r) => r.loc);
  }
  function ensureCoachSvgExtras(preview, phase) {
    const svg2 = preview.querySelector(".map-svg");
    if (!svg2) return;
    const united = svg2.querySelector(".map-board-united");
    const outline = svg2.querySelector(".map-board-outline");
    if (phase >= 6 && united && !svg2.querySelector(".map-monster-stacks")) {
      united.insertAdjacentHTML("beforeend", monsterLevelStacksSvg());
    }
    if (phase >= 7 && united && !svg2.querySelector(".map-loc-fight-setup")) {
      united.insertAdjacentHTML("beforeend", locationTokensAndFightDeckSvg());
    }
    if (phase >= 8 && outline && !svg2.querySelector(".map-gold-dice-setup")) {
      outline.insertAdjacentHTML("beforebegin", goldBankAndDiceSvg());
    }
    if (phase < 8) svg2.querySelector(".map-gold-dice-setup")?.remove();
    if (phase < 7) svg2.querySelector(".map-loc-fight-setup")?.remove();
    if (phase < 6) svg2.querySelector(".map-monster-stacks")?.remove();
    if (phase >= 9 && united && !svg2.querySelector(".map-monster-stacks")) {
      united.insertAdjacentHTML("beforeend", monsterLevelStacksSvg());
    }
    if (phase >= 9 && united && !svg2.querySelector(".map-loc-fight-setup")) {
      united.insertAdjacentHTML("beforeend", locationTokensAndFightDeckSvg());
    }
  }
  function syncCoachScreenMods(phase) {
    const screen = appEl.querySelector(".setup-screen");
    if (!screen) return;
    screen.classList.toggle("setup-screen--deal-zero", phase >= 1);
    screen.classList.toggle("setup-screen--pool-draw", phase >= 1 && phase <= 2);
    screen.classList.toggle("setup-screen--explore-decks", phase >= 3);
    screen.classList.toggle("setup-screen--elixir-deck", phase >= 4);
    screen.classList.toggle("setup-screen--monster-stacks", phase >= 6);
    screen.classList.toggle("setup-screen--coach-spawn", phase >= 10);
    screen.classList.remove("setup-screen--enter-coach");
    const preview = appEl.querySelector(".setup-board-preview--coach");
    if (!preview) return;
    preview.classList.toggle("setup-board-preview--deal", phase >= 1);
    preview.classList.toggle("setup-board-preview--explore", phase >= 3);
    preview.classList.toggle("setup-board-preview--elixir", phase >= 4);
    preview.classList.toggle("setup-board-preview--monsters", phase >= 6);
    preview.classList.toggle("setup-board-preview--spawn", phase >= 10);
    preview.dataset.coachPhase = String(phase);
  }
  function applyCoachPhaseDom(phase) {
    const preview = appEl.querySelector(".setup-board-preview--coach");
    const coach = appEl.querySelector("#setup-coach");
    if (!preview || !coach) return false;
    const copy = setupDeckCoachCopy(phase);
    const title = setupDeckCoachTitle(phase, "Wsp\xF3lna talia akcji");
    const h1 = appEl.querySelector(".setup-head h1");
    if (h1) {
      h1.textContent = title;
      h1.classList.remove("is-title-leaving");
    }
    const kicker = coach.querySelector(".setup-coach-kicker");
    const text = coach.querySelector(".setup-coach-text");
    if (kicker) kicker.textContent = copy.kicker;
    if (text) text.innerHTML = copy.text;
    const sideTile = appEl.querySelector("#setup-coach-side-tile");
    if (sideTile) {
      const sideKicker = sideTile.querySelector(".setup-coach-kicker");
      const sideText = sideTile.querySelector(".setup-coach-text");
      if (sideKicker) sideKicker.textContent = copy.kicker;
      if (sideText) sideText.innerHTML = copy.text;
    }
    coach.classList.remove("is-leaving");
    preview.querySelectorAll(
      ".is-coach-target, .is-coach-deck, .is-coach-filled, .is-coach-leaving"
    ).forEach((el) => {
      el.classList.remove(
        "is-coach-target",
        "is-coach-deck",
        "is-coach-filled",
        "is-coach-leaving"
      );
    });
    const builders = coachDealBuilders();
    Object.entries(COACH_DEAL_SELECTORS).forEach(([pStr, sel]) => {
      const p = Number(pStr);
      const el = preview.querySelector(sel);
      if (p > phase) {
        el?.remove();
        return;
      }
      if (!el && builders[p]) {
        preview.insertAdjacentHTML("beforeend", builders[p]());
      }
      const node = preview.querySelector(sel);
      if (!node) return;
      if (p < phase) settleCoachDealRoot(node);
      else {
        node.classList.remove("is-settled-layer", "is-positioned", "is-ready", "is-leaving");
        node.querySelectorAll(".setup-deal-card").forEach((c) => {
          const poolHoriz = c.classList.contains("setup-deal-card--pool");
          c.classList.remove(
            "is-dealt",
            "is-flipped",
            "is-settled",
            "is-landing",
            "is-seating"
          );
          if (!poolHoriz) {
            c.classList.remove("is-slot-horizontal");
          } else {
            c.classList.add("is-slot-horizontal");
          }
        });
        node.querySelectorAll(
          ".setup-loc-token-chip, .setup-monster-token-chip, .setup-gold-chip, .setup-die-chip, .setup-area-card-chip, .setup-spawn-token-chip"
        ).forEach((c) => c.classList.remove("is-dealt"));
      }
    });
    ensureCoachSvgExtras(preview, phase);
    syncCoachScreenMods(phase);
    bindSetupDeckCoach(phase);
    return true;
  }
  function softSetCoachPhase(phase) {
    if (phase < 0 || phase > SETUP_DECK_COACH_LAST) return false;
    if (!appEl.querySelector(".setup-board-preview--coach")) return false;
    _setupDeckCoachPhase = phase;
    return applyCoachPhaseDom(phase);
  }
  function dealSettledClass(settled) {
    return settled ? " is-dealt is-flipped is-settled" : "";
  }
  function dealRootClass(settled) {
    return settled ? " is-ready is-settled-layer" : "";
  }
  function setupDeckCoachCopy(phase) {
    if (phase === 1) {
      return {
        kicker: "Koszt 0",
        text: `Odkrywajcie z talii, a\u017C znajdziecie <strong>3 karty o koszcie 0</strong>. Po\u0142\xF3\u017Ccie je na <strong>3 polach od do\u0142u</strong> prawej kolumny (przy dolnej kraw\u0119dzi), w losowej kolejno\u015Bci.`
      };
    }
    if (phase === 2) {
      return {
        kicker: "Pula \u2014 reszta",
        text: `Reszt\u0119 odkrytych <strong>wtasujcie z powrotem</strong> w tali\u0119. Potem odkryjcie <strong>kolejne 3 karty</strong> na pozosta\u0142e pola puli (bli\u017Cej talii).`
      };
    }
    if (phase === 3) {
      return {
        kicker: "Eksploracja",
        text: `Karty <strong>Miast</strong> i <strong>Dzikich ost\u0119p\xF3w</strong> potasujcie osobno. Karty <strong>Zdarze\u0144</strong> u\u0142\xF3\u017Ccie rosn\u0105co wed\u0142ug numer\xF3w.`
      };
    }
    if (phase === 4) {
      return {
        kicker: "Eliksiry",
        text: `Potasujcie karty <strong>eliksir\xF3w</strong> i po\u0142\xF3\u017Ccie zakryt\u0105 tali\u0119.`
      };
    }
    if (phase === 5) {
      return {
        kicker: "Trofea",
        text: isSolo() ? `We\u017A po 1 trofeum atrybutu (4 karty), potasuj, <strong>wylosuj 1</strong> i po\u0142\xF3\u017C odkryt\u0105. Reszt\u0119 do pude\u0142ka.` : `Po\u0142\xF3\u017Ccie <strong>trofea atrybut\xF3w</strong> w zakrytym stosie (2\u20133 graczy: po 1 na atrybut; 4\u20135: wszystkie).`
      };
    }
    if (phase === 6) {
      return {
        kicker: "Potwory",
        text: `Karty potwor\xF3w po\u0142\xF3\u017Ccie <strong>pionowo</strong> nad flagami <strong>I / II / III</strong>. Obok ka\u017Cdego stosu \u2014 \u017Cetony (sze\u015Bciok\u0105t: <strong>I</strong> najmniejszy, <strong>III</strong> najwi\u0119kszy).`
      };
    }
    if (phase === 7) {
      return {
        kicker: "Obszary i walka",
        text: `<strong>\u017Betony obszar\xF3w</strong> (Location Tokens): 3 zakryte stosy \u2014 las / g\xF3ry / woda. <strong>Talia walki potwor\xF3w</strong> (Monster Fight Deck): potasujcie i po\u0142\xF3\u017Ccie zakryt\u0105.`
      };
    }
    if (phase === 8) {
      return {
        kicker: "Bank i ko\u015Bci",
        text: isSolo() ? `Po lewej u g\xF3ry po\u0142\xF3\u017C <strong>1 zestaw 5 ko\u015Bci</strong>. Pod nimi \u2014 <strong>bank z\u0142ota</strong>.` : `Po lewej u g\xF3ry \u2014 <strong>2 zestawy po 5 ko\u015Bci</strong>. Pod nimi wsp\xF3lny <strong>bank z\u0142ota</strong>.`
      };
    }
    if (phase === 9) {
      return {
        kicker: "\u017Betony na kartach",
        text: `Z ka\u017Cdego stosu obszar\xF3w wylosuj <strong>1 \u017Ceton</strong> i po\u0142\xF3\u017C na <strong>polu \u017Cetonu przy karcie</strong>. Od g\xF3ry: <strong>las</strong> \u2192 <strong>woda</strong> \u2192 <strong>g\xF3ry</strong> (jeden rodzaj na jedno pole).`
      };
    }
    if (phase === 10) {
      const n = state.players || 1;
      let draw;
      if (n === 1) {
        draw = `Dobierz <strong>po 1 \u017Cetonie z I, II i III</strong> (zamiast 3\xD7 I).`;
      } else if (n === 2) {
        draw = `Dobierz <strong>2\xD7 poziom I</strong> + <strong>1\xD7 poziom II</strong>. Pierwszy gracz wybiera teren dla II.`;
      } else {
        draw = `Dobierz <strong>3 \u017Cetony poziomu I</strong> (losowo po 1 przy ka\u017Cdym \u017Cetonie obszaru).`;
      }
      return {
        kicker: "Potwory na start",
        text: `${draw} Odkryj \u2192 przenie\u015B \u017Ceton na obszar z \u017Cetonu obszaru \u2192 po\u0142\xF3\u017C pasuj\u0105c\u0105 <strong>kart\u0119 potwora</strong> na polu karty (od g\xF3ry: las / woda / g\xF3ry).`
      };
    }
    return {
      kicker: "Wsp\xF3lna talia akcji",
      text: `Przetasuj <strong>wsp\xF3lne karty akcji</strong> \u2014 <strong>${COMMON_ACTION_DECK_CARD_COUNT} kart</strong>. Nast\u0119pnie po\u0142\xF3\u017C je <strong>zakryte</strong> na odpowiednim polu.`
    };
  }
  function setupDeckCoachTitle(phase, fallback) {
    if (phase === 10) return "Potwory na planszy";
    if (phase === 9) return "\u017Betony obszaru przy kartach";
    if (phase === 8) return "Bank z\u0142ota i ko\u015Bci";
    if (phase === 7) return "\u017Betony obszar\xF3w i talia walki";
    if (phase === 6) return "Karty i \u017Cetony potwor\xF3w";
    if (phase === 5) return "Trofea atrybut\xF3w";
    if (phase === 4) return "Talia eliksir\xF3w";
    if (phase === 3) return "Zdarzenia i eksploracja";
    if (phase >= 1) return "Wsp\xF3lna talia akcji";
    return fallback;
  }
  function setupDiePipsHtml(face) {
    const n = Math.max(1, Math.min(6, face));
    return Array.from({ length: n }, () => `<i class="setup-die-pip"></i>`).join("");
  }
  function setupAreaTokensOnCardsHtml({ settled = false } = {}) {
    const rows = demoMonsterSetupRows();
    const chipDone = settled ? " is-dealt" : "";
    return `
    <div class="setup-deal setup-deal--area-cards${dealRootClass(settled)}" id="setup-deal-area-cards" aria-hidden="true">
      ${rows.map(
      (r, i) => `
        <div class="setup-area-card-chip${chipDone}" data-terrain="${r.terrain}" data-deal-area="${i}" data-slot-target="${r.slot}">
          <img src="${r.src}" alt="" decoding="async" />
          <span class="setup-area-card-chip__num">${r.loc.number}</span>
        </div>`
    ).join("")}
    </div>`;
  }
  function setupMonsterSpawnHtml({ settled = false } = {}) {
    const rows = demoMonsterSetupRows();
    const cardDone = dealSettledClass(settled);
    const chipDone = settled ? " is-dealt" : "";
    return `
    <div class="setup-deal setup-deal--monster-spawn${dealRootClass(settled)}" id="setup-deal-monster-spawn" aria-hidden="true">
      ${rows.map(
      (r, i) => `
        <div class="setup-deal-card setup-deal-card--spawn${cardDone}" data-deal="${i}" data-terrain="${r.terrain}" data-slot-target="${r.slot}" data-monster-level="${r.level}">
          <div class="setup-deal-card__inner">
            <div class="setup-deal-card__face setup-deal-card__face--back setup-deal-card__face--monster-back" aria-hidden="true"></div>
            <div class="setup-deal-card__face setup-deal-card__face--front setup-deal-card__face--spawn">
              <span class="setup-deal-card__monster-lvl">${r.level}</span>
              <img class="setup-deal-card__spawn-terrain" src="${r.src}" alt="" decoding="async" />
            </div>
          </div>
        </div>
        <div class="setup-spawn-token-chip${chipDone}" data-terrain="${r.terrain}" data-deal-spawn="${i}" data-loc="${r.loc.id}" data-monster-level="${r.level}">
          <span>${r.level}</span>
        </div>`
    ).join("")}
    </div>`;
  }
  function setupGoldDiceHtml({ settled = false } = {}) {
    const chipDone = settled ? " is-dealt" : "";
    const faces = [1, 2, 3, 4, 5];
    return `
    <div class="setup-deal setup-deal--gold-dice${dealRootClass(settled)}" id="setup-deal-gold-dice" aria-hidden="true">
      ${[0, 1, 2, 3, 4].map(
      (i) => `
        <div class="setup-gold-chip${chipDone}" data-gold="${i}" data-deal-gold="${i}" aria-hidden="true">
          <span class="setup-gold-chip__ring" aria-hidden="true"></span>
          <span class="setup-gold-chip__mark" aria-hidden="true">z\u0142</span>
        </div>`
    ).join("")}
      ${faces.map(
      (face, i) => `
        <div class="setup-die-chip${chipDone}" data-die="${i}" data-deal-die="${i}" data-face="${face}">
          <span class="setup-die-chip__face" data-pips="${face}" aria-hidden="true">${setupDiePipsHtml(face)}</span>
        </div>`
    ).join("")}
    </div>`;
  }
  function setupLocFightHtml({ settled = false } = {}) {
    const terrains = [
      { id: "forest", name: "Las", src: "./img/terrain/forest.png" },
      { id: "mountain", name: "G\xF3ry", src: "./img/terrain/mountain.png" },
      { id: "water", name: "Woda", src: "./img/terrain/water.png" }
    ];
    const chipDone = settled ? " is-dealt" : "";
    const cardDone = dealSettledClass(settled);
    return `
    <div class="setup-deal setup-deal--loc-fight${dealRootClass(settled)}" id="setup-deal-loc-fight" aria-hidden="true">
      ${terrains.map(
      (t, i) => `
        <div class="setup-loc-token-chip${chipDone}" data-terrain="${t.id}" data-deal-loc="${i}">
          <img src="${t.src}" alt="" decoding="async" />
        </div>`
    ).join("")}
      <div class="setup-deal-card setup-deal-card--fight${cardDone}" data-deal="0">
        <div class="setup-deal-card__inner">
          <div class="setup-deal-card__face setup-deal-card__face--back setup-deal-card__face--fight-back" aria-hidden="true"></div>
          <div class="setup-deal-card__face setup-deal-card__face--front setup-deal-card__face--fight">
            <span class="setup-deal-card__fight-mark" aria-hidden="true">\u2694</span>
          </div>
        </div>
      </div>
    </div>`;
  }
  function setupMonsterStacksHtml({ settled = false } = {}) {
    const cardDone = dealSettledClass(settled);
    const chipDone = settled ? " is-dealt" : "";
    return `
    <div class="setup-deal setup-deal--monsters${dealRootClass(settled)}" id="setup-deal-monsters" aria-hidden="true">
      ${[1, 2, 3].map(
      (lvl) => `
        <div class="setup-deal-card setup-deal-card--monster${cardDone}" data-deal="${lvl - 1}" data-monster-level="${lvl}">
          <div class="setup-deal-card__inner">
            <div class="setup-deal-card__face setup-deal-card__face--back setup-deal-card__face--monster-back" aria-hidden="true"></div>
            <div class="setup-deal-card__face setup-deal-card__face--front setup-deal-card__face--monster">
              <span class="setup-deal-card__monster-lvl">${["I", "II", "III"][lvl - 1]}</span>
            </div>
          </div>
        </div>
        <div class="setup-monster-token-chip${chipDone}" data-token-level="${lvl}" data-deal-token="${lvl - 1}">
          <span>${lvl === 3 ? "III" : lvl === 2 ? "II" : "I"}</span>
        </div>`
    ).join("")}
    </div>`;
  }
  function setupElixirDeckHtml({ settled = false } = {}) {
    const flask = `
    <svg class="setup-deal-card__elixir-ico" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M9.2 3.2h5.6v2.1l1.7 2.4c1.9 2.7 2.9 5.1 2.9 7.6a5.4 5.4 0 0 1-10.8 0c0-2.5 1-4.9 2.9-7.6l1.7-2.4V3.2Z" opacity=".22"/>
      <path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M9 3.4h6M10.2 3.4v2.2L8.2 8.4C6.5 10.8 5.6 13 5.6 15.4a6.4 6.4 0 0 0 12.8 0c0-2.4-.9-4.6-2.6-7L13.8 5.6V3.4"/>
      <path fill="currentColor" d="M8.1 14.2c.7 3.1 2.3 4.6 3.9 4.6s3.2-1.5 3.9-4.6c-1.3.55-2.6.8-3.9.8s-2.6-.25-3.9-.8Z" opacity=".88"/>
    </svg>`;
    return `
    <div class="setup-deal setup-deal--elixir${dealRootClass(settled)}" id="setup-deal-elixir" aria-hidden="true">
      <div class="setup-deal-card setup-deal-card--elixir${dealSettledClass(settled)}" data-deal="0">
        <div class="setup-deal-card__inner">
          <div class="setup-deal-card__face setup-deal-card__face--back setup-deal-card__face--elixir-back" aria-hidden="true"></div>
          <div class="setup-deal-card__face setup-deal-card__face--front setup-deal-card__face--elixir">
            ${flask}
          </div>
        </div>
      </div>
    </div>`;
  }
  function setupTrophyDeckHtml({ settled = false } = {}) {
    const cup = `
    <svg class="setup-deal-card__trophy-ico" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M8 4h8v3.2a4 4 0 0 1-8 0V4Z"/>
      <path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" d="M8 5.2H5.6A2.2 2.2 0 0 0 5.6 9.4H8M16 5.2h2.4a2.2 2.2 0 0 1 0 4.2H16"/>
      <path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" d="M12 11.2v3.2M9.5 18.5h5M10.2 14.4h3.6V18"/>
      <path fill="currentColor" d="M9.2 18.2h5.6v1.6H9.2z" opacity=".85"/>
    </svg>`;
    return `
    <div class="setup-deal setup-deal--trophy${dealRootClass(settled)}" id="setup-deal-trophy" aria-hidden="true">
      <div class="setup-deal-card setup-deal-card--trophy${dealSettledClass(settled)}" data-deal="0">
        <div class="setup-deal-card__inner">
          <div class="setup-deal-card__face setup-deal-card__face--back setup-deal-card__face--trophy-back" aria-hidden="true"></div>
          <div class="setup-deal-card__face setup-deal-card__face--front setup-deal-card__face--trophy">
            ${cup}
          </div>
        </div>
      </div>
    </div>`;
  }
  function setupExploreDecksHtml({ settled = false } = {}) {
    return `
    <div class="setup-deal setup-deal--explore${dealRootClass(settled)}" id="setup-deal-explore" aria-hidden="true">
      ${SETUP_EXPLORE_DECKS.map(
      (d, i) => `
        <div class="setup-deal-card setup-deal-card--explore${dealSettledClass(settled)}" data-deal="${i}" data-deck="${d.id}" data-slot-target="${d.slot}">
          <div class="setup-deal-card__inner">
            <div class="setup-deal-card__face setup-deal-card__face--back" aria-hidden="true"></div>
            <div class="setup-deal-card__face setup-deal-card__face--front setup-deal-card__face--${d.id}">
              ${d.art ? `<img class="setup-deal-card__art" src="${d.art}" alt="" decoding="async" />` : `<span class="setup-deal-card__nums"><span>1</span><span>2</span><span>3</span></span>`}
              <span class="setup-deal-card__deck-name">${d.name}</span>
            </div>
          </div>
        </div>`
    ).join("")}
    </div>`;
  }
  function applyMainDeckLandedState(root, { stackOnSlot = true } = {}) {
    if (!root) return;
    const cards = [...root.querySelectorAll(".setup-deal-card--main-deck")];
    cards.forEach((c, i) => {
      c.classList.add("is-dealt", "is-settled", "is-slot-horizontal");
      c.classList.remove("is-landing");
      if (stackOnSlot && i < cards.length - 1) c.classList.add("is-stack-hidden");
    });
    appEl.querySelector(".setup-screen")?.classList.add("setup-screen--main-deck-settled");
    const preview = appEl.querySelector(".setup-board-preview--coach");
    if (preview) mountMainDeckInForeignObject(preview, root);
    if (!_setupMainDeckPlaced) {
      _setupMainDeckPlaced = true;
      queryActionDeckSlot2(appEl)?.classList.add("is-coach-deck");
    }
  }
  function settleMainDeckRoot(root) {
    if (!root) return;
    root.classList.add("is-ready", "is-settled-layer", "is-positioned", "is-idle");
    root.classList.remove("is-leaving", "is-shuffling", "is-flying", "is-seating", "is-loop-out");
    applyMainDeckLandedState(root);
  }
  function resetMainDeckCycle(dealRoot, cards, { keepSvgSettled = false } = {}) {
    unmountMainDeckToOverlay(
      appEl.querySelector(".setup-board-preview--coach"),
      dealRoot
    );
    if (!keepSvgSettled) {
      appEl.querySelector(".setup-screen")?.classList.remove("setup-screen--main-deck-settled");
    }
    dealRoot.classList.remove(
      "is-settled-layer",
      "is-positioned",
      "is-seating",
      "is-flying",
      "is-shuffling",
      "is-loop-out",
      "is-deck-entering",
      "is-deck-entered"
    );
    cards.forEach((c) => {
      c.classList.remove(
        "is-dealt",
        "is-settled",
        "is-seated",
        "is-landing",
        "is-stack-hidden",
        "is-slot-horizontal",
        "is-seating",
        "is-seated-visual",
        "is-loop-out"
      );
    });
  }
  function setupMainDeckStackHtml({ settled = false } = {}) {
    const v = COMMON_ACTION_DECK_ASSET_V;
    const back = COMMON_ACTION_DECK_BACK_SRC;
    const cards = Array.from({ length: COMMON_ACTION_DECK_STACK_SIZE }, (_, i) => `
        <div class="setup-deal-card setup-deal-card--main-deck setup-deal-card--portrait${settled ? " is-dealt is-settled is-slot-horizontal" : ""}" data-deal="${i}" style="--stack-i: ${i}">
          <div class="setup-deal-card__inner setup-deal-card__inner--back-only">
            <div class="setup-deal-card__face setup-deal-card__face--scan setup-deal-card__face--portrait" aria-hidden="true">
              <img src="${back}?v=${v}" alt="" decoding="async" />
            </div>
          </div>
        </div>`).join("");
    return `<div class="setup-deal setup-deal--main-deck${dealRootClass(settled)}${settled ? " is-positioned" : ""}" id="setup-deal-main-deck" aria-hidden="true">${cards}</div>`;
  }
  function setupDealCardsHtml({ costs, settled = false, useCommonBack = false } = {}) {
    const v = COMMON_ACTION_DECK_ASSET_V;
    const back = COMMON_ACTION_DECK_BACK_SRC;
    return costs.map(
      (cost, i) => `
        <div class="setup-deal-card${useCommonBack ? " setup-deal-card--pool is-slot-horizontal" : ""}${settled ? useCommonBack ? " is-dealt is-flipped is-settled" : " is-dealt is-flipped is-settled" : ""}" data-deal="${i}">
          <div class="setup-deal-card__inner">
            <div class="setup-deal-card__face setup-deal-card__face--back${useCommonBack ? " setup-deal-card__face--scan" : ""}" aria-hidden="true">${useCommonBack ? `<img src="${back}?v=${v}" alt="" decoding="async" />` : ""}</div>
            <div class="setup-deal-card__face setup-deal-card__face--front setup-deal-card__face--pool-cost">
              <span class="setup-deal-card__cost">${cost}</span>
              <span class="setup-deal-card__label">koszt</span>
            </div>
          </div>
        </div>`
    ).join("");
  }
  function renderSetup() {
    const steps = buildSetupSteps(state.players, state.roster);
    const index = Math.min(state.setupIndex, steps.length - 1);
    const step = steps[index];
    const pct = Math.round((index + 1) / steps.length * 100);
    if (String(step.id || "").startsWith("player") || step.id === "player-solo") {
      applyStartResources(state.roster, state.players, { force: false });
      const m = String(step.id).match(/player-(\d+)/);
      if (m) {
        const idx = Number(m[1]);
        const start = startResourcesFor(state.players, idx);
        if (state.roster[idx]) {
          state.roster[idx].cards = start.cards;
          state.roster[idx].gold = start.gold;
          state.roster[idx].resourcesApplied = true;
        }
      }
      if (step.id === "player-solo" && state.roster[0]) {
        state.roster[0].cards = 5;
        state.roster[0].gold = 3;
        state.roster[0].resourcesApplied = true;
      }
    }
    if (step.id === "map-pawns") {
      (state.roster || []).forEach((p) => {
        placeAtSchool(p, { force: true });
        p.reputation = 0;
      });
      ensureReputationClaims(state.board, state.roster);
    }
    const mapPawnsMain = step.id === "map-pawns" ? `
      <div class="setup-map-pawns-layout">
        ${mapPawnsPrepPanelHtml({ roster: state.roster })}
        <div class="setup-map-embed setup-map-embed--pawns">
          ${mapSvgHtml(state.board || defaultBoard(), state.roster, {
      schoolById: schoolById3,
      setupPreview: true,
      setupMapPawns: true
    })}
        </div>
      </div>` : "";
    const monsterMap = step.id === "monsters" ? `
      <div class="setup-monsters-grid">
        <div class="setup-map-embed">
          <h3>Oznacz potwory (numery z \u017Ceton\xF3w)</h3>
          <p class="lead">Dla lasu, g\xF3r i wody podaj numer obszaru z odkrytego \u017Cetonu \u2014 strza\u0142kami albo wpisz. Potem ustaw poziom.</p>
          ${mapSvgHtml(state.board, state.roster, { schoolById: schoolById3 })}
        </div>
        <div class="setup-monsters-panel-wrap">
          ${monstersPanelHtml(state.board)}
        </div>
      </div>` : "";
    const showBoardMap = step.id === "board" || step.id === "action-deck" || step.id === "map-pawns";
    const showDeckCoach = step.id === "action-deck";
    if (!showDeckCoach) {
      _setupDeckCoachPhase = 0;
      _setupMainDeckPlaced = false;
    }
    const coachPhase = showDeckCoach ? _setupDeckCoachPhase : 0;
    const coachCopy = setupDeckCoachCopy(coachPhase);
    const coachTitle = setupDeckCoachTitle(coachPhase, step.title);
    const dealActive = coachPhase >= 1;
    const exploreActive = coachPhase >= 3;
    const elixirActive = coachPhase >= 4;
    const trophyActive = coachPhase >= 5;
    const monsterActive = coachPhase >= 6;
    const locFightActive = coachPhase >= 7;
    const goldDiceActive = coachPhase >= 8;
    const areaCardsActive = coachPhase >= 9;
    const monsterSpawnActive = coachPhase >= 10;
    const notchActive = elixirActive;
    const topActive = monsterActive || areaCardsActive;
    const boardPreview = showBoardMap ? `
      <div class="setup-board-preview${showDeckCoach ? " setup-board-preview--coach" : ""}${dealActive ? " setup-board-preview--deal" : ""}${exploreActive ? " setup-board-preview--explore" : ""}${notchActive ? " setup-board-preview--elixir" : ""}${topActive ? " setup-board-preview--monsters" : ""}${monsterSpawnActive ? " setup-board-preview--spawn" : ""}" ${showDeckCoach ? "" : 'aria-hidden="true"'}>
        ${mapSvgHtml(state.board || defaultBoard(), state.roster, {
      schoolById: schoolById3,
      setupCoachPhase: showDeckCoach ? coachPhase : null,
      setupPreview: showBoardMap
    })}
        ${showDeckCoach ? `<div class="setup-coach" id="setup-coach" aria-live="polite">
                <div class="setup-coach-bubble" id="setup-coach-bubble" role="dialog" aria-label="Wskaz\xF3wka">
                  <p class="setup-coach-kicker">${coachCopy.kicker}</p>
                  <p class="setup-coach-text">${coachCopy.text}</p>
                </div>
                <div class="setup-coach-side-tile" id="setup-coach-side-tile" role="note" aria-label="Wskaz\xF3wka">
                  <p class="setup-coach-kicker">${coachCopy.kicker}</p>
                  <p class="setup-coach-text">${coachCopy.text}</p>
                </div>
                <svg class="setup-coach-arrow" id="setup-coach-arrow" aria-hidden="true"></svg>
              </div>
              ${setupMainDeckStackHtml({
      settled: coachPhase > 0 || _setupMainDeckPlaced
    })}
              ${coachPhase >= 1 ? `<div class="setup-deal setup-deal--zero${dealRootClass(coachPhase > 1)}" id="setup-deal-zero" data-slots="zero" aria-hidden="true">
                      ${setupDealCardsHtml({
      costs: [0, 0, 0],
      settled: coachPhase > 1,
      useCommonBack: true
    })}
                    </div>` : ""}
              ${coachPhase >= 2 ? `<div class="setup-deal setup-deal--rest${dealRootClass(coachPhase > 2)}" id="setup-deal-rest" data-slots="rest" aria-hidden="true">
                      ${setupDealCardsHtml({
      costs: [1, 2, 1],
      settled: coachPhase > 2
    })}
                    </div>` : ""}
              ${exploreActive ? setupExploreDecksHtml({ settled: coachPhase > 3 }) : ""}
              ${elixirActive ? setupElixirDeckHtml({ settled: coachPhase > 4 }) : ""}
              ${trophyActive ? setupTrophyDeckHtml({ settled: coachPhase > 5 }) : ""}
              ${monsterActive ? setupMonsterStacksHtml({ settled: coachPhase > 6 }) : ""}
              ${locFightActive ? setupLocFightHtml({ settled: coachPhase > 7 }) : ""}
              ${goldDiceActive ? setupGoldDiceHtml({ settled: coachPhase > 8 }) : ""}
              ${areaCardsActive ? setupAreaTokensOnCardsHtml({ settled: coachPhase > 9 }) : ""}
              ${monsterSpawnActive ? setupMonsterSpawnHtml({ settled: false }) : ""}` : ""}
      </div>` : "";
    const enterBoard = step.id === "board" && _setupEnterBoard;
    if (enterBoard) _setupEnterBoard = false;
    const enterCoach = step.id === "action-deck" && _setupEnterCoach;
    if (enterCoach) _setupEnterCoach = false;
    const isPrepBeforeMonsters = SETUP_PREP_BEFORE_MONSTERS.has(step.id);
    const screenMods = [
      isPrepBeforeMonsters ? "setup-screen--prep" : "",
      step.id === "intro" ? "setup-screen--intro" : "",
      step.id === "board" ? "setup-screen--board-step" : "",
      step.id === "action-deck" ? "setup-screen--coach-flow" : "",
      showDeckCoach && coachPhase === 0 ? "setup-screen--coach-phase-0" : "",
      enterBoard ? "setup-screen--enter-board" : "",
      enterCoach ? "setup-screen--enter-coach" : "",
      showDeckCoach && (coachPhase > 0 || _setupMainDeckPlaced) ? "setup-screen--main-deck-settled" : "",
      dealActive ? "setup-screen--deal-zero" : "",
      exploreActive ? "setup-screen--explore-decks" : "",
      notchActive ? "setup-screen--elixir-deck" : "",
      topActive ? "setup-screen--monster-stacks" : "",
      monsterSpawnActive ? "setup-screen--coach-spawn" : "",
      step.id === "monsters" ? "setup-screen--monsters" : "",
      step.id === "map-pawns" ? "setup-screen--map-pawns" : ""
    ].filter(Boolean).join(" ");
    shell(`
    <section class="panel setup-screen${screenMods ? ` ${screenMods}` : ""}">
      <div class="setup-stack">
        <header class="setup-head${isPrepBeforeMonsters ? " setup-head--prep-hero" : ""}">
          ${isPrepBeforeMonsters ? "" : `<div class="progress setup-progress">
            <div class="progress-bar"><span style="width:${pct}%"></span></div>
          </div>`}
          <h1>${coachTitle}</h1>
          <div class="home-hero-rule" aria-hidden="true"></div>
        </header>

        <div class="setup-main${showBoardMap ? " setup-main--board" : ""}${step.id === "monsters" ? " setup-main--monsters" : ""}">
          ${showDeckCoach ? "" : step.id === "map-pawns" ? mapPawnsMain : String(step.body || "").trim() ? `<div class="step-body">${step.body}</div>` : ""}
          ${step.id === "map-pawns" ? "" : boardPreview}
          ${monsterMap}
        </div>

        <div class="actions flow-actions">
          <button type="button" class="btn btn-secondary" id="prev">Wstecz</button>
          ${step.nextMode === "turn" ? `<button type="button" class="btn btn-primary" id="to-turn">Dalej</button>` : `<button type="button" class="btn btn-primary" id="next">Dalej</button>`}
        </div>
      </div>
    </section>
  `);
    if (step.id === "monsters") {
      bindMonsterPanelControls();
      bindSetupMonsterMapClicks();
    }
    const prev = appEl.querySelector("#prev");
    const next = appEl.querySelector("#next");
    const toTurn = appEl.querySelector("#to-turn");
    if (prev) {
      prev.addEventListener("click", () => {
        if (index === 0) {
          const pbSteps = buildPlayerBoardSteps({ playerCount: state.players, solo: isSolo() });
          state.playerBoardIndex = playerBoardStepIndex(pbSteps, "figure-ring");
          saveState();
          goBack("playerboard");
          return;
        }
        if (step.id === "action-deck" && _setupDeckCoachPhase > 0) {
          leaveCoachThen(
            () => {
              if (!softSetCoachPhase(_setupDeckCoachPhase - 1)) {
                _setupDeckCoachPhase -= 1;
                render();
              }
            },
            { keepDeals: true }
          );
          return;
        }
        const fromCoach = step.id === "action-deck" && steps[index - 1]?.id === "board";
        const after = () => {
          _setupDeckCoachPhase = 0;
          state.setupIndex = index - 1;
        };
        const goPrevStep = () => transitionRender(after, { direction: "back" });
        if (fromCoach) leaveCoachThen(goPrevStep);
        else goPrevStep();
      });
    }
    if (next) {
      next.addEventListener("click", () => {
        if (step.id === "action-deck" && _setupDeckCoachPhase < SETUP_DECK_COACH_LAST) {
          leaveCoachThen(
            () => {
              if (!softSetCoachPhase(_setupDeckCoachPhase + 1)) {
                _setupDeckCoachPhase += 1;
                render();
              }
            },
            { keepDeals: true }
          );
          return;
        }
        const toBoard = step.id === "intro";
        const toCoach = step.id === "board" && steps[index + 1]?.id === "action-deck";
        const after = () => {
          let nextIndex = Math.min(steps.length - 1, index + 1);
          if (step.id === "action-deck") {
            while (nextIndex < steps.length && ["potions", "attr-trophies", "events-explore", "locations", "gold-dice"].includes(
              steps[nextIndex]?.id
            )) {
              nextIndex += 1;
            }
            nextIndex = Math.min(steps.length - 1, nextIndex);
          }
          state.setupIndex = nextIndex;
          if (toBoard) _setupEnterBoard = true;
          if (toCoach) {
            _setupDeckCoachPhase = 0;
            _setupEnterCoach = true;
            _setupMainDeckPlaced = false;
          }
          if (step.id === "action-deck") _setupDeckCoachPhase = 0;
        };
        if (toCoach) {
          after();
          saveState();
          render();
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else transitionRender(after);
      });
    }
    if (toTurn) {
      toTurn.addEventListener("click", () => {
        applyStartResources(state.roster, state.players, { force: true });
        state.activeIndex = 0;
        state.turnNumber = 1;
        go("turn", { turn: { phase: "hub", screen: "hub" } });
      });
    }
    if (showDeckCoach) {
      requestAnimationFrame(() => bindSetupDeckCoach(coachPhase));
    }
  }
  function bindSetupDeckCoach(phase = 0) {
    const preview = appEl.querySelector(".setup-board-preview--coach");
    const bubble = appEl.querySelector("#setup-coach-bubble");
    const arrow = appEl.querySelector("#setup-coach-arrow");
    if (!preview || !bubble || !arrow) return;
    const bindGen = ++_coachBindGen;
    _coachResizeAbort?.abort();
    _coachResizeAbort = new AbortController();
    const deck = queryActionDeckSlot2(preview);
    const slotsOf = (ids) => ids.map((i) => preview.querySelector(`.map-card-slot[data-slot="${i}"]`)).filter(Boolean);
    const zeroSlots = slotsOf(SETUP_POOL_ZERO_SLOTS);
    const restSlots = slotsOf(SETUP_POOL_REST_SLOTS);
    const exploreSlots = slotsOf(SETUP_EXPLORE_SLOTS);
    const elixirSlot = preview.querySelector('.map-card-slot[data-slot="elixir"]');
    const trophySlot = preview.querySelector('.map-card-slot[data-slot="trophy"]');
    const monsterCardSlots = [1, 2, 3].map((lvl) => preview.querySelector(`.map-card-slot[data-slot="monster-card-${lvl}"]`)).filter(Boolean);
    const monsterTokenSlots = [1, 2, 3].map((lvl) => preview.querySelector(`[data-slot="monster-token-${lvl}"]`)).filter(Boolean);
    const locTokenSlots = ["forest", "mountain", "water"].map((id) => preview.querySelector(`[data-slot="loc-token-${id}"]`)).filter(Boolean);
    const fightSlot = preview.querySelector('[data-slot="monster-fight"]');
    const goldBank = preview.querySelector('[data-slot="gold-bank"]');
    const diceTray = preview.querySelector('[data-slot="dice-tray"]');
    const dieSlots = [0, 1, 2, 3, 4].map((i) => preview.querySelector(`[data-slot="die-${i}"]`)).filter(Boolean);
    const cardTokenSlots = [0, 1, 2].map((i) => preview.querySelector(`[data-slot="card-token-${i}"]`)).filter(Boolean);
    const spawnCardSlots = [0, 1, 2].map((i) => preview.querySelector(`.map-card-slot[data-slot="${i}"]`)).filter(Boolean);
    const spawnLocNodes = demoMonsterSetupRows().map((r) => preview.querySelector(`.map-node[data-loc="${r.loc.id}"]`)).filter(Boolean);
    const highlight = phase === 10 ? [...spawnCardSlots, ...spawnLocNodes] : phase === 9 ? cardTokenSlots : phase === 8 ? [...goldBank ? [goldBank] : [], ...diceTray ? [diceTray] : [], ...dieSlots] : phase === 7 ? [...locTokenSlots, ...fightSlot ? [fightSlot] : []] : phase === 6 ? [...monsterCardSlots, ...monsterTokenSlots] : phase === 5 ? trophySlot ? [trophySlot] : [] : phase === 4 ? elixirSlot ? [elixirSlot] : [] : phase === 3 ? exploreSlots : phase === 2 ? restSlots : phase === 1 ? zeroSlots : deck ? [deck] : [];
    if (!highlight.length) return;
    highlight.forEach((t) => t.classList.add("is-coach-target"));
    if (phase >= 1 && phase <= 2 && deck || _setupMainDeckPlaced) {
      deck?.classList.add("is-coach-deck");
    }
    if (phase >= 2) {
      zeroSlots.forEach((t) => t.classList.add("is-coach-filled"));
    }
    if (phase >= 3) {
      restSlots.forEach((t) => t.classList.add("is-coach-filled"));
    }
    const layoutCoachSideTile = () => {
      const tile = appEl.querySelector("#setup-coach-side-tile");
      if (!tile || phase !== 0) return;
      const pr = preview.getBoundingClientRect();
      if (pr.width < 8) return;
      const mapFace = preview.querySelector(".map-board-face");
      const united = preview.querySelector(".map-board-united") || preview.querySelector(".map-svg");
      const board = united?.getBoundingClientRect();
      const mapTopRef = mapFace?.getBoundingClientRect() ?? board;
      if (!board || !mapTopRef) return;
      const gap = 10;
      const pad = 6;
      const boardRightInPreview = board.right - pr.left;
      const left = boardRightInPreview + gap;
      const tileW = Math.max(148, pr.width - pad - left);
      const top = mapTopRef.top - pr.top;
      tile.style.width = `${tileW}px`;
      tile.style.left = `${left}px`;
      tile.style.top = `${top}px`;
    };
    const placeBubble = (anchorEl) => {
      if (phase === 0) {
        layoutCoachSideTile();
        arrow.innerHTML = "";
        return null;
      }
      const pr = preview.getBoundingClientRect();
      const tr = anchorEl.getBoundingClientRect();
      if (pr.width < 8 || tr.width < 2) return null;
      const tx = tr.left + tr.width / 2 - pr.left;
      const ty = tr.top + tr.height / 2 - pr.top;
      const bubbleW = phase === 10 ? Math.min(pr.width * 0.28, 300) : Math.min(pr.width * 0.52, 352);
      const cornerPhases = phase === 3 || phase === 4 || phase === 5 || phase === 6 || phase === 7 || phase === 8 || phase === 9 || phase === 10;
      let bx;
      let by;
      if (phase === 10) {
        bx = Math.max(12, pr.width - bubbleW - 10);
        by = Math.max(14, Math.min(pr.height * 0.28, Math.max(14, ty - 40)));
      } else if (phase === 9) {
        bx = Math.max(12, Math.min(pr.width - bubbleW - 12, pr.width * 0.48));
        by = Math.max(12, Math.min(pr.height * 0.36, ty - 20));
      } else if (phase === 8) {
        bx = Math.max(12, Math.min(pr.width - bubbleW - 12, pr.width * 0.42));
        by = Math.max(12, Math.min(pr.height * 0.38, ty + 36));
      } else if (phase === 6 || phase === 7) {
        bx = Math.max(12, Math.min(pr.width - bubbleW - 12, pr.width * 0.34));
        by = Math.max(12, Math.min(pr.height * 0.42, ty + 48));
      } else if (phase === 4 || phase === 5) {
        bx = phase === 5 ? Math.max(12, Math.min(pr.width - bubbleW - 12, pr.width * 0.28)) : Math.max(12, Math.min(pr.width - bubbleW - 12, pr.width * 0.58));
        by = Math.max(10, Math.min(pr.height * 0.22, ty - 170));
      } else if (phase === 3) {
        bx = Math.max(12, pr.width - bubbleW - 14);
        by = 14;
      } else {
        bx = Math.max(12, Math.min(pr.width * 0.4, tx - 160));
        by = Math.max(12, Math.min(pr.height - 150, ty - 48));
      }
      if (cornerPhases) bubble.style.width = `${bubbleW}px`;
      else bubble.style.width = "";
      bubble.style.left = `${bx}px`;
      bubble.style.top = `${by}px`;
      const br = bubble.getBoundingClientRect();
      const x1 = phase === 10 ? br.left - pr.left : phase === 9 ? br.left + br.width * 0.35 - pr.left : phase === 8 ? br.left + br.width * 0.28 - pr.left : phase === 6 || phase === 7 ? br.left + br.width * 0.5 - pr.left : phase === 5 ? br.left + br.width * 0.35 - pr.left : phase === 4 ? br.left + br.width * 0.55 - pr.left : phase === 3 ? br.left + br.width * 0.2 - pr.left : br.left + br.width / 2 - pr.left;
      const y1 = phase === 10 ? br.top + br.height * 0.42 - pr.top : phase === 6 || phase === 7 || phase === 8 || phase === 9 ? br.top - pr.top : br.top + br.height - pr.top;
      const x2 = tx;
      const y2 = ty;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2 - (cornerPhases ? 24 : 18);
      arrow.setAttribute("viewBox", `0 0 ${pr.width} ${pr.height}`);
      arrow.style.width = `${pr.width}px`;
      arrow.style.height = `${pr.height}px`;
      arrow.innerHTML = `
      <defs>
        <marker id="setup-coach-head" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#c4a14a"/>
        </marker>
      </defs>
      <path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" fill="none" stroke="#c4a14a" stroke-width="2.4" marker-end="url(#setup-coach-head)"/>
    `;
      return { pr, tx, ty };
    };
    const { mapWrap, positionRoot } = mountCoachOverlays(preview);
    const layoutMainDeck = () => {
      const dealRoot = appEl.querySelector("#setup-deal-main-deck");
      const pxRoot = positionRoot || mapWrap;
      if (!dealRoot || !deck || !pxRoot || !mapWrap) return;
      const origin = pxRoot.getBoundingClientRect();
      const svg2 = mapWrap.querySelector(".map-svg");
      const united = svg2?.querySelector(".map-board-united");
      const boardEl = united || svg2;
      const boardScreen = boardEl?.getBoundingClientRect();
      const svgAnchored = isMainDeckSvgAnchored(dealRoot);
      const foHost = dealRoot.parentElement?.classList?.contains("map-action-deck-fo-host") ? dealRoot.parentElement : null;
      const box = svgAnchored && foHost ? { left: 0, top: 0, width: foHost.clientWidth, height: foHost.clientHeight } : measureActionDeckLipBox(pxRoot, preview);
      if (!box || !svgAnchored && origin.width < 8 || box.width < 2 || !boardScreen?.width) return;
      const aspect = ACTION_CARD_ASPECT_W / ACTION_CARD_ASPECT_H;
      const gap = 10;
      const pad = 6;
      const landW = box.width;
      const landH = box.height;
      const { fitRotW, fitRotH } = htmlCardFitVarsForLip(box);
      const x1 = svgAnchored ? 0 : box.left;
      const y1 = svgAnchored ? 0 : box.top;
      const mapFace = svg2?.querySelector(".map-board-face");
      const mapFaceScreen = mapFace?.getBoundingClientRect();
      const boardTop = boardScreen.top - origin.top;
      const boardLeft = boardScreen.left - origin.left;
      const boardH = boardScreen.height;
      const mapTopInLayer = mapFaceScreen ? mapFaceScreen.top - origin.top : boardTop;
      const mapH = mapFaceScreen?.height ?? boardH;
      const layerW = origin.width;
      let portraitH = Math.min(Math.max(156, mapH * 0.9), mapH - 6);
      portraitH = Math.min(portraitH, 300);
      let portraitW = portraitH * aspect;
      const maxStackW = Math.max(48, layerW - 2 * pad);
      if (portraitW > maxStackW) {
        portraitW = maxStackW;
        portraitH = portraitW / aspect;
      }
      const roomLeftOfBoard = boardLeft - gap - pad;
      let x0Base = pad;
      if (roomLeftOfBoard >= portraitW * 0.92) {
        x0Base = boardLeft - portraitW - gap;
      } else if (roomLeftOfBoard >= 40) {
        portraitW = Math.min(portraitW, roomLeftOfBoard);
        portraitH = portraitW / aspect;
        x0Base = boardLeft - portraitW - gap;
      }
      x0Base = Math.max(pad, Math.min(x0Base, layerW - portraitW - pad));
      const y0Base = mapTopInLayer;
      [...dealRoot.querySelectorAll(".setup-deal-card--main-deck")].forEach((card, i) => {
        const fanX = i * 0.55;
        const fanY = i * -1.35;
        card.style.setProperty("--w", `${portraitW}px`);
        card.style.setProperty("--h", `${portraitH}px`);
        card.style.setProperty("--w1", `${landW}px`);
        card.style.setProperty("--h1", `${landH}px`);
        card.style.setProperty("--x0", `${x0Base + fanX}px`);
        card.style.setProperty("--y0", `${y0Base + fanY}px`);
        card.style.setProperty("--x-enter", `${x0Base + fanX - portraitW - 96}px`);
        card.style.setProperty("--y-enter", `${y0Base + fanY}px`);
        card.style.setProperty("--x1", `${x1}px`);
        card.style.setProperty("--y1", `${y1}px`);
        card.style.setProperty("--x1-fly", `${x1 + landW / 2 - portraitW / 2}px`);
        card.style.setProperty("--y1-fly", `${y1 + landH / 2 - portraitH / 2}px`);
        const seatScale = mainDeckSeatScaleForPortraitInLip(
          { width: landW, height: landH },
          portraitW,
          portraitH
        );
        card.style.setProperty("--seat-scale", `${seatScale}`);
        card.style.setProperty("--fit-rot-h", `${fitRotH}px`);
        card.style.setProperty("--fit-rot-w", `${fitRotW}px`);
        card.style.zIndex = String(24 + i);
      });
    };
    const sleep3 = (ms) => new Promise((r) => window.setTimeout(r, ms));
    const runMainDeckEnter = () => {
      const dealRoot = appEl.querySelector("#setup-deal-main-deck");
      if (!dealRoot) return;
      if (dealRoot.classList.contains("is-settled-layer") && _setupDeckCoachPhase !== 0) return;
      const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        layoutMainDeck();
        settleMainDeckRoot(dealRoot);
        return;
      }
      if (dealRoot.dataset.enterRunning === "1") return;
      dealRoot.dataset.enterRunning = "1";
      const cards = [...dealRoot.querySelectorAll(".setup-deal-card--main-deck")];
      const runShufflePass = () => new Promise((resolve) => {
        dealRoot.classList.remove("is-shuffling");
        void dealRoot.offsetWidth;
        dealRoot.classList.add("is-shuffling");
        window.setTimeout(resolve, 860);
      });
      const waitFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));
      const runFlyToSlot = () => new Promise((resolve) => {
        layoutMainDeck();
        dealRoot.classList.add("is-flying");
        cards.forEach(
          (c) => c.classList.remove("is-dealt", "is-settled", "is-landing", "is-stack-hidden", "is-slot-horizontal", "is-seating")
        );
        cards.forEach((card, i) => {
          window.setTimeout(
            () => card.classList.add("is-dealt", "is-landing"),
            20 + i * 22
          );
        });
        window.setTimeout(() => {
          layoutMainDeck();
          cards.forEach((c) => c.classList.remove("is-landing"));
          dealRoot.classList.remove("is-flying");
          resolve();
        }, 800);
      });
      const runSeatOnSlot = () => new Promise((resolve) => {
        const reduceSeat = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        layoutMainDeck();
        const topCard = cards[cards.length - 1];
        if (!topCard) {
          resolve();
          return;
        }
        cards.forEach((c) => {
          if (c !== topCard) c.classList.add("is-stack-hidden");
        });
        if (reduceSeat) {
          resolve();
          return;
        }
        dealRoot.classList.add("is-seating");
        void topCard.offsetWidth;
        requestAnimationFrame(() => {
          topCard.classList.add("is-seating");
        });
        window.setTimeout(() => {
          dealRoot.classList.remove("is-seating");
          topCard.classList.remove("is-seating");
          topCard.classList.add("is-seated-visual");
          resolve();
        }, 760);
      });
      const prepareDeckFromLeft = () => new Promise((resolve) => {
        const screen = appEl.querySelector(".setup-screen");
        resetMainDeckCycle(dealRoot, cards, { keepSvgSettled: true });
        layoutMainDeck();
        dealRoot.classList.add("is-idle", "is-ready", "is-deck-entering");
        dealRoot.classList.remove("is-deck-entered");
        void dealRoot.offsetWidth;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            screen?.classList.remove("setup-screen--main-deck-settled");
            dealRoot.classList.add("is-deck-entered");
            window.setTimeout(() => {
              dealRoot.classList.remove("is-deck-entering", "is-deck-entered");
              resolve();
            }, 720);
          });
        });
      });
      (async () => {
        dealRoot.classList.remove("is-settled-layer", "is-positioned");
        while (bindGen === _coachBindGen && _setupDeckCoachPhase === 0) {
          await prepareDeckFromLeft();
          await waitFrame();
          for (let pass = 0; pass < 3; pass++) {
            if (bindGen !== _coachBindGen || _setupDeckCoachPhase !== 0) break;
            await runShufflePass();
          }
          if (bindGen !== _coachBindGen || _setupDeckCoachPhase !== 0) break;
          dealRoot.classList.remove("is-shuffling");
          await runFlyToSlot();
          await runSeatOnSlot();
          await waitFrame();
          applyMainDeckLandedState(dealRoot);
          await sleep3(1700);
          if (bindGen !== _coachBindGen || _setupDeckCoachPhase !== 0) break;
        }
        if (bindGen === _coachBindGen && _setupDeckCoachPhase === 0) {
          layoutMainDeck();
          settleMainDeckRoot(dealRoot);
        }
        delete dealRoot.dataset.enterRunning;
      })();
    };
    const layoutZeroPoolGroup = (dealRoot, targetSlots) => {
      if (!dealRoot || !deck || !targetSlots.length || !positionRoot) return;
      const deckBox = measureActionDeckLipBox(positionRoot, preview) || measureSlotBoxInLayer(positionRoot, deck, { metric: "lip" });
      if (!deckBox?.width) return;
      [...dealRoot.querySelectorAll(".setup-deal-card--pool")].forEach((card, i) => {
        const slot = targetSlots[i];
        if (!slot) return;
        const slotBox = measureSlotBoxInLayer(positionRoot, slot, { metric: "lip" });
        if (!slotBox?.width) return;
        let landW = slotBox.width;
        let landH = slotBox.height;
        let deckW = deckBox.width;
        let deckH = deckBox.height;
        if (landH > landW) [landW, landH] = [landH, landW];
        if (deckH > deckW) [deckW, deckH] = [deckH, deckW];
        const slotFit = cardFitInLipRect({ x: 0, y: 0, w: landW, h: landH });
        const portraitW = slotFit.unrotated.w;
        const portraitH = slotFit.unrotated.h;
        const fanX = i * 1.2;
        const fanY = i * -0.9;
        const x0 = deckBox.left + (deckW - landW) / 2 + fanX;
        const y0 = deckBox.top + (deckH - landH) / 2 + fanY;
        const x1 = slotBox.left;
        const y1 = slotBox.top;
        const x1Fly = slotBox.left;
        const y1Fly = slotBox.top;
        const seatScale = mainDeckSeatScaleForPortraitInLip(
          { width: landW, height: landH },
          portraitW,
          portraitH
        );
        const { fitRotW, fitRotH } = htmlCardFitVarsForLip({ width: landW, height: landH });
        card.classList.add("is-slot-horizontal");
        card.style.setProperty("--w", `${landW}px`);
        card.style.setProperty("--h", `${landH}px`);
        card.style.setProperty("--w1", `${landW}px`);
        card.style.setProperty("--h1", `${landH}px`);
        card.style.setProperty("--x0", `${x0}px`);
        card.style.setProperty("--y0", `${y0}px`);
        card.style.setProperty("--x1", `${x1}px`);
        card.style.setProperty("--y1", `${y1}px`);
        card.style.setProperty("--x1-fly", `${x1Fly}px`);
        card.style.setProperty("--y1-fly", `${y1Fly}px`);
        card.style.setProperty("--seat-scale", `${seatScale}`);
        card.style.setProperty("--fit-rot-w", `${fitRotW}px`);
        card.style.setProperty("--fit-rot-h", `${fitRotH}px`);
        card.style.zIndex = String(32 + i);
      });
    };
    const runZeroPoolDeal = () => {
      const dealRoot = appEl.querySelector("#setup-deal-zero");
      if (!dealRoot || dealRoot.classList.contains("is-settled-layer")) return;
      const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cards = [...dealRoot.querySelectorAll(".setup-deal-card--pool")].filter(
        (c) => !c.classList.contains("is-settled") && !c.classList.contains("is-dealt")
      );
      cards.forEach((c) => c.classList.add("is-slot-horizontal"));
      layoutZeroPoolGroup(dealRoot, zeroSlots);
      if (reduce) {
        cards.forEach(
          (c) => c.classList.add("is-dealt", "is-flipped", "is-settled")
        );
        dealRoot.classList.add("is-ready", "is-settled-layer", "is-positioned");
        return;
      }
      if (!cards.length) return;
      dealRoot.classList.add("is-ready");
      dealRoot.classList.remove("is-settled-layer", "is-flying", "is-seating");
      (async () => {
        for (let i = 0; i < cards.length; i++) {
          if (bindGen !== _coachBindGen || _setupDeckCoachPhase !== 1) break;
          const card = cards[i];
          layoutZeroPoolGroup(dealRoot, zeroSlots);
          dealRoot.classList.add("is-flying");
          card.classList.add("is-dealt", "is-landing");
          await sleep3(540);
          dealRoot.classList.remove("is-flying");
          card.classList.remove("is-landing");
          card.classList.add("is-flipped");
          await sleep3(480);
          card.classList.add("is-settled");
          await sleep3(80);
        }
        if (bindGen === _coachBindGen && _setupDeckCoachPhase === 1) {
          dealRoot.classList.add("is-settled-layer", "is-positioned");
          dealRoot.classList.remove("is-flying", "is-seating");
        }
      })();
    };
    const layoutDealGroup = (dealRoot, targetSlots) => {
      if (!dealRoot || !deck || !targetSlots.length) return;
      if (dealRoot.id === "setup-deal-zero") {
        layoutZeroPoolGroup(dealRoot, targetSlots);
        return;
      }
      const pr = preview.getBoundingClientRect();
      const dr = deck.getBoundingClientRect();
      if (pr.width < 8 || dr.width < 2) return;
      const isNotchDeal = dealRoot.id === "setup-deal-elixir" || dealRoot.id === "setup-deal-trophy";
      [...dealRoot.querySelectorAll(".setup-deal-card")].forEach((card, i) => {
        const slot = targetSlots[i];
        if (!slot) return;
        const sr = slot.getBoundingClientRect();
        const w = isNotchDeal ? Math.max(24, sr.width) : Math.max(28, sr.width);
        const h = isNotchDeal ? Math.max(22, sr.height) : Math.max(40, sr.height);
        const x0 = dr.left - pr.left + (dr.width - w) / 2;
        const y0 = dr.top - pr.top + (dr.height - h) / 2;
        const x1 = sr.left - pr.left + (sr.width - w) / 2;
        const y1 = sr.top - pr.top + (sr.height - h) / 2;
        card.style.setProperty("--w", `${w}px`);
        card.style.setProperty("--h", `${h}px`);
        card.style.setProperty("--x0", `${x0}px`);
        card.style.setProperty("--y0", `${y0}px`);
        card.style.setProperty("--x1", `${x1}px`);
        card.style.setProperty("--y1", `${y1}px`);
        card.style.zIndex = String(20 - i);
      });
    };
    const runDealGroup = (dealRoot) => {
      if (!dealRoot || dealRoot.classList.contains("is-settled-layer")) return;
      const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cards = [...dealRoot.querySelectorAll(".setup-deal-card")].filter(
        (c) => !c.classList.contains("is-settled") && !c.classList.contains("is-dealt")
      );
      if (reduce) {
        cards.forEach((c) => c.classList.add("is-dealt", "is-flipped"));
        dealRoot.classList.add("is-ready");
        return;
      }
      dealRoot.classList.add("is-ready");
      cards.forEach((card, i) => {
        window.setTimeout(() => card.classList.add("is-dealt"), 80 + i * 160);
        window.setTimeout(() => card.classList.add("is-flipped"), 420 + i * 220);
      });
    };
    const layoutMonsterStacks = () => {
      if (phase < 6 || !deck) return;
      const dealRoot = appEl.querySelector("#setup-deal-monsters");
      if (!dealRoot) return;
      const pr = preview.getBoundingClientRect();
      const dr = deck.getBoundingClientRect();
      if (pr.width < 8 || dr.width < 2) return;
      dealRoot.querySelectorAll(".setup-deal-card--monster").forEach((card, i) => {
        const slot = monsterCardSlots[i];
        if (!slot) return;
        const sr = slot.getBoundingClientRect();
        const w = Math.max(22, sr.width);
        const h = Math.max(36, sr.height);
        card.style.setProperty("--w", `${w}px`);
        card.style.setProperty("--h", `${h}px`);
        card.style.setProperty("--x0", `${dr.left - pr.left + (dr.width - w) / 2}px`);
        card.style.setProperty("--y0", `${dr.top - pr.top + (dr.height - h) / 2}px`);
        card.style.setProperty("--x1", `${sr.left - pr.left}px`);
        card.style.setProperty("--y1", `${sr.top - pr.top}px`);
        card.style.zIndex = String(24 - i);
      });
      dealRoot.querySelectorAll(".setup-monster-token-chip").forEach((chip2, i) => {
        const slot = monsterTokenSlots[i];
        if (!slot) return;
        const sr = slot.getBoundingClientRect();
        const size = Math.max(22, Math.min(sr.width, sr.height) * 1.05);
        chip2.style.setProperty("--s", `${size}px`);
        chip2.style.setProperty(
          "--x0",
          `${dr.left - pr.left + (dr.width - size) / 2}px`
        );
        chip2.style.setProperty(
          "--y0",
          `${dr.top - pr.top + (dr.height - size) / 2}px`
        );
        chip2.style.setProperty(
          "--x1",
          `${sr.left - pr.left + (sr.width - size) / 2}px`
        );
        chip2.style.setProperty(
          "--y1",
          `${sr.top - pr.top + (sr.height - size) / 2}px`
        );
        chip2.style.zIndex = String(26 - i);
      });
    };
    const layoutLocFight = () => {
      if (phase < 7 || !deck) return;
      const dealRoot = appEl.querySelector("#setup-deal-loc-fight");
      if (!dealRoot) return;
      const pr = preview.getBoundingClientRect();
      const dr = deck.getBoundingClientRect();
      if (pr.width < 8 || dr.width < 2) return;
      dealRoot.querySelectorAll(".setup-loc-token-chip").forEach((chip2, i) => {
        const slot = locTokenSlots[i];
        if (!slot) return;
        const sr = slot.getBoundingClientRect();
        const size = Math.max(26, Math.min(sr.width, sr.height) * 1.05);
        chip2.style.setProperty("--s", `${size}px`);
        chip2.style.setProperty("--x0", `${dr.left - pr.left + (dr.width - size) / 2}px`);
        chip2.style.setProperty("--y0", `${dr.top - pr.top + (dr.height - size) / 2}px`);
        chip2.style.setProperty("--x1", `${sr.left - pr.left + (sr.width - size) / 2}px`);
        chip2.style.setProperty("--y1", `${sr.top - pr.top + (sr.height - size) / 2}px`);
        chip2.style.zIndex = String(28 - i);
      });
      const fightCard = dealRoot.querySelector(".setup-deal-card--fight");
      if (fightCard && fightSlot) {
        const sr = fightSlot.getBoundingClientRect();
        const w = Math.max(28, sr.width);
        const h = Math.max(40, sr.height);
        fightCard.style.setProperty("--w", `${w}px`);
        fightCard.style.setProperty("--h", `${h}px`);
        fightCard.style.setProperty("--x0", `${dr.left - pr.left + (dr.width - w) / 2}px`);
        fightCard.style.setProperty("--y0", `${dr.top - pr.top + (dr.height - h) / 2}px`);
        fightCard.style.setProperty("--x1", `${sr.left - pr.left}px`);
        fightCard.style.setProperty("--y1", `${sr.top - pr.top}px`);
        fightCard.style.zIndex = "30";
      }
    };
    const layoutGoldDice = () => {
      if (phase < 8 || !deck) return;
      const dealRoot = appEl.querySelector("#setup-deal-gold-dice");
      if (!dealRoot) return;
      const pr = preview.getBoundingClientRect();
      const dr = deck.getBoundingClientRect();
      if (pr.width < 8 || dr.width < 2) return;
      const goldEls = [...preview.querySelectorAll(".map-gold-coin")];
      dealRoot.querySelectorAll(".setup-gold-chip").forEach((chip2, i) => {
        const slot = goldEls[i] || goldBank;
        if (!slot) return;
        const sr = slot.getBoundingClientRect();
        const size = Math.max(18, Math.min(sr.width, sr.height) * 1.1);
        chip2.style.setProperty("--s", `${size}px`);
        chip2.style.setProperty("--x0", `${dr.left - pr.left + (dr.width - size) / 2}px`);
        chip2.style.setProperty("--y0", `${dr.top - pr.top + (dr.height - size) / 2}px`);
        chip2.style.setProperty("--x1", `${sr.left - pr.left + (sr.width - size) / 2}px`);
        chip2.style.setProperty("--y1", `${sr.top - pr.top + (sr.height - size) / 2}px`);
        chip2.style.zIndex = String(32 - i);
      });
      dealRoot.querySelectorAll(".setup-die-chip").forEach((chip2, i) => {
        const slot = dieSlots[i];
        if (!slot) return;
        const sr = slot.getBoundingClientRect();
        const size = Math.max(20, Math.min(sr.width, sr.height) * 1.05);
        chip2.style.setProperty("--s", `${size}px`);
        chip2.style.setProperty("--x0", `${dr.left - pr.left + (dr.width - size) / 2}px`);
        chip2.style.setProperty("--y0", `${dr.top - pr.top + (dr.height - size) / 2}px`);
        chip2.style.setProperty("--x1", `${sr.left - pr.left + (sr.width - size) / 2}px`);
        chip2.style.setProperty("--y1", `${sr.top - pr.top + (sr.height - size) / 2}px`);
        chip2.style.zIndex = String(36 - i);
      });
    };
    const layoutAreaCards = () => {
      if (phase < 9 || !deck) return;
      const dealRoot = appEl.querySelector("#setup-deal-area-cards");
      if (!dealRoot) return;
      const pr = preview.getBoundingClientRect();
      const dr = deck.getBoundingClientRect();
      if (pr.width < 8 || dr.width < 2) return;
      dealRoot.querySelectorAll(".setup-area-card-chip").forEach((chip2, i) => {
        const slot = cardTokenSlots[i];
        if (!slot) return;
        const sr = slot.getBoundingClientRect();
        const size = Math.max(24, Math.min(sr.width, sr.height) * 1.08);
        chip2.style.setProperty("--s", `${size}px`);
        chip2.style.setProperty("--x0", `${dr.left - pr.left + (dr.width - size) / 2}px`);
        chip2.style.setProperty("--y0", `${dr.top - pr.top + (dr.height - size) / 2}px`);
        chip2.style.setProperty("--x1", `${sr.left - pr.left + (sr.width - size) / 2}px`);
        chip2.style.setProperty("--y1", `${sr.top - pr.top + (sr.height - size) / 2}px`);
        chip2.style.zIndex = String(45 - i);
      });
    };
    const layoutMonsterSpawn = () => {
      if (phase < 10 || !deck) return;
      const dealRoot = appEl.querySelector("#setup-deal-monster-spawn");
      if (!dealRoot) return;
      const pr = preview.getBoundingClientRect();
      const dr = deck.getBoundingClientRect();
      if (pr.width < 8 || dr.width < 2) return;
      dealRoot.querySelectorAll(".setup-deal-card--spawn").forEach((card, i) => {
        const slot = spawnCardSlots[i];
        if (!slot) return;
        const sr = slot.getBoundingClientRect();
        const w = Math.max(20, sr.width * 0.55);
        const h = Math.max(30, sr.height * 0.78);
        const padX = Math.max(2, sr.width * 0.05);
        const padY = (sr.height - h) / 2;
        card.style.setProperty("--w", `${w}px`);
        card.style.setProperty("--h", `${h}px`);
        card.style.setProperty("--x0", `${dr.left - pr.left + (dr.width - w) / 2}px`);
        card.style.setProperty("--y0", `${dr.top - pr.top + (dr.height - h) / 2}px`);
        card.style.setProperty("--x1", `${sr.left - pr.left + padX}px`);
        card.style.setProperty("--y1", `${sr.top - pr.top + padY}px`);
        card.style.zIndex = String(34 - i);
      });
      dealRoot.querySelectorAll(".setup-spawn-token-chip").forEach((chip2, i) => {
        const node = spawnLocNodes[i];
        const fromTok = monsterTokenSlots[i] || deck;
        if (!node || !fromTok) return;
        const disc = node.querySelector(".map-node-disc");
        const nr = (disc || node).getBoundingClientRect();
        const fr = fromTok.getBoundingClientRect();
        const size = Math.max(11, Math.min(nr.width, nr.height) * 0.72);
        chip2.style.setProperty("--s", `${size}px`);
        chip2.style.setProperty("--x0", `${fr.left - pr.left + (fr.width - size) / 2}px`);
        chip2.style.setProperty("--y0", `${fr.top - pr.top + (fr.height - size) / 2}px`);
        chip2.style.setProperty("--x1", `${nr.left - pr.left + (nr.width - size) / 2}px`);
        chip2.style.setProperty("--y1", `${nr.top - pr.top + (nr.height - size) / 2}px`);
        chip2.style.zIndex = String(42 - i);
      });
    };
    const ensureMainDeckVisibleDuringPoolDraw = () => {
      if (phase < 1 || phase > 2 || !_setupMainDeckPlaced) return;
      const dealRoot = appEl.querySelector("#setup-deal-main-deck");
      if (!dealRoot || !preview) return;
      mountMainDeckInForeignObject(preview, dealRoot);
      layoutMainDeck();
      dealRoot.classList.add("is-ready", "is-settled-layer", "is-positioned", "is-idle");
      dealRoot.classList.remove("is-flying", "is-seating", "is-shuffling");
      const cards = [...dealRoot.querySelectorAll(".setup-deal-card--main-deck")];
      cards.forEach((c, i) => {
        c.classList.add("is-dealt", "is-settled", "is-slot-horizontal");
        c.classList.remove("is-landing", "is-seating", "is-seated-visual");
        if (i < cards.length - 1) c.classList.add("is-stack-hidden");
        else c.classList.remove("is-stack-hidden");
      });
    };
    const layoutAll = () => {
      ensureMainDeckVisibleDuringPoolDraw();
      layoutMainDeck();
      if (phase === 0) layoutCoachSideTile();
      layoutDealGroup(appEl.querySelector("#setup-deal-zero"), zeroSlots);
      layoutDealGroup(appEl.querySelector("#setup-deal-rest"), restSlots);
      layoutDealGroup(appEl.querySelector("#setup-deal-explore"), exploreSlots);
      if (elixirSlot) {
        layoutDealGroup(appEl.querySelector("#setup-deal-elixir"), [elixirSlot]);
      }
      if (trophySlot) {
        layoutDealGroup(appEl.querySelector("#setup-deal-trophy"), [trophySlot]);
      }
      layoutMonsterStacks();
      layoutLocFight();
      layoutGoldDice();
      layoutAreaCards();
      layoutMonsterSpawn();
      preview.querySelectorAll(".setup-deal.is-settled-layer").forEach((el) => {
        el.classList.add("is-positioned");
      });
    };
    const runLocFight = () => {
      const dealRoot = appEl.querySelector("#setup-deal-loc-fight");
      if (!dealRoot || dealRoot.classList.contains("is-settled-layer")) return;
      const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      layoutLocFight();
      const chips = [...dealRoot.querySelectorAll(".setup-loc-token-chip")];
      const fightCard = dealRoot.querySelector(".setup-deal-card--fight");
      if (reduce) {
        chips.forEach((c) => c.classList.add("is-dealt"));
        fightCard?.classList.add("is-dealt", "is-flipped");
        dealRoot.classList.add("is-ready");
        return;
      }
      dealRoot.classList.add("is-ready");
      chips.forEach((chip2, i) => {
        window.setTimeout(() => chip2.classList.add("is-dealt"), 60 + i * 120);
      });
      if (fightCard) {
        window.setTimeout(() => fightCard.classList.add("is-dealt"), 220);
        window.setTimeout(() => fightCard.classList.add("is-flipped"), 480);
      }
    };
    const runGoldDice = () => {
      const dealRoot = appEl.querySelector("#setup-deal-gold-dice");
      if (!dealRoot || dealRoot.classList.contains("is-settled-layer")) return;
      const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      layoutGoldDice();
      const golds = [...dealRoot.querySelectorAll(".setup-gold-chip")];
      const dice = [...dealRoot.querySelectorAll(".setup-die-chip")];
      const revealSvg = () => {
        dealRoot.classList.add("is-revealed-svg");
      };
      if (reduce) {
        golds.forEach((c) => c.classList.add("is-dealt"));
        dice.forEach((c) => c.classList.add("is-dealt"));
        dealRoot.classList.add("is-ready");
        revealSvg();
        return;
      }
      dealRoot.classList.add("is-ready");
      dice.forEach((chip2, i) => {
        window.setTimeout(() => chip2.classList.add("is-dealt"), 40 + i * 80);
      });
      golds.forEach((chip2, i) => {
        window.setTimeout(() => chip2.classList.add("is-dealt"), 320 + i * 70);
      });
      window.setTimeout(revealSvg, 920);
    };
    const runMonsterStacks = () => {
      const dealRoot = appEl.querySelector("#setup-deal-monsters");
      if (!dealRoot || dealRoot.classList.contains("is-settled-layer")) return;
      const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      layoutMonsterStacks();
      const cards = [...dealRoot.querySelectorAll(".setup-deal-card--monster")];
      const chips = [...dealRoot.querySelectorAll(".setup-monster-token-chip")];
      if (reduce) {
        cards.forEach((c) => c.classList.add("is-dealt", "is-flipped"));
        chips.forEach((c) => c.classList.add("is-dealt"));
        dealRoot.classList.add("is-ready");
        return;
      }
      dealRoot.classList.add("is-ready");
      cards.forEach((card, i) => {
        window.setTimeout(() => card.classList.add("is-dealt"), 70 + i * 140);
        window.setTimeout(() => card.classList.add("is-flipped"), 320 + i * 160);
      });
      chips.forEach((chip2, i) => {
        window.setTimeout(() => chip2.classList.add("is-dealt"), 180 + i * 160);
      });
    };
    const runAreaCards = () => {
      const dealRoot = appEl.querySelector("#setup-deal-area-cards");
      if (!dealRoot || dealRoot.classList.contains("is-settled-layer")) return;
      const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      layoutAreaCards();
      const chips = [...dealRoot.querySelectorAll(".setup-area-card-chip")];
      if (reduce) {
        chips.forEach((c) => c.classList.add("is-dealt"));
        dealRoot.classList.add("is-ready");
        return;
      }
      dealRoot.classList.add("is-ready");
      chips.forEach((chip2, i) => {
        window.setTimeout(() => chip2.classList.add("is-dealt"), 70 + i * 140);
      });
    };
    const applyDemoMonstersToBoard = () => {
      if (!state.board) state.board = defaultBoard();
      demoMonsterSetupRows().forEach((r) => {
        setMonsterForTerrain(state.board, r.terrain, r.loc.id, { level: r.level });
      });
      saveState();
    };
    const runMonsterSpawn = () => {
      const dealRoot = appEl.querySelector("#setup-deal-monster-spawn");
      if (!dealRoot || dealRoot.classList.contains("is-settled-layer")) return;
      const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      layoutMonsterSpawn();
      const cards = [...dealRoot.querySelectorAll(".setup-deal-card--spawn")];
      const chips = [...dealRoot.querySelectorAll(".setup-spawn-token-chip")];
      if (reduce) {
        cards.forEach((c) => c.classList.add("is-dealt", "is-flipped"));
        chips.forEach((c) => c.classList.add("is-dealt"));
        dealRoot.classList.add("is-ready");
        applyDemoMonstersToBoard();
        return;
      }
      dealRoot.classList.add("is-ready");
      cards.forEach((card, i) => {
        window.setTimeout(() => card.classList.add("is-dealt"), 80 + i * 160);
        window.setTimeout(() => card.classList.add("is-flipped"), 340 + i * 180);
      });
      chips.forEach((chip2, i) => {
        window.setTimeout(() => chip2.classList.add("is-dealt"), 420 + i * 200);
      });
      window.setTimeout(() => applyDemoMonstersToBoard(), 420 + chips.length * 200 + 200);
    };
    const anchor = phase === 10 ? spawnCardSlots[1] || spawnLocNodes[0] || highlight[0] : phase === 9 ? cardTokenSlots[1] || cardTokenSlots[0] || highlight[0] : phase === 8 ? diceTray || goldBank || highlight[0] : phase === 7 ? locTokenSlots[1] || fightSlot || highlight[0] : phase === 6 ? monsterCardSlots[1] || monsterCardSlots[0] || highlight[0] : phase === 5 ? trophySlot || highlight[0] : phase === 4 ? elixirSlot || highlight[0] : phase === 3 ? exploreSlots[1] || exploreSlots[0] : phase >= 1 ? highlight[1] || highlight[0] : highlight[0];
    const syncCoachLayout = (run) => {
      if (bindGen !== _coachBindGen) return;
      layoutAll();
      placeBubble(anchor);
      run?.();
    };
    const afterLayout = (run) => {
      requestAnimationFrame(() => syncCoachLayout(run));
      window.setTimeout(() => syncCoachLayout(), 440);
    };
    if (phase === 1) {
      afterLayout(() => runZeroPoolDeal());
    } else if (phase === 2) {
      afterLayout(() => runDealGroup(appEl.querySelector("#setup-deal-rest")));
    } else if (phase === 3) {
      afterLayout(() => runDealGroup(appEl.querySelector("#setup-deal-explore")));
    } else if (phase === 4) {
      afterLayout(() => runDealGroup(appEl.querySelector("#setup-deal-elixir")));
    } else if (phase === 5) {
      afterLayout(() => runDealGroup(appEl.querySelector("#setup-deal-trophy")));
    } else if (phase === 6) {
      afterLayout(() => runMonsterStacks());
    } else if (phase === 7) {
      afterLayout(() => runLocFight());
    } else if (phase === 8) {
      afterLayout(() => runGoldDice());
    } else if (phase === 9) {
      afterLayout(() => runAreaCards());
    } else if (phase === 10) {
      afterLayout(() => runMonsterSpawn());
    } else if (phase > 1) {
      afterLayout();
    } else if (phase === 0) {
      afterLayout(() => runMainDeckEnter());
    } else {
      requestAnimationFrame(() => syncCoachLayout());
    }
    let resizeRaf = 0;
    window.addEventListener(
      "resize",
      () => {
        if (resizeRaf) return;
        resizeRaf = requestAnimationFrame(() => {
          resizeRaf = 0;
          if (bindGen !== _coachBindGen) return;
          placeBubble(anchor);
          layoutAll();
        });
      },
      { passive: true, signal: _coachResizeAbort.signal }
    );
  }
  function escapeHtml4(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function turnShell(title, body) {
    const tabs = [
      ["hub", `${ICO.trophy()} Start`],
      ["I", `${ICO.phase1()}${ICO.move()} Faza I`],
      ["II", `${ICO.phase2()}${ICO.monster()} Faza II`],
      ["III", `${ICO.phase3()}${ICO.cardBlue()} Faza III`]
    ];
    const active = state.turn.phase;
    const p = activePlayer();
    const school = schoolById3(p.schoolId);
    shell(`
    <section class="panel">
      <div class="badge-row">
        <span class="player-chip">${schoolIcon(p.schoolId)}${escapeHtml4(p.name)} <span>${school.name}</span></span>
        ${isSolo() ? `<span class="badge">Tura ${state.turnNumber || 1}</span>` : ""}
      </div>
      ${soloTurnBadgeHtml()}
      <div class="phase-tabs">
        ${tabs.map(
      ([id, label]) => `<button class="phase-tab ${active === id ? "active" : ""}" data-phase="${id}">${label}</button>`
    ).join("")}
      </div>
      <p class="step-kicker">Przewodnik tury${isSolo() ? " \xB7 solo" : ""}</p>
      <h1>${title}</h1>
      <div class="step-body">${body}</div>
      <div class="actions" id="turn-actions"></div>
    </section>
  `);
    bindSoloTurnCounter();
    appEl.querySelectorAll("[data-phase]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-phase");
        if (id === "hub") setTurn("hub", "hub");
        else if (id === "I") setTurn("I", "phase1-start");
        else if (id === "II") setTurn("II", "phase2");
        else if (id === "III") setTurn("III", "phase3");
      });
    });
  }
  function setTurn(phase, screen, extra = {}) {
    let moveTo = extra.moveTo !== void 0 ? extra.moveTo : state.turn?.moveTo || null;
    let moveCost = extra.moveCost !== void 0 ? extra.moveCost : state.turn?.moveCost || null;
    let exploreDeck = extra.exploreDeck !== void 0 ? extra.exploreDeck : state.turn?.exploreDeck || null;
    let fightResult = extra.fightResult !== void 0 ? extra.fightResult : state.turn?.fightResult || null;
    if (extra.clearMove) {
      moveTo = null;
      moveCost = null;
    }
    if (extra.clearExplore) exploreDeck = null;
    if (extra.clearFightResult) fightResult = null;
    state.turn = { phase, screen, moveTo, moveCost, exploreDeck, fightResult };
    const p = activePlayer();
    if (p) {
      if (phase === "I") p.nowDoing = "faza1";
      else if (screen === "fight" || screen === "fight-monster" || screen === "fight-monster-result" || screen === "fight-witcher")
        p.nowDoing = "walka";
      else if (screen === "meditate") p.nowDoing = "medytacja";
      else if (screen === "explore") p.nowDoing = "eksploracja";
      else if (phase === "III") p.nowDoing = "faza3";
      else if (phase === "hub") p.nowDoing = "czekam";
    }
    saveState();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function nextPlayer() {
    if (isSolo()) {
      state.activeIndex = 0;
      state.turnNumber = Math.min(999, (state.turnNumber || 1) + 1);
    } else {
      const next = (state.activeIndex + 1) % state.players;
      if (next === 0) state.turnNumber = Math.min(999, (state.turnNumber || 1) + 1);
      state.activeIndex = next;
    }
    setTurn("hub", "hub");
  }
  function soloTurnBadgeHtml() {
    if (!isSolo()) return "";
    const n = state.turnNumber || 1;
    return `
    <div class="solo-turn-counter" role="status" aria-live="polite">
      <span class="solo-turn-label">Tura</span>
      <strong class="solo-turn-num">${n}</strong>
      <span class="solo-turn-actions">
        <button type="button" class="btn btn-secondary" data-turn-delta="-1" title="Cofnij tur\u0119" ${n <= 1 ? "disabled" : ""}>\u2212</button>
        <button type="button" class="btn btn-secondary" data-turn-delta="1" title="Dodaj tur\u0119">+</button>
      </span>
    </div>`;
  }
  function bindSoloTurnCounter() {
    appEl.querySelectorAll("[data-turn-delta]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const delta = Number(btn.getAttribute("data-turn-delta"));
        state.turnNumber = Math.max(1, Math.min(999, (state.turnNumber || 1) + delta));
        saveState();
        render();
      });
    });
  }
  function setupMonstersStepActive() {
    if (state.view !== "setup") return false;
    const steps = buildSetupSteps(state.players, state.roster);
    const index = Math.min(state.setupIndex, steps.length - 1);
    return steps[index]?.id === "monsters";
  }
  function refreshSetupMonstersDom() {
    if (!setupMonstersStepActive()) {
      render();
      return;
    }
    const embed = appEl.querySelector(".setup-map-embed");
    const panelWrap = appEl.querySelector(".setup-monsters-panel-wrap");
    if (!embed || !panelWrap) {
      render();
      return;
    }
    const stage = embed.querySelector(".map-stage");
    if (stage) {
      stage.outerHTML = mapSvgHtml(state.board, state.roster, { schoolById: schoolById3 });
    } else {
      render();
      return;
    }
    panelWrap.innerHTML = monstersPanelHtml(state.board);
    bindSetupMonsterMapClicks();
    bindMonsterPanelControls();
  }
  function afterMonsterBoardChange() {
    saveState();
    if (setupMonstersStepActive()) refreshSetupMonstersDom();
    else render();
  }
  function bindSetupMonsterMapClicks() {
    const root = appEl.querySelector(".setup-monsters-grid");
    if (!root) return;
    root.querySelectorAll(".map-node").forEach((g) => {
      g.addEventListener("click", () => {
        state.board.selectedLoc = g.getAttribute("data-loc");
        state.board.placeError = null;
        afterMonsterBoardChange();
      });
    });
  }
  function bindMonsterPanelControls() {
    appEl.querySelectorAll("[data-monster-cycle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const terrain = btn.getAttribute("data-monster-cycle");
        const delta = Number(btn.getAttribute("data-delta") || 1);
        const result = cycleMonsterTerrain(state.board, terrain, delta);
        if (!result.ok) state.board.placeError = result.reason;
        else state.board.placeError = null;
        afterMonsterBoardChange();
      });
    });
    appEl.querySelectorAll("[data-monster-num]").forEach((input) => {
      const apply = () => {
        const terrain = input.getAttribute("data-monster-num");
        const raw = String(input.value || "").trim();
        if (raw === "") {
          const result2 = setMonsterForTerrain(state.board, terrain, null);
          if (!result2.ok) state.board.placeError = result2.reason;
          else state.board.placeError = null;
          afterMonsterBoardChange();
          return;
        }
        const result = setMonsterTerrainByNumber(state.board, terrain, raw);
        if (!result.ok) state.board.placeError = result.reason;
        else state.board.placeError = null;
        afterMonsterBoardChange();
      };
      input.addEventListener("change", apply);
      input.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          apply();
        }
      });
    });
    appEl.querySelectorAll("[data-monster-terrain-level]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const terrain = btn.getAttribute("data-monster-terrain-level");
        const level = btn.getAttribute("data-level") || "I";
        const result = setMonsterTerrainLevel(state.board, terrain, level);
        if (!result.ok) state.board.placeError = result.reason;
        else state.board.placeError = null;
        afterMonsterBoardChange();
      });
    });
    appEl.querySelectorAll("[data-monster-terrain-clear]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const terrain = btn.getAttribute("data-monster-terrain-clear");
        setMonsterForTerrain(state.board, terrain, null);
        state.board.placeError = null;
        afterMonsterBoardChange();
      });
    });
  }
  function bindChoices() {
    appEl.querySelectorAll(".choice[data-goto]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled || btn.classList.contains("choice-disabled")) return;
        const goto = btn.getAttribute("data-goto");
        if (goto === "phase2") {
          state.board.highlightFrom = null;
          setTurn("II", "phase2", { clearMove: true });
        } else if (goto === "move") {
          const ap = activePlayer();
          if (ap && !ap.locationId) placeAtSchool(ap, { force: true });
          state.board.highlightFrom = ap?.locationId || null;
          setTurn("I", "move-pick", { clearMove: true });
        } else if (goto === "fight") setTurn("II", "fight");
        else if (goto === "meditate") setTurn("II", "meditate");
        else if (goto === "explore") setTurn("II", "explore");
        else if (goto === "fight-monster") setTurn("II", "fight-monster");
        else if (goto === "fight-witcher") setTurn("II", "fight-witcher");
        else if (goto === "phase3") setTurn("III", "phase3");
      });
    });
  }
  function fightOptionsFor(player) {
    return phase2FightOptions(player, {
      board: state.board,
      roster: state.roster,
      isSolo: isSolo()
    });
  }
  function bindMoveCostTurn() {
    appEl.querySelectorAll("[data-move-cost]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const costId = btn.getAttribute("data-move-cost");
        const p = activePlayer();
        const toId = state.turn.moveTo;
        if (!p || !toId) return;
        const result = applyMoveCost(p, costId);
        if (!result.ok) {
          window.alert(result.reason);
          return;
        }
        p.locationId = toId;
        state.board.selectedLoc = toId;
        state.board.movePrompt = null;
        state.board.highlightFrom = null;
        finishMoveTo(p, toId, costId);
      });
    });
  }
  function finishMoveTo(p, toId, costId) {
    p.nowDoing = "faza1";
    setTurn("I", "field-confirm", { moveTo: toId, moveCost: costId });
  }
  function proceedAfterFieldConfirm(p) {
    p.nowDoing = "faza1";
    setTurn("I", "after-move", { moveTo: p.locationId, moveCost: state.turn?.moveCost || null });
  }
  function bindResourceAdjust(player) {
    appEl.querySelectorAll("[data-adj]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const field = btn.getAttribute("data-adj");
        const delta = Number(btn.getAttribute("data-delta"));
        if (!player || !field) return;
        if (field === "cards") player.cards = Math.max(0, Math.min(20, (player.cards || 0) + delta));
        if (field === "gold") player.gold = Math.max(0, Math.min(99, (player.gold || 0) + delta));
        if (field === "elixirs") player.elixirs = Math.max(0, Math.min(4, (player.elixirs || 0) + delta));
        saveState();
        render();
      });
    });
  }
  function bindAttrAdjust(player) {
    ensureCombatTrack(player);
    appEl.querySelectorAll("[data-attr]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-attr");
        const delta = Number(btn.getAttribute("data-delta"));
        if (!key || !player.attrs) return;
        player.attrs[key] = Math.max(1, Math.min(5, (player.attrs[key] || 1) + delta));
        if (key === "defense" && (player.shield || 0) > player.attrs.defense) {
          player.shield = player.attrs.defense;
        }
        saveState();
        render();
      });
    });
    appEl.querySelectorAll("[data-shield-delta]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const delta = Number(btn.getAttribute("data-shield-delta"));
        const max = player.attrs?.defense || 1;
        player.shield = Math.max(0, Math.min(max, (player.shield || 0) + delta));
        saveState();
        render();
      });
    });
  }
  function bindTrailForms(player) {
    ensureCombatTrack(player);
    appEl.querySelectorAll("[data-trail-monster]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const terrain = btn.getAttribute("data-trail-monster");
        const locId = btn.getAttribute("data-loc");
        const kind = btn.getAttribute("data-kind") || "trail";
        if (!terrain) return;
        if (kind === "clear") {
          player.trails[terrain] = null;
          saveState();
          render();
          return;
        }
        if (!locId || !locById(locId)) return;
        player.trails[terrain] = { kind: "trail", locId, goldOnToken: 0 };
        saveState();
        render();
      });
    });
  }
  function bindFieldChangeModal(player) {
    const btn = appEl.querySelector("#field-modal-confirm");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const checks = [...appEl.querySelectorAll("[data-field-action]:checked")];
      const ordered = checks.map((el) => el.getAttribute("data-field-action")).filter(Boolean).sort((a, b) => (a === "level:up") - (b === "level:up"));
      for (const id of ordered) {
        const res = applyFieldChange(player, id);
        if (!res.ok) {
          window.alert(res.reason || "Nie uda\u0142o si\u0119 zastosowa\u0107 zmiany.");
          return;
        }
      }
      saveState();
      proceedAfterFieldConfirm(player);
    });
  }
  function bindQuestForms(player) {
    const addBtn = appEl.querySelector("#quest-add-btn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        ensureQuests(player);
        const title = (appEl.querySelector("#quest-title")?.value || "").trim() || "Zadanie";
        const locationId = appEl.querySelector("#quest-loc")?.value;
        const eventCard = (appEl.querySelector("#quest-event")?.value || "").trim();
        const note = (appEl.querySelector("#quest-note")?.value || "").trim();
        if (!locationId || !locById(locationId)) {
          window.alert("Wybierz lokacj\u0119 zadania.");
          return;
        }
        player.quests.push({
          id: newQuestId(),
          title: title.replace(/[<>]/g, ""),
          locationId,
          eventCard: eventCard.replace(/[<>]/g, ""),
          note: note.replace(/[<>]/g, "")
        });
        saveState();
        render();
      });
    }
    appEl.querySelectorAll("[data-quest-done]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-quest-done");
        ensureQuests(player);
        player.quests = player.quests.filter((q) => q.id !== id);
        saveState();
        render();
      });
    });
  }
  function addTurnButtons(buttons) {
    const wrap = appEl.querySelector("#turn-actions");
    if (!wrap) return;
    wrap.innerHTML = buttons.map(
      (b) => `<button class="btn ${b.primary ? "btn-primary" : "btn-secondary"}" data-act="${b.id}">${b.label}</button>`
    ).join("");
    wrap.querySelectorAll("[data-act]").forEach((btn) => {
      const conf = buttons.find((b) => b.id === btn.getAttribute("data-act"));
      if (conf) btn.addEventListener("click", conf.onClick);
    });
  }
  function renderTurn() {
    const { screen } = state.turn;
    const solo = isSolo();
    const p = activePlayer();
    if (screen === "hub") {
      const picker = solo ? "" : `<h3>Aktywny gracz</h3>
         <div class="choice-grid">
           ${state.roster.map(
        (r, i) => `
             <button class="choice ${i === state.activeIndex ? "active" : ""}" data-active="${i}">
               <strong>${escapeHtml4(r.name)}</strong>
               <span>${schoolById3(r.schoolId).name}${i === 0 ? " \xB7 pierwszy" : ""}</span>
             </button>`
      ).join("")}
         </div>`;
      turnShell(
        solo ? `Twoja tura \xB7 nr ${state.turnNumber || 1}` : `Tura: ${escapeHtml4(p.name)}`,
        `
        ${picker}
        <p class="lead">${solo ? "Fazy I \u2192 II \u2192 III. Licznik tur liczy si\u0119 automatycznie (po \u201EKoniec tury\u201D). Start: 5 kart, 3 z\u0142ota." : "Aktywny rozgrywa I \u2192 II \u2192 III. Kolejno\u015B\u0107 zgodnie z zegarem (pierwszy = index 0 w sk\u0142adzie)."}</p>
        ${solo ? "" : `<h3>Startowe zasoby (przypomnienie)</h3>${resourcesTable(state.players)}`}
      `
      );
      if (!solo) {
        appEl.querySelectorAll("[data-active]").forEach((btn) => {
          btn.addEventListener("click", () => {
            state.activeIndex = Number(btn.dataset.active);
            saveState();
            render();
          });
        });
      }
      addTurnButtons([
        {
          id: "go-i",
          label: `Zaczynam faz\u0119 I (${escapeHtml4(p.name)})`,
          primary: true,
          onClick: () => {
            p.nowDoing = "faza1";
            saveState();
            setTurn("I", "phase1-start");
          }
        },
        {
          id: "to-board",
          label: "St\xF3\u0142 \u2014 mapa / reputacja / karty",
          onClick: () => go("board")
        }
      ]);
      return;
    }
    if (screen === "phase1-start") {
      turnShell(
        "Faza I \u2014 start",
        `
        <p class="lead"><strong>${escapeHtml4(p.name)}</strong>: <em>obowi\u0105zkowy ruch</em> albo od razu faza II. Nie zaczynasz akcj\u0105 na polu, na kt\xF3rym ju\u017C stoisz.</p>
        <div class="choice-grid">
          <button class="choice" data-goto="move"><strong>Ruszam si\u0119</strong><span>Mapa \u2014 kliknij s\u0105siada</span></button>
          <button class="choice" data-goto="phase2"><strong>Id\u0119 do fazy II</strong><span>Bez ruchu</span></button>
        </div>
      `
      );
      bindChoices();
      return;
    }
    if (screen === "move-pick") {
      if (!p.locationId) {
        placeAtSchool(p, { force: true });
        p._prevSchoolId = p.schoolId;
      }
      const fromId = p.locationId;
      state.board.highlightFrom = fromId;
      if (!state.turn.moveTo) state.board.selectedLoc = fromId;
      const destOk = state.turn.moveTo && neighborsOf(fromId).includes(state.turn.moveTo);
      if (destOk) state.board.selectedLoc = state.turn.moveTo;
      const popupInner = destOk ? mapLocPopupHtml(state.turn.moveTo, {
        player: p,
        roster: state.roster,
        monsters: state.board.monsters
      }) : null;
      turnShell(
        "Faza I \u2014 ruch na mapie",
        `
        <p class="lead"><strong>${escapeHtml4(p.name)}</strong> \xB7 kliknij s\u0105siada (z\u0142ota obw\xF3dka). Opis wyskoczy nad map\u0105 \u2014 bez prze\u0142adowania strony.</p>
        ${mapSvgHtml(state.board, state.roster, {
          schoolById: schoolById3,
          highlightFromId: fromId,
          popupHtml: popupInner
        })}
        <div id="move-pick-footer">
          ${destOk ? `<p class="tip" style="margin:0.55rem 0 0">Wybrano: <strong>${escapeHtml4(
          locById(state.turn.moveTo)?.name || "?"
        )}</strong></p>
                 <div class="actions"><button type="button" class="btn btn-primary" id="confirm-dest">Id\u0119 tutaj \u2014 wyb\xF3r kosztu</button></div>` : `<p class="tip">Kliknij <strong>pod\u015Bwietlone</strong> pole \u2014 kr\xF3tki opis pojawi si\u0119 nad map\u0105 (3 s / klik poza).</p>`}
        </div>
      `
      );
      if (destOk) bindMapLocPopup(appEl);
      const updateMovePickSelection = (toId) => {
        if (!neighborsOf(fromId).includes(toId)) return;
        state.board.selectedLoc = toId;
        state.turn = {
          ...state.turn || {},
          phase: "I",
          screen: "move-pick",
          moveTo: toId,
          moveCost: null,
          exploreDeck: state.turn?.exploreDeck || null
        };
        saveState();
        appEl.querySelectorAll(".map-node").forEach((g) => {
          g.classList.toggle("map-node-selected", g.getAttribute("data-loc") === toId);
        });
        const stage = appEl.querySelector(".map-stage");
        if (stage) {
          stage.classList.add("map-stage--has-popup");
          let popup = stage.querySelector("#map-loc-popup");
          if (!popup) {
            popup = document.createElement("div");
            popup.id = "map-loc-popup";
            popup.className = "map-loc-popup";
            popup.setAttribute("role", "dialog");
            popup.setAttribute("aria-live", "polite");
            stage.appendChild(popup);
          }
          popup.classList.remove("map-loc-popup--gone");
          popup.innerHTML = mapLocPopupHtml(toId, {
            player: p,
            roster: state.roster,
            monsters: state.board.monsters
          });
          bindMapLocPopup(appEl);
        }
        const footer = appEl.querySelector("#move-pick-footer");
        if (footer) {
          const name = locById(toId)?.name || "?";
          footer.innerHTML = `
          <p class="tip" style="margin:0.55rem 0 0">Wybrano: <strong>${escapeHtml4(name)}</strong></p>
          <div class="actions"><button type="button" class="btn btn-primary" id="confirm-dest">Id\u0119 tutaj \u2014 wyb\xF3r kosztu</button></div>`;
          footer.querySelector("#confirm-dest")?.addEventListener("click", () => {
            if (!state.turn.moveTo) return;
            setTurn("I", "move-cost", { moveTo: state.turn.moveTo, moveCost: null });
          });
        }
      };
      appEl.querySelectorAll(".map-node-reach").forEach((g) => {
        g.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const toId = g.getAttribute("data-loc");
          if (toId) updateMovePickSelection(toId);
        });
      });
      appEl.querySelector("#confirm-dest")?.addEventListener("click", () => {
        if (!state.turn.moveTo) return;
        setTurn("I", "move-cost", { moveTo: state.turn.moveTo, moveCost: null });
      });
      addTurnButtons([
        {
          id: "back",
          label: "Wr\xF3\u0107",
          onClick: () => {
            state.board.highlightFrom = null;
            setTurn("I", "phase1-start", { clearMove: true });
          }
        }
      ]);
      return;
    }
    if (screen === "move-cost") {
      const to = locById(state.turn.moveTo);
      const from = locById(p.locationId);
      if (!to) {
        setTurn("I", "move-pick", { clearMove: true });
        return;
      }
      turnShell(
        "Faza I \u2014 koszt ruchu",
        `
        ${destinationPreviewHtml(to.id, {
          player: p,
          roster: state.roster,
          monsters: state.board.monsters
        })}
        ${moveCostChooserHtml({
          fromLoc: from,
          toLoc: to,
          playerName: p.name,
          selectedCostId: state.turn.moveCost
        })}
        <p class="tip">Tracker: <strong>${p.cards ?? 0}</strong> kart \xB7 <strong>${p.gold ?? 0}</strong> z\u0142ota \u2014 po wyborze odejmiemy koszt.</p>
      `
      );
      bindMoveCostTurn();
      addTurnButtons([
        { id: "back", label: "Inny cel", onClick: () => setTurn("I", "move-pick", { clearMove: true }) }
      ]);
      return;
    }
    if (screen === "field-confirm") {
      const here = locById(p.locationId) || locById(state.turn.moveTo);
      if (!here) {
        setTurn("I", "move-pick", { clearMove: true });
        return;
      }
      ensureCombatTrack(p);
      turnShell(
        "Faza I \u2014 zmiany na planszetce",
        `
        ${questArrivalHtml(p, here.id)}
        <p class="lead">Wesz\u0142e\u015B na <strong>${escapeHtml4(here.name)}</strong>. Potwierd\u017A, co zmieniasz (atrybuty / z\u0142oto / eliksir / poziom).</p>
        ${fieldChangeModalHtml(p, here)}
      `
      );
      bindQuestForms(p);
      bindFieldChangeModal(p);
      return;
    }
    if (screen === "after-move") {
      const here = locById(p.locationId);
      const mon = monsterAt(state.board, p.locationId);
      turnShell(
        "Faza I \u2014 po ruchu",
        `
        ${questArrivalHtml(p, p.locationId)}
        ${mon && here ? monsterEncounterHtml(here, mon) : ""}
        <p class="lead">Jeste\u015B na <strong>${here ? escapeHtml4(here.name) : "\u2014"}</strong>. Mo\u017Cesz zrobi\u0107 akcje obszaru, rozwi\u0105za\u0107 zadanie, ruszy\u0107 si\u0119 znowu albo przej\u015B\u0107 do fazy II.</p>
        ${locationActionGuideHtml(here)}
        ${phase1AfterMove(solo)}
        <div class="choice-grid">
          <button class="choice" data-goto="move"><strong>Ruszam si\u0119 znowu</strong><span>Znowu wyb\xF3r celu + koszt kart</span></button>
          <button class="choice" data-goto="phase2"><strong>Przechodz\u0119 do fazy II</strong><span>Walka / medytacja / eksploracja \u2014 wyb\xF3r 1</span></button>
        </div>
        <details style="margin-top:1rem"><summary><strong>\u015Aci\u0105ga wszystkich akcji obszar\xF3w</strong></summary>${LOCATION_ACTIONS}</details>
      `
      );
      bindChoices();
      bindQuestForms(p);
      return;
    }
    if (screen === "phase2") {
      ensureCombatTrack(p);
      const med = meditationStatus(p, { isSolo: solo });
      const fight = fightOptionsFor(p);
      if (!fight.can && !med.can) {
        p.nowDoing = "eksploracja";
        saveState();
        setTurn("II", "explore");
        return;
      }
      turnShell(
        "Faza II \u2014 wyb\xF3r",
        `
        ${med.can ? `<p class="tip choice-meditate-ready" style="padding:0.7rem 0.9rem"><strong>Medytacja dost\u0119pna!</strong> ${escapeHtml4(med.reason)}</p>` : `<p class="note">${escapeHtml4(med.reason)}</p>`}
        ${fight.can ? `<p class="tip" style="padding:0.55rem 0.9rem">${escapeHtml4(fight.reason)}</p>` : `<p class="note">${escapeHtml4(fight.reason)}</p>`}
        ${phase2Choices(solo, {
          meditateEnabled: med.can,
          meditateHint: med.reason,
          fightEnabled: fight.can,
          fightHint: fight.can ? solo ? "Na Twoim obszarze" : "Z potworem lub wied\u017Aminem" : fight.reason
        })}
      `
      );
      bindChoices();
      return;
    }
    if (screen === "fight") {
      const fight = fightOptionsFor(p);
      if (!fight.can) {
        setTurn("II", "phase2");
        return;
      }
      if (solo) {
        setTurn("II", fight.canMonster ? "fight-monster" : "phase2");
        return;
      }
      if (fight.canMonster && !fight.canWitcher) {
        setTurn("II", "fight-monster");
        return;
      }
      if (!fight.canMonster && fight.canWitcher) {
        setTurn("II", "fight-witcher");
        return;
      }
      turnShell(
        "Walka \u2014 typ",
        fightBranchHtml({
          monsterEnabled: fight.canMonster,
          witcherEnabled: fight.canWitcher,
          hint: fight.reason
        })
      );
      bindChoices();
      addTurnButtons([
        { id: "back", label: "Wr\xF3\u0107", onClick: () => setTurn("II", "phase2") }
      ]);
      return;
    }
    if (screen === "fight-monster") {
      const here = locById(p.locationId);
      const mon = monsterAt(state.board, p.locationId);
      if (!here || !mon) {
        if (state.turn?.fightResult) {
          setTurn("II", "fight-monster-result");
          return;
        }
        setTurn("III", "phase3", { clearFightResult: true });
        return;
      }
      ensureCombatTrack(p);
      const hasTrail = hasTrailForMonster(p, here);
      turnShell(
        "Walka z potworem \u2014 co teraz?",
        `
        ${monsterEncounterHtml(here, mon)}
        ${questArrivalHtml(p, p.locationId)}
        <p class="${hasTrail ? "tip" : "warn"}"><strong>\u017Beton tropu:</strong> ${hasTrail ? `Masz trop terenu tego pola (${here?.terrain || "?"}) \u2192 <strong>Ty zaczynasz</strong> walk\u0119.` : `Brak tropu na ten teren \u2192 <strong>najpierw tura potwora</strong>.`}</p>
        ${attrsAdjustHtml(p)}
        ${trailsHtml(p, { editable: true, board: state.board })}
        ${resourceAdjustHtml(p, { title: "Karty / z\u0142oto / eliksiry w walce" })}
        ${fightMonster(solo)}
        <div class="guide-box" style="margin-top:0.85rem">
          <p class="step-kicker" style="margin:0">Wynik walki</p>
          <p class="lead" style="margin:0.35rem 0 0">Faza II = <strong>1 wyb\xF3r</strong> (walka <em>albo</em> medytacja <em>albo</em> eksploracja). Po walce idziesz do <strong>fazy III</strong> \u2014 nie eksplorujesz w tej samej turze.</p>
          <div class="choice-grid" style="margin-top:0.65rem">
            <button type="button" class="choice" data-fight-outcome="defeat"><strong>Pokonany</strong><span>Talia potwora = 0</span></button>
            <button type="button" class="choice" data-fight-outcome="drive"><strong>Odp\u0119dzony</strong><span>Ty pad\u0142e\u015B, u potwora &lt; 2 kart</span></button>
            <button type="button" class="choice" data-fight-outcome="loss"><strong>Kl\u0119ska</strong><span>Ty pad\u0142e\u015B, u potwora \u2265 2 kart</span></button>
          </div>
        </div>
      `
      );
      bindQuestForms(p);
      bindResourceAdjust(p);
      bindAttrAdjust(p);
      bindTrailForms(p);
      appEl.querySelectorAll("[data-fight-outcome]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const kind = btn.getAttribute("data-fight-outcome");
          const plan = monsterFightOutcomePlan({
            kind,
            isSolo: solo,
            loc: here,
            monster: mon
          });
          if (plan.removeMonster && p.locationId) {
            delete state.board.monsters[p.locationId];
          }
          state.board.placeError = null;
          setTurn("II", "fight-monster-result", { fightResult: plan });
        });
      });
      addTurnButtons([
        { id: "back", label: "Wr\xF3\u0107", onClick: () => setTurn("II", solo ? "phase2" : "fight") }
      ]);
      return;
    }
    if (screen === "fight-monster-result") {
      const plan = state.turn?.fightResult;
      if (!plan) {
        setTurn("III", "phase3");
        return;
      }
      if (plan.needsSpawn && plan.terrain && plan.spawnLevel) {
        const cur = state.board.monsters ? Object.entries(state.board.monsters).find(([id, m]) => {
          if (!m || !(m.count > 0)) return false;
          const loc = locById(id);
          return loc?.terrain === plan.terrain;
        }) : null;
        if (cur) {
          const [id] = cur;
          state.board.monsters[id] = {
            count: 1,
            level: normalizeMonsterLevel(plan.spawnLevel),
            label: `Poz. ${normalizeMonsterLevel(plan.spawnLevel)}`
          };
        }
      }
      const spawnReady = !plan.needsSpawn || Boolean(
        plan.terrain && Object.entries(state.board.monsters || {}).some(([id, m]) => {
          if (!m || !(m.count > 0)) return false;
          return locById(id)?.terrain === plan.terrain;
        })
      );
      turnShell(
        `Po walce \u2014 ${plan.title}`,
        `
        <div class="guide-box">
          <p class="lead" style="margin:0">${plan.summary}</p>
          ${plan.spawnHint ? `<p class="tip" style="margin:0.55rem 0 0">${plan.spawnHint}</p>` : ""}
          <p class="note" style="margin:0.55rem 0 0">Dalej: <strong>faza III</strong> (dob\xF3r / kupno). Eksploracja to osobny wyb\xF3r fazy II \u2014 nie robisz jej po walce w tej turze.</p>
        </div>
        ${plan.needsSpawn && plan.terrain ? monsterSpawnSlotHtml(state.board, {
          terrain: plan.terrain,
          level: plan.spawnLevel
        }) : ""}
        ${plan.needsSpawn && !spawnReady ? `<p class="warn" style="margin-top:0.6rem">Ustaw numer obszaru strza\u0142kami (teren \u201E${escapeHtml4(
          plan.terrainLabel || ""
        )}\u201D), potem przejd\u017A do fazy III.</p>` : ""}
      `
      );
      if (plan.needsSpawn) {
        appEl.querySelectorAll("[data-monster-cycle]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const terrain = btn.getAttribute("data-monster-cycle");
            const delta = Number(btn.getAttribute("data-delta") || 1);
            const result = cycleMonsterTerrain(state.board, terrain, delta);
            if (result.ok && plan.spawnLevel) {
              setMonsterTerrainLevel(state.board, terrain, normalizeMonsterLevel(plan.spawnLevel));
            }
            if (!result.ok) state.board.placeError = result.reason;
            saveState();
            render();
          });
        });
        appEl.querySelectorAll("[data-monster-num]").forEach((input) => {
          const apply = () => {
            const terrain = input.getAttribute("data-monster-num");
            const raw = String(input.value || "").trim();
            if (raw === "") return;
            const result = setMonsterTerrainByNumber(state.board, terrain, raw, {
              level: normalizeMonsterLevel(plan.spawnLevel)
            });
            if (!result.ok) state.board.placeError = result.reason;
            saveState();
            render();
          };
          input.addEventListener("change", apply);
          input.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter") {
              ev.preventDefault();
              apply();
            }
          });
        });
      }
      addTurnButtons([
        {
          id: "to3",
          label: spawnReady ? "Dalej \u2192 faza III" : "Pomi\u0144 spawn \u2192 faza III",
          primary: true,
          onClick: () => {
            p.nowDoing = "faza3";
            setTurn("III", "phase3", { clearFightResult: true });
          }
        }
      ]);
      return;
    }
    if (screen === "fight-witcher") {
      const fight = fightOptionsFor(p);
      if (!fight.canWitcher) {
        setTurn("II", "phase2");
        return;
      }
      ensureCombatTrack(p);
      turnShell(
        "Walka z wied\u017Aminem",
        `
        ${attrsAdjustHtml(p)}
        ${resourceAdjustHtml(p, { title: "Karty / z\u0142oto" })}
        ${FIGHT_WITCHER}
      `
      );
      bindResourceAdjust(p);
      bindAttrAdjust(p);
      addTurnButtons([
        { id: "to3", label: "Koniec walki \u2192 faza III", primary: true, onClick: () => setTurn("III", "phase3") },
        { id: "back", label: "Wr\xF3\u0107", onClick: () => setTurn("II", "fight") }
      ]);
      return;
    }
    if (screen === "meditate") {
      ensureCombatTrack(p);
      const med = meditationStatus(p, { isSolo: solo });
      if (!med.can) {
        turnShell(
          "Medytacja \u2014 niedost\u0119pna",
          `
          <p class="warn">${escapeHtml4(med.reason)}</p>
          ${meditate(solo)}
          ${attrsAdjustHtml(p)}
          <p class="note">${escapeHtml4(med.soloNote)}</p>
        `
        );
        bindAttrAdjust(p);
        addTurnButtons([{ id: "back", label: "Wr\xF3\u0107", onClick: () => setTurn("II", "phase2") }]);
        return;
      }
      turnShell(
        "Medytacja",
        `
        <p class="tip"><strong>OK \u2014 mo\u017Cesz medytowa\u0107.</strong> ${escapeHtml4(med.reason)}</p>
        ${meditate(solo)}
        ${attrsAdjustHtml(p)}
        <div class="actions" style="margin:0.6rem 0">
          ${med.available.map(
          (id) => `<button type="button" class="btn btn-primary" data-take-trophy="${id}">We\u017A trofeum: ${ATTR_KEYS.find((a) => a.id === id)?.label || id}</button>`
        ).join("")}
        </div>
        <p class="note">${escapeHtml4(med.soloNote)}</p>
      `
      );
      bindAttrAdjust(p);
      appEl.querySelectorAll("[data-take-trophy]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-take-trophy");
          ensureCombatTrack(p);
          if (!p.attrTrophies.includes(id)) p.attrTrophies.push(id);
          if ((p.reputation || 0) < 3) {
            p.reputation = Math.min(4, (p.reputation || 0) + 1);
            noteReputationClaim(state.board, p.schoolId, p.reputation);
          }
          saveState();
          render();
        });
      });
      addTurnButtons([
        { id: "to3", label: "Dalej \u2192 faza III", primary: true, onClick: () => setTurn("III", "phase3") },
        { id: "back", label: "Wr\xF3\u0107", onClick: () => setTurn("II", "phase2") }
      ]);
      return;
    }
    if (screen === "explore") {
      if (state.turn) state.turn.exploreDeck = null;
      turnShell(
        "Eksploracja",
        exploreDeckChooserHtml({ selected: null })
      );
      appEl.querySelectorAll("[data-explore-deck]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const deck = btn.getAttribute("data-explore-deck");
          setTurn("II", "explore-resolve", { exploreDeck: deck });
        });
      });
      addTurnButtons([
        { id: "back", label: "Wr\xF3\u0107", onClick: () => setTurn("II", "phase2", { clearExplore: true }) }
      ]);
      return;
    }
    if (screen === "explore-resolve") {
      const deck = state.turn.exploreDeck || "city";
      turnShell(
        "Eksploracja \u2014 po karcie",
        `
        ${exploreResolveHtml({ deck, isSolo: solo, player: p })}
        ${trailsHtml(p, { editable: true, board: state.board })}
      `
      );
      bindResourceAdjust(p);
      bindQuestForms(p);
      bindTrailForms(p);
      addTurnButtons([
        {
          id: "to3",
          label: "Dalej \u2192 faza III",
          primary: true,
          onClick: () => setTurn("III", "phase3", { clearExplore: true })
        },
        {
          id: "back-deck",
          label: "Inna talia",
          onClick: () => setTurn("II", "explore", { clearExplore: true })
        }
      ]);
      return;
    }
    if (screen === "phase3") {
      const hint = phase3DrawHint(p.cards || 0);
      turnShell(
        "Faza III \u2014 dob\xF3r i zakup",
        `
        ${phase3(solo)}
        ${resourceAdjustHtml(p, { title: "Po doborze / kupnie \u2014 ustaw tracker" })}
        <p class="tip">${escapeHtml4(hint.note)}</p>
        <div class="actions" style="margin:0.5rem 0">
          <button type="button" class="btn btn-secondary" id="phase3-set-hand">Ustaw r\u0119k\u0119 na 3 (po doborze)</button>
        </div>
      `
      );
      bindResourceAdjust(p);
      const setHand = appEl.querySelector("#phase3-set-hand");
      if (setHand) {
        setHand.addEventListener("click", () => {
          p.cards = 3;
          saveState();
          render();
        });
      }
      addTurnButtons([
        {
          id: "summary",
          label: "Podsumowanie tury",
          primary: true,
          onClick: () => setTurn("III", "turn-summary")
        },
        {
          id: "to-board",
          label: "St\xF3\u0142 \u2014 mapa / reputacja / karty",
          onClick: () => go("board")
        }
      ]);
      return;
    }
    if (screen === "turn-summary") {
      const hint = phase3DrawHint(p.cards || 0);
      const next = state.roster[(state.activeIndex + 1) % state.players];
      turnShell(
        solo ? `Podsumowanie \xB7 tura ${state.turnNumber || 1}` : "Podsumowanie tury",
        turnSummaryHtml(p, {
          phase3Hint: hint,
          schoolName: schoolById3(p.schoolId).short,
          turnNumber: state.turnNumber || 1,
          isSolo: solo
        })
      );
      bindQuestForms(p);
      addTurnButtons([
        {
          id: "next",
          label: solo ? `Koniec tury ${state.turnNumber || 1} \u2192 start tury ${(state.turnNumber || 1) + 1}` : `Koniec tury \u2192 ${escapeHtml4(next.name)}`,
          primary: true,
          onClick: () => nextPlayer()
        },
        {
          id: "back-p3",
          label: "Wr\xF3\u0107 do fazy III",
          onClick: () => setTurn("III", "phase3")
        }
      ]);
    }
  }
  function renderBoard() {
    const board = state.board;
    shell(`
    <section class="panel board-panel">
      <p class="step-kicker">Przy stole \xB7 mapa i status</p>
      <h1>St\xF3\u0142</h1>
      <p class="lead">Schemat mapy do oznaczania potwor\xF3w i wied\u017Amin\xF3w (mo\u017Cesz obraca\u0107). Jak przesuniesz wied\u017Amina na s\u0105siada \u2014 wyskoczy wyb\xF3r kosztu ruchu (1 karta / 2 karty / 1+z\u0142oto). Przyciski \u201Eco robi teraz\u201D prowadz\u0105 za r\u0119k\u0119 (m.in. eksploracja wg znak\xF3w pola).</p>

      <h2>Mapa (schemat)</h2>
      ${mapToolbarHtml(board, state.roster)}
      ${mapSvgHtml(board, state.roster, {
      schoolById: schoolById3,
      highlightFromId: board.highlightFrom || board.movePrompt?.fromId || (activePlayer()?.nowDoing === "faza1" ? activePlayer()?.locationId : null)
    })}
      ${selectedLocPanel(board, state.roster)}
      ${(board.highlightFrom || activePlayer()?.nowDoing === "faza1") && activePlayer()?.locationId ? neighborPickerHtml(board.highlightFrom || activePlayer().locationId, {
      player: activePlayer(),
      monsters: board.monsters
    }) : ""}
      ${movePromptHtml(board, state.roster)}
      ${board.movePrompt ? `<div class="actions" style="margin:0.5rem 0 1rem">
              <button type="button" class="btn btn-secondary" id="dismiss-move-prompt">Anuluj ten ruch (cofnij pionek)</button>
            </div>` : ""}

      ${monstersPanelHtml(board)}

      <h2>Gracze \u2014 reputacja i karty</h2>
      <div class="tracker-list">
        ${playerTrackerHtml(state.roster, {
      schoolById: schoolById3,
      isSolo: isSolo(),
      activeIndex: state.activeIndex,
      START_RESOURCES,
      players: state.players
    })}
      </div>

      <div class="actions">
        <button class="btn btn-primary" id="to-turn">Prowad\u017A tur\u0119</button>
        <button class="btn btn-secondary" id="to-icons">Co oznaczaj\u0105 symbole?</button>
        <button class="btn btn-secondary" id="reset-board">Wyczy\u015B\u0107 tylko map\u0119</button>
      </div>
    </section>
  `);
    bindMonsterPanelControls();
    appEl.querySelectorAll(".map-node").forEach((g) => {
      g.addEventListener("click", () => {
        state.board.selectedLoc = g.getAttribute("data-loc");
        state.board.placeError = null;
        saveState();
        render();
      });
    });
    const dismissMove = appEl.querySelector("#dismiss-move-prompt");
    if (dismissMove) {
      dismissMove.addEventListener("click", () => {
        const mp = state.board.movePrompt;
        if (mp && state.roster[mp.playerIdx]) {
          state.roster[mp.playerIdx].locationId = mp.fromId;
          state.board.selectedLoc = mp.fromId;
        }
        state.board.movePrompt = null;
        saveState();
        render();
      });
    }
    appEl.querySelectorAll("[data-move-to]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const toId = btn.getAttribute("data-move-to");
        const pl = activePlayer();
        if (!pl?.locationId || !toId) return;
        const fromId = pl.locationId;
        if (!neighborsOf(fromId).includes(toId)) {
          window.alert("To nie jest s\u0105siad po \u015Bcie\u017Cce.");
          return;
        }
        pl.locationId = toId;
        pl.nowDoing = "faza1";
        state.board.selectedLoc = toId;
        state.board.highlightFrom = fromId;
        state.board.movePrompt = {
          playerIdx: state.activeIndex,
          fromId,
          toId,
          costId: null
        };
        saveState();
        render();
      });
    });
    appEl.querySelectorAll("[data-move-cost]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mp = state.board.movePrompt;
        if (!mp) return;
        const pl = state.roster[mp.playerIdx];
        if (!pl) return;
        const costId = btn.getAttribute("data-move-cost");
        const result = applyMoveCost(pl, costId);
        if (!result.ok) {
          window.alert(result.reason);
          return;
        }
        mp.costId = costId;
        state.board.movePrompt = null;
        state.board.highlightFrom = null;
        state.board.selectedLoc = mp.toId;
        pl.locationId = mp.toId;
        state.activeIndex = mp.playerIdx;
        pl.nowDoing = "faza1";
        saveState();
        go("turn");
        finishMoveTo(pl, mp.toId, costId);
      });
    });
    appEl.querySelectorAll("[data-rep]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.idx);
        const n = Number(btn.dataset.rep);
        const p = state.roster[i];
        if (p) {
          p.reputation = n;
          noteReputationClaim(state.board, p.schoolId, n);
        }
        saveState();
        render();
      });
    });
    appEl.querySelectorAll("[data-cards-delta]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.idx);
        const d = Number(btn.dataset.cardsDelta);
        const p = state.roster[i];
        if (!p) return;
        p.cards = Math.max(0, Math.min(20, (p.cards || 0) + d));
        saveState();
        render();
      });
    });
    appEl.querySelectorAll("[data-gold-delta]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.idx);
        const d = Number(btn.dataset.goldDelta);
        const p = state.roster[i];
        if (!p) return;
        p.gold = Math.max(0, Math.min(99, (p.gold || 0) + d));
        saveState();
        render();
      });
    });
    appEl.querySelectorAll("[data-elixir-delta]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.idx);
        const d = Number(btn.dataset.elixirDelta);
        const p = state.roster[i];
        if (!p) return;
        p.elixirs = Math.max(0, Math.min(4, (p.elixirs || 0) + d));
        saveState();
        render();
      });
    });
    appEl.querySelectorAll(".tracker-card [data-quest-done]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.idx);
        const id = btn.getAttribute("data-quest-done");
        const p = state.roster[i];
        if (!p || !id) return;
        ensureQuests(p);
        p.quests = p.quests.filter((q) => q.id !== id);
        saveState();
        render();
      });
    });
    appEl.querySelectorAll("[data-now]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.idx);
        const now = btn.dataset.now;
        if (state.roster[i]) {
          state.roster[i].nowDoing = now;
          if (now !== "czekam") state.activeIndex = i;
          if (now === "faza1") {
            if (!state.roster[i].locationId) placeAtSchool(state.roster[i], { force: true });
            state.board.highlightFrom = state.roster[i].locationId;
          } else {
            state.board.highlightFrom = null;
          }
        }
        saveState();
        render();
      });
    });
    appEl.querySelectorAll("[data-apply-fatigue]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.idx);
        const p = state.roster[i];
        if (!p || p.reputation >= 4) return;
        const next = p.reputation + 1;
        const lose = fatigueForReputation(next);
        if (!window.confirm(
          `+1 reputacja \u2192 ${next}. Usun\u0105\u0107 z gry ${lose} kart(y) z r\u0119ki (uproszczenie trackera)? Na stole mo\u017Cesz bra\u0107 te\u017C z talii/odrzuconych.`
        )) {
          return;
        }
        p.reputation = next;
        noteReputationClaim(state.board, p.schoolId, next);
        p.cards = Math.max(0, (p.cards || 0) - lose);
        saveState();
        render();
      });
    });
    appEl.querySelectorAll("[data-apply-draw7]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.idx);
        const p = state.roster[i];
        if (!p) return;
        const hint = phase3DrawHint(p.cards || 0);
        p.cards = hint.afterDraw;
        saveState();
        render();
      });
    });
    appEl.querySelector("#to-turn").addEventListener("click", () => go("turn"));
    appEl.querySelector("#to-icons").addEventListener("click", () => go("icons"));
    appEl.querySelector("#reset-board").addEventListener("click", () => {
      if (!window.confirm("Wyczy\u015Bci\u0107 tylko map\u0119 (potwory i pozycje wied\u017Amin\xF3w)?")) return;
      state.board = defaultBoard();
      state.roster.forEach((p) => {
        p.locationId = null;
      });
      saveState();
      render();
    });
  }
  function resourcesTable(n) {
    const rows = START_RESOURCES[n].map((r, i) => {
      const who = state.roster[i] ? `${escapeHtml4(state.roster[i].name)} (${schoolById3(state.roster[i].schoolId).short})` : n === 1 ? "Ty (solo)" : PLAYER_LABELS[i];
      return `<tr><th>${who}</th><td>${r.cards} kart(y)</td><td>${r.gold} z\u0142ota</td></tr>`;
    }).join("");
    return `<table class="table"><thead><tr><th>Gracz</th><th>Karty</th><th>Z\u0142oto</th></tr></thead><tbody>${rows}</tbody></table>`;
  }
  function renderRef() {
    shell(`
    <section class="panel">
      <p class="step-kicker">Na szybko</p>
      <h1>\u015Aci\u0105ga${isSolo() ? " \xB7 solo" : ""}</h1>
      ${quickRef(isSolo())}
      ${LOCATION_ACTIONS}
      <div class="actions">
        <button class="btn btn-primary" id="to-turn">Wr\xF3\u0107 do tury</button>
        <button class="btn btn-secondary" id="to-sources">\u0179r\xF3d\u0142a i FAQ</button>
        <button class="btn btn-secondary" id="reset">Wyczy\u015B\u0107 zapis</button>
      </div>
    </section>
  `);
    appEl.querySelector("#to-turn").addEventListener("click", () => go("turn"));
    appEl.querySelector("#to-sources").addEventListener("click", () => go("sources"));
    appEl.querySelector("#reset").addEventListener("click", () => {
      if (!window.confirm("Wyczy\u015Bci\u0107 ca\u0142y zapis helpera (gracze, mapa, reputacja)?")) return;
      startNewAdventure();
    });
  }
  function renderIcons() {
    shell(`
    <section class="panel">
      <p class="step-kicker">\u015Aci\u0105ga symboli</p>
      <h1>Ikony</h1>
      ${iconsLegendHtml()}
      <div class="actions">
        <button class="btn btn-primary" id="to-turn">Do tury</button>
        <button class="btn btn-secondary" id="to-lexicon">Leksykon szk\xF3\u0142</button>
      </div>
    </section>
  `);
    appEl.querySelector("#to-turn").addEventListener("click", () => go("turn"));
    appEl.querySelector("#to-lexicon").addEventListener("click", () => go("lexicon"));
  }
  function renderLexicon() {
    const schoolId = activePlayer()?.schoolId;
    const mine = SCHOOL_SPECIALTIES.find((s) => s.id === schoolId);
    shell(`
    <section class="panel">
      <p class="step-kicker">Podstawka \xB7 przy stole</p>
      <h1>Leksykon</h1>
      ${mine ? `<p class="tip"><strong>Aktywny (${escapeHtml4(activePlayer().name)}):</strong> ${mine.name}<br>${mine.body}</p>` : ""}
      ${lexiconHtml()}
      <div class="actions">
        <button class="btn btn-primary" id="to-turn">Do tury</button>
        <button class="btn btn-secondary" id="to-sources">\u0179r\xF3d\u0142a / FAQ</button>
      </div>
    </section>
  `);
    appEl.querySelector("#to-turn").addEventListener("click", () => go("turn"));
    appEl.querySelector("#to-sources").addEventListener("click", () => go("sources"));
  }
  function renderSources() {
    shell(`
    <section class="panel">
      <p class="step-kicker">Weryfikacja zasad</p>
      <h1>\u0179r\xF3d\u0142a, filmy, FAQ</h1>
      ${sourcesHtml()}
      <div class="actions">
        <button class="btn btn-primary" id="to-home">Wr\xF3\u0107</button>
      </div>
    </section>
  `);
    appEl.querySelector("#to-home").addEventListener("click", () => go("home"));
  }
  render();
})();
