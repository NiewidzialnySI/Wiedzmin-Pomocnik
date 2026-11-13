/** Wspólne wymiary flag / desek (jednostki viewBox SVG planszy stołu). */
export const MAP_FLAG = {
  yTop: 0.6,
  w: 3.35,
  h: 5.8,
  notch: 0.85,
  edgePad: 4.4,
  woodX: 100,
  woodW: 58.5,
  get viewW() {
    return this.woodX + this.woodW + 0.6;
  },
  get shellW() {
    return this.woodX + this.woodW - 0.6;
  },
};

/**
 * Szerokość well/lip względem dostępnej kolumny drewna (0–1).
 * Niższe = węższe pola, wyśrodkowane między krawędziami / listwami.
 */
export const CARD_SLOT_WIDTH_FRAC = 0.7;
