# Kopia zapasowa — refaktor warstw mapy (coach / talia)

**Data:** 2026-11-12  
**Cel:** Przed wydzieleniem `js/map/*` i naprawą pozycjonowania talii akcji.

## Pliki w tym folderze

| Plik | Opis |
|------|------|
| `board.js` | Mapa SVG + logika stołu |
| `app.js` | Setup coach, animacja talii |
| `school-action-deck-prep.js` | Assety talii |
| `styles.css` | Style mapy / coach |
| `git-commit.txt` | SHA commita w momencie kopii |
| `timestamp.txt` | Czas utworzenia kopii |

## Przywracanie

```bash
cp backup/pre-map-layer-refactor-2026-11-12/board.js js/board.js
cp backup/pre-map-layer-refactor-2026-11-12/app.js js/app.js
# … pozostałe pliki według potrzeby
npm run build
```

Nie commituj tego folderu do produkcji, jeśli nie chcesz trzymać duplikatów w repo — to lokalny punkt przywracania.
