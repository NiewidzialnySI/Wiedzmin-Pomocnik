import {
  schoolTrophyBackSrc,
  schoolTrophyPrepScenario,
  TROPHY_BACK_FALLBACK,
} from "./school-trophy-prep.js";

function trophyCardImg(back) {
  return `<img class="pb-trophy-card__img" src="${back}?v=1" data-fallback="${TROPHY_BACK_FALLBACK}?v=1" alt="" decoding="async" />`;
}

export function playerBoardTrophyMainHtml({
  boardSrc,
  boardV,
  schoolId,
  playerCount,
}) {
  const sc = schoolTrophyPrepScenario(playerCount);
  const back = schoolTrophyBackSrc(schoolId);

  const shuffleCards = Array.from({ length: sc.poolSize }, (_, i) => `
    <div class="pb-trophy-shuffle-card" style="--i: ${i}" data-shuffle-i="${i}">
      ${trophyCardImg(back)}
    </div>`).join("");

  return `
    <div class="player-board-trophy-layout" id="pb-trophy-layout" data-pick="${sc.pickCount}">
      <div class="player-board-trophy-layout__mat">
        <figure class="player-board-scan" id="player-board-scan">
          <div class="player-board-scan__stack player-board-scan__stack--compact player-board-scan__stack--trophy">
            <div class="pb-trophy-under" id="pb-trophy-under" aria-hidden="true"></div>
            <div class="pb-trophy-fly-layer" id="pb-trophy-fly" aria-hidden="true"></div>
            <img
              class="player-board-scan__img"
              src="${boardSrc}?v=${boardV}"
              alt=""
              width="1024"
              height="425"
              loading="eager"
              decoding="async"
            />
            <div class="pb-trophy-insert-slot" id="pb-trophy-insert-slot" aria-hidden="true"></div>
            <div class="pb-trophy-edge" id="pb-trophy-edge" aria-hidden="true"></div>
          </div>
        </figure>
      </div>
      <div class="player-board-trophy-aside">
        <aside class="player-board-trophy-panel">
          <h2 class="player-board-trophy-panel__title">${sc.title}</h2>
          <p class="player-board-trophy-panel__body">${sc.instruction}</p>
        </aside>
        <div class="player-board-trophy-shuffle-col">
          <div class="pb-trophy-shuffle" id="pb-trophy-shuffle" aria-hidden="true">
            ${shuffleCards}
          </div>
        </div>
      </div>
    </div>`;
}

function sleep(ms) {
  return new Promise((r) => window.setTimeout(r, ms));
}

function waitTransition(el, prop = "transform") {
  return new Promise((resolve) => {
    let done = false;
    const finish = (ev) => {
      if (ev && ev.propertyName && ev.propertyName !== prop) return;
      if (done) return;
      done = true;
      el.removeEventListener("transitionend", finish);
      resolve();
    };
    el.addEventListener("transitionend", finish);
    window.setTimeout(finish, 820);
  });
}

function layoutFlyCard(card, from, to, w, h, { fly = false } = {}) {
  card.style.setProperty("--w", `${w}px`);
  card.style.setProperty("--h", `${h}px`);
  card.style.setProperty("--x0", `${from.x}px`);
  card.style.setProperty("--y0", `${from.y}px`);
  card.style.setProperty("--x1", `${to.x}px`);
  card.style.setProperty("--y1", `${to.y}px`);
  card.classList.toggle("is-flying", Boolean(fly));
}

function measureTargets(stack, shuffle, slot) {
  const sr = stack.getBoundingClientRect();
  const dr = shuffle.getBoundingClientRect();
  const sl = slot.getBoundingClientRect();

  const deckX = dr.left - sr.left + dr.width / 2;
  const deckY = dr.top - sr.top + dr.height / 2;
  const edgeY = sl.bottom - sr.top;
  const slotLeft = sl.left - sr.left;
  const slotW = sl.width;

  return { sr, deckX, deckY, edgeY, slotLeft, slotW };
}

function bindTrophyCardImages(root) {
  root.querySelectorAll(".pb-trophy-card__img").forEach((img) => {
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

/**
 * @param {HTMLElement} root
 * @param {{ pickCount: number }} opts
 */
export function bindSchoolTrophyStep(root, opts) {
  const layout = root.querySelector("#pb-trophy-layout");
  const shuffle = root.querySelector("#pb-trophy-shuffle");
  const stack = root.querySelector(".player-board-scan__stack--trophy");
  const slot = root.querySelector("#pb-trophy-insert-slot");
  const fly = root.querySelector("#pb-trophy-fly");
  const under = root.querySelector("#pb-trophy-under");
  const back =
    root.querySelector(".pb-trophy-shuffle-card img")?.getAttribute("src") ||
    `${TROPHY_BACK_FALLBACK}?v=1`;

  bindTrophyCardImages(root);

  if (!layout || !shuffle || !stack || !slot || !fly || !under || !opts?.pickCount) {
    return;
  }

  const reduce =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let stop = false;
  const pickCount = opts.pickCount;

  async function runShufflePasses() {
    for (let pass = 0; pass < 3 && !stop; pass++) {
      shuffle.classList.remove("is-shuffling");
      void shuffle.offsetWidth;
      shuffle.classList.add("is-shuffling");
      await sleep(850);
      shuffle.classList.remove("is-shuffling");
      await sleep(180);
    }
  }

  async function flyCardsIn() {
    fly.replaceChildren();
    under.replaceChildren();

    const { sr, deckX, deckY, edgeY, slotLeft, slotW } = measureTargets(
      stack,
      shuffle,
      slot
    );

    const targetW = Math.min(sr.width * 0.2, slotW * 0.92);
    const targetH = targetW * (819 / 532);
    const startW = targetW * 0.42;
    const startH = startW * (819 / 532);
    const tx = slotLeft + (slotW - targetW) / 2;
    const stackStep = pickCount > 1 ? Math.min(targetH * 0.17, 32) : 0;

    for (let i = 0; i < pickCount && !stop; i++) {
      const el = document.createElement("div");
      el.className = "pb-trophy-fly-card";
      el.style.setProperty("--stack-i", String(i));
      el.innerHTML = trophyCardImg(back);
      fly.appendChild(el);
      bindTrophyCardImages(el);

      const ty = edgeY - targetH / 2 + i * stackStep;
      const from = { x: deckX - startW / 2, y: deckY - startH / 2 };
      const midDeck = { x: deckX - targetW / 2, y: deckY - targetH / 2 };
      const to = { x: tx, y: ty };

      layoutFlyCard(el, from, from, startW, startH);
      el.style.opacity = "1";

      await sleep(40);
      void el.offsetWidth;
      layoutFlyCard(el, midDeck, to, targetW, targetH, { fly: true });

      await waitTransition(el);
      if (stop) break;

      el.classList.remove("is-flying");
      el.classList.add("is-inserted");
      under.appendChild(el);
    }

    await sleep(2200);
    fly.replaceChildren();
    under.replaceChildren();
  }

  async function loop() {
    shuffle.classList.add("is-idle");
    if (reduce) {
      slot.classList.add("is-static-demo");
      return;
    }

    while (!stop) {
      await runShufflePasses();
      if (stop) break;
      await flyCardsIn();
      await sleep(600);
    }
  }

  loop();

  return () => {
    stop = true;
  };
}
