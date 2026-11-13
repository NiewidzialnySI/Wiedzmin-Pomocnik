/**
 * Projekcja SVG → px (wzór: plannotator diagram-projection, snippet.zone getScreenCTM).
 * @see https://github.com/plannotator/plannotator
 * @see https://snippet.zone/2021/10/19/svg-getscreenctm/
 */

/**
 * @param {SVGElement} geomEl
 * @param {HTMLElement} hostEl — overlay lub map-wrap (origin px)
 * @returns {{ left: number, top: number, width: number, height: number } | null}
 */
export function projectSvgElementToHost(geomEl, hostEl) {
  if (!geomEl || !hostEl || typeof geomEl.getBBox !== "function") return null;
  const ctm = geomEl.getScreenCTM?.();
  if (!ctm) return null;

  let bb;
  try {
    bb = geomEl.getBBox();
  } catch {
    return null;
  }
  if (!(bb.width > 0) || !(bb.height > 0)) return null;

  const hostR = hostEl.getBoundingClientRect();
  const corners = [
    [bb.x, bb.y],
    [bb.x + bb.width, bb.y],
    [bb.x + bb.width, bb.y + bb.height],
    [bb.x, bb.y + bb.height],
  ];

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const [x, y] of corners) {
    const sx = ctm.a * x + ctm.c * y + ctm.e;
    const sy = ctm.b * x + ctm.d * y + ctm.f;
    minX = Math.min(minX, sx);
    minY = Math.min(minY, sy);
    maxX = Math.max(maxX, sx);
    maxY = Math.max(maxY, sy);
  }

  if (!Number.isFinite(minX)) return null;

  return {
    left: minX - hostR.left,
    top: minY - hostR.top,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/** CSS matrix() jak prostokąt SVG (dokładne skalowanie HTML). */
export function screenCtmMatrixCss(geomEl) {
  const ctm = geomEl?.getScreenCTM?.();
  if (!ctm) return null;
  const { a, b, c, d, e, f } = ctm;
  return `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`;
}
