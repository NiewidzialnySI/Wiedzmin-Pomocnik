/**
 * Jednolite przejścia między ekranami (View Transitions API + fallback CSS).
 * Inspiracja: Material shared axis / web.dev SPA view transitions.
 */

export const FLOW_DURATION_MS = 380;

export function motionEnabled() {
  return (
    typeof window.matchMedia !== "function" ||
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function viewTransitionsSupported() {
  return typeof document.startViewTransition === "function";
}

function legacyPanelLeaveThen(next) {
  const appEl = document.getElementById("app");
  const panel = appEl?.querySelector(".panel");
  if (!panel || !motionEnabled()) {
    next();
    return Promise.resolve();
  }
  if (panel.classList.contains("is-leaving")) {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        next();
        resolve();
      }, FLOW_DURATION_MS + 30);
    });
  }
  panel.classList.add("is-leaving");
  return new Promise((resolve) => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      panel.removeEventListener("animationend", onEnd);
      next();
      resolve();
    };
    const onEnd = (event) => {
      if (event.target === panel) finish();
    };
    panel.addEventListener("animationend", onEnd);
    window.setTimeout(finish, FLOW_DURATION_MS + 40);
  });
}

export function markPanelEntering() {
  if (viewTransitionsSupported() || !motionEnabled()) return;
  const appEl = document.getElementById("app");
  const panel = appEl?.querySelector(".panel");
  if (!panel) return;
  panel.classList.remove("is-leaving");
  panel.classList.add("is-entering");
  const done = () => {
    panel.classList.remove("is-entering");
    panel.removeEventListener("animationend", onEnd);
  };
  const onEnd = (event) => {
    if (event.target === panel) done();
  };
  panel.addEventListener("animationend", onEnd);
  window.setTimeout(done, FLOW_DURATION_MS + 50);
}

/**
 * @param {() => void} update — mutacja stanu + render DOM
 * @param {{ direction?: 'forward'|'back' }} [opts]
 */
export function runScreenTransition(update, { direction = "forward" } = {}) {
  const root = document.documentElement;
  if (!motionEnabled()) {
    update();
    return Promise.resolve();
  }

  root.dataset.vtDir = direction;

  if (viewTransitionsSupported()) {
    try {
      const vt = document.startViewTransition(() => {
        update();
      });
      return vt.finished
        .catch(() => {})
        .finally(() => {
          delete root.dataset.vtDir;
        });
    } catch {
      delete root.dataset.vtDir;
    }
  }

  return legacyPanelLeaveThen(() => {
    update();
    markPanelEntering();
    delete root.dataset.vtDir;
  });
}
