/**
 * Krok przygotowania stołu — żetony reputacji (0) i figurki na obszarach szkół.
 */

import { locById } from "./map-data.js";
import { schoolStartId } from "./map-data.js";
import { escapeHtmlLite } from "./player-state.js";
import { SCHOOLS } from "./sources.js";

function schoolById(id) {
  return SCHOOLS.find((s) => s.id === id) || SCHOOLS[0];
}

export function mapPawnsPrepCopy() {
  return {
    title: "Żetony i figurki na mapie",
    lead: "Połóż żeton szkoły na polu <strong>0</strong> toru reputacji (lewy dolny róg mapy). Figurki wiedźminów ustaw na obszarach startowych szkół — jak na podglądzie.",
  };
}

export function mapPawnsRosterHintHtml(roster) {
  return (roster || [])
    .map((p, i) => {
      const sid = p.schoolId || SCHOOLS[0].id;
      const school = schoolById(sid);
      const start = locById(schoolStartId(sid));
      const where = start?.name || "—";
      return `<li><strong>${escapeHtmlLite(p.name || `Gracz ${i + 1}`)}</strong> · ${escapeHtmlLite(school.short)} → ${escapeHtmlLite(where)}</li>`;
    })
    .join("");
}

export function mapPawnsPrepPanelHtml({ roster }) {
  const sc = mapPawnsPrepCopy();
  const list = mapPawnsRosterHintHtml(roster);
  return `
    <div class="map-pawns-prep-caption player-board-prep-panel">
      <h2 class="player-board-prep-panel__title">${sc.title}</h2>
      <p class="player-board-prep-panel__body">${sc.lead}</p>
      ${list ? `<ul class="checklist map-pawns-prep-list">${list}</ul>` : ""}
    </div>`;
}
