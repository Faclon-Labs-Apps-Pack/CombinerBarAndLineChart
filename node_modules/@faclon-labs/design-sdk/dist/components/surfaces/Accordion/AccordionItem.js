import { jsx as o, jsxs as d } from "react/jsx-runtime";
import { useState as B, useCallback as p } from "react";
import { cn as L } from "../../../utils/cn.js";
import { useAccordionContext as k } from "./Accordion.js";
import { AccordionLeadingItem as A } from "./AccordionLeadingItem.js";
/* empty css                  */
function I() {
  return /* @__PURE__ */ o("svg", { viewBox: "0 0 9.33 5.33", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", children: /* @__PURE__ */ o(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M0.195 0.195C0.456-0.065 0.878-0.065 1.138 0.195L4.667 3.724L8.195 0.195C8.456-0.065 8.878-0.065 9.138 0.195C9.398 0.456 9.398 0.878 9.138 1.138L5.138 5.138C4.878 5.398 4.456 5.398 4.195 5.138L0.195 1.138C-0.065 0.878-0.065 0.456 0.195 0.195Z",
      fill: "currentColor"
    }
  ) });
}
function K({
  value: i,
  title: u,
  bodyText: s,
  children: a,
  leading: _ = "None",
  leadingIcon: h,
  leadingNumber: y,
  isExpanded: f,
  defaultExpanded: v = !1,
  onExpandedChange: n,
  isDisabled: t = !1,
  className: N
}) {
  const c = k(), [w, x] = B(v), l = f !== void 0, r = c && i ? c.expandedKeys.has(i) : l ? f : w, m = p(() => {
    if (!t)
      if (c && i)
        c.toggleKey(i);
      else {
        const e = !r;
        l || x(e), n == null || n(e);
      }
  }, [t, c, i, r, l, n]), C = p(
    (e) => {
      (e.key === "Enter" || e.key === " ") && (e.preventDefault(), m());
    },
    [m]
  ), g = L(
    "fds-accordion-item",
    r && "fds-accordion-item--expanded",
    t && "fds-accordion-item--disabled",
    N
  );
  return /* @__PURE__ */ o("div", { className: g, children: /* @__PURE__ */ d("div", { className: "fds-accordion-item__root", children: [
    /* @__PURE__ */ d(
      "button",
      {
        className: "fds-accordion-item__header",
        type: "button",
        onClick: m,
        onKeyDown: C,
        "aria-expanded": r,
        "aria-disabled": t || void 0,
        disabled: t,
        children: [
          /* @__PURE__ */ d("div", { className: "fds-accordion-item__title-area", children: [
            /* @__PURE__ */ o(
              A,
              {
                leading: _,
                icon: h,
                number: y
              }
            ),
            /* @__PURE__ */ o("span", { className: "fds-accordion-item__title BodyMediumMedium", children: u })
          ] }),
          /* @__PURE__ */ o("span", { className: "fds-accordion-item__chevron", children: /* @__PURE__ */ o(I, {}) })
        ]
      }
    ),
    (a || s) && /* @__PURE__ */ d("div", { className: "fds-accordion-item__body", role: "region", children: [
      s && !a && /* @__PURE__ */ o("p", { className: "fds-accordion-item__body-text BodyMediumRegular", children: s }),
      a
    ] })
  ] }) });
}
K.displayName = "AccordionItem";
export {
  K as AccordionItem
};
