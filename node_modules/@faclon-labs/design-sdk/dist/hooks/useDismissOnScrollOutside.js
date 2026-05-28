import { useEffect as d } from "react";
function w(r, e, t) {
  d(() => {
    if (!t) return;
    const n = (c) => {
      var o;
      const s = c.target;
      s && ((o = r.current) != null && o.contains(s)) || e();
    }, i = () => e();
    return window.addEventListener("scroll", n, !0), window.addEventListener("resize", i), () => {
      window.removeEventListener("scroll", n, !0), window.removeEventListener("resize", i);
    };
  }, [t, r, e]);
}
export {
  w as useDismissOnScrollOutside
};
