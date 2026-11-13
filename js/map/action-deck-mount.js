/**
 * Kotwica talii w SVG foreignObject (jak m98/svg-interactive, D3 foreignObject tooltips).
 * @see https://github.com/m98/svg-interactive
 */

export function queryActionDeckForeignHost(searchRoot) {
  if (!searchRoot) return null;
  return searchRoot.querySelector(".map-action-deck-fo-host");
}

/** Przenieś #setup-deal-main-deck do hosta wewnątrz <foreignObject> (po lądowaniu). */
export function mountMainDeckInForeignObject(preview, dealRoot) {
  const host = queryActionDeckForeignHost(preview);
  if (!host || !dealRoot) return false;
  if (dealRoot.parentElement !== host) host.appendChild(dealRoot);
  dealRoot.classList.add("is-svg-anchored");
  return true;
}

export function unmountMainDeckToOverlay(preview, dealRoot) {
  const overlay = preview?.querySelector?.('[data-map-layer="overlay"]');
  if (!overlay || !dealRoot) return;
  if (dealRoot.parentElement !== overlay) overlay.appendChild(dealRoot);
  dealRoot.classList.remove("is-svg-anchored");
}

export function isMainDeckSvgAnchored(dealRoot) {
  return Boolean(dealRoot?.classList?.contains("is-svg-anchored"));
}
