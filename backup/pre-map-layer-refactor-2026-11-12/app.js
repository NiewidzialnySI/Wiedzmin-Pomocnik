import {
  START_RESOURCES,
  PLAYER_LABELS,
  buildSetupSteps,
  buildPlayerBoardSteps,
  PLAYER_BOARD_SCAN_SRC,
  phase1AfterMove,
  phase2Choices,
  fightBranchHtml,
  fightMonster,
  FIGHT_WITCHER,
  meditate,
  phase3,
  LOCATION_ACTIONS,
  quickRef,
} from "./content.js";
import {
  bindSchoolActionDeckStep,
  playerBoardActionDeckMainHtml,
} from "./player-board-action-deck.js";
import { bindSchoolTrophyStep, playerBoardTrophyMainHtml } from "./player-board-trophies.js";
import {
  bindPlayerBoardFigureStep,
  playerBoardFigureMainHtml,
} from "./player-board-figure-prep.js";
import {
  COMMON_ACTION_DECK_ASSET_V,
  COMMON_ACTION_DECK_BACK_SRC,
  COMMON_ACTION_DECK_STACK_SIZE,
  ACTION_CARD_ASPECT_W,
  ACTION_CARD_ASPECT_H,
} from "./school-action-deck-prep.js";
import { startResourcesDealIntro, startResourcesDealListHtml } from "./start-resources-screen.js";
import { runScreenTransition } from "./screen-transition.js";
import { mapPawnsPrepPanelHtml } from "./map-setup-pawns.js";
import { schoolTrophyPrepScenario } from "./school-trophy-prep.js";
import { SCHOOLS, canonicalSchoolId, sourcesHtml } from "./sources.js";
import { lexiconHtml, SCHOOL_SPECIALTIES } from "./lexicon.js";
import { ICO, SCHOOL_ICON, iconsLegendHtml, orderStartResourcesHtml } from "./icons.js";
import {
  defaultBoard,
  ensurePlayerTrack,
  noteReputationClaim,
  ensureReputationClaims,
  mapSvgHtml,
  monsterLevelStacksSvg,
  locationTokensAndFightDeckSvg,
  goldBankAndDiceSvg,
  mapToolbarHtml,
  selectedLocPanel,
  playerTrackerHtml,
  movePromptHtml,
  bindMapLocPopup,
  fatigueForReputation,
  phase3DrawHint,
  locById,
  neighborsOf,
  placeAtSchool,
  schoolStartId,
  monsterAt,
  monsterEncounterHtml,
  monstersPanelHtml,
  monsterSpawnSlotHtml,
  monsterFightOutcomePlan,
  normalizeMonsterLevel,
  cycleMonsterTerrain,
  setMonsterTerrainByNumber,
  setMonsterTerrainLevel,
  setMonsterForTerrain,
  sanitizeMonstersUniqueTerrain,
  locationsForTerrain,
  LOCATIONS,
} from "./board.js";
import {
  neighborPickerHtml,
  moveCostChooserHtml,
  applyMoveCost,
  locationActionGuideHtml,
  destinationPreviewHtml,
  mapLocPopupHtml,
} from "./guide.js";
import {
  exploreDeckChooserHtml,
  exploreResolveHtml,
  resourceAdjustHtml,
  questArrivalHtml,
  turnSummaryHtml,
  ensureQuests,
  newQuestId,
} from "./quests.js";
import {
  ensureCombatTrack,
  applyStartResources,
  startResourcesFor,
  meditationStatus,
  phase2FightOptions,
  trailsHtml,
  attrsAdjustHtml,
  hasTrailForMonster,
  fieldChangeModalHtml,
  applyFieldChange,
  ATTR_KEYS,
} from "./player-state.js";

const STORAGE_KEY = "wiedzmin-stary-swiat-helper-v4";
const UI_SCALE_KEY = "wiedzmin-stary-swiat-ui-scale";
const UI_SCALES = ["sm", "md", "lg"];

const appEl = document.getElementById("app");

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
    /* ignore */
  }
  return next;
}

applyUiScale(loadUiScale());

if (!window.__wiedzminKeysBound) {
  window.__wiedzminKeysBound = true;
  document.addEventListener("keydown", (e) => {
    if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
    const tag = e.target;
    const typing =
      tag &&
      ((tag.closest && tag.closest("textarea")) ||
        (tag.matches && tag.matches("input, textarea, select, [contenteditable=true]")));

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
    const primary =
      appEl?.querySelector(".flow-actions .btn-primary:not([disabled])") ||
      appEl?.querySelector(".btn-primary:not([disabled])") ||
      appEl?.querySelector("#next:not([disabled]), #pb-next:not([disabled]), #to-roster, #to-setup, #to-turn, #confirm-order, #deal-next");
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
      fightResult: null,
    },
    board: defaultBoard(),
    orderDice: [],
  };
}

function isSolo() {
  return state.players === 1;
}

