# Struktura projektu — stan i plan

Fanowski pomocnik do **Wiedźmin: Stary Świat**. Aplikacja SPA w czystym JS (ES modules), bez frameworka. Deployment: otwarcie `index.html` lub GitHub Pages.

## Problem dzisiejszy

| Plik | Linie | Uwagi |
|------|------:|-------|
| `js/app.js` | ~4100 | Stan, nawigacja, setup-coach, wszystkie ekrany |
| `js/board.js` | ~1476 | Logika stołu **oraz** duże kawałki SVG |
| `js/app.bundle.js` | ~6900 | **Artefakt** — nie edytować ręcznie |
| Pozostałe moduły | 120–627 | Sensowny rozmiar |

Efekt: agent i człowiek ładują cały `app.js` przy każdej zmianie UI → więcej tokenów i ryzyko regresji.

## Wzorce zewnętrzne (GitHub / vanilla)

Stosujemy mieszankę sprawdzonych konwencji:

1. **[remarcmij/vanilla-starter](https://github.com/remarcmij/vanilla-starter)** — `pages/` (logika ekranu + eventy) vs `views/` (HTML/DOM); jeden `index.js` jako entry.
2. **[wwebdev/static-website-template](https://github.com/wwebdev/static-website-template)** — `src/` = źródła, `dist/` = wynik builda; nie edytuje się `dist/`.
3. **Warstwy** (m.in. [Modular Vanilla JS](https://www.flaskvibe.com/tutorials/modular-vanilla-js-outperforms-frameworks)) — `data` → `domain` → `ui` → `app` (bootstrap/router).

Zasada: **jeden moduł = jedna odpowiedzialność**, importy w dół (ui może importować domain/data, nie odwrotnie).

## Docelowa struktura (fazy migracji)

Na końcu (ścieżki względne od roota repo):

```text
index.html
package.json
scripts/build.mjs          # esbuild: src/main.js → js/app.bundle.js
css/styles.css               # później opcjonalnie src/styles/
img/                         # assety używane w HTML (ścieżki ./img/...)
research/                    # audyty — bez importów z kodu
docs/STRUCTURE.md            # ten plik

src/
  main.js                    # jedyny entry bundla
  app/
    router.js                # go(), lista view, render()
    shell.js                 # nawigacja, layout
    constants.js             # STORAGE_KEY, UI_SCALE
  state/
    game-state.js            # load/save/normalize/defaultState
    player-state.js          # (przeniesienie z js/)
  data/                      # tylko dane i teksty przewodnika
    map-data.js
    content.js
    lexicon.js
    sources.js
  domain/                    # reguły gry bez HTML (czyste funkcje)
    board-logic.js           # potwory, reputacja, ścieżki
    guide.js
    quests.js
  ui/
    icons.js
    html.js                  # escapeAttr, escapeHtml
    map/                     # SVG i panele planszy (z dzisiejszego board.js)
      map-svg.js
      map-panels.js
    views/                   # każdy ekran = osobny plik
      splash.js
      home.js
      roster.js
      order.js
      setup.js               # coach + kroki setupu
      board-view.js
      turn.js
      reference.js           # ref, icons, lexicon, sources

js/
  app.bundle.js              # OUTPUT builda (commitowany pod GH Pages bez CI)
```

Stary katalog `js/*.js` znika **dopiero po** przeniesieniu modułów — można trzymać `js/legacy/` przez 1–2 PR-y z re-exportami.

## Kolejność migracji (małe PR-y)

1. **Tooling** — `package.json`, `esbuild`, skrypt `npm run build` / `npm run watch`; entry na razie `import "./js/app.js"` (bez zmiany zachowania).
2. **HTML utils** — wyciągnąć `escapeAttr` / `escapeHtml` do `ui/html.js`.
3. **Stan** — `game-state.js` (localStorage, `normalizeState`); `app.js` tylko importuje.
4. **Router** — `router.js` + `shell.js`; `render()` deleguje do `views/*`.
5. **Widoki** — po jednym pliku: `home` → `roster` → … → `setup` (największy) na końcu.
6. **board.js** — podział: `domain/board-logic.js` + `ui/map/*.js`; brak importu `icons` w domain.
7. **Assety** — `img/schools/_backup_*` i `_centered` do `img/_archive/` (poza ścieżkami w kodzie) lub `.cursorignore`.
8. **Opcjonalnie** — `type="module"` w dev (`src/main.js` bez bundla na localhost); produkcja nadal bundle dla `file://`.

## Zasady na co dzień

- Edytujemy wyłącznie `src/**` i `css/**`; po zmianie JS: `npm run build`.
- Nie commitujemy przypadkowego ręcznego patcha w `app.bundle.js`.
- Nowy ekran → `src/ui/views/<nazwa>.js` + wpis w `router.js`.
- Nowa reguła gry (bez DOM) → `src/domain/` lub `src/data/`.
- Ścieżki do obrazków w HTML: `./img/...` (root deploy).
- `research/` — dokumentacja dla ludzi; nie importować w runtime.

## Test po kroku

- Otwórz `index.html` (lub `python3 -m http.server`).
- Splash → nowa gra → roster → setup (coach) → stół → tura.
- Odświeżenie przywraca zapis z localStorage.
- Solo + 2 graczy — smoke test wystarczy przy refaktorze struktury.

## Cursor

Szczegóły dla agenta: `.cursor/rules/project-structure.mdc` (globalnie) i `.cursor/rules/javascript-modules.mdc` (pliki JS).
