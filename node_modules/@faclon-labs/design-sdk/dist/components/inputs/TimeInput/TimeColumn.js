import { jsxs as R, jsx as l } from "react/jsx-runtime";
import { forwardRef as A, useRef as s, useCallback as d, useEffect as T, useLayoutEffect as B } from "react";
import { cn as N } from "../../../utils/cn.js";
/* empty css               */
const g = 28, E = 68, H = 28, O = 300, G = A(
  ({ label: D, items: a, selectedIndex: t, onSelect: o, scrollToSelected: p = !0, className: v }, y) => {
    const i = s(null), u = s(!1), e = s(null), m = s(t), h = d((r = "smooth") => {
      const n = i.current;
      n && (u.current = !0, e.current !== null && window.clearTimeout(e.current), n.scrollTo({ top: t * g, behavior: r }), e.current = window.setTimeout(() => {
        u.current = !1;
      }, O));
    }, [t]);
    T(() => {
      p && t !== m.current && (m.current = t, h("smooth"));
    }, [p, t, h]), B(() => {
      const r = i.current;
      r && (u.current = !0, r.scrollTop = t * g, e.current !== null && window.clearTimeout(e.current), e.current = window.setTimeout(() => {
        u.current = !1;
      }, 0));
    }, []), T(
      () => () => {
        e.current !== null && window.clearTimeout(e.current);
      },
      []
    );
    const M = d(() => {
      if (u.current) return;
      const r = i.current;
      if (!r) return;
      const n = r.getBoundingClientRect(), c = n.left + n.width / 2, k = n.top + E + H / 2, w = document.elementFromPoint(c, k);
      if (!w) return;
      const _ = w.closest("[data-time-row-index]");
      if (!_) return;
      const b = Number(_.dataset.timeRowIndex);
      if (Number.isNaN(b)) return;
      const f = Math.max(0, Math.min(b, a.length - 1));
      f !== t && (m.current = f, o(f));
    }, [t, a.length, o]), C = d(
      (r) => {
        switch (r.key) {
          case "ArrowDown":
            r.preventDefault(), o(Math.min(t + 1, a.length - 1));
            break;
          case "ArrowUp":
            r.preventDefault(), o(Math.max(t - 1, 0));
            break;
          case "Home":
            r.preventDefault(), o(0);
            break;
          case "End":
            r.preventDefault(), o(a.length - 1);
            break;
        }
      },
      [t, a.length, o]
    );
    return /* @__PURE__ */ R("div", { ref: y, className: N("fds-time-column", v), children: [
      /* @__PURE__ */ l("div", { className: "fds-time-column__highlight", "aria-hidden": "true" }),
      /* @__PURE__ */ R(
        "div",
        {
          ref: i,
          className: "fds-time-column__scroll",
          role: "listbox",
          "aria-label": D,
          tabIndex: 0,
          onKeyDown: C,
          onScroll: M,
          children: [
            /* @__PURE__ */ l("div", { className: "fds-time-column__spacer fds-time-column__spacer--top", "aria-hidden": "true" }),
            a.map((r, n) => {
              const c = n === t;
              return /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  role: "option",
                  "aria-selected": c,
                  "data-time-row-index": n,
                  className: N(
                    "fds-time-column__cell",
                    c ? "BodyMediumSemibold" : "BodyMediumRegular",
                    c && "fds-time-column__cell--on-band"
                  ),
                  onClick: () => o(n),
                  children: r
                }
              );
            }),
            /* @__PURE__ */ l("div", { className: "fds-time-column__spacer fds-time-column__spacer--bottom", "aria-hidden": "true" })
          ]
        }
      )
    ] });
  }
);
G.displayName = "TimeColumn";
export {
  G as TimeColumn
};
