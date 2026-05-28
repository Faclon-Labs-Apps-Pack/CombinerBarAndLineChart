import { jsx as n } from "react/jsx-runtime";
import { useState as K, useCallback as b, createContext as j, useContext as x } from "react";
const l = j(null);
function q() {
  return x(l);
}
function I({
  mode: o = "single",
  defaultExpandedKeys: f = [],
  expandedKeys: c,
  onExpandChange: t,
  children: S,
  className: w
}) {
  const i = c !== void 0, [m, A] = K(
    () => new Set(f)
  ), d = i ? new Set(c) : m, v = b(
    (r) => {
      const u = (s) => {
        if (o === "single")
          return s.has(r) ? /* @__PURE__ */ new Set() : /* @__PURE__ */ new Set([r]);
        const e = new Set(s);
        return e.has(r) ? e.delete(r) : e.add(r), e;
      };
      if (i) {
        const s = u(new Set(c));
        t == null || t([...s]);
      } else
        A((s) => {
          const e = u(s);
          return t == null || t([...e]), e;
        });
    },
    [o, i, c, t]
  );
  return /* @__PURE__ */ n(l.Provider, { value: { expandedKeys: d, toggleKey: v }, children: /* @__PURE__ */ n("div", { className: w, children: S }) });
}
I.displayName = "Accordion";
export {
  I as Accordion,
  q as useAccordionContext
};
