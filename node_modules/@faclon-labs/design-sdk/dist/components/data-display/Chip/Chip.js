import { jsxs as _, jsx as m } from "react/jsx-runtime";
import { forwardRef as N } from "react";
import { cn as p } from "../../../utils/cn.js";
import { useChipGroupContext as R } from "./ChipGroupContext.js";
/* empty css         */
const x = {
  XSmall: "fds-chip--size-xsmall",
  Small: "fds-chip--size-small",
  Medium: "fds-chip--size-medium",
  Large: "fds-chip--size-large"
}, C = {
  XSmall: "BodySmallRegular",
  Small: "BodyMediumRegular",
  Medium: "BodyLargeRegular",
  Large: "HeadingMediumRegular"
}, w = N(
  ({
    label: i,
    value: s,
    size: f = "Small",
    isSelected: h = !1,
    isDisabled: u = !1,
    icon: r,
    iconOnly: a = !1,
    className: b,
    type: S,
    onClick: d,
    ...t
  }, g) => {
    const e = R(), n = (e == null ? void 0 : e.size) ?? f, l = (e == null ? void 0 : e.isDisabled) || u, c = e && s != null ? e.selectedValues.has(s) : h, z = (o) => {
      d == null || d(o), !o.defaultPrevented && (l || e && s != null && e.onChipToggle(s));
    };
    process.env.NODE_ENV !== "production" && a && !i && console.warn(
      "[Chip] `iconOnly` is true but no `label` was provided — screen readers will announce an unlabeled button."
    );
    const L = a ? i : t["aria-label"];
    return /* @__PURE__ */ _(
      "button",
      {
        ...t,
        ref: g,
        type: S ?? "button",
        className: p(
          "fds-chip",
          x[n],
          a && "fds-chip--icon-only",
          c && "fds-chip--selected",
          l && "fds-chip--disabled",
          b
        ),
        "aria-pressed": c,
        "aria-disabled": l || void 0,
        "aria-label": L,
        disabled: l,
        "data-value": s,
        onClick: z,
        children: [
          r && /* @__PURE__ */ m("span", { className: "fds-chip__icon", "aria-hidden": "true", children: r }),
          !a && i && /* @__PURE__ */ m("span", { className: p("fds-chip__label", C[n]), children: i })
        ]
      }
    );
  }
);
w.displayName = "Chip";
export {
  w as Chip
};
