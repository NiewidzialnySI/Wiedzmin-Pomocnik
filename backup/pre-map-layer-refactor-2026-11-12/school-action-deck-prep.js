/**
 * Talia startowa na planszetce — ekran poradnika (10 kart, lewe wycięcie talii).
 * Grafiki tasowania: rewers kart (zakryta talia), niezależnie od szkoły na rosterze.
 */

import { canonicalSchoolId } from "./sources.js";

/** Proporcje skanów kart (pionowe) */
export const ACTION_CARD_ASPECT_W = 769;
export const ACTION_CARD_ASPECT_H = 1175;

/** Wersja cache dla skanów talii startowej */
export const ACTION_DECK_ASSET_V = "10";

/** Tył wspólnej talii akcji na mapie stołu (coach) */
export const COMMON_ACTION_DECK_BACK_SRC = "./img/cards/action/common-back.png";
export const COMMON_ACTION_DECK_STACK_SIZE = 7;
export const COMMON_ACTION_DECK_ASSET_V = "3";

/**
 * Lewy pas na talię na planszetka-mat (pionowe wycięcie przy tarczy / lewej krawędzi).
 * Kalibracja względem 1024×425.
 */
export const ACTION_DECK_SLOT = {
  leftFrac: 0,
  topFrac: 0.19,
  widthFrac: 0.135,
  heightFrac: 0.6,
};

/** Szerokość planszetki na ekranie poradnika (ułamek kontenera) */
export const ACTION_DECK_BOARD_WIDTH_FRAC = 0.62;

/** Przesunięcie stosu + podpowiedzi w lewo (ułamek szerokości planszetki). */
export const ACTION_DECK_CARDS_SHIFT_LEFT_FRAC = 0.11;

/** Dodatkowe odsunięcie w lewo względem szerokości jednej karty. */
export const ACTION_DECK_CARDS_SHIFT_EXTRA_CARD_W_FRAC = 0.5;

/** Lekkie obniżenie kart względem środka planszetki (ułamek wysokości). */
export const ACTION_DECK_CARDS_SHIFT_DOWN_FRAC = 0.022;

/** Wysokość karty względem wysokości planszetki (poradnik). */
export const ACTION_DECK_CARD_BOARD_HEIGHT_FRAC = 0.8;

/** Odstęp podpowiedzi znaku od tasowanej talii (px + ułamek szer. karty). */
export const ACTION_DECK_HINT_GAP_PX = 6;
export const ACTION_DECK_HINT_EXTRA_GAP_CARD_W_FRAC = 0.48;

const GUIDE_ACTION_DECK_CARDS = [1, 2, 3, 4, 5, 6, 7].map(
  (n) => `./img/cards/action/niedzwiedz/card-0${n}.png`
);

const GUIDE_ACTION_DECK_LOGO = "./img/cards/action/niedzwiedz/logo.png";

export const ACTION_DECK_POOL_SIZE = 10;

export function guideActionDeckShuffleSrcs(poolSize = ACTION_DECK_POOL_SIZE) {
  const back = schoolActionDeckBackSrc("niedzwiedz");
  return Array.from({ length: poolSize }, () => back);
}

export function guideActionDeckFallbackSrc() {
  return schoolActionDeckBackSrc("niedzwiedz");
}

export function guideActionDeckLogoHintSrc() {
  return GUIDE_ACTION_DECK_LOGO;
}

/** Pełna twarz karty pod podpowiedź znaku szkoły (poradnik). */
export function guideActionDeckHintCardSrc() {
  return GUIDE_ACTION_DECK_CARDS[0];
}

/** Tył karty (inne ekrany) — po skanie: img/cards/action/<schoolId>-back.png */
export function schoolActionDeckBackSrc(schoolId) {
  const id = canonicalSchoolId(schoolId);
  return `./img/cards/action/${id}-back.png`;
}

export function schoolActionDeckPrepScenario() {
  return {
    poolSize: ACTION_DECK_POOL_SIZE,
    title: "Talia startowa",
    instruction:
      "Potasuj 10 kart akcji ze znakiem szkoły (prawy górny róg). Ułóż zakrytą talię w wycięciu z lewej strony planszetki.",
  };
}
