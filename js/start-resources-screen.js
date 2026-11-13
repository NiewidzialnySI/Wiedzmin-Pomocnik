/**
 * Ekran po „Przygotuj planszetkę” — kto ile kart i złota bierze (bez zmiany kolejności).
 */

import { SCHOOLS } from "./sources.js";
import { escapeHtmlLite } from "./player-state.js";
import { startResourcesFor } from "./player-state.js";
import { orderStartResourcesHtml } from "./icons.js";

const RES_OPTS = { cardHeight: 140, coinSize: 56 };

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

export function startResourcesDealIntro(solo) {
  if (solo) {
    return {
      title: "Dobierz karty i złoto",
      lead: "Weź podane poniżej karty z talii akcji oraz złoto z banku i ułóż je na planszecie.",
    };
  }
  return {
    title: "Dobierz karty i złoto",
    lead: "",
  };
}

export function startResourcesDealListHtml({ roster, playerCount }) {
  const list = roster || [];
  return `
    <ul class="deal-list order-list" data-count="${list.length}" style="--order-cols:${list.length}">
      ${list.map((p, i) => dealItemHtml(p, i, playerCount)).join("")}
    </ul>`;
}
