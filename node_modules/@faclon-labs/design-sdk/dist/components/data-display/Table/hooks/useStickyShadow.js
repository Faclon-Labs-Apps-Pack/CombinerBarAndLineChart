import { useState as c, useEffect as n } from "react";
function a(r) {
  const [l, o] = c(!1);
  return n(() => {
    const e = r.current;
    if (!e) return;
    const t = () => {
      const s = e.scrollLeft > 0;
      o(s), e.dataset.scrolled = s ? "true" : "false";
    };
    return e.addEventListener("scroll", t, { passive: !0 }), t(), () => e.removeEventListener("scroll", t);
  }, [r]), l;
}
export {
  a as useStickyShadow
};
