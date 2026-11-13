import { woodCardLayout } from "../wood-card-layout.js";
import { bottomNotches, woodFacePath } from "../shell-geometry.js";

/** Drewniane deski po prawej — złączone z mapą. */
export function woodCardPanelSvg(uid = "m") {
  const { woodX: x, woodW: w, yTop: y } = woodCardLayout();
  const h = 83.8;
  const face = woodFacePath();
  const notchD = bottomNotches()[0].d;
  const plankH = h / 9;
  const seams = Array.from({ length: 8 }, (_, i) => {
    const yy = y + plankH * (i + 1);
    if (yy > y + h - notchD - 0.3) return "";
    return `<line class="map-wood-seam" x1="${x}" y1="${yy}" x2="${x + w}" y2="${yy}"/>`;
  }).join("");
  const grains = [0.12, 0.28, 0.47, 0.63]
    .map(
      (t, i) =>
        `<path class="map-wood-grain" d="M${x + 1.2 + i * 0.15} ${y + h * t} Q${x + w * 0.45} ${y + h * t - 1.2}, ${x + w - 1.4} ${y + h * t + 0.6}" fill="none"/>`
    )
    .join("");
  return `
    <g class="map-wood-panel" data-map-layer="wood" aria-label="Stół na karty">
      <path class="map-wood-face" d="${face}" fill="url(#${uid}-wood)"/>
      <path d="${face}" fill="url(#${uid}-wood-shine)"/>
      ${seams}
      ${grains}
      <line class="map-wood-join" x1="${x}" y1="${y}" x2="${x}" y2="${y + h}"/>
    </g>`;
}
