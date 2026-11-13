import { boardShellPath } from "./shell-geometry.js";

/** Gradienty i clipPath planszy. */
export function mapSvgDefsHtml(uid) {
  return `
          <defs>
            <linearGradient id="${uid}-land" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#8fa57a"/>
              <stop offset="38%" stop-color="#c2b48a"/>
              <stop offset="72%" stop-color="#9aaf7e"/>
              <stop offset="100%" stop-color="#7e9470"/>
            </linearGradient>
            <radialGradient id="${uid}-mist" cx="50%" cy="42%" r="62%">
              <stop offset="0%" stop-color="rgba(255,248,230,0.28)"/>
              <stop offset="100%" stop-color="rgba(70,90,55,0.12)"/>
            </radialGradient>
            <radialGradient id="${uid}-water" cx="12%" cy="18%" r="28%">
              <stop offset="0%" stop-color="rgba(70,120,150,0.28)"/>
              <stop offset="100%" stop-color="rgba(70,120,150,0)"/>
            </radialGradient>
            <radialGradient id="${uid}-peak" cx="88%" cy="14%" r="24%">
              <stop offset="0%" stop-color="rgba(210,215,220,0.35)"/>
              <stop offset="100%" stop-color="rgba(210,215,220,0)"/>
            </radialGradient>
            <linearGradient id="${uid}-wood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#6b4a2e"/>
              <stop offset="35%" stop-color="#8a623c"/>
              <stop offset="70%" stop-color="#734f30"/>
              <stop offset="100%" stop-color="#5c3f28"/>
            </linearGradient>
            <linearGradient id="${uid}-wood-shine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="rgba(255,230,190,0.14)"/>
              <stop offset="45%" stop-color="rgba(255,230,190,0)"/>
              <stop offset="100%" stop-color="rgba(30,18,8,0.18)"/>
            </linearGradient>
            <clipPath id="${uid}-shell">
              <path d="${boardShellPath()}"/>
            </clipPath>
          </defs>`;
}
