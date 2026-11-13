import { MAP_FLAG } from "./constants.js";
import { woodCardLayout } from "./wood-card-layout.js";

export function bottomNotches() {
  const { leftSlotX: lx, leftSlotW: lw, rightSlotX: rx, rightSlotW: rw } = woodCardLayout();
  const depth = 1.45;
  const angleDeg = 70;
  const sideInset = depth / Math.tan((angleDeg * Math.PI) / 180);
  const make = (x, w) => ({
    x0: x,
    x1: x + w,
    xt0: x + sideInset,
    xt1: x + w - sideInset,
    d: depth,
  });
  return [make(lx, lw), make(rx, rw)];
}

export function notchPathSeg(n, y1) {
  return [`H${n.x1}`, `L${n.xt1} ${y1 - n.d}`, `H${n.xt0}`, `L${n.x0} ${y1}`].join(" ");
}

export function boardShellPath() {
  const x0 = 0.6;
  const y0 = 0.6;
  const x1 = x0 + MAP_FLAG.shellW;
  const y1 = y0 + 83.8;
  const [nL, nR] = bottomNotches();
  return [`M${x0} ${y0}`, `H${x1}`, `V${y1}`, notchPathSeg(nR, y1), notchPathSeg(nL, y1), `H${x0}`, `Z`].join(
    " "
  );
}

export function woodFacePath() {
  const { woodX: x, yTop: y, woodW: w } = woodCardLayout();
  const y1 = y + 83.8;
  const x1 = x + w;
  const [nL, nR] = bottomNotches();
  return [`M${x} ${y}`, `H${x1}`, `V${y1}`, notchPathSeg(nR, y1), notchPathSeg(nL, y1), `H${x}`, `Z`].join(" ");
}
