import { woodCardLayout } from "../wood-card-layout.js";
import { MAP_SLOT } from "../slot-registry.js";

export function goldBankAndDiceSvg() {
  const { yTop } = woodCardLayout();
  const cx = -6.2;
  const dieSize = 2.85;
  const dieGap = 0.38;
  const step = dieSize + dieGap;
  const diceY0 = yTop + 1.15;
  const diceCells = [
    [-1, 0],
    [0, 0],
    [1, 0],
    [-0.5, 1],
    [0.5, 1],
  ];
  const pip = (x, y) => `<circle class="map-die-pip" cx="${x}" cy="${y}" r="0.26"/>`;
  const pipLayouts = [
    [[0.5, 0.5]],
    [
      [0.28, 0.28],
      [0.72, 0.72],
    ],
    [
      [0.28, 0.28],
      [0.5, 0.5],
      [0.72, 0.72],
    ],
    [
      [0.28, 0.28],
      [0.72, 0.28],
      [0.28, 0.72],
      [0.72, 0.72],
    ],
    [
      [0.28, 0.28],
      [0.72, 0.28],
      [0.5, 0.5],
      [0.28, 0.72],
      [0.72, 0.72],
    ],
  ];
  const dice = diceCells
    .map(([gx, gy], i) => {
      const x = cx + gx * step - dieSize / 2;
      const y = diceY0 + gy * step;
      const pips = pipLayouts[i].map(([px, py]) => pip(x + dieSize * px, y + dieSize * py)).join("");
      return `
      <g class="map-die-slot" data-slot="die-${i}" data-die="${i}">
        <rect class="map-die-well" x="${x}" y="${y}" width="${dieSize}" height="${dieSize}" rx="0.45"/>
        ${pips}
      </g>`;
    })
    .join("");

  const goldR = 2.05;
  const goldCy = diceY0 + 2 * step + goldR + 1.35;
  const goldOffsets = [
    [-1.55, -0.55],
    [1.35, -0.75],
    [-0.15, 0.95],
    [1.65, 0.85],
    [-1.7, 1.15],
  ];
  const golds = goldOffsets
    .map(
      ([dx, dy], i) => `
      <g class="map-gold-coin" data-gold="${i}" transform="translate(${cx + dx}, ${goldCy + dy})">
        <circle class="map-gold-coin-outer" r="${goldR}"/>
        <circle class="map-gold-coin-inner" r="${goldR * 0.58}"/>
        <text class="map-gold-coin-mark" text-anchor="middle" dominant-baseline="middle">zł</text>
      </g>`
    )
    .join("");

  return `
    <g class="map-gold-dice-setup" data-map-layer="gold-dice" aria-label="Bank złota i kości">
      <g class="map-dice-tray" data-slot="dice-tray" data-map-slot="${MAP_SLOT.DICE_TRAY}" aria-label="Kości do gry">${dice}</g>
      <g class="map-gold-bank" data-slot="gold-bank" data-map-slot="${MAP_SLOT.GOLD_BANK}" aria-label="Bank złota">${golds}</g>
    </g>`;
}
