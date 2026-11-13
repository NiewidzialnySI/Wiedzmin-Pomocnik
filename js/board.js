/**
 * Uproszczona mapa-schemat + helpery trackera przy stole.
 * Nie jest kopią oficjalnej grafiki — tylko nazwy lokacji i przybliżone pozycje.
 */
import {
  LOCATIONS,
  ROADS,
  TERRAIN,
  locById,
  neighborsOf,
  actionHintFor,
  fatigueForReputation,
  schoolStartId,
  placeAtSchool,
} from "./map-data.js";
import { ICO, SCHOOL_ICON, actionIconHtml, goldCoinsHtml, actionCardsHtml } from "./icons.js";
import { schoolRepTokenSrc, MAP_PREP_PAWN_ASSET_V } from "./map-prep-pawns.js";
import { nowDoingGuideHtml, moveCostChooserHtml } from "./guide.js";
import { MAP_FLAG } from "./map/constants.js";
import { woodCardLayout } from "./map/wood-card-layout.js";
import { mapSvgDefsHtml } from "./map/svg-defs.js";
import { mapStageOpen, mapStageClose, mapWrapOpen, mapSvgOpen, mapSvgClose } from "./map/compose-stage.js";
import { woodCardPanelSvg } from "./map/layers/wood-panel.js";
import { woodCardSlotsSvg } from "./map/layers/card-slots.js";
import { roundFlagSvg } from "./map/layers/round-flags.js";
import { monsterLevelStacksSvg } from "./map/layers/monster-stacks.js";
import { locationTokensAndFightDeckSvg } from "./map/layers/location-fight.js";
import { goldBankAndDiceSvg } from "./map/layers/gold-dice.js";

export { woodCardPanelSvg, woodCardSlotsSvg, roundFlagSvg, monsterLevelStacksSvg, locationTokensAndFightDeckSvg, goldBankAndDiceSvg };

export const NOW_ACTIONS = [
  { id: "czekam", label: "Czeka" },
  { id: "faza1", label: "Faza I — ruch" },
  { id: "poker", label: "Poker / akcja obszaru" },
  { id: "walka", label: "Walka" },
  { id: "medytacja", label: "Medytacja" },
  { id: "eksploracja", label: "Eksploracja" },
  { id: "faza3", label: "Faza III — dobór/kupno" },
];

export function defaultBoard() {
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
    roundFlag: "I",
  };
}

/** Zapisz, kto ostatnio zdobył dany poziom reputacji. */
export function noteReputationClaim(board, schoolId, level) {
  if (!board) return;
  if (!Array.isArray(board.repClaim) || board.repClaim.length !== 5) {
    board.repClaim = [null, null, null, null, null];
  }
  const n = Math.min(4, Math.max(0, Math.round(Number(level) || 0)));
  board.repClaim[n] = schoolId || null;
}

/**
 * Uzupełnia kolory na torze reputacji.
 * Poziom 0: wszyscy startują — losowy cech spośród obecnych (gdy brak / wyszedł).
 * Poziomy 1–4: tylko gdy brak claimu, a ktoś już stoi na poziomie.
 */
export function ensureReputationClaims(board, roster = []) {
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

export function monsterAt(board, locId) {
  const m = board?.monsters?.[locId];
  if (!m || !(m.count > 0)) return null;
  return m;
}

export function monstersList(board) {
  return Object.entries(board?.monsters || {})
    .filter(([, m]) => m && m.count > 0)
    .map(([id, m]) => ({ id, loc: locById(id), ...m }))
    .filter((row) => row.loc);
}

export const MONSTER_TERRAINS = ["forest", "mountain", "water"];

/**
 * Lokacje danego terenu z żetonem obszaru (do wyboru numeru potwora).
 * Behelt Nar (0, Szkoła Mantikory) nie ma żetonu obszaru — instrukcja str. 11.
 * Pozostałe szkoły (Kaer Seren itd.) mają żetony i potwór może tam stanąć
 * (nawet razem z wiedźminem; walka z potworem na szkole jest dozwolona).
 */
export function locationsForTerrain(terrain) {
  return LOCATIONS.filter(
    (l) =>
      l.terrain === terrain &&
      typeof l.number === "number" &&
      l.number !== 0 &&
      l.id !== "behelt-nar"
  ).sort((a, b) => a.number - b.number);
}

/** Inny potwór już zajmuje ten sam rodzaj terenu (las / góry / woda). */
export function monsterOccupyingTerrain(board, terrain, exceptLocId = null) {
  if (!terrain || !MONSTER_TERRAINS.includes(terrain)) return null;
  for (const row of monstersList(board)) {
    if (exceptLocId && row.id === exceptLocId) continue;
    if (row.loc.terrain === terrain) return row;
  }
  return null;
}

/**
 * Ustaw potwora dla slotu terenu (max 1 na las/góry/wodę).
 * locId = null → wyczyść slot. Zawsze jeden żeton na teren.
 */
export function setMonsterForTerrain(board, terrain, locId, { level } = {}) {
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
      reason: `Lokacja ${loc.name} to ${TERRAIN[loc.terrain]?.label || loc.terrain}, nie ${
        TERRAIN[terrain]?.label || terrain
      }.`,
    };
  }
  if (loc.number === 0 || loc.id === "behelt-nar") {
    return {
      ok: false,
      reason: "Behelt Nar (0) nie ma żetonu obszaru — tu nie stawia się potworów.",
    };
  }
  const lv = level || "I";
  board.monsters[locId] = { count: 1, level: lv, label: `Poz. ${lv}` };
  board.placeError = null;
  board.selectedLoc = locId;
  return { ok: true, placed: true, level: lv, loc };
}

