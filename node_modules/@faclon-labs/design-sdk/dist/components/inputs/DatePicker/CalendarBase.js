import { jsxs as f, jsx as a } from "react/jsx-runtime";
import { cn as p } from "../../../utils/cn.js";
import { CalendarHeader as j } from "./CalendarHeader.js";
import { CalendarWeekdays as B } from "./CalendarWeekdays.js";
import { CalendarDayCell as L } from "./CalendarDayCell.js";
import { CalendarFooter as g } from "./CalendarFooter.js";
import { MonthYearCell as F } from "./MonthYearCell.js";
/* empty css                 */
function W({
  view: r = "date",
  headerLabel: b = "March 2026",
  onPrev: n,
  onNext: _,
  onHeaderClick: h,
  days: o = [],
  onDayClick: s,
  onDayHover: l,
  onDayHoverEnd: t,
  items: u = [],
  onItemClick: i,
  showFooter: N = !1,
  isApplyDisabled: $ = !1,
  onCancel: C,
  onApply: M,
  className: S,
  ...x
}) {
  return /* @__PURE__ */ f("div", { className: p("fds-calendar-base", S), ...x, children: [
    /* @__PURE__ */ f("div", { className: "fds-calendar-base__header", children: [
      /* @__PURE__ */ a(
        j,
        {
          label: b,
          onPrev: n,
          onNext: _,
          onLabelClick: h
        }
      ),
      r === "date" && /* @__PURE__ */ a(B, {})
    ] }),
    /* @__PURE__ */ f("div", { className: p("fds-calendar-base__body", r !== "date" && "fds-calendar-base__body--grid"), children: [
      r === "date" && /* @__PURE__ */ a("div", { onMouseLeave: () => t == null ? void 0 : t(), children: o.map((m, d) => /* @__PURE__ */ a("div", { id: `week-${d}`, className: "fds-calendar-base__week", children: m.map((e, c) => /* @__PURE__ */ a(
        L,
        {
          id: `${d}-${c}`,
          date: e.date,
          type: e.type,
          isSelected: e.isSelected,
          isCurrentDate: e.isCurrentDate,
          onClick: () => s == null ? void 0 : s(e),
          onMouseEnter: () => l == null ? void 0 : l(e)
        }
      )) })) }),
      r !== "date" && u.map((m, d) => /* @__PURE__ */ a("div", { id: `row-${d}`, className: "fds-calendar-base__item-row", children: m.map((e, c) => /* @__PURE__ */ a(
        F,
        {
          id: `${d}-${c}`,
          label: e.label,
          isSelected: e.isSelected,
          onClick: () => i == null ? void 0 : i(e)
        }
      )) }))
    ] }),
    N && /* @__PURE__ */ a(g, { onCancel: C, onApply: M, isApplyDisabled: $ })
  ] });
}
W.displayName = "CalendarBase";
export {
  W as CalendarBase
};
