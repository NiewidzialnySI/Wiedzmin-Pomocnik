import { MAP_FLAG, CARD_SLOT_WIDTH_FRAC } from "./constants.js";

/** Górne pole prawej kolumny — wspólna talia akcji (romb). */
export const ACTION_DECK_SLOT_ID = "6";

/** Layout pól kart na deskach (współdzielony z flagą III / wcięciami). */
export function woodCardLayout() {
  const { yTop, w: flagW, h: flagH, edgePad, woodX, woodW } = MAP_FLAG;
  const tokenR = 2.2;
  const colGap = 4.2;
  const rightPad = 1.25;
  const woodRight = woodX + woodW;
  const leftSlotX = woodX + edgePad + flagW;
  const slotWMax = (woodRight - rightPad - leftSlotX - colGap) / 2;
  const slotW = slotWMax * CARD_SLOT_WIDTH_FRAC;
  const slotInsetX = (slotWMax - slotW) / 2;
  const leftSlotW = slotW;
  const leftSlotXAdj = leftSlotX + slotInsetX;
  const rightSlotX = leftSlotX + slotWMax + colGap + slotInsetX;
  const rightSlotW = slotW;
  const woodBottom = yTop + 83.8;
  const rightTopStart = yTop + flagH - 1.15;
  const bottomPad = edgePad;
  const slotGap = 1.55;
  /** @deprecated tylko kompat. wsteczna — prawa kolumna ma równy `slotGap` */
  const firstBreak = slotGap;
  const rightCount = 7;
  const rightAvail = woodBottom - bottomPad - rightTopStart;
  /* 7 identycznych pól (wys. jak u talii akcji); bez większej przerwy pod polem 6 */
  const slotH = (rightAvail - (rightCount - 1) * slotGap) / rightCount;
  return {
    yTop,
    flagW,
    flagH,
    edgePad,
    woodX,
    woodW,
    woodRight,
    tokenR,
    rightPad,
    leftSlotX: leftSlotXAdj,
    leftSlotW,
    rightSlotX,
    rightSlotW,
    slotWMax,
    slotX: leftSlotXAdj,
    slotW: leftSlotW,
    slotH,
    slotGap,
    firstBreak,
    rightTopStart,
    woodBottom,
    bottomPad,
    rightCount,
  };
}

export const LIP_INSET = 0.35;

/** Prostokąt well talii akcji (viewBox). */
export function actionDeckSlotSvgRect() {
  const L = woodCardLayout();
  return {
    x: L.rightSlotX,
    y: L.rightTopStart,
    w: L.rightSlotW,
    h: L.slotH,
    lipInset: LIP_INSET,
  };
}

/** Prostokąt `map-card-slot-lip` talii akcji — kotwica kart HTML. */
export function actionDeckLipSvgRect() {
  const L = woodCardLayout();
  return {
    x: L.rightSlotX + LIP_INSET,
    y: L.rightTopStart + LIP_INSET,
    w: L.rightSlotW - 2 * LIP_INSET,
    h: L.slotH - 2 * LIP_INSET,
  };
}
