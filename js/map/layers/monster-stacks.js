import { MAP_FLAG } from "../constants.js";
import { woodCardLayout } from "../wood-card-layout.js";
import { monsterFlagLayout } from "./round-flags.js";

function hexagonPath(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 30);
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }
  return `M${pts.join(" L")} Z`;
}

export function monsterLevelStacksSvg() {
  const { yTop, w: flagW } = MAP_FLAG;
  const { slotH } = woodCardLayout();
  const cardW = Math.max(flagW * 1.85, 5.8);
  const cardH = Math.max(slotH * 1.05, 7.2);
  const tokenR = { 1: 2.05, 2: 2.55, 3: 3.15 };

  const stacks = monsterFlagLayout().map((f) => {
    const cardX = f.cx - cardW / 2;
    const cardY = yTop - cardH - 0.35;
    const tokenCx = f.cx + cardW / 2 + tokenR[f.level] + 0.85;
    const tokenCy = cardY + cardH * 0.55;
    return `
      <g class="map-monster-stack" data-monster-level="${f.level}" data-slot="monster-${f.level}" aria-label="Potwory ${f.roman}">
        <g class="map-card-slot map-monster-card-slot" data-slot="monster-card-${f.level}">
          <rect class="map-card-slot-well map-monster-card-well" x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="0.45"/>
          <rect class="map-card-slot-lip" x="${cardX + 0.28}" y="${cardY + 0.28}" width="${cardW - 0.56}" height="${cardH - 0.56}" rx="0.3"/>
          <text class="map-monster-card-lvl" x="${f.cx}" y="${cardY + cardH * 0.52}" text-anchor="middle" dominant-baseline="middle">${f.roman}</text>
        </g>
        <g class="map-monster-token" data-slot="monster-token-${f.level}" data-token-level="${f.level}">
          <path class="map-monster-token-well" d="${hexagonPath(tokenCx, tokenCy, tokenR[f.level])}"/>
          <text class="map-monster-token-num" x="${tokenCx}" y="${tokenCy + 0.15}" text-anchor="middle" dominant-baseline="middle">${f.roman}</text>
        </g>
      </g>`;
  });

  return `<g class="map-monster-stacks" data-map-layer="monster-stacks" aria-label="Stosy potworów I–III">${stacks.join("")}</g>`;
}
