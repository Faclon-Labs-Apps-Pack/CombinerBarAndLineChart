import { useEffect as i } from "react";
let o = 0, d = "", n = "";
function r(t) {
  i(() => {
    if (!(!t || typeof document > "u")) {
      if (o === 0) {
        const e = window.innerWidth - document.documentElement.clientWidth;
        d = document.body.style.overflow, n = document.body.style.paddingRight, document.body.style.overflow = "hidden", e > 0 && (document.body.style.paddingRight = `${e}px`);
      }
      return o += 1, () => {
        o -= 1, o === 0 && (document.body.style.overflow = d, document.body.style.paddingRight = n);
      };
    }
  }, [t]);
}
export {
  r as useBodyScrollLock
};