function normalizeState(raw) {
  const base = defaultState();
  if (!raw || typeof raw !== "object") return base;
  const players = Math.min(5, Math.max(1, Number(raw.players) || 3));
  const turn =
    raw.turn && typeof raw.turn === "object"
      ? {
          phase: String(raw.turn.phase || "hub"),
          screen: String(raw.turn.screen || "hub"),
          moveTo: raw.turn.moveTo ? String(raw.turn.moveTo) : null,
          moveCost: raw.turn.moveCost ? String(raw.turn.moveCost) : null,
          exploreDeck: raw.turn.exploreDeck ? String(raw.turn.exploreDeck) : null,
          fightResult: raw.turn.fightResult && typeof raw.turn.fightResult === "object"
            ? raw.turn.fightResult
            : null,
        }
      : base.turn;
  const board =
    raw.board && typeof raw.board === "object"
      ? {
          ...defaultBoard(),
          ...raw.board,
          monsters: raw.board.monsters || {},
          movePrompt: raw.board.movePrompt || null,
          highlightFrom: raw.board.highlightFrom || null,
          tool: raw.board.tool === "player" ? "select" : raw.board.tool || "select",
        }
      : defaultBoard();
  // migracja Oxenfurt → Loc Ichaer; Mantikora → Behelt Nar
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
  const roster = Array.isArray(raw.roster)
    ? raw.roster.map((p) => {
        const copy = { ...(p || {}) };
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
      })
    : [];
  const views = new Set([
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
    "sources",
  ]);
  roster.forEach((p) => ensureCombatTrack(ensurePlayerTrack(p)));
  ensureReputationClaims(board, roster);
  const turnNumber = Math.max(1, Math.min(999, Number(raw.turnNumber) || 1));
  const setupIndex = Math.max(0, Number(raw.setupIndex) || 0);
  const playerBoardIndex = Math.max(0, Number(raw.playerBoardIndex) || 0);
  const view = views.has(raw.view) ? raw.view : "home";
  const adventureStarted = Boolean(
    raw.adventureStarted ||
      (view !== "home" && view !== "splash") ||
      turnNumber > 1 ||
      setupIndex > 0 ||
      playerBoardIndex > 0 ||
      (Array.isArray(raw.orderDice) && raw.orderDice.length > 0)
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
    orderDice: Array.isArray(raw.orderDice) ? raw.orderDice.map(Number) : [],
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

let saveTimer = null;
const state = loadState();
/** Splash tylko gdy nie ma rozpoczętej przygody — odświeżenie wraca do zapisanego ekranu. */
let bootGate = !state.adventureStarted;

function saveState({ immediate = false } = {}) {
  if (bootGate) return;
  clearTimeout(saveTimer);
  const write = () => {
    try {
      if (state.adventureStarted) state.savedAt = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota / private mode */
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
      timeStyle: "short",
    });
  } catch {
    return "";
  }
}

function continueSummaryParts() {
  if (!hasContinueSave()) return null;
  const names = (state.roster || [])
    .slice(0, state.players)
    .map((p) => p?.name)
    .filter(Boolean);
  const who = names.length ? names.join(" · ") : playersLabel(state.players);
  const when = formatSavedAt(state.savedAt);
  const bits = [
    playersLabel(state.players),
    state.turnNumber > 1 ? `tura ${state.turnNumber}` : null,
    when ? `zapis ${when}` : null,
  ].filter(Boolean);
  return { who, bits: bits.join(" · ") };
}

function splashSchoolMedallionsHtml() {
  const schools = [
    ["wilk", "Wilk"],
    ["gryf", "Gryf"],
    ["niedzwiedz", "Niedźwiedź"],
    ["kot", "Kot"],
    ["zmija", "Żmija"],
    ["mantikora", "Mantikora"],
  ];
  return `
    <ul class="splash-medallions" aria-hidden="true">
      ${schools
        .map(
          ([id, label], i) => `
        <li class="splash-medal" style="--i:${i}">
          <span class="splash-medal-disc splash-medal-disc--${id}">
            <img class="school-art school-art--${id}" src="./img/schools/${id === "kot" ? "kot-v10" : id}.png?v=10" alt="" width="96" height="96" decoding="async" />
          </span>
          <span>${label}</span>
        </li>`
        )
        .join("")}
    </ul>`;
}

let splashLeaving = false;

function leaveSplashThen(next) {
  if (splashLeaving) return;
  const root = appEl.querySelector(".splash-screen");
  const reduce =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      /* ignore */
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
    /* ignore */
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
        schoolId: SCHOOLS[i % SCHOOLS.length].id,
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

/** Po wyborze szkoły — pionek na startowej lokacji szkoły. */
function applySchoolStarts() {
  state.roster.forEach((p) => {
    const schoolChanged = p._prevSchoolId && p._prevSchoolId !== p.schoolId;
    if (!p.locationId || schoolChanged) {
      placeAtSchool(p, { force: true });
    }
    p._prevSchoolId = p.schoolId;
  });
}

function schoolById(id) {
  return SCHOOLS.find((s) => s.id === id) || SCHOOLS[0];
}

function activePlayer() {
  ensureRoster();
  return state.roster[state.activeIndex] || state.roster[0];
}

function playerLabel(p) {
  const school = schoolById(p.schoolId);
  return `${p.name} · ${school.short}`;
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

function leavePanelThen(next, { direction = "forward" } = {}) {
  runScreenTransition(next, { direction });
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
          Wiedźmin: Stary Świat
          ${isSolo() ? `<small>Solo</small>` : ""}
        </div>
        <button type="button" class="btn btn-ghost btn-exit" id="to-title" title="Wróć do ekranu startowego" aria-label="Wyjście">
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
          ["board", "Stół"],
        ]
          .map(
            ([id, label]) =>
              `<button class="btn btn-ghost ${state.view === id ? "nav-active" : ""}" data-nav="${id}">${label}</button>`
          )
          .join("")}
        <div class="ui-scale" role="group" aria-label="Rozmiar tekstu">
          ${[
            ["sm", "A−", "Mniejszy"],
            ["md", "A", "Domyślny"],
            ["lg", "A+", "Większy"],
          ]
            .map(
              ([id, label, title]) =>
                `<button type="button" class="btn btn-ghost ${scale === id ? "nav-active" : ""}" data-ui-scale="${id}" title="${title}">${label}</button>`
            )
            .join("")}
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
            ["sm", "A−", "Mniejszy"],
            ["md", "A", "Domyślny"],
            ["lg", "A+", "Większy"],
          ]
            .map(
              ([id, label, title]) =>
                `<button type="button" class="btn btn-ghost ${scale === id ? "nav-active" : ""}" data-ui-scale="${id}" title="${title}">${label}</button>`
            )
            .join("")}
        </div>
      </header>

      <section class="splash-stage" aria-label="Ekran tytułowy">
        <p class="splash-kicker">Pomocnik przy stole</p>
        <h1 class="splash-brand">Wiedźmin<span>Stary Świat</span></h1>
        <div class="splash-rule" aria-hidden="true"></div>
        ${splashSchoolMedallionsHtml()}

        <div class="splash-paths">
          <button type="button" class="splash-path splash-path-new" id="new-adventure">
            <span class="splash-path-kicker">Nowa ścieżka</span>
            <strong>Rozpocznij nową przygodę</strong>
          </button>

          <button type="button" class="splash-path splash-path-continue" id="continue-adventure" ${canContinue ? "" : "disabled"}>
            <span class="splash-path-kicker">Zapisana historia</span>
            <strong>Kontynuuj historię</strong>
            ${
              summary
                ? `<span class="splash-path-meta"><b>${escapeHtml(summary.who)}</b>${escapeHtml(summary.bits)}</span>`
                : ""
            }
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
    { n: 3, title: "Trójka" },
    { n: 4, title: "Czwórka" },
    { n: 5, title: "Piątka" },
  ];

  shell(`
    <section class="panel home-hero">
      <div class="home-hero-stack">
        <header class="home-hero-head">
          <h1>Prowadzę Cię przez grę</h1>
        </header>
        <div class="home-hero-rule" aria-hidden="true"></div>
        <h3 class="home-section-title" id="player-count-label">Ile osób gra?</h3>
        <div class="player-count" role="radiogroup" aria-labelledby="player-count-label">
          ${options
            .map(
              (o) => `
            <button type="button" role="radio" class="player-count-opt ${state.players === o.n ? "is-selected" : ""}" data-players="${o.n}" aria-checked="${state.players === o.n ? "true" : "false"}">
              <span class="player-count-num">${o.n}</span>
              <span class="player-count-title">${o.title}</span>
            </button>`
            )
            .join("")}
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

function schoolArtSrc(id) {
  return `./img/schools/${id === "kot" ? "kot-v10" : id}.png?v=10`;
}

function renderRoster() {
  ensureRoster();

  shell(`
    <section class="panel roster-screen">
      <div class="roster-stack">
        <header class="roster-head">
          <div class="roster-title-row">
            <h1>Imiona i szkoły</h1>
            <button type="button" class="btn btn-ghost btn-roster-dice" id="roll-schools" title="Wylosuj szkoły dla wszystkich" aria-label="Wylosuj szkoły">
              ${ICO.dice()}
            </button>
          </div>
          <div class="home-hero-rule" aria-hidden="true"></div>
        </header>
        <div class="roster-grid" id="roster-forms" data-count="${state.players}" style="--roster-cols:${state.players}">
          ${state.roster
            .map((p, i) => {
              const fallback = state.players === 1 ? "Ty" : `Gracz ${i + 1}`;
              const label = (p.name || "").trim() || fallback;
              const sid = p.schoolId || SCHOOLS[0].id;
              return `
              <div class="roster-card" data-idx="${i}">
                <div class="roster-card-top">
                  <span class="splash-medal-disc splash-medal-disc--${sid} roster-medal" data-medal>
                    <img class="school-art school-art--${sid}" src="${schoolArtSrc(sid)}" alt="" width="64" height="64" decoding="async" />
                  </span>
                  <strong class="roster-card-label">${escapeHtml(label)}</strong>
                </div>
                <label>Imię
                  <input type="text" data-field="name" value="${escapeAttr(p.name)}" maxlength="24" />
                </label>
                <label>Szkoła
                  <select data-field="schoolId">
                    ${SCHOOLS.map(
                      (s) =>
                        `<option value="${s.id}" ${sid === s.id ? "selected" : ""}>${s.name}</option>`
                    ).join("")}
                  </select>
                </label>
                <p class="roster-start school-start-hint">Start: <strong>${escapeHtml(
                  locById(schoolStartId(sid))?.name || "—"
                )}</strong></p>
              </div>`;
            })
            .join("")}
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
    if (hintStrong) hintStrong.textContent = locById(schoolStartId(schoolId))?.name || "—";
    const medal = card.querySelector("[data-medal]");
    const img = medal?.querySelector("img");
    if (medal) {
      medal.className = `splash-medal-disc splash-medal-disc--${schoolId} roster-medal`;
      medal.setAttribute("data-medal", "");
    }
    if (img) {
      img.className = `school-art school-art--${schoolId}`;
      img.src = schoolArtSrc(schoolId);
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
      const typed = card
        .querySelector('[data-field="name"]')
        .value.replace(/[<>]/g, "")
        .trim();
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
  const school = schoolById(schoolId);
  const trophySc = trophyStep ? schoolTrophyPrepScenario(state.players) : null;
  shell(`
    <section class="panel player-board-screen" data-pb-focus="${escapeAttr(step.focus)}" data-pb-step="${escapeAttr(step.id || "")}">
      <div class="player-board-stack${
        step.minimal
          ? " player-board-stack--hero-mat"
          : trophyStep
            ? " player-board-stack--trophies"
            : actionDeckStep
              ? " player-board-stack--action-deck"
              : figureStep
                ? " player-board-stack--figure"
                : " player-board-stack--coach"
      }">
        <header class="player-board-head">
          <h1>Przygotuj planszetkę</h1>
          <div class="home-hero-rule" aria-hidden="true"></div>
        </header>

        <div class="player-board-main">
          ${
            trophyStep
              ? playerBoardTrophyMainHtml({
                  boardSrc,
                  boardV,
                  schoolId,
                  playerCount: state.players,
                })
              : actionDeckStep
                ? playerBoardActionDeckMainHtml({
                    boardSrc,
                    boardV,
                  })
                : figureStep
                  ? playerBoardFigureMainHtml({
                      schoolId,
                      schoolName: school.name,
                      playerName: active?.name || "",
                      playerSlot: state.activeIndex + 1,
                      solo: isSolo(),
                    })
                  : `
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
                ${
                  overlaySrc
                    ? `<img
                  class="player-board-scan__overlay${overlayPulse ? " player-board-scan__overlay--pulse" : ""}"
                  src="${overlaySrc}?v=${overlayV}"
                  alt=""
                  width="1024"
                  height="425"
                  loading="eager"
                  decoding="async"
                  aria-hidden="true"
                />`
                    : ""
                }
              </div>
              ${step.boardCap ? `<figcaption class="player-board-scan__cap">${escapeHtml(step.boardCap)}</figcaption>` : ""}
            </figure>
          </div>

          ${
            step.minimal
              ? ""
              : `<div class="player-board-step">
            <h2 class="player-board-step__title">${escapeHtml(step.title)}</h2>
            <p class="player-board-step__body">${step.body}</p>
            ${step.hint ? `<p class="tip player-board-step__hint">${step.hint}</p>` : ""}
          </div>`
          }`
          }
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

/** Aktualizacja tożsamości w slocie (numer i karty/złoto zostają — zależą od miejsca). */
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
        img.src = schoolArtSrc(sid);
      }
    }
  }
  const nameEl = el.querySelector(".order-name");
  if (nameEl) nameEl.textContent = player.name || "";
  const schoolEl = el.querySelector(".order-school");
  if (schoolEl) schoolEl.textContent = schoolById(sid).short;
}

/**
 * FLIP tylko na medalionach (compositor: translate3d).
 * Wzorzec: batch reads → writes → rAF → batch lasts → animate
 * (github.com/iart-ai/web-animation-skills · aerotwist FLIP).
 */
function applyOrderRoster(list, nextRoster) {
  const items = [...list.querySelectorAll(".order-item")];
  const prevRoster = state.roster;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1) READ — pozycje graczy, którzy się ruszą
  const firsts = new Map();
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

  // 2) WRITE — tylko zmienione sloty; ukryj imię/szkołę od razu
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

  // 3–4) po layoucie: READ lasts, potem WRITE animate (bez thrashingu)
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
          { transform: "translate3d(0, 0, 0)" },
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
            <button type="button" class="btn btn-ghost btn-roster-dice" id="order-dice" title="Wylosuj kolejność" aria-label="Wylosuj kolejność">
              ${ICO.dice()}
            </button>
          </div>
          <div class="home-hero-rule" aria-hidden="true"></div>
        </header>

        <ul class="order-list" id="order-list" data-count="${state.roster.length}" style="--order-cols:${state.roster.length}">
          ${state.roster
            .map((p, i) => {
              const res = startResourcesFor(state.players, i);
              const sid = p.schoolId || SCHOOLS[0].id;
              return `
              <li class="order-item" data-idx="${i}">
                <span class="order-pos">${i + 1}</span>
                <span class="splash-medal-disc splash-medal-disc--${sid} order-medal" data-school-id="${sid}" draggable="true" title="Przeciągnij, by zmienić kolejność">
                  <img class="school-art school-art--${sid}" data-school-id="${sid}" src="${schoolArtSrc(sid)}" alt="" width="96" height="96" decoding="async" draggable="false" />
                </span>
                <strong class="order-name">${escapeHtml(p.name)}</strong>
                <span class="order-school">${escapeHtml(schoolById(sid).short)}</span>
                ${orderStartResourcesHtml(res.cards, res.gold)}
              </li>`;
            })
            .join("")}
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
        /* ignore */
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
          <h1>${escapeHtml(intro.title)}</h1>
          ${intro.lead ? `<p class="deal-lead">${escapeHtml(intro.lead)}</p>` : ""}
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
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

let _setupEnterBoard = false;
let _setupEnterCoach = false;
/** Po animacji wprowadzenia wspólnej talii na mapie (faza coach 0). */
let _setupMainDeckPlaced = false;
/** 0..8 jak wcześniej; 9 = żetony obszaru na polach kart; 10 = potwory na kartach + mapie */
let _setupDeckCoachPhase = 0;
const SETUP_DECK_COACH_LAST = 10;
/** Od góry przy lewej kolumnie: las → woda → góry */
const SETUP_CARD_TOKEN_TERRAINS = ["forest", "water", "mountain"];
let _coachBindGen = 0;
let _coachResizeAbort = null;

const SETUP_POOL_ZERO_SLOTS = [10, 11, 12];
const SETUP_POOL_REST_SLOTS = [7, 8, 9];
/** Lewa kolumna 6 pól — od dołu: zdarzenia, ostępy, miasta */
const SETUP_EXPLORE_DECKS = [
  { slot: 3, id: "city", name: "Miasta", art: "./img/explore/city.png" },
  { slot: 4, id: "wilds", name: "Dzikie ostępy", art: "./img/explore/wilds.png" },
  { slot: 5, id: "events", name: "Zdarzenia", art: "" },
];
const SETUP_EXPLORE_SLOTS = SETUP_EXPLORE_DECKS.map((d) => d.slot);

/** Kroki przygotowania przed ekranem „Potwory na start”. */
const SETUP_PREP_BEFORE_MONSTERS = new Set(["intro", "board", "action-deck", "map-pawns"]);

function leaveCoachThen(next, { keepDeals = false } = {}) {
  const coach = appEl.querySelector(".setup-coach");
  const reduce =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
  appEl
    .querySelectorAll(
      ".map-card-slot.is-coach-target, .map-token-slot.is-coach-target, .map-monster-token.is-coach-target, .map-loc-token-stack.is-coach-target, .map-gold-bank.is-coach-target, .map-dice-tray.is-coach-target, .map-die-slot.is-coach-target, .map-node.is-coach-target"
    )
    .forEach((el) => {
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
    c.classList.add("is-dealt", "is-flipped", "is-settled");
  });
  root
    .querySelectorAll(
      ".setup-loc-token-chip, .setup-monster-token-chip, .setup-gold-chip, .setup-die-chip, .setup-area-card-chip, .setup-spawn-token-chip"
    )
    .forEach((c) => c.classList.add("is-dealt"));
  if (root.id === "setup-deal-gold-dice") {
    root.classList.add("is-revealed-svg");
  }
}

function coachDealBuilders() {
  return {
    1: () =>
      `<div class="setup-deal setup-deal--zero" id="setup-deal-zero" data-slots="zero" aria-hidden="true">${setupDealCardsHtml(
        { costs: [0, 0, 0] }
      )}</div>`,
    2: () =>
      `<div class="setup-deal setup-deal--rest" id="setup-deal-rest" data-slots="rest" aria-hidden="true">${setupDealCardsHtml(
        { costs: [1, 2, 1] }
      )}</div>`,
    3: () => setupExploreDecksHtml(),
    4: () => setupElixirDeckHtml(),
    5: () => setupTrophyDeckHtml(),
    6: () => setupMonsterStacksHtml(),
    7: () => setupLocFightHtml(),
    8: () => setupGoldDiceHtml(),
    9: () => setupAreaTokensOnCardsHtml(),
    10: () => setupMonsterSpawnHtml(),
  };
}

const COACH_DEAL_SELECTORS = {
  1: "#setup-deal-zero",
  2: "#setup-deal-rest",
  3: "#setup-deal-explore",
  4: "#setup-deal-elixir",
  5: "#setup-deal-trophy",
  6: "#setup-deal-monsters",
  7: "#setup-deal-loc-fight",
  8: "#setup-deal-gold-dice",
  9: "#setup-deal-area-cards",
  10: "#setup-deal-monster-spawn",
};

/** Poziomy żetonów potworów na start — instrukcja (Monsters setup). */
function startingMonsterLevels() {
  const n = state.players || 1;
  if (n === 1) return ["I", "II", "III"]; /* solo: po 1 z każdego stosu */
  if (n === 2) return ["I", "I", "II"]; /* 2× I + 1× II; pierwszy gracz wybiera teren dla II */
  return ["I", "I", "I"]; /* 3–5: 3× poziom I */
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
      label: terrain === "forest" ? "Las" : terrain === "water" ? "Woda" : "Góry",
      src: `./img/terrain/${terrain}.png`,
    };
  }).filter((r) => r.loc);
}

function ensureCoachSvgExtras(preview, phase) {
  const svg = preview.querySelector(".map-svg");
  if (!svg) return;
  const united = svg.querySelector(".map-board-united");
  const outline = svg.querySelector(".map-board-outline");
  if (phase >= 6 && united && !svg.querySelector(".map-monster-stacks")) {
    united.insertAdjacentHTML("beforeend", monsterLevelStacksSvg());
  }
  if (phase >= 7 && united && !svg.querySelector(".map-loc-fight-setup")) {
    united.insertAdjacentHTML("beforeend", locationTokensAndFightDeckSvg());
  }
  if (phase >= 8 && outline && !svg.querySelector(".map-gold-dice-setup")) {
    outline.insertAdjacentHTML("beforebegin", goldBankAndDiceSvg());
  }
  if (phase < 8) svg.querySelector(".map-gold-dice-setup")?.remove();
  if (phase < 7) svg.querySelector(".map-loc-fight-setup")?.remove();
  if (phase < 6) svg.querySelector(".map-monster-stacks")?.remove();
  /* Fazy 9–10 potrzebują stosów potworów (żeby brać żetony I–III) */
  if (phase >= 9 && united && !svg.querySelector(".map-monster-stacks")) {
    united.insertAdjacentHTML("beforeend", monsterLevelStacksSvg());
  }
  if (phase >= 9 && united && !svg.querySelector(".map-loc-fight-setup")) {
    united.insertAdjacentHTML("beforeend", locationTokensAndFightDeckSvg());
  }
}

function syncCoachScreenMods(phase) {
  const screen = appEl.querySelector(".setup-screen");
  if (!screen) return;
  screen.classList.toggle("setup-screen--deal-zero", phase >= 1);
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
  const title = setupDeckCoachTitle(phase, "Wspólna talia akcji");
  const h1 = appEl.querySelector(".setup-head h1");
  if (h1) {
    h1.textContent = title;
    h1.classList.remove("is-title-leaving");
  }
  const kicker = coach.querySelector(".setup-coach-kicker");
  const text = coach.querySelector(".setup-coach-text");
  if (kicker) kicker.textContent = copy.kicker;
  if (text) text.innerHTML = copy.text;
  coach.classList.remove("is-leaving");

  preview
    .querySelectorAll(
      ".is-coach-target, .is-coach-deck, .is-coach-filled, .is-coach-leaving"
    )
    .forEach((el) => {
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
        c.classList.remove("is-dealt", "is-flipped", "is-settled");
      });
      node
        .querySelectorAll(
          ".setup-loc-token-chip, .setup-monster-token-chip, .setup-gold-chip, .setup-die-chip, .setup-area-card-chip, .setup-spawn-token-chip"
        )
        .forEach((c) => c.classList.remove("is-dealt"));
    }
  });

  ensureCoachSvgExtras(preview, phase);
  syncCoachScreenMods(phase);
  bindSetupDeckCoach(phase);
  return true;
}

/** Przejście faz coacha bez pełnego przerysowania strony (bez „odświeżenia”). */
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
      text: `Odkrywajcie z talii, aż znajdziecie <strong>3 karty o koszcie 0</strong>. Połóżcie je na <strong>3 polach od dołu</strong> prawej kolumny (przy dolnej krawędzi), w losowej kolejności.`,
    };
  }
  if (phase === 2) {
    return {
      kicker: "Pula — reszta",
      text: `Resztę odkrytych <strong>wtasujcie z powrotem</strong> w talię. Potem odkryjcie <strong>kolejne 3 karty</strong> na pozostałe pola puli (bliżej talii).`,
    };
  }
  if (phase === 3) {
    return {
      kicker: "Eksploracja",
      text: `Karty <strong>Miast</strong> i <strong>Dzikich ostępów</strong> potasujcie osobno. Karty <strong>Zdarzeń</strong> ułóżcie rosnąco według numerów.`,
    };
  }
  if (phase === 4) {
    return {
      kicker: "Eliksiry",
      text: `Potasujcie karty <strong>eliksirów</strong> i połóżcie zakrytą talię.`,
    };
  }
  if (phase === 5) {
    return {
      kicker: "Trofea",
      text: isSolo()
        ? `Weź po 1 trofeum atrybutu (4 karty), potasuj, <strong>wylosuj 1</strong> i połóż odkrytą. Resztę do pudełka.`
        : `Połóżcie <strong>trofea atrybutów</strong> w zakrytym stosie (2–3 graczy: po 1 na atrybut; 4–5: wszystkie).`,
    };
  }
  if (phase === 6) {
    return {
      kicker: "Potwory",
      text: `Karty potworów połóżcie <strong>pionowo</strong> nad flagami <strong>I / II / III</strong>. Obok każdego stosu — żetony (sześciokąt: <strong>I</strong> najmniejszy, <strong>III</strong> największy).`,
    };
  }
  if (phase === 7) {
    return {
      kicker: "Obszary i walka",
      text: `<strong>Żetony obszarów</strong> (Location Tokens): 3 zakryte stosy — las / góry / woda. <strong>Talia walki potworów</strong> (Monster Fight Deck): potasujcie i połóżcie zakrytą.`,
    };
  }
  if (phase === 8) {
    return {
      kicker: "Bank i kości",
      text: isSolo()
        ? `Po lewej u góry połóż <strong>1 zestaw 5 kości</strong>. Pod nimi — <strong>bank złota</strong>.`
        : `Po lewej u góry — <strong>2 zestawy po 5 kości</strong>. Pod nimi wspólny <strong>bank złota</strong>.`,
    };
  }
  if (phase === 9) {
    return {
      kicker: "Żetony na kartach",
      text: `Z każdego stosu obszarów wylosuj <strong>1 żeton</strong> i połóż na <strong>polu żetonu przy karcie</strong>. Od góry: <strong>las</strong> → <strong>woda</strong> → <strong>góry</strong> (jeden rodzaj na jedno pole).`,
    };
  }
  if (phase === 10) {
    const n = state.players || 1;
    let draw;
    if (n === 1) {
      draw = `Dobierz <strong>po 1 żetonie z I, II i III</strong> (zamiast 3× I).`;
    } else if (n === 2) {
      draw = `Dobierz <strong>2× poziom I</strong> + <strong>1× poziom II</strong>. Pierwszy gracz wybiera teren dla II.`;
    } else {
      draw = `Dobierz <strong>3 żetony poziomu I</strong> (losowo po 1 przy każdym żetonie obszaru).`;
    }
    return {
      kicker: "Potwory na start",
      text: `${draw} Odkryj → przenieś żeton na obszar z żetonu obszaru → połóż pasującą <strong>kartę potwora</strong> na polu karty (od góry: las / woda / góry).`,
    };
  }
  return {
    kicker: "Talia akcji",
    text: `Połóż <strong>zakrytą talię</strong> na pierwszym polu od góry w prawej kolumnie (7 kart) — zaznaczone rombem.`,
  };
}

function setupDeckCoachTitle(phase, fallback) {
  if (phase === 10) return "Potwory na planszy";
  if (phase === 9) return "Żetony obszaru przy kartach";
  if (phase === 8) return "Bank złota i kości";
  if (phase === 7) return "Żetony obszarów i talia walki";
  if (phase === 6) return "Karty i żetony potworów";
  if (phase === 5) return "Trofea atrybutów";
  if (phase === 4) return "Talia eliksirów";
  if (phase === 3) return "Zdarzenia i eksploracja";
  if (phase >= 1) return "Wspólna talia akcji";
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
      ${rows
        .map(
          (r, i) => `
        <div class="setup-area-card-chip${chipDone}" data-terrain="${r.terrain}" data-deal-area="${i}" data-slot-target="${r.slot}">
          <img src="${r.src}" alt="" decoding="async" />
          <span class="setup-area-card-chip__num">${r.loc.number}</span>
        </div>`
        )
        .join("")}
    </div>`;
}

function setupMonsterSpawnHtml({ settled = false } = {}) {
  const rows = demoMonsterSetupRows();
  const cardDone = dealSettledClass(settled);
  const chipDone = settled ? " is-dealt" : "";
  return `
    <div class="setup-deal setup-deal--monster-spawn${dealRootClass(settled)}" id="setup-deal-monster-spawn" aria-hidden="true">
      ${rows
        .map(
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
        )
        .join("")}
    </div>`;
}

function setupGoldDiceHtml({ settled = false } = {}) {
  const chipDone = settled ? " is-dealt" : "";
  const faces = [1, 2, 3, 4, 5];
  return `
    <div class="setup-deal setup-deal--gold-dice${dealRootClass(settled)}" id="setup-deal-gold-dice" aria-hidden="true">
      ${[0, 1, 2, 3, 4]
        .map(
          (i) => `
        <div class="setup-gold-chip${chipDone}" data-gold="${i}" data-deal-gold="${i}" aria-hidden="true">
          <span class="setup-gold-chip__ring" aria-hidden="true"></span>
          <span class="setup-gold-chip__mark" aria-hidden="true">zł</span>
        </div>`
        )
        .join("")}
      ${faces
        .map(
          (face, i) => `
        <div class="setup-die-chip${chipDone}" data-die="${i}" data-deal-die="${i}" data-face="${face}">
          <span class="setup-die-chip__face" data-pips="${face}" aria-hidden="true">${setupDiePipsHtml(face)}</span>
        </div>`
        )
        .join("")}
    </div>`;
}

function setupLocFightHtml({ settled = false } = {}) {
  const terrains = [
    { id: "forest", name: "Las", src: "./img/terrain/forest.png" },
    { id: "mountain", name: "Góry", src: "./img/terrain/mountain.png" },
    { id: "water", name: "Woda", src: "./img/terrain/water.png" },
  ];
  const chipDone = settled ? " is-dealt" : "";
  const cardDone = dealSettledClass(settled);
  return `
    <div class="setup-deal setup-deal--loc-fight${dealRootClass(settled)}" id="setup-deal-loc-fight" aria-hidden="true">
      ${terrains
        .map(
          (t, i) => `
        <div class="setup-loc-token-chip${chipDone}" data-terrain="${t.id}" data-deal-loc="${i}">
          <img src="${t.src}" alt="" decoding="async" />
        </div>`
        )
        .join("")}
      <div class="setup-deal-card setup-deal-card--fight${cardDone}" data-deal="0">
        <div class="setup-deal-card__inner">
          <div class="setup-deal-card__face setup-deal-card__face--back setup-deal-card__face--fight-back" aria-hidden="true"></div>
          <div class="setup-deal-card__face setup-deal-card__face--front setup-deal-card__face--fight">
            <span class="setup-deal-card__fight-mark" aria-hidden="true">⚔</span>
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
      ${[1, 2, 3]
        .map(
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
        )
        .join("")}
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
              ${
                d.art
                  ? `<img class="setup-deal-card__art" src="${d.art}" alt="" decoding="async" />`
                  : `<span class="setup-deal-card__nums"><span>1</span><span>2</span><span>3</span></span>`
              }
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
  if (!_setupMainDeckPlaced) {
    _setupMainDeckPlaced = true;
    appEl.querySelector(".setup-screen")?.classList.add("setup-screen--main-deck-settled");
    appEl
      .querySelector('.map-card-slot[data-slot="6"]')
      ?.classList.add("is-coach-deck");
  }
}

function settleMainDeckRoot(root) {
  if (!root) return;
  root.classList.add("is-ready", "is-settled-layer", "is-positioned", "is-idle");
  root.classList.remove("is-leaving", "is-shuffling", "is-flying", "is-seating", "is-loop-out");
  applyMainDeckLandedState(root);
}

function resetMainDeckCycle(dealRoot, cards) {
  dealRoot.classList.remove(
    "is-settled-layer",
    "is-positioned",
    "is-seating",
    "is-flying",
    "is-shuffling",
    "is-loop-out"
  );
  cards.forEach((c) => {
    c.classList.remove(
      "is-dealt",
      "is-settled",
      "is-seated",
      "is-landing",
      "is-stack-hidden",
      "is-slot-horizontal",
      "is-loop-out"
    );
  });
}

function setupMainDeckStackHtml({ settled = false } = {}) {
  const v = COMMON_ACTION_DECK_ASSET_V;
  const back = COMMON_ACTION_DECK_BACK_SRC;
  const cards = Array.from({ length: COMMON_ACTION_DECK_STACK_SIZE }, (_, i) => `
        <div class="setup-deal-card setup-deal-card--main-deck setup-deal-card--portrait${
          settled ? " is-dealt is-settled is-slot-horizontal" : ""
        }" data-deal="${i}" style="--stack-i: ${i}">
          <div class="setup-deal-card__inner setup-deal-card__inner--back-only">
            <div class="setup-deal-card__face setup-deal-card__face--scan setup-deal-card__face--portrait" aria-hidden="true">
              <img src="${back}?v=${v}" alt="" decoding="async" />
            </div>
          </div>
        </div>`).join("");
  return `<div class="setup-deal setup-deal--main-deck${dealRootClass(settled)}${
    settled ? " is-positioned" : ""
  }" id="setup-deal-main-deck" aria-hidden="true">${cards}</div>`;
}