/** Przewiń numer obszaru w slocie terenu (mysz: ◀ ▶). */
export function cycleMonsterTerrain(board, terrain, delta) {
  const opts = locationsForTerrain(terrain);
  if (!opts.length) return { ok: false, reason: "Brak lokacji." };
  const cur = monsterOccupyingTerrain(board, terrain);
  let idx = cur ? opts.findIndex((l) => l.id === cur.id) : -1;
  if (idx < 0) idx = delta > 0 ? -1 : 0;
  const next = opts[(idx + delta + opts.length) % opts.length];
  const level = cur?.level || "I";
  return setMonsterForTerrain(board, terrain, next.id, { level });
}

/** Ustaw slot terenu po numerze z planszy (0–18). */
export function setMonsterTerrainByNumber(board, terrain, number, { level } = {}) {
  const n = Number(number);
  if (!Number.isFinite(n)) return { ok: false, reason: "Podaj numer obszaru." };
  const loc = locationsForTerrain(terrain).find((l) => l.number === n);
  if (!loc) {
    const nums = locationsForTerrain(terrain)
      .map((l) => l.number)
      .join(", ");
    return {
      ok: false,
      reason: `Numer ${n} nie należy do terenu „${TERRAIN[terrain]?.label || terrain}”. Dostępne: ${nums}.`,
    };
  }
  const cur = monsterOccupyingTerrain(board, terrain);
  return setMonsterForTerrain(board, terrain, loc.id, {
    level: level || cur?.level || "I",
  });
}

export function setMonsterTerrainLevel(board, terrain, level) {
  const cur = monsterOccupyingTerrain(board, terrain);
  if (!cur) {
    return { ok: false, reason: "Najpierw wybierz numer obszaru dla tego terenu." };
  }
  board.monsters[cur.id] = {
    count: 1,
    level,
    label: `Poz. ${level}`,
  };
  board.placeError = null;
  return { ok: true };
}

