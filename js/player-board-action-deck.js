import {
  schoolActionDeckPrepScenario,
  guideActionDeckShuffleSrcs,
  guideActionDeckLogoHintSrc,
  guideActionDeckHintCardSrc,
  guideActionDeckFallbackSrc,
  ACTION_DECK_ASSET_V,
  ACTION_CARD_ASPECT_W,
  ACTION_CARD_ASPECT_H,
  ACTION_DECK_SLOT,
  ACTION_DECK_BOARD_WIDTH_FRAC,
  ACTION_DECK_CARD_BOARD_HEIGHT_FRAC,
  ACTION_DECK_HINT_GAP_PX,
  ACTION_DECK_HINT_EXTRA_GAP_CARD_W_FRAC,
  ACTION_DECK_CARDS_SHIFT_LEFT_FRAC,
  ACTION_DECK_CARDS_SHIFT_EXTRA_CARD_W_FRAC,
  ACTION_DECK_CARDS_SHIFT_DOWN_FRAC,
} from "./school-action-deck-prep.js";

const CARD_ASPECT = ACTION_CARD_ASPECT_W / ACTION_CARD_ASPECT_H;

function deckCardImg(src, fallbackSrc) {
  const v = ACTION_DECK_ASSET_V;
  return `<img class="pb-prep-card__img" src="${src}?v=${v}" data-fallback="${fallbackSrc}?v=${v}" alt="" decoding="async" />`;
}

export function playerBoardActionDeckMainHtml({ boardSrc, boardV }) {
  const sc = schoolActionDeckPrepScenario();
  const cardSrcs = guideActionDeckShuffleSrcs(sc.poolSize);
  const cardFallback = guideActionDeckFallbackSrc();
  const logoHint = guideActionDeckLogoHintSrc();
  const hintCard = guideActionDeckHintCardSrc();
  const logoHintBesideDeck =
    logoHint && hintCard
      ? `<aside class="pb-action-school-mark pb-action-school-mark--deck-corner" aria-hidden="true">
        <div class="pb-action-school-mark__sample">
          <img class="pb-action-school-mark__face" src="${hintCard}?v=${ACTION_DECK_ASSET_V}" alt="" decoding="async" />
          <img class="pb-action-school-mark__logo pb-action-school-mark__logo--pulse" src="${logoHint}?v=${ACTION_DECK_ASSET_V}" alt="" decoding="async" />
        </div>
      </aside>`
      : "";

  const shuffleCards = cardSrcs
    .map(
      (src, i) => `
    <div class="pb-prep-shuffle-card pb-action-shuffle-card" style="--i: ${i}" data-shuffle-i="${i}">
      ${deckCardImg(src, cardFallback)}
    </div>`
    )
    .join("");

  return `
    <div class="player-board-prep-layout player-board-action-layout" id="pb-action-layout">
      <div class="player-board-prep-stage player-board-action-stage">
        <header class="player-board-prep-panel player-board-prep-panel--action-caption">
          <h2 class="player-board-prep-panel__title">${sc.title}</h2>
          <p class="player-board-prep-panel__body">${sc.instruction}</p>
        </header>
        <div class="player-board-action-compose" style="--pb-board-width: ${ACTION_DECK_BOARD_WIDTH_FRAC}">
          <figure class="player-board-scan" id="player-board-scan">
            <div class="player-board-scan__stack player-board-scan__stack--compact player-board-scan__stack--action-deck">
              <img
                class="player-board-scan__img"
                src="${boardSrc}?v=${boardV}"
                alt=""
                width="1024"
                height="425"
                loading="eager"
                decoding="async"
              />
              <div class="player-board-action-deck-zone">
                <div class="player-board-action-shuffle-wrap">
                  ${logoHintBesideDeck}
                  <div class="pb-prep-shuffle pb-action-shuffle" id="pb-action-shuffle" aria-hidden="true">
                    ${shuffleCards}
                  </div>
                </div>
              </div>
            </div>
          </figure>
        </div>
      </div>
    </div>`;
}

function sleep(ms) {
  return new Promise((r) => window.setTimeout(r, ms));
}

function remixActionShuffleFaces(root) {
  const pool = [...guideActionDeckShuffleSrcs()];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const v = ACTION_DECK_ASSET_V;
  const fb = guideActionDeckFallbackSrc();
  root.querySelectorAll("#pb-action-shuffle .pb-prep-card__img").forEach((img, i) => {
    const src = pool[i % pool.length];
    img.src = `${src}?v=${v}`;
    img.setAttribute("data-fallback", `${fb}?v=${v}`);
  });
}