function setupDealCardsHtml({ costs, settled = false }) {
  return costs
    .map(
      (cost, i) => `
        <div class="setup-deal-card${settled ? " is-dealt is-flipped is-settled" : ""}" data-deal="${i}">
          <div class="setup-deal-card__inner">
            <div class="setup-deal-card__face setup-deal-card__face--back" aria-hidden="true"></div>
            <div class="setup-deal-card__face setup-deal-card__face--front">
              <span class="setup-deal-card__cost">${cost}</span>
              <span class="setup-deal-card__label">koszt</span>
            </div>
          </div>
        </div>`
    )
    .join("");
}

function renderSetup() {
  const steps = buildSetupSteps(state.players, state.roster);
  const index = Math.min(state.setupIndex, steps.length - 1);
  const step = steps[index];
  const pct = Math.round(((index + 1) / steps.length) * 100);

  // Przy krokach gracza / solo wiedźmina — dopisz karty i złoto do trackera
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

  const mapPawnsMain =
    step.id === "map-pawns"
      ? `
      <div class="setup-map-pawns-layout">
        ${mapPawnsPrepPanelHtml({ roster: state.roster })}
        <div class="setup-map-embed setup-map-embed--pawns">
          ${mapSvgHtml(state.board || defaultBoard(), state.roster, {
            schoolById,
            setupPreview: true,
            setupMapPawns: true,
          })}
        </div>
      </div>`
      : "";

  const monsterMap =
    step.id === "monsters"
      ? `
      <div class="setup-monsters-grid">
        <div class="setup-map-embed">
          <h3>Oznacz potwory (numery z żetonów)</h3>
          <p class="lead">Dla lasu, gór i wody podaj numer obszaru z odkrytego żetonu — strzałkami albo wpisz. Potem ustaw poziom.</p>
          ${mapSvgHtml(state.board, state.roster, { schoolById })}
        </div>
        <div class="setup-monsters-panel-wrap">
          ${monstersPanelHtml(state.board)}
        </div>
      </div>`
      : "";

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
  const boardPreview = showBoardMap
    ? `
      <div class="setup-board-preview${showDeckCoach ? " setup-board-preview--coach" : ""}${dealActive ? " setup-board-preview--deal" : ""}${exploreActive ? " setup-board-preview--explore" : ""}${notchActive ? " setup-board-preview--elixir" : ""}${topActive ? " setup-board-preview--monsters" : ""}${monsterSpawnActive ? " setup-board-preview--spawn" : ""}" ${showDeckCoach ? "" : 'aria-hidden="true"'}>
        ${mapSvgHtml(state.board || defaultBoard(), state.roster, {
          schoolById,
          setupCoachPhase: showDeckCoach ? coachPhase : null,
          setupPreview: showBoardMap,
        })}
        ${
          showDeckCoach
            ? `<div class="setup-coach" id="setup-coach" aria-live="polite">
                <div class="setup-coach-bubble" id="setup-coach-bubble" role="dialog" aria-label="Wskazówka">
                  <p class="setup-coach-kicker">${coachCopy.kicker}</p>
                  <p class="setup-coach-text">${coachCopy.text}</p>
                </div>
                <svg class="setup-coach-arrow" id="setup-coach-arrow" aria-hidden="true"></svg>
              </div>
              ${setupMainDeckStackHtml({
                settled: coachPhase > 0 || _setupMainDeckPlaced,
              })}
              ${
                coachPhase >= 1
                  ? `<div class="setup-deal setup-deal--zero${dealRootClass(coachPhase > 1)}" id="setup-deal-zero" data-slots="zero" aria-hidden="true">
                      ${setupDealCardsHtml({
                        costs: [0, 0, 0],
                        settled: coachPhase > 1,
                      })}
                    </div>`
                  : ""
              }
              ${
                coachPhase >= 2
                  ? `<div class="setup-deal setup-deal--rest${dealRootClass(coachPhase > 2)}" id="setup-deal-rest" data-slots="rest" aria-hidden="true">
                      ${setupDealCardsHtml({
                        costs: [1, 2, 1],
                        settled: coachPhase > 2,
                      })}
                    </div>`
                  : ""
              }
              ${exploreActive ? setupExploreDecksHtml({ settled: coachPhase > 3 }) : ""}
              ${elixirActive ? setupElixirDeckHtml({ settled: coachPhase > 4 }) : ""}
              ${trophyActive ? setupTrophyDeckHtml({ settled: coachPhase > 5 }) : ""}
              ${monsterActive ? setupMonsterStacksHtml({ settled: coachPhase > 6 }) : ""}
              ${locFightActive ? setupLocFightHtml({ settled: coachPhase > 7 }) : ""}
              ${goldDiceActive ? setupGoldDiceHtml({ settled: coachPhase > 8 }) : ""}
              ${areaCardsActive ? setupAreaTokensOnCardsHtml({ settled: coachPhase > 9 }) : ""}
              ${monsterSpawnActive ? setupMonsterSpawnHtml({ settled: false }) : ""}`
            : ""
        }
      </div>`
    : "";

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
    enterBoard ? "setup-screen--enter-board" : "",
    enterCoach ? "setup-screen--enter-coach" : "",
    showDeckCoach && (coachPhase > 0 || _setupMainDeckPlaced)
      ? "setup-screen--main-deck-settled"
      : "",
    dealActive ? "setup-screen--deal-zero" : "",
    exploreActive ? "setup-screen--explore-decks" : "",
    notchActive ? "setup-screen--elixir-deck" : "",
    topActive ? "setup-screen--monster-stacks" : "",
    monsterSpawnActive ? "setup-screen--coach-spawn" : "",
    step.id === "monsters" ? "setup-screen--monsters" : "",
    step.id === "map-pawns" ? "setup-screen--map-pawns" : "",
  ]
    .filter(Boolean)
    .join(" ");

  shell(`
    <section class="panel setup-screen${screenMods ? ` ${screenMods}` : ""}">
      <div class="setup-stack">
        <header class="setup-head${isPrepBeforeMonsters ? " setup-head--prep-hero" : ""}">
          ${
            isPrepBeforeMonsters
              ? ""
              : `<div class="progress setup-progress">
            <div class="progress-bar"><span style="width:${pct}%"></span></div>
          </div>`
          }
          <h1>${coachTitle}</h1>
          <div class="home-hero-rule" aria-hidden="true"></div>
        </header>

        <div class="setup-main${showBoardMap ? " setup-main--board" : ""}${
          step.id === "monsters" ? " setup-main--monsters" : ""
        }">
          ${
            showDeckCoach
              ? ""
              : step.id === "map-pawns"
                ? mapPawnsMain
                : String(step.body || "").trim()
                  ? `<div class="step-body">${step.body}</div>`
                  : ""
          }
          ${step.id === "map-pawns" ? "" : boardPreview}
          ${monsterMap}
        </div>

        <div class="actions flow-actions">
          <button type="button" class="btn btn-secondary" id="prev">Wstecz</button>
          ${
            step.nextMode === "turn"
              ? `<button type="button" class="btn btn-primary" id="to-turn">Dalej</button>`
              : `<button type="button" class="btn btn-primary" id="next">Dalej</button>`
          }
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
      const fromCoach =
        step.id === "action-deck" && steps[index - 1]?.id === "board";
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
      const toCoach =
        step.id === "board" && steps[index + 1]?.id === "action-deck";
      const after = () => {
        let nextIndex = Math.min(steps.length - 1, index + 1);
        if (step.id === "action-deck") {
          while (
            nextIndex < steps.length &&
            ["potions", "attr-trophies", "events-explore", "locations", "gold-dice"].includes(
              steps[nextIndex]?.id
            ) /* legacy ids — usunięte z flow, coach na mapie */
          ) {
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

/** Okno + strzałka; fazy 1–2 = pula, faza 3 = miasta / ostępy / zdarzenia. */
function bindSetupDeckCoach(phase = 0) {
  const preview = appEl.querySelector(".setup-board-preview--coach");
  const bubble = appEl.querySelector("#setup-coach-bubble");
  const arrow = appEl.querySelector("#setup-coach-arrow");
  if (!preview || !bubble || !arrow) return;
  const bindGen = ++_coachBindGen;
  _coachResizeAbort?.abort();
  _coachResizeAbort = new AbortController();

  const deck = preview.querySelector('.map-card-slot[data-slot="6"]');
  const slotsOf = (ids) =>
    ids.map((i) => preview.querySelector(`.map-card-slot[data-slot="${i}"]`)).filter(Boolean);

  const zeroSlots = slotsOf(SETUP_POOL_ZERO_SLOTS);
  const restSlots = slotsOf(SETUP_POOL_REST_SLOTS);
  const exploreSlots = slotsOf(SETUP_EXPLORE_SLOTS);
  const elixirSlot = preview.querySelector('.map-card-slot[data-slot="elixir"]');
  const trophySlot = preview.querySelector('.map-card-slot[data-slot="trophy"]');
  const monsterCardSlots = [1, 2, 3]
    .map((lvl) => preview.querySelector(`.map-card-slot[data-slot="monster-card-${lvl}"]`))
    .filter(Boolean);
  const monsterTokenSlots = [1, 2, 3]
    .map((lvl) => preview.querySelector(`[data-slot="monster-token-${lvl}"]`))
    .filter(Boolean);
  const locTokenSlots = ["forest", "mountain", "water"]
    .map((id) => preview.querySelector(`[data-slot="loc-token-${id}"]`))
    .filter(Boolean);
  const fightSlot = preview.querySelector('[data-slot="monster-fight"]');
  const goldBank = preview.querySelector('[data-slot="gold-bank"]');
  const diceTray = preview.querySelector('[data-slot="dice-tray"]');
  const dieSlots = [0, 1, 2, 3, 4]
    .map((i) => preview.querySelector(`[data-slot="die-${i}"]`))
    .filter(Boolean);
  const cardTokenSlots = [0, 1, 2]
    .map((i) => preview.querySelector(`[data-slot="card-token-${i}"]`))
    .filter(Boolean);
  const spawnCardSlots = [0, 1, 2]
    .map((i) => preview.querySelector(`.map-card-slot[data-slot="${i}"]`))
    .filter(Boolean);
  const spawnLocNodes = demoMonsterSetupRows()
    .map((r) => preview.querySelector(`.map-node[data-loc="${r.loc.id}"]`))
    .filter(Boolean);

  const highlight =
    phase === 10
      ? [...spawnCardSlots, ...spawnLocNodes]
      : phase === 9
        ? cardTokenSlots
        : phase === 8
          ? [...(goldBank ? [goldBank] : []), ...(diceTray ? [diceTray] : []), ...dieSlots]
          : phase === 7
            ? [...locTokenSlots, ...(fightSlot ? [fightSlot] : [])]
            : phase === 6
              ? [...monsterCardSlots, ...monsterTokenSlots]
              : phase === 5
                ? trophySlot
                  ? [trophySlot]
                  : []
                : phase === 4
                  ? elixirSlot
                    ? [elixirSlot]
                    : []
                  : phase === 3
                    ? exploreSlots
                    : phase === 2
                      ? restSlots
                      : phase === 1
                        ? zeroSlots
                        : deck
                          ? [deck]
                          : [];
  if (!highlight.length) return;

  highlight.forEach((t) => t.classList.add("is-coach-target"));
  if ((phase >= 1 && phase <= 2 && deck) || _setupMainDeckPlaced) {
    deck?.classList.add("is-coach-deck");
  }
  if (phase >= 2) {
    zeroSlots.forEach((t) => t.classList.add("is-coach-filled"));
  }
  if (phase >= 3) {
    restSlots.forEach((t) => t.classList.add("is-coach-filled"));
  }

  const placeBubble = (anchorEl) => {
    const pr = preview.getBoundingClientRect();
    const tr = anchorEl.getBoundingClientRect();
    if (pr.width < 8 || tr.width < 2) return null;

    const tx = tr.left + tr.width / 2 - pr.left;
    const ty = tr.top + tr.height / 2 - pr.top;
    const bubbleW =
      phase === 10
        ? Math.min(pr.width * 0.28, 300)
        : Math.min(pr.width * 0.52, 352);
    const cornerPhases =
      phase === 3 ||
      phase === 4 ||
      phase === 5 ||
      phase === 6 ||
      phase === 7 ||
      phase === 8 ||
      phase === 9 ||
      phase === 10;
    let bx;
    let by;
    if (phase === 10) {
      /* Po prawej, poza mapą i drewnem (mapa jest dosunięta w lewo) */
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
      /* Nad deskami / mapą — bez zasłaniania wcięć */
      bx =
        phase === 5
          ? Math.max(12, Math.min(pr.width - bubbleW - 12, pr.width * 0.28))
          : Math.max(12, Math.min(pr.width - bubbleW - 12, pr.width * 0.58));
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
    const x1 =
      phase === 10
        ? br.left - pr.left
        : phase === 9
          ? br.left + br.width * 0.35 - pr.left
          : phase === 8
            ? br.left + br.width * 0.28 - pr.left
            : phase === 6 || phase === 7
              ? br.left + br.width * 0.5 - pr.left
              : phase === 5
                ? br.left + br.width * 0.35 - pr.left
                : phase === 4
                  ? br.left + br.width * 0.55 - pr.left
                  : phase === 3
                    ? br.left + br.width * 0.2 - pr.left
                    : br.left + br.width / 2 - pr.left;
    const y1 =
      phase === 10
        ? br.top + br.height * 0.42 - pr.top
        : phase === 6 || phase === 7 || phase === 8 || phase === 9
          ? br.top - pr.top
          : br.top + br.height - pr.top;
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

  const mapWrap = preview.querySelector(".map-wrap");
  if (mapWrap) {
    const dealRoot = appEl.querySelector("#setup-deal-main-deck");
    if (dealRoot && dealRoot.parentElement !== mapWrap) {
      mapWrap.appendChild(dealRoot);
    }
  }

  const layoutMainDeck = () => {
    const dealRoot = appEl.querySelector("#setup-deal-main-deck");
    if (!dealRoot || !deck || !mapWrap) return;
    const origin = mapWrap.getBoundingClientRect();
    const board =
      preview.querySelector(".map-board-united") ||
      preview.querySelector(".map-svg");
    const br = board?.getBoundingClientRect();
    const well = deck.querySelector(".map-card-slot-well");
    const lip = deck.querySelector(".map-card-slot-lip");
    const slotBox = (lip || well || deck).getBoundingClientRect();
    if (origin.width < 8 || slotBox.width < 2 || !br) return;

    const aspect = ACTION_CARD_ASPECT_W / ACTION_CARD_ASPECT_H;
    const gap = 10;
    const landW = slotBox.width;
    const landH = slotBox.height;
    const x1 = slotBox.left - origin.left;
    const y1 = slotBox.top - origin.top;
    let fitRotH = landW;
    let fitRotW = landW * aspect;
    if (fitRotW > landH) {
      fitRotW = landH;
      fitRotH = fitRotW / aspect;
    }
    /* Duży stos na czas tasowania — po prawej od całej planszy (mapa + drewno) */
    let portraitH = Math.min(Math.max(80, br.height * 0.52), 172);
    let portraitW = portraitH * aspect;
    const roomRight = origin.right - br.right - gap - 4;
    if (roomRight > 32 && portraitW > roomRight) {
      portraitW = roomRight;
      portraitH = portraitW / aspect;
    }
    const x0Base = br.right - origin.left + gap;
    const y0Base = br.top - origin.top + 2;

    [...dealRoot.querySelectorAll(".setup-deal-card--main-deck")].forEach((card, i) => {
      const fanX = i * 0.55;
      const fanY = i * -1.35;
      card.style.setProperty("--w", `${portraitW}px`);
      card.style.setProperty("--h", `${portraitH}px`);
      card.style.setProperty("--w1", `${landW}px`);
      card.style.setProperty("--h1", `${landH}px`);
      card.style.setProperty("--x0", `${x0Base + fanX}px`);
      card.style.setProperty("--y0", `${y0Base + fanY}px`);
      card.style.setProperty("--x1", `${x1}px`);
      card.style.setProperty("--y1", `${y1}px`);
      card.style.setProperty("--fit-rot-h", `${fitRotH}px`);
      card.style.setProperty("--fit-rot-w", `${fitRotW}px`);
      card.style.zIndex = String(24 + i);
    });
  };

  const sleep = (ms) => new Promise((r) => window.setTimeout(r, ms));

  const runMainDeckEnter = () => {
    const dealRoot = appEl.querySelector("#setup-deal-main-deck");
    if (!dealRoot) return;
    if (dealRoot.classList.contains("is-settled-layer") && _setupDeckCoachPhase !== 0) return;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      layoutMainDeck();
      settleMainDeckRoot(dealRoot);
      return;
    }
    if (dealRoot.dataset.enterRunning === "1") return;
    dealRoot.dataset.enterRunning = "1";
    const cards = [...dealRoot.querySelectorAll(".setup-deal-card--main-deck")];

    const runShufflePass = () =>
      new Promise((resolve) => {
        dealRoot.classList.remove("is-shuffling");
        void dealRoot.offsetWidth;
        dealRoot.classList.add("is-shuffling");
        window.setTimeout(resolve, 860);
      });

    const waitFrame = () =>
      new Promise((resolve) => requestAnimationFrame(() => resolve()));

    const runFlyToSlot = () =>
      new Promise((resolve) => {
        layoutMainDeck();
        dealRoot.classList.add("is-flying");
        cards.forEach((c) =>
          c.classList.remove("is-dealt", "is-settled", "is-landing", "is-stack-hidden", "is-slot-horizontal")
        );
        cards.forEach((card, i) => {
          window.setTimeout(
            () => card.classList.add("is-dealt", "is-landing", "is-slot-horizontal"),
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

    (async () => {
      dealRoot.classList.remove("is-settled-layer", "is-positioned");
      while (bindGen === _coachBindGen && _setupDeckCoachPhase === 0) {
        resetMainDeckCycle(dealRoot, cards);
        layoutMainDeck();
        await waitFrame();
        layoutMainDeck();
        dealRoot.classList.add("is-idle", "is-ready");
        await waitFrame();
        for (let pass = 0; pass < 3; pass++) {
          if (bindGen !== _coachBindGen || _setupDeckCoachPhase !== 0) break;
          await runShufflePass();
        }
        if (bindGen !== _coachBindGen || _setupDeckCoachPhase !== 0) break;
        dealRoot.classList.remove("is-shuffling");
        await runFlyToSlot();
        applyMainDeckLandedState(dealRoot);
        await sleep(1500);
        if (bindGen !== _coachBindGen || _setupDeckCoachPhase !== 0) break;
        dealRoot.classList.add("is-loop-out");
        cards.forEach((c) => c.classList.add("is-loop-out"));
        await sleep(420);
        dealRoot.classList.remove("is-loop-out");
      }
      if (bindGen === _coachBindGen && _setupDeckCoachPhase === 0) {
        layoutMainDeck();
        applyMainDeckLandedState(dealRoot);
        settleMainDeckRoot(dealRoot);
      }
      delete dealRoot.dataset.enterRunning;
    })();
  };

  const layoutDealGroup = (dealRoot, targetSlots) => {
    if (!dealRoot || !deck || !targetSlots.length) return;
    const pr = preview.getBoundingClientRect();
    const dr = deck.getBoundingClientRect();
    if (pr.width < 8 || dr.width < 2) return;
    const isNotchDeal =
      dealRoot.id === "setup-deal-elixir" || dealRoot.id === "setup-deal-trophy";

    [...dealRoot.querySelectorAll(".setup-deal-card")].forEach((card, i) => {
      const slot = targetSlots[i];
      if (!slot) return;
      const sr = slot.getBoundingClientRect();
      /* Wcięcia: dokładnie szerokość wycięcia */
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
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

    dealRoot.querySelectorAll(".setup-monster-token-chip").forEach((chip, i) => {
      const slot = monsterTokenSlots[i];
      if (!slot) return;
      const sr = slot.getBoundingClientRect();
      const size = Math.max(22, Math.min(sr.width, sr.height) * 1.05);
      chip.style.setProperty("--s", `${size}px`);
      chip.style.setProperty(
        "--x0",
        `${dr.left - pr.left + (dr.width - size) / 2}px`
      );
      chip.style.setProperty(
        "--y0",
        `${dr.top - pr.top + (dr.height - size) / 2}px`
      );
      chip.style.setProperty(
        "--x1",
        `${sr.left - pr.left + (sr.width - size) / 2}px`
      );
      chip.style.setProperty(
        "--y1",
        `${sr.top - pr.top + (sr.height - size) / 2}px`
      );
      chip.style.zIndex = String(26 - i);
    });
  };

  const layoutLocFight = () => {
    if (phase < 7 || !deck) return;
    const dealRoot = appEl.querySelector("#setup-deal-loc-fight");
    if (!dealRoot) return;
    const pr = preview.getBoundingClientRect();
    const dr = deck.getBoundingClientRect();
    if (pr.width < 8 || dr.width < 2) return;

    dealRoot.querySelectorAll(".setup-loc-token-chip").forEach((chip, i) => {
      const slot = locTokenSlots[i];
      if (!slot) return;
      const sr = slot.getBoundingClientRect();
      const size = Math.max(26, Math.min(sr.width, sr.height) * 1.05);
      chip.style.setProperty("--s", `${size}px`);
      chip.style.setProperty("--x0", `${dr.left - pr.left + (dr.width - size) / 2}px`);
      chip.style.setProperty("--y0", `${dr.top - pr.top + (dr.height - size) / 2}px`);
      chip.style.setProperty("--x1", `${sr.left - pr.left + (sr.width - size) / 2}px`);
      chip.style.setProperty("--y1", `${sr.top - pr.top + (sr.height - size) / 2}px`);
      chip.style.zIndex = String(28 - i);
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
    dealRoot.querySelectorAll(".setup-gold-chip").forEach((chip, i) => {
      const slot = goldEls[i] || goldBank;
      if (!slot) return;
      const sr = slot.getBoundingClientRect();
      const size = Math.max(18, Math.min(sr.width, sr.height) * 1.1);
      chip.style.setProperty("--s", `${size}px`);
      chip.style.setProperty("--x0", `${dr.left - pr.left + (dr.width - size) / 2}px`);
      chip.style.setProperty("--y0", `${dr.top - pr.top + (dr.height - size) / 2}px`);
      chip.style.setProperty("--x1", `${sr.left - pr.left + (sr.width - size) / 2}px`);
      chip.style.setProperty("--y1", `${sr.top - pr.top + (sr.height - size) / 2}px`);
      chip.style.zIndex = String(32 - i);
    });

    dealRoot.querySelectorAll(".setup-die-chip").forEach((chip, i) => {
      const slot = dieSlots[i];
      if (!slot) return;
      const sr = slot.getBoundingClientRect();
      const size = Math.max(20, Math.min(sr.width, sr.height) * 1.05);
      chip.style.setProperty("--s", `${size}px`);
      chip.style.setProperty("--x0", `${dr.left - pr.left + (dr.width - size) / 2}px`);
      chip.style.setProperty("--y0", `${dr.top - pr.top + (dr.height - size) / 2}px`);
      chip.style.setProperty("--x1", `${sr.left - pr.left + (sr.width - size) / 2}px`);
      chip.style.setProperty("--y1", `${sr.top - pr.top + (sr.height - size) / 2}px`);
      chip.style.zIndex = String(36 - i);
    });
  };

  const layoutAreaCards = () => {
    if (phase < 9 || !deck) return;
    const dealRoot = appEl.querySelector("#setup-deal-area-cards");
    if (!dealRoot) return;
    const pr = preview.getBoundingClientRect();
    const dr = deck.getBoundingClientRect();
    if (pr.width < 8 || dr.width < 2) return;
    dealRoot.querySelectorAll(".setup-area-card-chip").forEach((chip, i) => {
      const slot = cardTokenSlots[i];
      if (!slot) return;
      const sr = slot.getBoundingClientRect();
      const size = Math.max(24, Math.min(sr.width, sr.height) * 1.08);
      chip.style.setProperty("--s", `${size}px`);
      chip.style.setProperty("--x0", `${dr.left - pr.left + (dr.width - size) / 2}px`);
      chip.style.setProperty("--y0", `${dr.top - pr.top + (dr.height - size) / 2}px`);
      chip.style.setProperty("--x1", `${sr.left - pr.left + (sr.width - size) / 2}px`);
      chip.style.setProperty("--y1", `${sr.top - pr.top + (sr.height - size) / 2}px`);
      chip.style.zIndex = String(45 - i);
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
      /* Mniejsze niż pole — zostaw miejsce na żeton obszaru po prawej */
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

    dealRoot.querySelectorAll(".setup-spawn-token-chip").forEach((chip, i) => {
      const node = spawnLocNodes[i];
      const fromTok = monsterTokenSlots[i] || deck;
      if (!node || !fromTok) return;
      const disc = node.querySelector(".map-node-disc");
      const nr = (disc || node).getBoundingClientRect();
      const fr = fromTok.getBoundingClientRect();
      /* Mniejsze niż dysk lokalizacji — nie zasłania numeru / nazwy */
      const size = Math.max(11, Math.min(nr.width, nr.height) * 0.72);
      chip.style.setProperty("--s", `${size}px`);
      chip.style.setProperty("--x0", `${fr.left - pr.left + (fr.width - size) / 2}px`);
      chip.style.setProperty("--y0", `${fr.top - pr.top + (fr.height - size) / 2}px`);
      chip.style.setProperty("--x1", `${nr.left - pr.left + (nr.width - size) / 2}px`);
      chip.style.setProperty("--y1", `${nr.top - pr.top + (nr.height - size) / 2}px`);
      chip.style.zIndex = String(42 - i);
    });
  };

  const layoutAll = () => {
    layoutMainDeck();
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
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    chips.forEach((chip, i) => {
      window.setTimeout(() => chip.classList.add("is-dealt"), 60 + i * 120);
    });
    if (fightCard) {
      window.setTimeout(() => fightCard.classList.add("is-dealt"), 220);
      window.setTimeout(() => fightCard.classList.add("is-flipped"), 480);
    }
  };

  const runGoldDice = () => {
    const dealRoot = appEl.querySelector("#setup-deal-gold-dice");
    if (!dealRoot || dealRoot.classList.contains("is-settled-layer")) return;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    layoutGoldDice();
    const golds = [...dealRoot.querySelectorAll(".setup-gold-chip")];
    const dice = [...dealRoot.querySelectorAll(".setup-die-chip")];
    const revealSvg = () => {
      /* Zostaw detale z SVG — chipy tylko do animacji dolotu */
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
    dice.forEach((chip, i) => {
      window.setTimeout(() => chip.classList.add("is-dealt"), 40 + i * 80);
    });
    golds.forEach((chip, i) => {
      window.setTimeout(() => chip.classList.add("is-dealt"), 320 + i * 70);
    });
    window.setTimeout(revealSvg, 920);
  };

  const runMonsterStacks = () => {
    const dealRoot = appEl.querySelector("#setup-deal-monsters");
    if (!dealRoot || dealRoot.classList.contains("is-settled-layer")) return;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    chips.forEach((chip, i) => {
      window.setTimeout(() => chip.classList.add("is-dealt"), 180 + i * 160);
    });
  };

  const runAreaCards = () => {
    const dealRoot = appEl.querySelector("#setup-deal-area-cards");
    if (!dealRoot || dealRoot.classList.contains("is-settled-layer")) return;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    layoutAreaCards();
    const chips = [...dealRoot.querySelectorAll(".setup-area-card-chip")];
    if (reduce) {
      chips.forEach((c) => c.classList.add("is-dealt"));
      dealRoot.classList.add("is-ready");
      return;
    }
    dealRoot.classList.add("is-ready");
    chips.forEach((chip, i) => {
      window.setTimeout(() => chip.classList.add("is-dealt"), 70 + i * 140);
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
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    chips.forEach((chip, i) => {
      window.setTimeout(() => chip.classList.add("is-dealt"), 420 + i * 200);
    });
    window.setTimeout(() => applyDemoMonstersToBoard(), 420 + chips.length * 200 + 200);
  };

  const anchor =
    phase === 10
      ? spawnCardSlots[1] || spawnLocNodes[0] || highlight[0]
      : phase === 9
        ? cardTokenSlots[1] || cardTokenSlots[0] || highlight[0]
        : phase === 8
          ? diceTray || goldBank || highlight[0]
          : phase === 7
            ? locTokenSlots[1] || fightSlot || highlight[0]
            : phase === 6
              ? monsterCardSlots[1] || monsterCardSlots[0] || highlight[0]
              : phase === 5
                ? trophySlot || highlight[0]
                : phase === 4
                  ? elixirSlot || highlight[0]
                  : phase === 3
                    ? exploreSlots[1] || exploreSlots[0]
                    : phase >= 1
                      ? highlight[1] || highlight[0]
                      : highlight[0];
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
    afterLayout(() => runDealGroup(appEl.querySelector("#setup-deal-zero")));
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

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function turnShell(title, body) {
  const tabs = [
    ["hub", `${ICO.trophy()} Start`],
    ["I", `${ICO.phase1()}${ICO.move()} Faza I`],
    ["II", `${ICO.phase2()}${ICO.monster()} Faza II`],
    ["III", `${ICO.phase3()}${ICO.cardBlue()} Faza III`],
  ];
  const active = state.turn.phase;
  const p = activePlayer();
  const school = schoolById(p.schoolId);

  shell(`
    <section class="panel">
      <div class="badge-row">
        <span class="player-chip">${schoolIcon(p.schoolId)}${escapeHtml(p.name)} <span>${school.name}</span></span>
        ${isSolo() ? `<span class="badge">Tura ${state.turnNumber || 1}</span>` : ""}
      </div>
      ${soloTurnBadgeHtml()}
      <div class="phase-tabs">
        ${tabs
          .map(
            ([id, label]) =>
              `<button class="phase-tab ${active === id ? "active" : ""}" data-phase="${id}">${label}</button>`
          )
          .join("")}
      </div>
      <p class="step-kicker">Przewodnik tury${isSolo() ? " · solo" : ""}</p>
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
  let moveTo = extra.moveTo !== undefined ? extra.moveTo : state.turn?.moveTo || null;
  let moveCost = extra.moveCost !== undefined ? extra.moveCost : state.turn?.moveCost || null;
  let exploreDeck =
    extra.exploreDeck !== undefined ? extra.exploreDeck : state.turn?.exploreDeck || null;
  let fightResult =
    extra.fightResult !== undefined ? extra.fightResult : state.turn?.fightResult || null;
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
    else if (
      screen === "fight" ||
      screen === "fight-monster" ||
      screen === "fight-monster-result" ||
      screen === "fight-witcher"
    )
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
    // Pełna runda: gdy wracamy do pierwszego gracza, +1 tura
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
        <button type="button" class="btn btn-secondary" data-turn-delta="-1" title="Cofnij turę" ${n <= 1 ? "disabled" : ""}>−</button>
        <button type="button" class="btn btn-secondary" data-turn-delta="1" title="Dodaj turę">+</button>
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

/** Krok „Potwory na start” — tylko mapa + panel, bez pełnego render(). */
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
    stage.outerHTML = mapSvgHtml(state.board, state.roster, { schoolById });
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
        const result = setMonsterForTerrain(state.board, terrain, null);
        if (!result.ok) state.board.placeError = result.reason;
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
      }
      else if (goto === "fight") setTurn("II", "fight");
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
    isSolo: isSolo(),
  });
}

