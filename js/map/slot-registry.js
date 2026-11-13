/** Semantyczne id pól na mapie (HTML overlay + SVG). */
export const MAP_SLOT = {
  ACTION_POOL: "action-pool",
  ELIXIR: "elixir",
  TROPHY: "trophy",
  MONSTER_FIGHT: "monster-fight",
  GOLD_BANK: "gold-bank",
  DICE_TRAY: "dice-tray",
};

export const MAP_SLOT_SELECTOR = Object.fromEntries(
  Object.entries(MAP_SLOT).map(([k, v]) => [k, `[data-map-slot="${v}"]`])
);

/** @param {ParentNode|null} root */
export function queryMapSlot(root, mapSlot) {
  if (!root || !mapSlot) return null;
  return root.querySelector(`[data-map-slot="${mapSlot}"]`);
}
