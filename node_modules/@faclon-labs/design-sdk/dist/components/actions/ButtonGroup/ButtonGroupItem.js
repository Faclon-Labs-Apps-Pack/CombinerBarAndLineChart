import { jsx as t } from "react/jsx-runtime";
import { forwardRef as f } from "react";
import { cn as s } from "../../../utils/cn.js";
import { Button as d } from "../Button/Button.js";
import { useButtonGroupContext as l } from "./ButtonGroupContext.js";
const _ = f(
  ({ position: e = "Only", className: n, ...i }, a) => {
    const o = l(), m = (o == null ? void 0 : o.size) ?? "Medium", r = (o == null ? void 0 : o.variant) ?? "Primary", p = (o == null ? void 0 : o.color) ?? "Primary", u = (o == null ? void 0 : o.isDisabled) ?? !1;
    return /* @__PURE__ */ t(
      "span",
      {
        className: s(
          "fds-btn-group__item",
          `fds-btn-group__item--${e.toLowerCase()}`,
          `fds-btn-group__item--variant-${r.toLowerCase()}`
        ),
        children: /* @__PURE__ */ t(
          d,
          {
            ref: a,
            variant: r,
            size: m,
            color: p,
            isDisabled: u,
            className: s("fds-btn-group__button", n),
            ...i
          }
        )
      }
    );
  }
);
_.displayName = "ButtonGroupItem";
export {
  _ as ButtonGroupItem
};
