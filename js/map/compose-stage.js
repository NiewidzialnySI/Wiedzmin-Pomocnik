import { MAP_FLAG } from "./constants.js";
import { boardShellPath } from "./shell-geometry.js";

/**
 * Otwarcie map-wrap z warstwą SVG i pustym overlay HTML.
 * @param {{ setupFill?: boolean, rot?: number }} opts
 */
export function mapWrapOpen({ setupFill = false, rot = 0 } = {}) {
  return `
      <div class="map-wrap${setupFill ? " map-wrap--setup-fill" : ""}" style="--map-rot:${rot}deg">
        <div class="map-layer map-layer--svg" data-map-layer="svg">`;
}

/** @param {{ setupFill?: boolean, uid?: string }} opts */
export function mapSvgOpen({ setupFill = false, uid = "m" } = {}) {
  return `
        <svg class="map-svg${setupFill ? " map-svg--setup-fill" : ""}" viewBox="-13 -12.5 ${MAP_FLAG.viewW + 13} 105.5"${setupFill ? ' preserveAspectRatio="xMidYMin meet"' : ""} role="img" aria-label="Mapa obszarów" data-map-layer="board">`;
}

export function mapSvgClose() {
  return `
          <path class="map-board-outline" d="${boardShellPath()}" fill="none" stroke="#5a4530" stroke-width="0.55"/>
        </svg>
        </div>
        <div class="map-layer map-layer--overlay" data-map-layer="overlay" aria-hidden="true"></div>
      </div>`;
}

export function mapStageOpen({ setupFill = false, hasPopup = false } = {}) {
  return `
    <div class="map-stage${hasPopup ? " map-stage--has-popup" : ""}${setupFill ? " map-stage--setup-fill" : ""}">`;
}

export function mapStageClose({ popupHtml = null } = {}) {
  return `
      ${
        popupHtml
          ? `<div class="map-loc-popup" id="map-loc-popup" role="dialog" aria-live="polite">${popupHtml}</div>`
          : ""
      }
    </div>`;
}
