# Wiedźmin: Stary Świat — Pomocnik

Przeglądarkowy przewodnik do planszówki **Wiedźmin: Stary Świat** (sama **podstawka**).

Prowadzi przez:

1. **Wybór liczby graczy** + **imiona i szkoły** wiedźmińskie
2. **Przygotowanie rozgrywki** — krok po kroku (plansza, talie, potwory, każdy gracz)
3. **Stół** — uproszczona mapa (obrót, potwory, pozycje wiedźminów), reputacja, licznik kart/złota/eliksirów, „co robi teraz”, wyliczenie zmęczenia i doboru
4. **Turę gracza** — faza I → II → III, z gałęziami (ruch, walka, medytacja, eksploracja)
5. **Wariant solo** — osobny setup i różnice w pokerze, walce, fazie III oraz tabeli wyniku
6. **Ikony / ściąga symboli** — eliksir, kości, burn vs discard, zmęczenie + **Leksykon** + **Źródła**
7. **Nie zastępuje kart** — pełne teksty potworów/eliksirów/eksploracji zostają na stole (prawa CDPR)

## Uruchomienie

Wystarczy otworzyć `index.html` w przeglądarce (działa też jako plik z dysku). Można też odpalić lokalny serwer w tym folderze:

```bash
cd wiedzmin-helper
python3 -m http.server 8080
```

Potem wejdź na: http://127.0.0.1:8080

> `index.html` ładuje jeden zwykły skrypt `js/app.bundle.js`, więc dwuklik w plik wystarcza. Po zmianie plików w `js/` (lub `src/`):

```bash
npm install
npm run build
```

Podczas pracy: `npm run watch` — przebudowuje bundle przy zapisie.

## GitHub Pages

W ustawieniach repozytorium włącz Pages (branch `main` / ten branch, folder `/wiedzmin-helper` albo root z tą zawartością). Adres będzie w stylu:

`https://<user>.github.io/<repo>/wiedzmin-helper/`

## Zakres

- Tylko podstawka (bez dodatków)
- Solo + 2–5 graczy
- Język: polski
- Fanowski skrót instrukcji — przy sporze wygrywa oficjalna książka zasad

## Disclaimer

Nieoficjalny projekt fanowski. *Wiedźmin: Stary Świat* © CD PROJEKT RED / Go On Board.
