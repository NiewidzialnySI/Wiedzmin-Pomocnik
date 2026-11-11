/**
 * Trofea szkoły na planszetce (multi) — ile kart, co z resztą puli 4.
 */

import { canonicalSchoolId } from "./sources.js";

const TROPHY_BACK_FALLBACK = "./img/trophies/school/niedzwiedz-back.png";

export function schoolTrophyBackSrc(schoolId) {
  const id = canonicalSchoolId(schoolId);
  return `./img/trophies/school/${id}-back.png`;
}

export { TROPHY_BACK_FALLBACK };

const POOL_SIZE = 4;

const TROPHY_PICK_ROMAN = ["I", "II", "III", "IV"];

function trophyPickRoman(pickCount) {
  return TROPHY_PICK_ROMAN[pickCount - 1] ?? String(pickCount);
}

function trophyTitle(pickCount) {
  const r = trophyPickRoman(pickCount);
  if (pickCount === 1) return `${r} karta trofeum`;
  return `${r} karty trofeum`;
}

function trophyInsertPhrase(pickCount) {
  if (pickCount === 1) return "Włóż 1 kartę";
  return `Włóż ${pickCount} karty`;
}

function trophyRestPhrase(restToBox) {
  if (restToBox <= 0) return "";
  if (restToBox === 1) return " Pozostałą kartę schowaj do pudełka.";
  return ` Pozostałe ${restToBox} karty schowaj do pudełka.`;
}

export function schoolTrophyPrepScenario(playerCount) {
  const n = Math.min(5, Math.max(2, Number(playerCount) || 2));
  const opponents = n - 1;
  const pickCount = opponents;
  const restToBox = POOL_SIZE - pickCount;

  const insertPart = trophyInsertPhrase(pickCount);
  const instruction =
    `Potasuj 4 karty trofeum. ${insertPart} w górną część planszetki po lewej stronie (jedna na drugą).` +
    trophyRestPhrase(restToBox);

  return {
    playerCount: n,
    opponents,
    pickCount,
    poolSize: POOL_SIZE,
    restToBox,
    title: trophyTitle(pickCount),
    instruction,
  };
}
