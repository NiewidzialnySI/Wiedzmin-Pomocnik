import { MAP_FLAG } from "../constants.js";
import { MAP_SLOT } from "../slot-registry.js";

export function locationTokensAndFightDeckSvg() {
  const { yTop, woodX } = MAP_FLAG;
  const fightW = 7.6;
  const fightH = 10.6;
  const mapGap = 0.2;
  const rightPad = 0.35;
  const fightX = woodX - fightW - rightPad;
  const fightY = yTop - fightH - mapGap;

  const r = 3.15;
  const img = 4.5;
  const tokenGap = 7.05;
  const tokenRight = fightX - 0.85 - r;
  const terrains = [
    { id: "forest", label: "Las", file: "forest" },
    { id: "mountain", label: "Góry", file: "mountain" },
    { id: "water", label: "Woda", file: "water" },
  ].map((t, i, arr) => ({
    ...t,
    x: tokenRight - (arr.length - 1 - i) * tokenGap,
  }));
  const cy = yTop - r - mapGap;

  const tokens = terrains
    .map(
      (t) => `
      <g class="map-loc-token-stack" data-slot="loc-token-${t.id}" data-terrain="${t.id}" aria-label="Żetony obszarów — ${t.label}">
        <circle class="map-loc-token-well" cx="${t.x}" cy="${cy}" r="${r}" fill="none"/>
        <image href="./img/terrain/${t.file}.png" x="${t.x - img / 2}" y="${cy - img / 2}" width="${img}" height="${img}" preserveAspectRatio="xMidYMid meet"/>
      </g>`
    )
    .join("");

  const fight = `
    <g class="map-card-slot map-fight-deck-slot" data-slot="monster-fight" data-map-slot="${MAP_SLOT.MONSTER_FIGHT}" aria-label="Talia walki potworów">
      <rect class="map-card-slot-well map-fight-deck-well" x="${fightX}" y="${fightY}" width="${fightW}" height="${fightH}" rx="0.5"/>
      <rect class="map-card-slot-lip" x="${fightX + 0.3}" y="${fightY + 0.3}" width="${fightW - 0.6}" height="${fightH - 0.6}" rx="0.35"/>
      <text class="map-fight-deck-label" x="${fightX + fightW / 2}" y="${fightY + fightH * 0.52}" text-anchor="middle" dominant-baseline="middle">⚔</text>
    </g>`;

  return `<g class="map-loc-fight-setup" data-map-layer="loc-fight" aria-label="Żetony obszarów i talia walki">${tokens}${fight}</g>`;
}