/** Stare zapisy: max 1 potwór na teren, count zawsze 1. */
export function sanitizeMonstersUniqueTerrain(board) {
  if (!board?.monsters) return board;
  const seen = Object.create(null);
  for (const id of Object.keys(board.monsters)) {
    const m = board.monsters[id];
    if (!m || !(m.count > 0)) {
      delete board.monsters[id];
      continue;
    }
    const loc = locById(id);
    if (
      !loc ||
      !MONSTER_TERRAINS.includes(loc.terrain) ||
      loc.number === 0 ||
      loc.id === "behelt-nar"
    ) {
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

export function monsterEncounterHtml(loc, monster) {
  if (!loc || !monster) return "";
  const lvl = monster.level ? ` poziom ${escapeHtml(String(monster.level))}` : "";
  const label = monster.label ? ` — ${escapeHtml(monster.label)}` : "";
  return `
    <div class="guide-box guide-monster-hit" role="status">
      <p class="step-kicker" style="margin:0">${ICO.monster()} Potwór na polu</p>
      <h3 style="margin:0.25rem 0 0.4rem">Na <strong>${escapeHtml(loc.name)}</strong> stoi potwór${lvl}${label}</h3>
      <p class="lead" style="margin:0"><strong>Nie musisz walczyć.</strong> Instrukcja: w fazie II <em>możesz</em> walczyć z potworem na tym samym obszarze — albo wybrać medytację albo eksplorację.</p>
      <p class="note" style="margin:0.45rem 0 0">Teraz jesteś w fazie I: akcje obszaru / zadanie / kolejny ruch. Walka dopiero gdy w fazie II wybierzesz „Walka”.</p>
    </div>
  `;
}

const LEVEL_ORDER = ["I", "II", "III"];

export function normalizeMonsterLevel(level) {
  const s = String(level || "I").toUpperCase();
  if (s === "1" || s === "I") return "I";
  if (s === "2" || s === "II") return "II";
  if (s === "3" || s === "III") return "III";
  return LEVEL_ORDER.includes(s) ? s : "I";
}

/** Po pokonaniu: I→II, II→III, III→III. */
export function nextMonsterLevelAfterDefeat(level) {
  const lv = normalizeMonsterLevel(level);
  if (lv === "I") return "II";
  return "III";
}

/**
 * Wynik walki z potworem → co zrobić z żetonem (instrukcja + solo).
 * kind: defeat | drive | loss
 */
export function monsterFightOutcomePlan({ kind, isSolo, loc, monster }) {
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
      title: "Klęska",
      summary: `Potwór zostaje na <strong>${escapeHtml(locName)}</strong> (poz. ${escapeHtml(
        level
      )}). Przy następnej walce ma pełną talię. Weź trop terenu „${escapeHtml(
        terrainLabel
      )}” (jeśli go nie masz) i 1 kartę kosztu 0 na odrzucone; w tej turze w fazie III dobierasz o 1 mniej.`,
      spawnHint: null,
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
      title: "Odpędzenie",
      summary: `Zdejmij żeton z <strong>${escapeHtml(locName)}</strong>. +2 złota; żeton na stos odpędzonych; 1 karta kosztu 0 na odrzucone.`,
      spawnHint: `Nowy potwór: <strong>poziom ${escapeHtml(
        level
      )}</strong> (ten sam), teren <strong>${escapeHtml(
        terrainLabel
      )}</strong> — dobierz żeton obszaru tego terenu i wpisz jego numer poniżej.`,
    };
  }

  // defeat
  if (isSolo) {
    return {
      kind,
      removeMonster: true,
      needsSpawn: false,
      spawnLevel: null,
      terrain,
      terrainLabel,
      oldLevel: level,
      title: "Pokonanie (solo)",
      summary: `Zdejmij żeton z <strong>${escapeHtml(
        locName
      )}</strong>. +2 złota, trofeum, +reputacja, zmęczenie. <strong>Solo: nie dobierasz nowego potwora</strong> po pokonaniu.`,
      spawnHint: null,
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
    summary: `Zdejmij żeton z <strong>${escapeHtml(
      locName
    )}</strong>. +2 złota, trofeum, +reputacja, zmęczenie.`,
    spawnHint: `Nowy potwór: <strong>poziom ${escapeHtml(
      nextLv
    )}</strong> (${escapeHtml(level)}→${escapeHtml(
      nextLv
    )}), teren <strong>${escapeHtml(
      terrainLabel
    )}</strong> — dobierz żeton obszaru tego samego terenu i wpisz numer poniżej.`,
  };
}

/** Jednoslotowy picker numeru dla nowego potwora po walce. */
export function monsterSpawnSlotHtml(board, { terrain, level }) {
  if (!terrain || !MONSTER_TERRAINS.includes(terrain)) return "";
  const t = TERRAIN[terrain];
  const opts = locationsForTerrain(terrain);
  const cur = monsterOccupyingTerrain(board, terrain);
  const num = cur?.loc?.number;
  const name = cur?.loc?.name || "— ustaw numer z żetonu —";
  const lv = normalizeMonsterLevel(level || cur?.level || "I");
  return `
    <div class="monster-terrain-slot is-filled monster-spawn-slot" data-terrain-slot="${terrain}">
      <div class="monster-terrain-head">
        <span class="monster-terrain-ico">${terrainIcon(terrain)}</span>
        <strong>${escapeHtml(t.label)}</strong>
        <span class="monster-terrain-meta">${escapeHtml(name)} · poz. ${escapeHtml(lv)}</span>
      </div>
      <div class="monster-terrain-pick" role="group" aria-label="Numer nowego obszaru">
        <button type="button" class="btn btn-secondary monster-num-btn" data-monster-cycle="${terrain}" data-delta="-1" title="Poprzedni">◀</button>
        <input type="number" class="monster-num-input" data-monster-num="${terrain}" min="0" max="18" inputmode="numeric" value="${
          num != null ? escapeHtml(String(num)) : ""
        }" placeholder="#" aria-label="Numer obszaru" />
        <button type="button" class="btn btn-secondary monster-num-btn" data-monster-cycle="${terrain}" data-delta="1" title="Następny">▶</button>
      </div>
      <p class="note monster-terrain-hint">Poziom ustawiony na <strong>${escapeHtml(
        lv
      )}</strong> · numery: ${opts.map((l) => l.number).join(", ")}</p>
    </div>
  `;
}

export function monstersPanelHtml(board) {
  const levels = ["I", "II", "III"];
  const slots = MONSTER_TERRAINS.map((terrain) => {
    const t = TERRAIN[terrain];
    const opts = locationsForTerrain(terrain);
    const cur = monsterOccupyingTerrain(board, terrain);
    const num = cur?.loc?.number;
    const name = cur?.loc?.name || "— wybierz numer —";
    const level = cur?.level || "I";
    const filled = Boolean(cur);
    return `
      <div class="monster-terrain-slot ${filled ? "is-filled" : "is-empty"}" data-terrain-slot="${terrain}">
        <div class="monster-terrain-head">
          <span class="monster-terrain-ico">${terrainIcon(terrain)}</span>
          <strong>${escapeHtml(t.label)}</strong>
          <span class="monster-terrain-meta">${filled ? escapeHtml(name) : "brak żetonu"}</span>
        </div>
        <div class="monster-terrain-pick" role="group" aria-label="Numer obszaru: ${escapeHtml(t.label)}">
          <button type="button" class="btn btn-secondary monster-num-btn" data-monster-cycle="${terrain}" data-delta="-1" title="Poprzedni obszar">◀</button>
          <input type="number" class="monster-num-input" data-monster-num="${terrain}" min="0" max="18" inputmode="numeric" value="${
            num != null ? escapeHtml(String(num)) : ""
          }" placeholder="#" aria-label="Numer obszaru ${escapeHtml(t.label)}" />
          <button type="button" class="btn btn-secondary monster-num-btn" data-monster-cycle="${terrain}" data-delta="1" title="Następny obszar">▶</button>
          <button type="button" class="btn btn-secondary" data-monster-terrain-clear="${terrain}" ${
            filled ? "" : "disabled"
          }>Usuń</button>
        </div>
        <div class="monster-terrain-levels" role="group" aria-label="Poziom potwora ${escapeHtml(t.label)}">
          ${levels
            .map(
              (lv) =>
                `<button type="button" class="btn ${
                  filled && level === lv ? "btn-primary" : "btn-secondary"
                }" data-monster-terrain-level="${terrain}" data-level="${lv}" ${
                  filled ? "" : "disabled"
                }>Poz. ${lv}</button>`
            )
            .join("")}
        </div>
        <p class="note monster-terrain-hint">Numery ${opts
          .map((l) => l.number)
          .join(", ")}</p>
      </div>`;
  }).join("");

  return `
    <div class="monsters-panel">
      <h3>${ICO.monster()} Potwory na mapie</h3>
      <p class="lead" style="margin:0">Trzy żetony obszarów = <strong>3 różne tereny</strong>. Podaj <strong>numer</strong> z żetonu (strzałki albo wpisz) — drugi potwór na ten sam teren jest niemożliwy. Szkoła (np. Kaer Seren) jest OK, jeśli tak wyszło na żetonie; <strong>Behelt Nar (0)</strong> nie ma żetonu.</p>
      ${
        board.placeError
          ? `<p class="warn" style="margin:0.45rem 0 0" role="alert">${escapeHtml(board.placeError)}</p>`
          : ""
      }
      <div class="monster-terrain-grid">${slots}</div>
      <p class="note" style="margin:0.45rem 0 0">Walka w fazie II jest <strong>opcjonalna</strong> — tylko gdy żeton stoi na Twoim polu.</p>
    </div>
  `;
}

