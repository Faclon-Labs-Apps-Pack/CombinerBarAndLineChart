import { jsx as f } from "react/jsx-runtime";
import { useRef as a, useCallback as l, useLayoutEffect as c, useEffect as d } from "react";
import { useTabsContext as u } from "./TabsContext.js";
/* empty css                 */
function p() {
  const r = u(), i = a(null), n = a(!1), o = l(() => {
    const t = i.current;
    if (!t) return;
    if (!r.selectedValue) {
      t.style.opacity = "0";
      return;
    }
    const e = r.getItemEl(r.selectedValue);
    if (!e) return;
    const s = !n.current;
    s && (t.style.transitionProperty = "none"), r.variant === "Filled" ? (t.style.transform = `translate(${e.offsetLeft}px, ${e.offsetTop}px)`, t.style.width = `${e.offsetWidth}px`, t.style.height = `${e.offsetHeight}px`) : r.orientation === "Horizontal" ? (t.style.transform = `translateX(${e.offsetLeft}px)`, t.style.width = `${e.offsetWidth}px`, t.style.height = "") : (t.style.transform = `translateY(${e.offsetTop}px)`, t.style.height = `${e.offsetHeight}px`, t.style.width = ""), r.variant === "Filled" ? t.style.backgroundColor = "" : t.style.backgroundColor = e.disabled ? "var(--text-brand-disabled)" : "", t.style.opacity = "1", s && (t.offsetWidth, t.style.transitionProperty = "", n.current = !0);
  }, [r]);
  return c(() => {
    o();
  }), d(() => {
    var s;
    const t = (s = i.current) == null ? void 0 : s.parentElement;
    if (!t || typeof ResizeObserver > "u") return;
    const e = new ResizeObserver(() => o());
    return e.observe(t), () => e.disconnect();
  }, [o]), /* @__PURE__ */ f("span", { ref: i, className: "fds-tabs__indicator", "aria-hidden": "true" });
}
p.displayName = "TabIndicator";
export {
  p as TabIndicator
};
