import { jsxs as f, jsx as e } from "react/jsx-runtime";
import { forwardRef as y, useState as z, useRef as A } from "react";
import { ChevronDown as k, PieChart as x, BarChart as E, Activity as O, TrendingUp as R, BarChart2 as D } from "react-feather";
import { cn as T } from "../../../utils/cn.js";
import { useControllableState as j } from "../../../hooks/useControllableState.js";
import { useClickOutside as B } from "../../../hooks/useClickOutside.js";
import { useKeyboard as H } from "../../../hooks/useKeyboard.js";
import { DropdownMenu as L } from "../../overlays/DropdownMenu/DropdownMenu.js";
import { ActionListItem as P } from "../../overlays/DropdownMenu/ActionListItem.js";
import { ActionListItemGroup as V } from "../../overlays/DropdownMenu/ActionListItemGroup.js";
import { Chart as G } from "../Chart/Chart.js";
/* empty css                  */
const K = {
  column: /* @__PURE__ */ e(D, { size: 16 }),
  line: /* @__PURE__ */ e(R, { size: 16 }),
  area: /* @__PURE__ */ e(O, { size: 16 }),
  bar: /* @__PURE__ */ e(E, { size: 16 }),
  pie: /* @__PURE__ */ e(x, { size: 16 })
}, l = (r, i) => r.id ?? String(i), M = (r) => r.icon !== void 0 ? r.icon : r.type ? K[r.type] : null, U = y(
  function({
    items: i,
    activeId: u,
    defaultActiveId: C,
    onActiveChange: S,
    titlePrefix: d,
    className: _,
    ...v
  }, w) {
    const h = i[0] ? l(i[0], 0) : "", [I, N] = j({
      value: u,
      defaultValue: C ?? h,
      onChange: S
    }), m = I ?? h, [n, o] = z(!1), p = A(null);
    B(p, () => {
      n && o(!1);
    }), H("Escape", () => o(!1), n);
    const a = i.find((t, s) => l(t, s) === m) ?? i[0];
    if (!a)
      return process.env.NODE_ENV !== "production" && console.warn("[ChartSwitcher] `items` is empty — nothing to render."), null;
    const b = (t) => {
      N(t), o(!1);
    }, g = /* @__PURE__ */ f("div", { ref: p, className: "fds-chart-switcher__title", children: [
      d && /* @__PURE__ */ e("span", { className: "fds-chart-switcher__prefix HeadingSmallSemibold", children: d }),
      /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: "fds-chart__title",
          onClick: () => o((t) => !t),
          "aria-haspopup": "menu",
          "aria-expanded": n,
          children: [
            /* @__PURE__ */ e("span", { className: "fds-chart__title-label HeadingSmallSemibold", children: a.label }),
            /* @__PURE__ */ e(k, { className: "fds-chart__title-icon", "aria-hidden": "true" })
          ]
        }
      ),
      n && /* @__PURE__ */ e("div", { className: "fds-chart-switcher__menu", children: /* @__PURE__ */ e(L, { children: /* @__PURE__ */ e(V, { children: i.map((t, s) => {
        const c = l(t, s);
        return /* @__PURE__ */ e(
          P,
          {
            title: t.label,
            leadingIcon: M(t),
            selectionType: "Single",
            isSelected: c === m,
            onClick: () => b(c)
          },
          c
        );
      }) }) }) })
    ] });
    return /* @__PURE__ */ e(G, { ref: w, ...v, className: T("fds-chart-switcher", _), title: g, children: a.children });
  }
);
U.displayName = "ChartSwitcher";
export {
  U as ChartSwitcher
};
