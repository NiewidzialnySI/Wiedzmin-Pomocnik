import { MAP_SLOT, queryMapSlot } from "./slot-registry.js";
import { measureSlotBoxInLayer, measureActionDeckLipBox } from "./coach-slot-metrics.js";

/** @param {ParentNode|null} mapWrap */
export function getMapOverlayLayer(mapWrap) {
  if (!mapWrap) return null;
  return mapWrap.querySelector('[data-map-layer="overlay"]') || mapWrap;
}

/** Współrzędne px dla HTML — zawsze względem overlay (albo map-wrap). */
export function getMapPositionRoot(mapWrap) {
  return getMapOverlayLayer(mapWrap) || mapWrap;
}

/**
 * Wszystkie warstwy animacji coacha → jeden overlay nad SVG.
 * @param {ParentNode|null} preview — `.setup-board-preview`
 * @returns {{ mapWrap: HTMLElement|null, overlay: HTMLElement|null, positionRoot: HTMLElement|null }}
 */
export function mountCoachOverlays(preview) {
  const mapWrap = preview?.querySelector?.(".map-wrap") ?? null;
  const overlay = getMapOverlayLayer(mapWrap);
  const positionRoot = getMapPositionRoot(mapWrap);
  if (!preview || !overlay) {
    return { mapWrap, overlay, positionRoot };
  }
  preview.querySelectorAll(".setup-deal").forEach((el) => {
    if (el.parentElement !== overlay) overlay.appendChild(el);
  });
  return { mapWrap, overlay, positionRoot };
}

export function queryActionDeckSlot(searchRoot) {
  return (
    queryMapSlot(searchRoot, MAP_SLOT.ACTION_POOL) ||
    searchRoot?.querySelector?.(".map-action-deck-slot") ||
    searchRoot?.querySelector?.('.map-card-slot[data-slot="6"]') ||
    null
  );
}

export function measureMapSlot(searchRoot, slotEl, options) {
  const mapWrap = searchRoot?.closest?.(".map-wrap") || searchRoot?.querySelector?.(".map-wrap");
  const root = getMapPositionRoot(mapWrap) || searchRoot;
  return measureSlotBoxInLayer(root, slotEl, options);
}

export { measureSlotBoxInLayer, measureActionDeckLipBox, MAP_SLOT, queryMapSlot };
