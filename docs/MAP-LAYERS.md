# Mapa stołu — warstwy i sloty

## Problem

`board.js` + overlaye w `app.js` mieszały SVG, geometrię i pozycjonowanie HTML (`getBoundingClientRect` w wielu miejscach). Karty coacha „walczyły” z rombem i polem SVG.

## Zasada

**Dwa światy, jeden układ współrzędnych (px w `map-wrap`):**

| Warstwa | DOM | Zawartość |
|---------|-----|-----------|
| **svg** | `[data-map-layer="svg"]` | Tylko SVG: ląd, drewno, sloty, flagi, żetony… |
| **overlay** | `[data-map-layer="overlay"]` | Karty, chipy, animacje setup-coach (HTML) |

SVG = plansza (statyczna grafika). Overlay = obiekty gry **nad** planszą. Kotwiczenie: `data-map-slot` + `js/map/overlay-layer.js`.

## Moduły (`js/map/`)

```
constants.js          — MAP_FLAG, viewBox
wood-card-layout.js   — geometria pól kart
shell-geometry.js     — obrys planszy, wcięcia
svg-defs.js           — gradienty `<defs>`
slot-registry.js      — semantyczne id slotów (action-pool, elixir, …)
coach-slot-metrics.js — pomiar slotu (getBBox + CTM)
overlay-layer.js      — montowanie HTML w overlay, wspólny root px
compose-stage.js      — szkielet map-stage / map-wrap / warstwy

layers/
  wood-panel.js
  card-slots.js
  round-flags.js
  monster-stacks.js
  location-fight.js
  gold-dice.js
```

`board.js` na razie składa `mapSvgHtml` i logikę gry; SVG-stopnie są w `layers/*` i są re-eksportowane.

## Sloty

- Numeryczne pola: `data-slot="0"…` (kompatybilność).
- Semantyczne: `data-map-slot="action-pool"` — **używaj w coachu i overlayach**.

## Coach / talia akcji

1. Render mapy z pustym `[data-map-layer="overlay"]`.
2. `mountCoachOverlays(preview)` — wszystkie `.setup-deal` → overlay.
3. `measureSlotBoxInLayer(getMapPositionRoot(mapWrap), slotEl)` — jeden pomiar.
4. Romb w `map-card-deck-marker` — znacznik; znika gdy talia leci / leży.

## Kolejne PR-y

1. `land-layer.js` — drogi, lokacje (wyciągnąć z `mapSvgHtml`).
2. `reputation-track.js` — tor reputacji.
3. Setup coach → `js/map/coach/` zamiast fragmentów w `app.js`.
4. Migracja do `src/ui/map/` wg `STRUCTURE.md`.

## Inspiracje z GitHub / sieci

| Podejście | Repo / źródło | Kiedy |
|-----------|----------------|--------|
| **`foreignObject` + HTML w SVG** | [m98/svg-interactive](https://github.com/m98/svg-interactive), [D3 gist jebeck](https://gist.github.com/jebeck/10699411) | Karta **w prostokącie lip** — te same jednostki co `rect` |
| **Projekcja `getBBox` + macierz CTM** | [plannotator diagram-projection](https://cdn.jsdelivr.net/npm/@plannotator/ui@0.45.1/utils/diagram-projection.ts) | Overlay obok SVG, px względem hosta |
| **CSS `matrix(getScreenCTM())`** | [snippet.zone getScreenCTM](https://snippet.zone/2021/10/19/svg-getscreenctm/) | Div „przyklejony” transformem do elementu SVG |
| **Canvas warstwy (Konva)** | [react-konva-demo](https://github.com/sunshine168/react-konva-demo) | Gdy cała plansza w canvas — u nas na razie SVG |

**Wdrożone:** talia akcji po lądowaniu → `foreignObject` na współrzędnych lip; lot/tasowanie → overlay + projekcja CTM.

## Test

Setup → krok talia akcji (faza 0): tasowanie, lot, talia na polu, bez rombu pod kartą. Dalej / Wstecz — bez regresji mapy na stole głównym.
