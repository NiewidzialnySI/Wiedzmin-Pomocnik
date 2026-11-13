import {
  ACTION_CARD_ASPECT_W,
  ACTION_CARD_ASPECT_H,
} from "../school-action-deck-prep.js";
import { woodCardLayout, actionDeckLipSvgRect, actionDeckSlotSvgRect, LIP_INSET } from "./wood-card-layout.js";

/** Jak tył talii mieści się w lip (logika z `actionDeckCardImageSvg`). */
/** CSS `--fit-rot-w` / `--fit-rot-h` dla HTML (ta sama logika co SVG `<image>`). */
export function htmlCardFitVarsForLip(lipBox) {
  const { unrotated } = cardFitInLipRect({
    x: 0,
    y: 0,
    w: lipBox.width,
    h: lipBox.height,
  });
  return { fitRotW: unrotated.w, fitRotH: unrotated.h };
}

/** Skala inner po obrocie −90° — ten sam wizualny rozmiar co `<image>` w lipie SVG. */
export function mainDeckSeatScaleForPortraitInLip(lipBox, portraitW, portraitH) {
  const { visual } = cardFitInLipRect({
    x: 0,
    y: 0,
    w: lipBox.width,
    h: lipBox.height,
  });
  const rw = portraitH > 0 ? visual.w / portraitH : 1;
  const rh = portraitW > 0 ? visual.h / portraitW : 1;
  return Math.min(rw, rh);
}

export function cardFitInLipRect(lip) {
  const aspect = ACTION_CARD_ASPECT_W / ACTION_CARD_ASPECT_H;
  let uw = lip.h;
  let uh = uw / aspect;
  if (uh > lip.w) {
    uh = lip.w;
    uw = uh * aspect;
  }
  const cx = lip.x + lip.w / 2;
  const cy = lip.y + lip.h / 2;
  return {
    aspect,
    unrotated: { w: uw, h: uh, x: cx - uw / 2, y: cy - uh / 2 },
    visual: { w: uh, h: uw },
    center: { cx, cy },
  };
}

/** Wymiary pól prawej kolumny (wszystkie 7 = jak talia akcji). */
export function rightColumnCardFieldSpec() {
  const L = woodCardLayout();
  const well = actionDeckSlotSvgRect();
  const lip = actionDeckLipSvgRect();
  const fit = cardFitInLipRect(lip);
  return {
    lipInset: LIP_INSET,
    well,
    lip,
    fit,
    column: {
      x: L.rightSlotX,
      wellW: L.rightSlotW,
      wellH: L.slotH,
      topY: L.rightTopStart,
      gap: L.slotGap,
      count: L.rightCount,
    },
  };
}

/** Y górnej krawędzi well dla slotu prawej kolumny (0…6 → id 6…12). */
export function rightColumnSlotY(columnIndex) {
  const { column } = rightColumnCardFieldSpec();
  return column.topY + columnIndex * (column.wellH + column.gap);
}
