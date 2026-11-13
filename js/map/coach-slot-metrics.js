import { ACTION_DECK_SLOT_ID, actionDeckLipSvgRect } from "./wood-card-layout.js";
import { MAP_SLOT, queryMapSlot } from "./slot-registry.js";
import { projectSvgElementToHost } from "./svg-projection.js";

export function queryActionDeckSlot(searchRoot) {
  if (!searchRoot) return null;
  return (
    queryMapSlot(searchRoot, MAP_SLOT.ACTION_POOL) ||
    searchRoot.querySelector(".map-action-deck-slot") ||
    searchRoot.querySelector(`.map-card-slot[data-slot="${ACTION_DECK_SLOT_ID}"]`)
  );
}

export function queryActionDeckLip(searchRoot) {
  const slot = queryActionDeckSlot(searchRoot);
  return (
    slot?.querySelector(".map-action-deck-lip") ||
    slot?.querySelector(".map-card-slot-lip") ||
    null
  );
}

function resolveMapWrap(layerOrRoot) {
  return (
    layerOrRoot?.closest?.(".map-wrap") ||
    layerOrRoot?.querySelector?.(".map-wrap") ||
    null
  );
}

function pickSlotGeom(slotEl, metric) {
  if (!slotEl) return null;
  const lip = slotEl.querySelector?.(".map-card-slot-lip");
  const well = slotEl.querySelector?.(".map-card-slot-well");
  if (metric === "lip" && lip) return lip;
  if (metric === "well" && well) return well;
  return well || lip || slotEl;
}

/** Px w overlay / map-wrap; geometria z getBBox + getScreenCTM. */
function measureSvgGeomInLayer(positionRoot, geomEl) {
  if (!positionRoot || !geomEl) return null;
  const svg = geomEl.ownerSVGElement;
  if (!svg || typeof geomEl.getBBox !== "function") return null;

  let bb;
  try {
    bb = geomEl.getBBox();
  } catch {
    return null;
  }
  if (!(bb.width > 0) || !(bb.height > 0)) return null;

  const ctm = geomEl.getScreenCTM?.();
  if (!ctm) return null;

  const pt = svg.createSVGPoint();
  const layerR = positionRoot.getBoundingClientRect();
  const corners = [
    [bb.x, bb.y],
    [bb.x + bb.width, bb.y],
    [bb.x + bb.width, bb.y + bb.height],
    [bb.x, bb.y + bb.height],
  ];

  const xs = [];
  const ys = [];
  for (const [x, y] of corners) {
    pt.x = x;
    pt.y = y;
    const sc = pt.matrixTransform(ctm);
    xs.push(sc.x - layerR.left);
    ys.push(sc.y - layerR.top);
  }

  const left = Math.min(...xs);
  const top = Math.min(...ys);
  const width = Math.max(...xs) - left;
  const height = Math.max(...ys) - top;
  if (width < 1 || height < 1) return null;
  return { left, top, width, height };
}

/** Fallback: lip talii akcji z viewBox (np. x=134.95, w=21.95). */
function measureActionDeckLipFromViewBox(mapWrap, positionRoot) {
  const svg = mapWrap?.querySelector?.(".map-svg");
  if (!svg || !positionRoot) return null;
  const ctm = svg.getScreenCTM?.();
  if (!ctm) return null;

  const { x, y, w, h } = actionDeckLipSvgRect();
  const pt = svg.createSVGPoint();
  const layerR = positionRoot.getBoundingClientRect();
  const corners = [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ];

  const xs = [];
  const ys = [];
  for (const [cx, cy] of corners) {
    pt.x = cx;
    pt.y = cy;
    const sc = pt.matrixTransform(ctm);
    xs.push(sc.x - layerR.left);
    ys.push(sc.y - layerR.top);
  }

  const left = Math.min(...xs);
  const top = Math.min(...ys);
  const width = Math.max(...xs) - left;
  const height = Math.max(...ys) - top;
  if (width < 1 || height < 1) return null;
  return { left, top, width, height };
}

function measureClientRectInLayer(positionRoot, target) {
  const layerR = positionRoot.getBoundingClientRect();
  const targetR = target.getBoundingClientRect();
  if (layerR.width < 4 || targetR.width < 1) return null;
  return {
    left: targetR.left - layerR.left,
    top: targetR.top - layerR.top,
    width: targetR.width,
    height: targetR.height,
  };
}

export function measureSlotBoxInLayer(positionRoot, slotEl, { metric = "lip" } = {}) {
  if (!positionRoot || !slotEl) return null;

  const geom = pickSlotGeom(slotEl, metric);
  if (geom instanceof SVGElement) {
    const projected = projectSvgElementToHost(geom, positionRoot);
    if (projected) return projected;
  }
  const fromSvg = measureSvgGeomInLayer(positionRoot, geom);
  if (fromSvg) return fromSvg;

  const mapWrap = resolveMapWrap(positionRoot);
  if (metric === "lip" && slotEl.classList?.contains("map-action-deck-slot") && mapWrap) {
    const fallback = measureActionDeckLipFromViewBox(mapWrap, positionRoot);
    if (fallback) return fallback;
  }

  const target = geom || slotEl;
  return measureClientRectInLayer(positionRoot, target);
}

/**
 * Pole wspólnej talii — dokładnie prostokąt `.map-card-slot-lip`.
 * @param {HTMLElement} positionRoot — overlay (`getMapPositionRoot`)
 * @param {ParentNode} searchRoot — preview / map-wrap (szukanie slotu)
 */
export function measureActionDeckLipBox(positionRoot, searchRoot) {
  if (!positionRoot) return null;
  const lip = queryActionDeckLip(searchRoot);
  if (lip) {
    const m = measureSvgGeomInLayer(positionRoot, lip);
    if (m) return m;
  }
  const mapWrap = resolveMapWrap(positionRoot) || resolveMapWrap(searchRoot);
  return mapWrap ? measureActionDeckLipFromViewBox(mapWrap, positionRoot) : null;
}