function bindMovePick() {
  appEl.querySelectorAll("[data-move-to]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const toId = btn.getAttribute("data-move-to");
      setTurn("I", "move-cost", { moveTo: toId, moveCost: null });
    });
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

/** Po opłaceniu ruchu: najpierw popup zmian (atrybuty/poziom), potem walka / po ruchu. */
function finishMoveTo(p, toId, costId) {
  p.nowDoing = "faza1";
  setTurn("I", "field-confirm", { moveTo: toId, moveCost: costId });
}

function proceedAfterFieldConfirm(p) {
  // Instrukcja: wejście na potwora NIE wymusza walki. Walka = opcjonalny wybór w fazie II.
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
      // Przy akcji tropienia wybierasz 1 potwora (1 przycisk). Limit zasad: max 1 trop na teren.
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
    // najpierw atrybuty/szkoła/złoto/eliksir, na końcu awans poziomu
    const ordered = checks
      .map((el) => el.getAttribute("data-field-action"))
      .filter(Boolean)
      .sort((a, b) => (a === "level:up") - (b === "level:up"));
    for (const id of ordered) {
      const res = applyFieldChange(player, id);
      if (!res.ok) {
        window.alert(res.reason || "Nie udało się zastosować zmiany.");
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
        window.alert("Wybierz lokację zadania.");
        return;
      }
      player.quests.push({
        id: newQuestId(),
        title: title.replace(/[<>]/g, ""),
        locationId,
        eventCard: eventCard.replace(/[<>]/g, ""),
        note: note.replace(/[<>]/g, ""),
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
  wrap.innerHTML = buttons
    .map(
      (b) =>
        `<button class="btn ${b.primary ? "btn-primary" : "btn-secondary"}" data-act="${b.id}">${b.label}</button>`
    )
    .join("");
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
    const picker = solo
      ? ""
      : `<h3>Aktywny gracz</h3>
         <div class="choice-grid">
           ${state.roster
             .map(
               (r, i) => `
             <button class="choice ${i === state.activeIndex ? "active" : ""}" data-active="${i}">
               <strong>${escapeHtml(r.name)}</strong>
               <span>${schoolById(r.schoolId).name}${i === 0 ? " · pierwszy" : ""}</span>
             </button>`
             )
             .join("")}
         </div>`;

    turnShell(
      solo ? `Twoja tura · nr ${state.turnNumber || 1}` : `Tura: ${escapeHtml(p.name)}`,
      `
        ${picker}
        <p class="lead">${
          solo
            ? "Fazy I → II → III. Licznik tur liczy się automatycznie (po „Koniec tury”). Start: 5 kart, 3 złota."
            : "Aktywny rozgrywa I → II → III. Kolejność zgodnie z zegarem (pierwszy = index 0 w składzie)."
        }</p>
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
        label: `Zaczynam fazę I (${escapeHtml(p.name)})`,
        primary: true,
        onClick: () => {
          p.nowDoing = "faza1";
          saveState();
          setTurn("I", "phase1-start");
        },
      },
      {
        id: "to-board",
        label: "Stół — mapa / reputacja / karty",
        onClick: () => go("board"),
      },
    ]);
    return;
  }

  if (screen === "phase1-start") {
    turnShell(
      "Faza I — start",
      `
        <p class="lead"><strong>${escapeHtml(p.name)}</strong>: <em>obowiązkowy ruch</em> albo od razu faza II. Nie zaczynasz akcją na polu, na którym już stoisz.</p>
        <div class="choice-grid">
          <button class="choice" data-goto="move"><strong>Ruszam się</strong><span>Mapa — kliknij sąsiada</span></button>
          <button class="choice" data-goto="phase2"><strong>Idę do fazy II</strong><span>Bez ruchu</span></button>
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
    const destOk =
      state.turn.moveTo && neighborsOf(fromId).includes(state.turn.moveTo);
    if (destOk) state.board.selectedLoc = state.turn.moveTo;
    const popupInner = destOk
      ? mapLocPopupHtml(state.turn.moveTo, {
          player: p,
          roster: state.roster,
          monsters: state.board.monsters,
        })
      : null;
    turnShell(
      "Faza I — ruch na mapie",
      `
        <p class="lead"><strong>${escapeHtml(p.name)}</strong> · kliknij sąsiada (złota obwódka). Opis wyskoczy nad mapą — bez przeładowania strony.</p>
        ${mapSvgHtml(state.board, state.roster, {
          schoolById,
          highlightFromId: fromId,
          popupHtml: popupInner,
        })}
        <div id="move-pick-footer">
          ${
            destOk
              ? `<p class="tip" style="margin:0.55rem 0 0">Wybrano: <strong>${escapeHtml(
                  locById(state.turn.moveTo)?.name || "?"
                )}</strong></p>
                 <div class="actions"><button type="button" class="btn btn-primary" id="confirm-dest">Idę tutaj — wybór kosztu</button></div>`
              : `<p class="tip">Kliknij <strong>podświetlone</strong> pole — krótki opis pojawi się nad mapą (3 s / klik poza).</p>`
          }
        </div>
      `
    );
    if (destOk) bindMapLocPopup(appEl);

    const updateMovePickSelection = (toId) => {
      if (!neighborsOf(fromId).includes(toId)) return;
      state.board.selectedLoc = toId;
      state.turn = {
        ...(state.turn || {}),
        phase: "I",
        screen: "move-pick",
        moveTo: toId,
        moveCost: null,
        exploreDeck: state.turn?.exploreDeck || null,
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
          monsters: state.board.monsters,
        });
        bindMapLocPopup(appEl);
      }

      const footer = appEl.querySelector("#move-pick-footer");
      if (footer) {
        const name = locById(toId)?.name || "?";
        footer.innerHTML = `
          <p class="tip" style="margin:0.55rem 0 0">Wybrano: <strong>${escapeHtml(name)}</strong></p>
          <div class="actions"><button type="button" class="btn btn-primary" id="confirm-dest">Idę tutaj — wybór kosztu</button></div>`;
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
        label: "Wróć",
        onClick: () => {
          state.board.highlightFrom = null;
          setTurn("I", "phase1-start", { clearMove: true });
        },
      },
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
      "Faza I — koszt ruchu",
      `
        ${destinationPreviewHtml(to.id, {
          player: p,
          roster: state.roster,
          monsters: state.board.monsters,
        })}
        ${moveCostChooserHtml({
          fromLoc: from,
          toLoc: to,
          playerName: p.name,
          selectedCostId: state.turn.moveCost,
        })}
        <p class="tip">Tracker: <strong>${p.cards ?? 0}</strong> kart · <strong>${p.gold ?? 0}</strong> złota — po wyborze odejmiemy koszt.</p>
      `
    );
    bindMoveCostTurn();
    addTurnButtons([
      { id: "back", label: "Inny cel", onClick: () => setTurn("I", "move-pick", { clearMove: true }) },
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
      "Faza I — zmiany na planszetce",
      `
        ${questArrivalHtml(p, here.id)}
        <p class="lead">Weszłeś na <strong>${escapeHtml(here.name)}</strong>. Potwierdź, co zmieniasz (atrybuty / złoto / eliksir / poziom).</p>
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
      "Faza I — po ruchu",
      `
        ${questArrivalHtml(p, p.locationId)}
        ${mon && here ? monsterEncounterHtml(here, mon) : ""}
        <p class="lead">Jesteś na <strong>${here ? escapeHtml(here.name) : "—"}</strong>. Możesz zrobić akcje obszaru, rozwiązać zadanie, ruszyć się znowu albo przejść do fazy II.</p>
        ${locationActionGuideHtml(here)}
        ${phase1AfterMove(solo)}
        <div class="choice-grid">
          <button class="choice" data-goto="move"><strong>Ruszam się znowu</strong><span>Znowu wybór celu + koszt kart</span></button>
          <button class="choice" data-goto="phase2"><strong>Przechodzę do fazy II</strong><span>Walka / medytacja / eksploracja — wybór 1</span></button>
        </div>
        <details style="margin-top:1rem"><summary><strong>Ściąga wszystkich akcji obszarów</strong></summary>${LOCATION_ACTIONS}</details>
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
    // Bez celu walki i bez medytacji → od razu eksploracja
    if (!fight.can && !med.can) {
      p.nowDoing = "eksploracja";
      saveState();
      setTurn("II", "explore");
      return;
    }
    turnShell(
      "Faza II — wybór",
      `
        ${
          med.can
            ? `<p class="tip choice-meditate-ready" style="padding:0.7rem 0.9rem"><strong>Medytacja dostępna!</strong> ${escapeHtml(med.reason)}</p>`
            : `<p class="note">${escapeHtml(med.reason)}</p>`
        }
        ${
          fight.can
            ? `<p class="tip" style="padding:0.55rem 0.9rem">${escapeHtml(fight.reason)}</p>`
            : `<p class="note">${escapeHtml(fight.reason)}</p>`
        }
        ${phase2Choices(solo, {
          meditateEnabled: med.can,
          meditateHint: med.reason,
          fightEnabled: fight.can,
          fightHint: fight.can
            ? solo
              ? "Na Twoim obszarze"
              : "Z potworem lub wiedźminem"
            : fight.reason,
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
    // Multi: jeden możliwy typ → od razu tam
    if (fight.canMonster && !fight.canWitcher) {
      setTurn("II", "fight-monster");
      return;
    }
    if (!fight.canMonster && fight.canWitcher) {
      setTurn("II", "fight-witcher");
      return;
    }
    turnShell(
      "Walka — typ",
      fightBranchHtml({
        monsterEnabled: fight.canMonster,
        witcherEnabled: fight.canWitcher,
        hint: fight.reason,
      })
    );
    bindChoices();
    addTurnButtons([
      { id: "back", label: "Wróć", onClick: () => setTurn("II", "phase2") },
    ]);
    return;
  }

  if (screen === "fight-monster") {
    const here = locById(p.locationId);
    const mon = monsterAt(state.board, p.locationId);
    if (!here || !mon) {
      // Nie skacz do eksploracji — po walce jest faza III (albo wynik).
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
      "Walka z potworem — co teraz?",
      `
        ${monsterEncounterHtml(here, mon)}
        ${questArrivalHtml(p, p.locationId)}
        <p class="${hasTrail ? "tip" : "warn"}"><strong>Żeton tropu:</strong> ${
          hasTrail
            ? `Masz trop terenu tego pola (${here?.terrain || "?"}) → <strong>Ty zaczynasz</strong> walkę.`
            : `Brak tropu na ten teren → <strong>najpierw tura potwora</strong>.`
        }</p>
        ${attrsAdjustHtml(p)}
        ${trailsHtml(p, { editable: true, board: state.board })}
        ${resourceAdjustHtml(p, { title: "Karty / złoto / eliksiry w walce" })}
        ${fightMonster(solo)}
        <div class="guide-box" style="margin-top:0.85rem">
          <p class="step-kicker" style="margin:0">Wynik walki</p>
          <p class="lead" style="margin:0.35rem 0 0">Faza II = <strong>1 wybór</strong> (walka <em>albo</em> medytacja <em>albo</em> eksploracja). Po walce idziesz do <strong>fazy III</strong> — nie eksplorujesz w tej samej turze.</p>
          <div class="choice-grid" style="margin-top:0.65rem">
            <button type="button" class="choice" data-fight-outcome="defeat"><strong>Pokonany</strong><span>Talia potwora = 0</span></button>
            <button type="button" class="choice" data-fight-outcome="drive"><strong>Odpędzony</strong><span>Ty padłeś, u potwora &lt; 2 kart</span></button>
            <button type="button" class="choice" data-fight-outcome="loss"><strong>Klęska</strong><span>Ty padłeś, u potwora ≥ 2 kart</span></button>
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
          monster: mon,
        });
        if (plan.removeMonster && p.locationId) {
          delete state.board.monsters[p.locationId];
        }
        state.board.placeError = null;
        setTurn("II", "fight-monster-result", { fightResult: plan });
      });
    });
    addTurnButtons([
      { id: "back", label: "Wróć", onClick: () => setTurn("II", solo ? "phase2" : "fight") },
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
      // Utrzymaj wymagany poziom na slocie, jeśli już wybrano numer
      const cur = state.board.monsters
        ? Object.entries(state.board.monsters).find(([id, m]) => {
            if (!m || !(m.count > 0)) return false;
            const loc = locById(id);
            return loc?.terrain === plan.terrain;
          })
        : null;
      if (cur) {
        const [id] = cur;
        state.board.monsters[id] = {
          count: 1,
          level: normalizeMonsterLevel(plan.spawnLevel),
          label: `Poz. ${normalizeMonsterLevel(plan.spawnLevel)}`,
        };
      }
    }
    const spawnReady =
      !plan.needsSpawn ||
      Boolean(
        plan.terrain &&
          Object.entries(state.board.monsters || {}).some(([id, m]) => {
            if (!m || !(m.count > 0)) return false;
            return locById(id)?.terrain === plan.terrain;
          })
      );
    turnShell(
      `Po walce — ${plan.title}`,
      `
        <div class="guide-box">
          <p class="lead" style="margin:0">${plan.summary}</p>
          ${
            plan.spawnHint
              ? `<p class="tip" style="margin:0.55rem 0 0">${plan.spawnHint}</p>`
              : ""
          }
          <p class="note" style="margin:0.55rem 0 0">Dalej: <strong>faza III</strong> (dobór / kupno). Eksploracja to osobny wybór fazy II — nie robisz jej po walce w tej turze.</p>
        </div>
        ${
          plan.needsSpawn && plan.terrain
            ? monsterSpawnSlotHtml(state.board, {
                terrain: plan.terrain,
                level: plan.spawnLevel,
              })
            : ""
        }
        ${
          plan.needsSpawn && !spawnReady
            ? `<p class="warn" style="margin-top:0.6rem">Ustaw numer obszaru strzałkami (teren „${escapeHtml(
                plan.terrainLabel || ""
              )}”), potem przejdź do fazy III.</p>`
            : ""
        }
      `
    );
    if (plan.needsSpawn) {
      // cycle/num with locked level
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
            level: normalizeMonsterLevel(plan.spawnLevel),
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
        label: spawnReady ? "Dalej → faza III" : "Pomiń spawn → faza III",
        primary: true,
        onClick: () => {
          p.nowDoing = "faza3";
          setTurn("III", "phase3", { clearFightResult: true });
        },
      },
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
      "Walka z wiedźminem",
      `
        ${attrsAdjustHtml(p)}
        ${resourceAdjustHtml(p, { title: "Karty / złoto" })}
        ${FIGHT_WITCHER}
      `
    );
    bindResourceAdjust(p);
    bindAttrAdjust(p);
    addTurnButtons([
      { id: "to3", label: "Koniec walki → faza III", primary: true, onClick: () => setTurn("III", "phase3") },
      { id: "back", label: "Wróć", onClick: () => setTurn("II", "fight") },
    ]);
    return;
  }

  if (screen === "meditate") {
    ensureCombatTrack(p);
    const med = meditationStatus(p, { isSolo: solo });
    if (!med.can) {
      turnShell(
        "Medytacja — niedostępna",
        `
          <p class="warn">${escapeHtml(med.reason)}</p>
          ${meditate(solo)}
          ${attrsAdjustHtml(p)}
          <p class="note">${escapeHtml(med.soloNote)}</p>
        `
      );
      bindAttrAdjust(p);
      addTurnButtons([{ id: "back", label: "Wróć", onClick: () => setTurn("II", "phase2") }]);
      return;
    }
    turnShell(
      "Medytacja",
      `
        <p class="tip"><strong>OK — możesz medytować.</strong> ${escapeHtml(med.reason)}</p>
        ${meditate(solo)}
        ${attrsAdjustHtml(p)}
        <div class="actions" style="margin:0.6rem 0">
          ${med.available
            .map(
              (id) =>
                `<button type="button" class="btn btn-primary" data-take-trophy="${id}">Weź trofeum: ${ATTR_KEYS.find((a) => a.id === id)?.label || id}</button>`
            )
            .join("")}
        </div>
        <p class="note">${escapeHtml(med.soloNote)}</p>
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
      { id: "to3", label: "Dalej → faza III", primary: true, onClick: () => setTurn("III", "phase3") },
      { id: "back", label: "Wróć", onClick: () => setTurn("II", "phase2") },
    ]);
    return;
  }

  if (screen === "explore") {
    // nic nie zaznaczone na starcie — dopiero klik w kartę
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
      { id: "back", label: "Wróć", onClick: () => setTurn("II", "phase2", { clearExplore: true }) },
    ]);
    return;
  }

  if (screen === "explore-resolve") {
    const deck = state.turn.exploreDeck || "city";
    turnShell(
      "Eksploracja — po karcie",
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
        label: "Dalej → faza III",
        primary: true,
        onClick: () => setTurn("III", "phase3", { clearExplore: true }),
      },
      {
        id: "back-deck",
        label: "Inna talia",
        onClick: () => setTurn("II", "explore", { clearExplore: true }),
      },
    ]);
    return;
  }

  if (screen === "phase3") {
    const hint = phase3DrawHint(p.cards || 0);
    turnShell(
      "Faza III — dobór i zakup",
      `
        ${phase3(solo)}
        ${resourceAdjustHtml(p, { title: "Po doborze / kupnie — ustaw tracker" })}
        <p class="tip">${escapeHtml(hint.note)}</p>
        <div class="actions" style="margin:0.5rem 0">
          <button type="button" class="btn btn-secondary" id="phase3-set-hand">Ustaw rękę na 3 (po doborze)</button>
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
        onClick: () => setTurn("III", "turn-summary"),
      },
      {
        id: "to-board",
        label: "Stół — mapa / reputacja / karty",
        onClick: () => go("board"),
      },
    ]);
    return;
  }

  if (screen === "turn-summary") {
    const hint = phase3DrawHint(p.cards || 0);
    const next = state.roster[(state.activeIndex + 1) % state.players];
    turnShell(
      solo ? `Podsumowanie · tura ${state.turnNumber || 1}` : "Podsumowanie tury",
      turnSummaryHtml(p, {
        phase3Hint: hint,
        schoolName: schoolById(p.schoolId).short,
        turnNumber: state.turnNumber || 1,
        isSolo: solo,
      })
    );
    bindQuestForms(p);
    addTurnButtons([
      {
        id: "next",
        label: solo
          ? `Koniec tury ${state.turnNumber || 1} → start tury ${(state.turnNumber || 1) + 1}`
          : `Koniec tury → ${escapeHtml(next.name)}`,
        primary: true,
        onClick: () => nextPlayer(),
      },
      {
        id: "back-p3",
        label: "Wróć do fazy III",
        onClick: () => setTurn("III", "phase3"),
      },
    ]);
  }
}

