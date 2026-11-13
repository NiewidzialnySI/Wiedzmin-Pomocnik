/**
 * Ostatni krok maty — figurka + krążek szkoły (figurka i żeton na mapę w przygotowaniu stołu).
 */

import { SCHOOLS } from "./sources.js";
import {
  schoolRepTokenSrc,
  schoolRepTokenFallbackSrc,
  WITCHER_FIGURE_SRC,
  PAWN_BASE_RING_SRC,
  MAP_PREP_PAWN_ASSET_V,
} from "./map-prep-pawns.js";

/** Piramida: 2 u góry, 3 na dole (kolejność SCHOOLS). */
const PYRAMID_TOP_IDX = [0, 1];
const PYRAMID_BOT_IDX = [2, 3, 4];

export function playerBoardFigurePrepScenario() {
  return {
    title: "Figurka, podstawka i żeton szkoły",
    instruction:
      "Wybierz figurkę wiedźmina z pudełka. Załóż na figurkę podstawkę w kolorze szkoły oraz wyciągnij żeton szkoły wiedźmińskiej.",
  };
}

function prepImg(src, fallback, className) {
  const v = MAP_PREP_PAWN_ASSET_V;
  return `<img class="pb-figure-prep-img ${className}" src="${src}?v=${v}" data-fallback="${fallback}?v=${v}" alt="" decoding="async" />`;
}

function pyramidHtml(cellFn) {
  const row = (indices) =>
    `<ul class="pb-figure-pyramid__row" role="list">${indices
      .map((i) => cellFn(SCHOOLS[i]))
      .join("")}</ul>`;
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

export function playerBoardFigureMainHtml({
  schoolId,
  schoolName,
  playerName,
  playerSlot,
  solo,
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
          <p class="pb-figure-col__label">Żetony szkół</p>
          <div class="pb-figure-token-mount">${tokensPyramidHtml(tokFb)}</div>
        </div>
      </div>
    </div>`;
}

/** Fallbacki skanów (figurka, żetony). */
export function bindPlayerBoardFigureStep(root) {
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
