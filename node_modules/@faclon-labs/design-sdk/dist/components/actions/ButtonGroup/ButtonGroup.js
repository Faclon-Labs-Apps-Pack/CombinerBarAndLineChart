import { jsx as s } from "react/jsx-runtime";
import { forwardRef as C, useMemo as E, Children as I, cloneElement as P, isValidElement as b } from "react";
import { cn as h } from "../../../utils/cn.js";
import { ButtonGroupContext as v } from "./ButtonGroupContext.js";
import { ButtonGroupItem as w } from "./ButtonGroupItem.js";
function l(t) {
  return b(t) && t.type === w;
}
const M = C(
  ({
    size: t = "Medium",
    variant: m = "Primary",
    color: u = "Primary",
    isFullWidth: r = !1,
    isDisabled: i = !1,
    accessibilityLabel: a,
    className: c,
    children: d,
    ...y
  }, g) => {
    const x = E(
      () => ({ size: t, variant: m, color: u, isFullWidth: r, isDisabled: i }),
      [t, m, u, r, i]
    ), p = I.toArray(d), f = p.filter(l).length;
    let n = -1;
    const B = p.map((o) => {
      if (!l(o)) return o;
      n += 1;
      let e;
      f === 1 ? e = "Only" : n === 0 ? e = "Left" : n === f - 1 ? e = "Right" : e = "Center";
      const G = o.props.position ?? e;
      return P(o, { position: G });
    });
    return /* @__PURE__ */ s(
      "div",
      {
        ref: g,
        role: "group",
        "aria-label": a,
        className: h(
          "fds-btn-group",
          r && "fds-btn-group--full-width",
          c
        ),
        ...y,
        children: /* @__PURE__ */ s(v.Provider, { value: x, children: B })
      }
    );
  }
);
M.displayName = "ButtonGroup";
export {
  M as ButtonGroup
};