function renderBoard() {
  const board = state.board;
  shell(`
    <section class="panel board-panel">
      <p class="step-kicker">Przy stole · mapa i status</p>
      <h1>Stół</h1>
      <p class="lead">Schemat mapy do oznaczania potworów i wiedźminów (możesz obracać). Jak przesuniesz wiedźmina na sąsiada — wyskoczy wybór kosztu ruchu (1 karta / 2 karty / 1+złoto). Przyciski „co robi teraz” prowadzą za rękę (m.in. eksploracja wg znaków pola).</p>

      <h2>Mapa (schemat)</h2>
      ${mapToolbarHtml(board, state.roster)}
      ${mapSvgHtml(board, state.roster, {
        schoolById,
        highlightFromId:
          board.highlightFrom ||
          board.movePrompt?.fromId ||
          (activePlayer()?.nowDoing === "faza1" ? activePlayer()?.locationId : null),
      })}
      ${selectedLocPanel(board, state.roster)}
      ${
        (board.highlightFrom || activePlayer()?.nowDoing === "faza1") && activePlayer()?.locationId
          ? neighborPickerHtml(board.highlightFrom || activePlayer().locationId, {
              player: activePlayer(),
              monsters: board.monsters,
            })
          : ""
      }
      ${movePromptHtml(board, state.roster)}
      ${
        board.movePrompt
          ? `<div class="actions" style="margin:0.5rem 0 1rem">
              <button type="button" class="btn btn-secondary" id="dismiss-move-prompt">Anuluj ten ruch (cofnij pionek)</button>
            </div>`
          : ""
      }

      ${monstersPanelHtml(board)}

      <h2>Gracze — reputacja i karty</h2>
      <div class="tracker-list">
        ${playerTrackerHtml(state.roster, {
          schoolById,
          isSolo: isSolo(),
          activeIndex: state.activeIndex,
          START_RESOURCES,
          players: state.players,
        })}
      </div>

      <div class="actions">
        <button class="btn btn-primary" id="to-turn">Prowadź turę</button>
        <button class="btn btn-secondary" id="to-icons">Co oznaczają symbole?</button>
        <button class="btn btn-secondary" id="reset-board">Wyczyść tylko mapę</button>
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
        window.alert("To nie jest sąsiad po ścieżce.");
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
        costId: null,
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
      if (
        !window.confirm(
          `+1 reputacja → ${next}. Usunąć z gry ${lose} kart(y) z ręki (uproszczenie trackera)? Na stole możesz brać też z talii/odrzuconych.`
        )
      ) {
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
    if (!window.confirm("Wyczyścić tylko mapę (potwory i pozycje wiedźminów)?")) return;
    state.board = defaultBoard();
    state.roster.forEach((p) => {
      p.locationId = null;
    });
    saveState();
    render();
  });
}

function resourcesTable(n) {
  const rows = START_RESOURCES[n]
    .map((r, i) => {
      const who = state.roster[i]
        ? `${escapeHtml(state.roster[i].name)} (${schoolById(state.roster[i].schoolId).short})`
        : n === 1
          ? "Ty (solo)"
          : PLAYER_LABELS[i];
      return `<tr><th>${who}</th><td>${r.cards} kart(y)</td><td>${r.gold} złota</td></tr>`;
    })
    .join("");
  return `<table class="table"><thead><tr><th>Gracz</th><th>Karty</th><th>Złoto</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function renderRef() {
  shell(`
    <section class="panel">
      <p class="step-kicker">Na szybko</p>
      <h1>Ściąga${isSolo() ? " · solo" : ""}</h1>
      ${quickRef(isSolo())}
      ${LOCATION_ACTIONS}
      <div class="actions">
        <button class="btn btn-primary" id="to-turn">Wróć do tury</button>
        <button class="btn btn-secondary" id="to-sources">Źródła i FAQ</button>
        <button class="btn btn-secondary" id="reset">Wyczyść zapis</button>
      </div>
    </section>
  `);
  appEl.querySelector("#to-turn").addEventListener("click", () => go("turn"));
  appEl.querySelector("#to-sources").addEventListener("click", () => go("sources"));
  appEl.querySelector("#reset").addEventListener("click", () => {
    if (!window.confirm("Wyczyścić cały zapis helpera (gracze, mapa, reputacja)?")) return;
    startNewAdventure();
  });
}

function renderIcons() {
  shell(`
    <section class="panel">
      <p class="step-kicker">Ściąga symboli</p>
      <h1>Ikony</h1>
      ${iconsLegendHtml()}
      <div class="actions">
        <button class="btn btn-primary" id="to-turn">Do tury</button>
        <button class="btn btn-secondary" id="to-lexicon">Leksykon szkół</button>
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
      <p class="step-kicker">Podstawka · przy stole</p>
      <h1>Leksykon</h1>
      ${
        mine
          ? `<p class="tip"><strong>Aktywny (${escapeHtml(activePlayer().name)}):</strong> ${mine.name}<br>${mine.body}</p>`
          : ""
      }
      ${lexiconHtml()}
      <div class="actions">
        <button class="btn btn-primary" id="to-turn">Do tury</button>
        <button class="btn btn-secondary" id="to-sources">Źródła / FAQ</button>
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
      <h1>Źródła, filmy, FAQ</h1>
      ${sourcesHtml()}
      <div class="actions">
        <button class="btn btn-primary" id="to-home">Wróć</button>
      </div>
    </section>
  `);
  appEl.querySelector("#to-home").addEventListener("click", () => go("home"));
}

render();
