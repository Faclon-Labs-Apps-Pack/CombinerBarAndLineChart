import { jsxs as y, jsx as d } from "react/jsx-runtime";
import { forwardRef as $, useCallback as x } from "react";
import { cn as I } from "../../../utils/cn.js";
import { useTabsContext as _ } from "./TabsContext.js";
/* empty css            */
const F = $(
  ({ value: e, label: m, leadingItem: l, trailing: n, isDisabled: i = !1, className: b, onClick: o, ...c }, a) => {
    const t = _(), f = x(
      (s) => {
        t.registerItem(e, s), typeof a == "function" ? a(s) : a && (a.current = s);
      },
      [t, e, a]
    ), r = t.selectedValue === e, p = t.selectedValue === void 0 && !i && t.firstFocusableValue === e, u = t.size === "Large" ? "BodyLargeSemibold" : "BodyMediumSemibold", h = I(
      "fds-tab-item",
      `fds-tab-item--variant-${t.variant.toLowerCase()}`,
      `fds-tab-item--orientation-${t.orientation.toLowerCase()}`,
      `fds-tab-item--size-${t.size.toLowerCase()}`,
      r && "fds-tab-item--selected",
      i && "fds-tab-item--disabled",
      t.orientation === "Horizontal" && (t.variant === "Filled" || t.isFullWidthTabItem) && "fds-tab-item--full-width",
      u,
      b
    );
    return /* @__PURE__ */ y(
      "button",
      {
        ref: f,
        type: "button",
        role: "tab",
        id: `${t.baseId}-tab-${e}`,
        "aria-controls": `${t.baseId}-panel-${e}`,
        "aria-selected": r,
        "aria-disabled": i || void 0,
        disabled: i,
        tabIndex: r || p ? 0 : -1,
        "data-value": e,
        className: h,
        onClick: (s) => {
          t.setSelectedValue(e), o == null || o(s);
        },
        ...c,
        children: [
          l && /* @__PURE__ */ d("span", { className: "fds-tab-item__leading", children: l }),
          /* @__PURE__ */ d("span", { className: "fds-tab-item__label", children: m }),
          n && /* @__PURE__ */ d("span", { className: "fds-tab-item__trailing", children: n })
        ]
      }
    );
  }
);
F.displayName = "TabItem";
export {
  F as TabItem
};