export function ensurePlayerTrack(p, startCards = 5, startGold = 3) {
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

export function handAfterFatigue(cards, rep) {
  const lose = fatigueForReputation(rep);
  const after = Math.max(0, cards - lose);
  return { lose, after, before: cards };
}

/** Faza III (instrukcja): opcjonalnie odrzuć dowolną liczbę, potem dobierz do 3 na ręce, kup 1.
 *  Limit 7 to osobny sufit (FAQ #25), nie cel doboru w fazie III. */
export function phase3DrawHint(cardsInHand) {
  const phase3Target = 3;
  const hardLimit = 7;
  const afterDiscardAssume = Math.min(cardsInHand, phase3Target);
  const need = Math.max(0, phase3Target - afterDiscardAssume);
  return {
    limit: hardLimit,
    phase3Target,
    drawUpTo: need,
    afterDraw: phase3Target,
    note:
      cardsInHand > phase3Target
        ? `Masz ${cardsInHand} → w fazie III zwykle odrzucasz (dowolną liczbę), potem dobierasz do 3, potem kupujesz 1 (limit ręki nadal 7).`
        : cardsInHand < phase3Target
          ? `Dobierz do 3: +${need} kart(y), potem kup 1 z puli (limit ręki 7).`
          : "Masz 3 — w fazie III możesz odrzucić część i dobrać z powrotem do 3, potem kup 1.",
  };
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function mapSvgHtml(
  board,
  roster,
  {
    schoolById,
    highlightFromId,
    showDisclaimer = false,
    popupHtml = null,
    setupCoachPhase = null,
    setupPreview = false,
    setupMapPawns = false,
  } = {}
) {
  const setupLite = (setupPreview || setupCoachPhase != null) && !setupMapPawns;
  const setupFill = setupPreview || setupMapPawns || setupCoachPhase != null;
  const locMap = Object.fromEntries(LOCATIONS.map((l) => [l.id, l]));
  const fromId = highlightFromId || board.highlightFrom || null;
  const reachable = new Set(fromId ? neighborsOf(fromId) : []);

  const roadSeg = ([a, b], cls) => {
    const A = locMap[a];
    const B = locMap[b];
    if (!A || !B) return "";
    const lit =
      fromId && ((a === fromId && reachable.has(b)) || (b === fromId && reachable.has(a)));
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
    const witches = roster
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.locationId === loc.id);
    const numLabel =
      typeof loc.number === "number" ? String(loc.number) : "";
    const name = String(loc.name || "");
    const nameLen = name.length;
    /* uppercase + letter-spacing w CSS → szerszy tekst niż surowa długość */
    const fontPx = nameLen >= 12 ? 1.55 : nameLen >= 9 ? 1.75 : 1.95;
    const sidePad = 2.4; /* zapas L/P, żeby tekst nie stykał z krawędzią kafelka */
    const labelW = Math.min(30, Math.max(9.5, nameLen * fontPx * 0.62 + sidePad * 2));
    const labelH = 2.85;
    const labelX = -labelW / 2;
    const labelY = -labelH / 2;
    const clipId = `${uid}-lbl-${loc.id}`;
    const clipPad = 0.55;
    const isWild = loc.terrain === "wild" || loc.id === "behelt-nar";

    const monsterBadge = monsters
      ? `<g class="map-monster-badge" transform="translate(${loc.x + 3.4},${loc.y - 4}) rotate(${labelUpright})">
           <circle r="2.15" fill="#6b3a2f" stroke="#f0e6d2" stroke-width="0.35"/>
           <text y="0.85" text-anchor="middle" class="map-badge-text">${escapeXml(String(monsters.count || 1))}</text>
         </g>`
      : "";

    const setupSchoolPawns =
      setupMapPawns && loc.school
        ? (roster || [])
            .map((p, i) => ({ p, i }))
            .filter(({ p }) => schoolStartId(p.schoolId) === loc.id)
            .map(({ p, i }, idx) => {
              const sid = p.schoolId || "wilk";
              const ox = -2.6 + idx * 2.4;
              const src = `${schoolRepTokenSrc(sid)}?v=${MAP_PREP_PAWN_ASSET_V}`;
              return `<g class="map-setup-school-pawn" transform="translate(${loc.x + ox},${loc.y + 3.6})">
            <circle r="2.05" fill="rgba(20,18,14,0.35)" stroke="#d4b05a" stroke-width="0.35"/>
            <image class="map-setup-school-pawn__art" href="${src}" x="-1.85" y="-1.85" width="3.7" height="3.7" preserveAspectRatio="xMidYMid meet"/>
            <text y="3.35" text-anchor="middle" class="map-badge-text map-setup-school-pawn__lbl">${escapeXml(String(i + 1))}</text>
          </g>`;
            })
            .join("")
        : "";

    /* Na polach szkół bez żetonów graczy — pozycja i tak wynika ze startu cechu. */
    const witchBadges =
      setupSchoolPawns
        ? setupSchoolPawns
        : setupLite || loc.school
          ? ""
          : witches
              .map(({ i }, idx) => {
                const ox = -3.2 + idx * 2.4;
                return `<g transform="translate(${loc.x + ox},${loc.y + 4.4}) rotate(${labelUpright})">
          <circle r="1.7" fill="#244833" stroke="#d4b05a" stroke-width="0.35"/>
          <text y="0.7" text-anchor="middle" class="map-badge-text">${i + 1}</text>
        </g>`;
              })
              .join("");

    const disc = isWild
      ? `<circle class="map-node-soft" cx="${loc.x}" cy="${loc.y}" r="4.4" fill="#7a6b4a" opacity="0.2"/>
        <image class="map-node-wild" href="./img/terrain/wild.png" x="${loc.x - 3.55}" y="${loc.y - 3.55}" width="7.1" height="7.1" preserveAspectRatio="xMidYMid slice"/>
        <circle class="map-node-disc" cx="${loc.x}" cy="${loc.y}" r="3.55" fill="none" stroke="#f4ebd6" stroke-width="0.55"/>`
      : `<circle class="map-node-soft" cx="${loc.x}" cy="${loc.y}" r="4.4" fill="${fill}" opacity="0.18"/>
        <circle class="map-node-disc" cx="${loc.x}" cy="${loc.y}" r="3.55" fill="${fill}" stroke="#f4ebd6" stroke-width="0.55"/>
        <circle cx="${loc.x}" cy="${loc.y}" r="2.55" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="0.4"/>`;

    return `
      <g class="map-node${terrainClass}${selected}${here}${reach}" data-loc="${loc.id}" style="cursor:pointer">
        ${
          reach
            ? `<circle cx="${loc.x}" cy="${loc.y}" r="5" fill="none" stroke="#b8923e" stroke-width="0.5" stroke-dasharray="1.1 0.7" opacity="0.95"/>`
            : ""
        }
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
    ${
      showDisclaimer
        ? `<p class="note">Schemat: numery 0–18, tereny i drogi.</p>`
        : ""
    }
  `;
}

/** Kolory cech na torze reputacji (jak medaliony). */
const SCHOOL_REP_COLOR = {
  wilk: "#3a2210",
  gryf: "#6e5410",
  niedzwiedz: "#541010",
  kot: "#142448",
  zmija: "#14341c",
  mantikora: "#5c2c0c",
};

function schoolRepFill(schoolId) {
  return SCHOOL_REP_COLOR[schoolId] || SCHOOL_REP_COLOR.wilk;
}

/**
 * Tor reputacji 0–4 w lewym dolnym rogu (pionowo).
 * Domyślnie: kolor ostatniego, kto zdobył poziom; hover: animacja pozostałych na poziomie.
 */
export function reputationTrackSvg(roster = [], board = null, { useTokenArt = false } = {}) {
  const cy0 = 80.6; /* 0 — dół */
  const edgePad = 85 - cy0; /* ten sam odstęp od lewej co od dołu */
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

  const slots = [0, 1, 2, 3, 4]
    .map((n) => {
      const cy = cy0 - n * gap;
      const present = byRep[n];
      let leadSchool = claims[n] || null;
      const leadPlayer =
        present.find((p) => p.schoolId === leadSchool) || present[0] || null;
      if (leadPlayer) leadSchool = leadPlayer.schoolId;
      const others = leadPlayer
        ? present.filter((p) => p.i !== leadPlayer.i)
        : present;
      const lead =
        leadSchool && useTokenArt
          ? `<image class="map-rep-token-art map-rep-lead" href="${schoolRepTokenSrc(leadSchool)}?v=${MAP_PREP_PAWN_ASSET_V}" x="${cx - 1.95}" y="${cy - 1.95}" width="3.9" height="3.9" preserveAspectRatio="xMidYMid meet"/>`
          : leadSchool
            ? `<circle class="map-rep-lead map-rep-pawn-disc" cx="${cx}" cy="${cy}" r="1.9" fill="${schoolRepFill(leadSchool)}"/>`
            : "";
      /* Pozycje wachlarza w jednostkach SVG — CSS tylko opacity/scale (bez translate). */
      const othersHtml = others
        .map(({ i, schoolId }, idx) => {
          const ox = 3.55 + idx * 2.85;
          const oy = -idx * 0.55;
          return `
        <g class="map-rep-other" style="--i:${idx}" transform="translate(${cx + ox}, ${cy + oy})" data-player="${i}">
          ${
            useTokenArt
              ? `<image class="map-rep-token-art" href="${schoolRepTokenSrc(schoolId)}?v=${MAP_PREP_PAWN_ASSET_V}" x="-1.35" y="-1.35" width="2.7" height="2.7" preserveAspectRatio="xMidYMid meet"/>`
              : `<circle class="map-rep-pawn-disc" r="1.35" fill="${schoolRepFill(schoolId)}" cx="0" cy="0"/>`
          }
        </g>`;
        })
        .join("");
      const hasMore = others.length > 0;
      return `
      <g class="map-rep-slot${leadSchool ? " map-rep-slot--claimed" : ""}${hasMore ? " map-rep-slot--has-more" : ""}" data-rep="${n}">
        <circle class="map-rep-hit" cx="${cx}" cy="${cy}" r="3.1"/>
        <circle class="map-rep-ring" cx="${cx}" cy="${cy}" r="2.35"/>
        <text x="${cx}" y="${cy + 0.9}" text-anchor="middle" class="map-rep-num">${n}</text>
        ${lead}
        <g class="map-rep-others">${othersHtml}</g>
      </g>`;
    })
    .join("");

  return `
    <g class="map-rep-track" aria-label="Reputacja graczy 0–4">
      ${slots}
    </g>`;
}

let _mapPopupCleanup = null;

/** Dymek nad mapą: znika po 3 s albo kliku poza oknem (wybór celu zostaje). */
export function bindMapLocPopup(root, { timeoutMs = 3000 } = {}) {
  if (typeof _mapPopupCleanup === "function") {
    _mapPopupCleanup();
    _mapPopupCleanup = null;
  }
  const popup = root?.querySelector?.("#map-loc-popup");
  if (!popup) return () => {};

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

/** Pasek narzędzi mapy usunięty — oznaczanie potworów jest w panelu Potwory. */
export function mapToolbarHtml() {
  return "";
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function terrainIcon(id) {
  if (id === "forest") return ICO.forest();
  if (id === "mountain") return ICO.mountain();
  if (id === "water") return ICO.water();
  return "";
}

export function selectedLocPanel(board, roster) {
  const loc = locById(board.selectedLoc);
  if (!loc) {
    return `<p class="lead">Kliknij lokację na mapie. Potwory ustawiasz numerami w panelu (1 na teren).</p>`;
  }
  const t = TERRAIN[loc.terrain];
  const m = monsterAt(board, loc.id);
  const here = roster
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => p.locationId === loc.id);
  const hint = actionHintFor(loc);
  const neigh = neighborsOf(loc.id)
    .map((id) => locById(id))
    .filter(Boolean)
    .map((n) => `${n.name}${typeof n.number === "number" ? ` (${n.number})` : ""}`)
    .join(", ");
  const otherSame =
    !m && MONSTER_TERRAINS.includes(loc.terrain)
      ? monsterOccupyingTerrain(board, loc.terrain)
      : null;

  return `
    <div class="loc-panel">
      <h3>${escapeHtml(loc.name)}${
        typeof loc.number === "number" ? ` <span class="loc-num">#${loc.number}</span>` : ""
      }</h3>
      <p class="lead" style="margin:0">${terrainIcon(loc.terrain)} Teren ruchu: <strong>${
        t.label
      }</strong>${loc.school ? ` · szkoła wiedźmińska` : ""}</p>
      ${
        loc.actionKey
          ? `<div class="loc-action-icon">${actionIconHtml(loc.actionKey, { width: 130, height: 40 })}</div>`
          : ""
      }
      ${hint ? `<p class="loc-action"><strong>Znak na planszy:</strong> ${escapeHtml(hint)}</p>` : ""}
      <p class="note" style="margin:0.4rem 0 0">Sąsiedzi (ścieżki): ${
        neigh ? escapeHtml(neigh) : "—"
      }</p>
      <p class="tip" style="margin:0.5rem 0 0">Po ruchu helper pokaże kroki tej akcji (faza I, opcjonalna).</p>
      ${
        m
          ? `<p class="warn" style="margin:0.45rem 0 0">${ICO.monster()} Potwór tu: poz. <strong>${escapeHtml(
              String(m.level || "?")
            )}</strong></p>`
          : otherSame
            ? `<p class="note" style="margin:0.45rem 0 0">${ICO.monster()} Slot „${escapeHtml(
                t.label
              )}” zajęty przez <strong>${escapeHtml(otherSame.loc.name)}</strong> (#${
                otherSame.loc.number
              }).</p>`
            : `<p class="note" style="margin:0.45rem 0 0">${ICO.monster()} Brak potwora na tym polu — ustaw numer w panelu poniżej.</p>`
      }
      <p>Wiedźmini:
        ${
          here.length
            ? here
                .map(
                  ({ p, i }) =>
                    `<span class="player-chip">${i + 1}. ${escapeHtml(p.name)}</span>`
                )
                .join(" ")
            : "—"
        }
      </p>
    </div>
  `;
}

export function movePromptHtml(board, roster) {
  const mp = board.movePrompt;
  if (!mp) return "";
  const p = roster[mp.playerIdx];
  if (!p) return "";
  return moveCostChooserHtml({
    fromLoc: locById(mp.fromId),
    toLoc: locById(mp.toId),
    playerName: p.name,
    selectedCostId: mp.costId || null,
  });
}

export function playerTrackerHtml(roster, { schoolById, activeIndex, START_RESOURCES, players, isSolo }) {
  return roster
    .map((p, i) => {
      const school = schoolById(p.schoolId);
      const iconFn = SCHOOL_ICON[p.schoolId] || ICO.specialty;
      const loc = p.locationId ? locById(p.locationId) : null;
      const fat = fatigueForReputation(Math.min(4, (p.reputation || 0) + 1));
      const nextRep = Math.min(4, (p.reputation || 0) + 1);
      const afterFat = handAfterFatigue(p.cards || 0, nextRep);
      const draw = phase3DrawHint(p.cards || 0);
      const start = START_RESOURCES[players]?.[i] || { cards: 5, gold: 3 };
      const guide = nowDoingGuideHtml(p, { isSolo: !!isSolo });

      return `
        <article class="tracker-card ${i === activeIndex ? "tracker-active" : ""}" data-track="${i}">
          <header>
            <span class="player-chip">${iconFn()}${escapeHtml(p.name)} <span>${school.short}</span></span>
            ${i === activeIndex ? `<span class="badge">Teraz gra</span>` : ""}
          </header>

          <div class="tracker-grid">
            <label>Reputacja (0–4)
              <div class="rep-row">
                ${[0, 1, 2, 3, 4]
                  .map(
                    (n) =>
                      `<button type="button" class="rep-btn ${(p.reputation || 0) === n ? "active" : ""}" data-rep="${n}" data-idx="${i}">${n}</button>`
                  )
                  .join("")}
              </div>
            </label>

            <label>Karty na ręce
              <div class="num-row num-row--cards">
                <button type="button" class="btn btn-secondary" data-cards-delta="-1" data-idx="${i}">−</button>
                <span class="num-val num-val--cards">${actionCardsHtml(p.cards ?? start.cards, { height: 22 })}</span>
                <button type="button" class="btn btn-secondary" data-cards-delta="1" data-idx="${i}">+</button>
              </div>
            </label>

            <label>Złoto
              <div class="num-row num-row--gold">
                <button type="button" class="btn btn-secondary" data-gold-delta="-1" data-idx="${i}">−</button>
                <span class="num-val num-val--coins">${goldCoinsHtml(p.gold ?? start.gold, { size: 24 })}</span>
                <button type="button" class="btn btn-secondary" data-gold-delta="1" data-idx="${i}">+</button>
              </div>
            </label>

            <label>Eliksiry (max 4)
              <div class="num-row">
                <button type="button" class="btn btn-secondary" data-elixir-delta="-1" data-idx="${i}">−</button>
                <strong class="num-val">${p.elixirs ?? 0}</strong>
                <button type="button" class="btn btn-secondary" data-elixir-delta="1" data-idx="${i}">+</button>
              </div>
            </label>
          </div>

          <p class="tip"><strong>Lokalizacja:</strong> ${
            loc ? escapeHtml(loc.name) : "szkoła startowa (ustawi się po wyborze szkoły)"
          }</p>

          ${
            (p.quests || []).length
              ? `<div class="tracker-quests">
                  <p class="step-kicker" style="margin:0.35rem 0 0.25rem">${ICO.quest()} Zadania (${p.quests.length})</p>
                  <ul class="checklist">
                    ${p.quests
                      .map((q) => {
                        const ql = q.locationId ? locById(q.locationId) : null;
                        return `<li>
                          <strong>${escapeHtml(q.title || "Zadanie")}</strong>
                          → ${ql ? escapeHtml(ql.name) : "?"}
                          ${q.eventCard ? ` · Event <strong>#${escapeHtml(String(q.eventCard))}</strong>` : ""}
                          <button type="button" class="btn btn-secondary" data-quest-done="${escapeHtml(q.id)}" data-idx="${i}">Usuń</button>
                        </li>`;
                      })
                      .join("")}
                  </ul>
                </div>`
              : ""
          }

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
              <li><strong>Teraz na ręce:</strong> ${p.cards ?? 0} (sufit 7; w fazie III cel doboru = <strong>3</strong>)</li>
              <li><strong>Przy +1 reputacji (→ ${nextRep}):</strong> zmęczenie usuwa z gry <strong>${afterFat.lose}</strong> kart(y)
                → ręka orientacyjnie <strong>${afterFat.after}</strong> (jeśli usuwasz z ręki)
                <div>Instrukcja: możesz usuwać z ręki / talii / odrzuconych; potem tasujesz talię. Przykład: 1. trofeum = 1 karta.</div>
              </li>
              <li><strong>Faza III (dobór do 3):</strong> ${escapeHtml(draw.note)}
                <div>Po kroku doboru orientacyjnie: ${draw.afterDraw} na ręce, potem kup 1 z puli.</div>
              </li>
              <li><strong>Start tej pozycji przy stole:</strong> ${actionCardsHtml(start.cards, { height: 20 })} ${goldCoinsHtml(start.gold, { size: 22 })}</li>
            </ul>
            <div class="actions" style="margin-top:0.6rem">
              <button type="button" class="btn btn-primary" data-apply-fatigue data-idx="${i}">
                +1 reputacja i odejmij zmęczenie z ręki (${fat} kart)
              </button>
              <button type="button" class="btn btn-secondary" data-apply-draw7 data-idx="${i}">
                Ustaw rękę jak po doborze fazy III (3)
              </button>
            </div>
          </details>
        </article>
      `;
    })
    .join("");
}

export {
  fatigueForReputation,
  locById,
  LOCATIONS,
  TERRAIN,
  neighborsOf,
  actionHintFor,
  schoolStartId,
  placeAtSchool,
};
