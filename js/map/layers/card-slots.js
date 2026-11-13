import { MAP_SLOT } from "../slot-registry.js";
import { woodCardLayout, LIP_INSET } from "../wood-card-layout.js";
import { bottomNotches } from "../shell-geometry.js";
import {
  COMMON_ACTION_DECK_BACK_SRC,
  COMMON_ACTION_DECK_ASSET_V,
} from "../../school-action-deck-prep.js";
import {
  cardFitInLipRect,
  rightColumnCardFieldSpec,
  rightColumnSlotY,
} from "../card-field-spec.js";

function lipRectFromWell(x, y, w, h) {
  return {
    x: x + LIP_INSET,
    y: y + LIP_INSET,
    w: w - 2 * LIP_INSET,
    h: h - 2 * LIP_INSET,
  };
}

/** Tył talii w prostokącie lip — ta sama przestrzeń co `<rect class="map-card-slot-lip">`. */
function cardImageInLipSvg(lipR, { className = "map-action-deck-card-svg" } = {}) {
  const { unrotated, center } = cardFitInLipRect(lipR);
  const href = `${COMMON_ACTION_DECK_BACK_SRC}?v=${COMMON_ACTION_DECK_ASSET_V}`;
  return `
        <g class="map-action-deck-card-layer" pointer-events="none">
          <g transform="rotate(-90 ${center.cx} ${center.cy})">
            <image class="${className}" href="${href}" x="${unrotated.x}" y="${unrotated.y}" width="${unrotated.w}" height="${unrotated.h}" preserveAspectRatio="xMidYMid meet"/>
          </g>
        </g>`;
}

/**
 * 3+3 (lewa) + 7 (prawa) — pola kart na deskach.
 */
export function woodCardSlotsSvg() {
  const {
    yTop,
    flagH,
    tokenR,
    leftSlotX,
    leftSlotW,
    rightSlotX,
    rightSlotW,
    slotH,
    slotGap,
    rightTopStart,
    woodBottom,
    bottomPad,
    rightCount,
  } = woodCardLayout();
  const topStart = yTop + flagH + 1.4;
  const leftBottomH = 3 * slotH + 2 * slotGap;
  const leftBottomStart = woodBottom - bottomPad - leftBottomH;

  const diamondHtml = (x, y, w, h) => {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const rw = Math.min(w * 0.22, h * 0.55);
    const rh = Math.min(h * 0.38, w * 0.16);
    return `<path class="map-card-diamond" d="M${cx} ${cy - rh} L${cx + rw} ${cy} L${cx} ${cy + rh} L${cx - rw} ${cy} Z"/>`;
  };

  const CARD_TOKEN_TERRAINS = ["forest", "water", "mountain"];
  const fieldSpec = rightColumnCardFieldSpec();

  const slotHtml = (i, x, y, w, h, withToken, withDiamond = false, terrain = null, mapSlot = null) => {
    const token =
      withToken
        ? `<g class="map-token-slot" data-slot="card-token-${i}" data-terrain="${terrain || ""}" aria-label="Żeton obszaru — ${
            terrain === "forest" ? "Las" : terrain === "water" ? "Woda" : terrain === "mountain" ? "Góry" : "Żeton"
          }">
          <circle class="map-token-slot-well" cx="${x + w}" cy="${y + h / 2}" r="${tokenR}"/>
          <circle class="map-token-slot-lip" cx="${x + w}" cy="${y + h / 2}" r="${tokenR - 0.45}"/>
        </g>`
        : "";
    const deckMarker = withDiamond
      ? `<g class="map-card-deck-marker" aria-hidden="true">${diamondHtml(x, y, w, h)}</g>`
      : "";
    const mapSlotAttr = mapSlot ? ` data-map-slot="${mapSlot}"` : "";
    const lipClass = withDiamond ? "map-card-slot-lip map-action-deck-lip" : "map-card-slot-lip";
    const lipR = lipRectFromWell(x, y, w, h);
    const cardImg = withDiamond ? cardImageInLipSvg(lipR) : "";
    const foHost =
      withDiamond
        ? `
        <foreignObject class="map-action-deck-fo" x="${lipR.x}" y="${lipR.y}" width="${lipR.w}" height="${lipR.h}" overflow="visible">
          <div xmlns="http://www.w3.org/1999/xhtml" class="map-action-deck-fo-host" data-map-slot="action-pool-host"></div>
        </foreignObject>`
        : "";
    return `
      <g class="map-card-slot${withDiamond ? " map-action-deck-slot" : ""} map-card-slot--right-col" data-slot="${i}"${mapSlotAttr}${withDiamond ? ` data-action-deck="pool"` : ""}${terrain ? ` data-terrain="${terrain}"` : ""} data-well-w="${w}" data-well-h="${h}" data-lip-w="${lipR.w}" data-lip-h="${lipR.h}">
        <rect class="map-card-slot-well" x="${x}" y="${y}" width="${w}" height="${h}" rx="0.5"/>
        <rect class="${lipClass}" x="${lipR.x}" y="${lipR.y}" width="${lipR.w}" height="${lipR.h}" rx="0.3"/>
        ${deckMarker}
        ${cardImg}
        ${foHost}
        ${token}
      </g>`;
  };

  const slots = [];
  for (let i = 0; i < 3; i++) {
    slots.push(
      slotHtml(
        i,
        leftSlotX,
        topStart + i * (slotH + slotGap),
        leftSlotW,
        slotH,
        true,
        false,
        CARD_TOKEN_TERRAINS[i]
      )
    );
  }
  for (let i = 0; i < 3; i++) {
    slots.push(slotHtml(3 + i, leftSlotX, leftBottomStart + i * (slotH + slotGap), leftSlotW, slotH, false));
  }
  const rw = fieldSpec.column.wellW;
  const rh = fieldSpec.column.wellH;
  for (let i = 0; i < rightCount; i++) {
    const y = rightColumnSlotY(i);
    slots.push(
      slotHtml(
        6 + i,
        rightSlotX,
        y,
        rw,
        rh,
        false,
        i === 0,
        null,
        i === 0 ? MAP_SLOT.ACTION_POOL : null
      )
    );
  }

  const [nL, nR] = bottomNotches();
  const notchSlot = (id, label, notch, extraClass, mapSlot) => {
    const w = notch.x1 - notch.x0;
    const h = Math.max(slotH * 0.72, notch.d * 4.2);
    const x = notch.x0;
    const y = woodBottom - notch.d;
    return `
      <g class="map-card-slot ${extraClass}" data-slot="${id}" data-map-slot="${mapSlot}" aria-label="${label}">
        <rect class="map-card-slot-well ${extraClass}-well" x="${x}" y="${y}" width="${w}" height="${h}" rx="0.45"/>
        <rect class="map-card-slot-lip" x="${x + 0.3}" y="${y + 0.3}" width="${w - 0.6}" height="${h - 0.6}" rx="0.3"/>
      </g>`;
  };
  slots.push(notchSlot("elixir", "Talia eliksirów", nR, "map-elixir-slot", MAP_SLOT.ELIXIR));
  slots.push(notchSlot("trophy", "Trofea atrybutów", nL, "map-trophy-slot", MAP_SLOT.TROPHY));

  return `<g class="map-card-slots" data-map-layer="card-slots" aria-label="Pola na karty">${slots.join("")}</g>`;
}
