import { MAP_FLAG } from "../constants.js";
import { woodCardLayout } from "../wood-card-layout.js";

export function monsterFlagLayout() {
  const { edgePad, woodX, w: flagW } = MAP_FLAG;
  const { slotX, slotW } = woodCardLayout();
  return [
    { roman: "I", level: 1, x: edgePad },
    { roman: "II", level: 2, x: woodX + edgePad },
    { roman: "III", level: 3, x: slotX + slotW },
  ].map((f) => ({ ...f, cx: f.x + flagW / 2 }));
}

export function roundFlagSvg(board = null) {
  const active = String(board?.roundFlag || board?.pendingMonsterLevel || "I").toUpperCase();
  const activeRoman =
    active === "III" || active === "3" ? "III" : active === "II" || active === "2" ? "II" : "I";
  const flags = monsterFlagLayout();
  const { yTop, w, h, notch } = MAP_FLAG;
  const cloth = (roman, x) => `
    <g class="map-round-flag${roman === activeRoman ? " map-round-flag--active" : ""}" transform="translate(${x}, ${yTop})" aria-label="Poziom ${roman}">
      <path class="map-round-flag-cloth" d="M0,0 L${w},0 L${w},${h - notch} L${w / 2},${h} L0,${h - notch} Z"/>
      <text class="map-round-flag-num" x="${w / 2}" y="${h * 0.52}" text-anchor="middle" dominant-baseline="middle">${roman}</text>
    </g>`;
  return `<g class="map-round-flags" data-map-layer="round-flags">${flags.map((f) => cloth(f.roman, f.x)).join("")}</g>`;
}
