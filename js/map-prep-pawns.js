/**
 * Figurka, podstawka (krążek) i żeton reputacji szkoły — skany do kroków mapy / planszetki.
 * Żeton na torze reputacji 0–4 (lewy dół mapy) w następnym etapie przygotowania stołu.
 */

import { canonicalSchoolId } from "./sources.js";

export const MAP_PREP_PAWN_ASSET_V = "3";

const REP_TOKEN_FALLBACK = "./img/tokens/reputation/wilk.png";

/** Skan figurki wiedźmina (pula — na razie jeden plik). */
export const WITCHER_FIGURE_SRC = "./img/pawns/witcher-figure.png";

/** Szary krążek podstawki — kolor szkoły nakładamy w CSS (maska). */
export const PAWN_BASE_RING_SRC = "./img/pawns/base-ring-gray.png";

/**
 * Podstawka figurki per szkoła — gdy dodasz skany: img/pawns/base/<schoolId>.png
 * @returns {string | null}
 */
export function schoolPawnBaseSrc(schoolId) {
  const id = canonicalSchoolId(schoolId);
  return `./img/pawns/base/${id}.png`;
}

/** Żeton ze znakiem szkoły (reputacja na mapie). */
export function schoolRepTokenSrc(schoolId) {
  const id = canonicalSchoolId(schoolId);
  return `./img/tokens/reputation/${id}.png`;
}

export function schoolRepTokenFallbackSrc() {
  return REP_TOKEN_FALLBACK;
}

/** `Gracz 3` albo imię z rosteru (solo). */
export function figurePrepPlayerTag({ playerName, playerSlot, solo }) {
  const name = String(playerName || "").trim();
  if (solo && name) return escapeLite(name);
  const slot = Math.max(1, Number(playerSlot) || 1);
  return `Gracz ${slot}`;
}

function escapeLite(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