function bindPrepCardImages(root) {
  root.querySelectorAll(".pb-prep-card__img, .pb-trophy-card__img").forEach((img) => {
    img.addEventListener(
      "error",
      () => {
        const fb = img.getAttribute("data-fallback");
        if (fb && img.src !== fb) img.src = fb;
      },
      { once: true }
    );
  });
}

function bindActionDeckLayoutSync(root) {
  const stack = root.querySelector(".player-board-scan__stack--action-deck");
  const shuffle = root.querySelector("#pb-action-shuffle");
  const wrap = root.querySelector(".player-board-action-shuffle-wrap");
  const zone = root.querySelector(".player-board-action-deck-zone");
  if (!stack || !shuffle || !wrap) return () => {};

  const img = stack.querySelector(".player-board-scan__img");

  const sync = () => {
    const boardRect = (img || stack).getBoundingClientRect();
    const boardW = boardRect.width;
    const boardH = boardRect.height;
    if (boardH < 40 || boardW < 40) return;

    let cardH = boardH * ACTION_DECK_CARD_BOARD_HEIGHT_FRAC;
    let cardW = cardH * CARD_ASPECT;

    shuffle.style.setProperty("--pb-shuffle-w", `${cardW}px`);
    shuffle.style.setProperty("--pb-shuffle-h", `${cardH}px`);
    shuffle.style.width = `${cardW}px`;
    shuffle.style.height = `${cardH}px`;

    wrap.style.setProperty("--pb-shuffle-w", `${cardW}px`);
    wrap.style.setProperty("--pb-shuffle-h", `${cardH}px`);
    const hintGap =
      ACTION_DECK_HINT_GAP_PX + cardW * ACTION_DECK_HINT_EXTRA_GAP_CARD_W_FRAC;
    wrap.style.setProperty("--pb-hint-gap", `${hintGap}px`);

    if (zone) {
      zone.style.left = `${ACTION_DECK_SLOT.leftFrac * 100}%`;
      zone.style.top = "50%";
      zone.style.width = "auto";
      zone.style.height = "auto";
      zone.style.bottom = "auto";
      const shiftLeftPx =
        boardW * ACTION_DECK_CARDS_SHIFT_LEFT_FRAC +
        cardW * ACTION_DECK_CARDS_SHIFT_EXTRA_CARD_W_FRAC;
      const shiftDownPx = boardH * ACTION_DECK_CARDS_SHIFT_DOWN_FRAC;

      zone.style.transform = `translate(${-shiftLeftPx}px, calc(-50% + ${shiftDownPx}px))`;

      const hintAside = root.querySelector(".pb-action-school-mark--deck-corner");
      if (hintAside) hintAside.style.transform = "";

      requestAnimationFrame(() => {
        const caption = root.querySelector(".player-board-prep-panel--action-caption");
        const hint = root.querySelector(".pb-action-school-mark__sample");
        if (!caption || !hint || !hintAside) return;
        const delta = Math.round(hint.getBoundingClientRect().left - caption.getBoundingClientRect().left);
        if (Math.abs(delta) > 1) {
          hintAside.style.transform = `translateX(${-delta}px)`;
        }
      });
    }
  };

  const ro = new ResizeObserver(() => sync());
  ro.observe(stack);
  if (img) {
    ro.observe(img);
    if (!img.complete) img.addEventListener("load", sync, { once: true });
  }
  sync();
  requestAnimationFrame(sync);

  return () => ro.disconnect();
}

/** @param {HTMLElement} root */
export function bindSchoolActionDeckStep(root) {
  const shuffle = root.querySelector("#pb-action-shuffle");

  bindPrepCardImages(root);
  remixActionShuffleFaces(root);

  const disconnectLayout = bindActionDeckLayoutSync(root);

  if (!shuffle) {
    disconnectLayout();
    return disconnectLayout;
  }

  const reduce =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let stop = false;

  if (reduce) {
    shuffle.classList.add("is-idle");
    return disconnectLayout;
  }

  async function runShufflePasses() {
    for (let pass = 0; pass < 3 && !stop; pass++) {
      remixActionShuffleFaces(root);
      shuffle.classList.remove("is-shuffling");
      void shuffle.offsetWidth;
      shuffle.classList.add("is-shuffling");
      await sleep(850);
      shuffle.classList.remove("is-shuffling");
      await sleep(180);
    }
  }

  async function loop() {
    shuffle.classList.add("is-idle");

    while (!stop) {
      await runShufflePasses();
      if (stop) break;
      await sleep(700);
    }
  }

  loop();

  return () => {
    stop = true;
    disconnectLayout();
  };
}
