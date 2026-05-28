import { jsxs as a, jsx as e } from "react/jsx-runtime";
import { ChevronDown as s, ChevronLeft as c, ChevronRight as m } from "react-feather";
import { cn as h } from "../../../utils/cn.js";
import { Button as r } from "../../actions/Button/Button.js";
/* empty css                   */
function f({
  label: n,
  onPrev: l,
  onNext: i,
  onLabelClick: d,
  className: o,
  ...t
}) {
  return /* @__PURE__ */ a("div", { className: h("fds-calendar-header", o), ...t, children: [
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "fds-calendar-header__label",
        onClick: d,
        "aria-label": "Change view",
        children: [
          /* @__PURE__ */ e("span", { className: "fds-calendar-header__label-text BodyMediumMedium", children: n }),
          /* @__PURE__ */ e(s, { className: "fds-calendar-header__label-icon", size: 16, "aria-hidden": "true" })
        ]
      }
    ),
    /* @__PURE__ */ a("div", { className: "fds-calendar-header__nav", children: [
      /* @__PURE__ */ e(
        r,
        {
          variant: "Gray",
          size: "XSmall",
          iconOnly: !0,
          leadingIcon: /* @__PURE__ */ e(c, { size: 16 }),
          onClick: l,
          "aria-label": "Previous month"
        }
      ),
      /* @__PURE__ */ e(
        r,
        {
          variant: "Gray",
          size: "XSmall",
          iconOnly: !0,
          leadingIcon: /* @__PURE__ */ e(m, { size: 16 }),
          onClick: i,
          "aria-label": "Next month"
        }
      )
    ] })
  ] });
}
f.displayName = "CalendarHeader";
export {
  f as CalendarHeader
};
