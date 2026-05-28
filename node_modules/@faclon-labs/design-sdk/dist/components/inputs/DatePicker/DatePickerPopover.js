import { jsxs as d, jsx as e } from "react/jsx-runtime";
import { cn as M } from "../../../utils/cn.js";
import { TextInput as i } from "../TextInput/TextInput.js";
import { formatDateInput as N, formatTimeInput as b } from "./datePickerUtils.js";
import { Divider as O } from "../../layout/Divider/Divider.js";
import { CalendarHeader as Q } from "./CalendarHeader.js";
import { CalendarWeekdays as R } from "./CalendarWeekdays.js";
import { CalendarDayCell as U } from "./CalendarDayCell.js";
import { CalendarFooter as X } from "./CalendarFooter.js";
import { MonthYearCell as Z } from "./MonthYearCell.js";
import { DatePresetSidebar as I } from "./DatePresetSidebar.js";
/* empty css                      */
function S({
  showPresets: k = !0,
  presets: h,
  selectedPreset: x,
  onPresetSelect: Y,
  startDate: L = "",
  startTime: P = "",
  endDate: $ = "",
  endTime: j = "",
  onStartDateChange: s,
  onStartTimeChange: t,
  onEndDateChange: c,
  onEndTimeChange: o,
  calendarLabel: w = "March 2026",
  onPrevMonth: F,
  onNextMonth: V,
  onCalendarLabelClick: W,
  view: a = "date",
  days: q = [],
  onDayClick: m,
  onDayHover: f,
  onDayHoverEnd: v,
  items: z = [],
  onItemClick: u,
  isApplyDisabled: A = !1,
  onCancel: B,
  onApply: G,
  className: J,
  ...K
}) {
  return /* @__PURE__ */ d("div", { className: M("fds-datepicker-popover", J), ...K, children: [
    k && /* @__PURE__ */ e(
      I,
      {
        presets: h,
        selectedValue: x,
        onPresetSelect: Y
      }
    ),
    /* @__PURE__ */ d("div", { className: "fds-datepicker-popover__panel", children: [
      /* @__PURE__ */ d("div", { className: "fds-datepicker-popover__inputs", children: [
        /* @__PURE__ */ d("div", { className: "fds-datepicker-popover__input-row", children: [
          /* @__PURE__ */ e(
            i,
            {
              label: "Start Date",
              placeholder: "DD/MM/YYYY",
              value: L,
              maxLength: 10,
              onChange: (r) => s == null ? void 0 : s(N(r.value))
            }
          ),
          /* @__PURE__ */ e(
            i,
            {
              label: "Start Time",
              placeholder: "HH:MM",
              value: P,
              maxLength: 5,
              onChange: (r) => t == null ? void 0 : t(b(r.value))
            }
          )
        ] }),
        /* @__PURE__ */ d("div", { className: "fds-datepicker-popover__input-row", children: [
          /* @__PURE__ */ e(
            i,
            {
              label: "End Date",
              placeholder: "DD/MM/YYYY",
              value: $,
              maxLength: 10,
              onChange: (r) => c == null ? void 0 : c(N(r.value))
            }
          ),
          /* @__PURE__ */ e(
            i,
            {
              label: "End Time",
              placeholder: "HH:MM",
              value: j,
              maxLength: 5,
              onChange: (r) => o == null ? void 0 : o(b(r.value))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e(O, { variant: "Muted" }),
      /* @__PURE__ */ d("div", { className: "fds-datepicker-popover__calendar", children: [
        /* @__PURE__ */ d("div", { className: "fds-datepicker-popover__calendar-header", children: [
          /* @__PURE__ */ e(
            Q,
            {
              label: w,
              onPrev: F,
              onNext: V,
              onLabelClick: W
            }
          ),
          a === "date" && /* @__PURE__ */ e(R, {})
        ] }),
        /* @__PURE__ */ d("div", { className: M("fds-datepicker-popover__calendar-body", a !== "date" && "fds-datepicker-popover__calendar-body--grid"), children: [
          a === "date" && /* @__PURE__ */ e("div", { onMouseLeave: () => v == null ? void 0 : v(), children: q.map((r, p) => /* @__PURE__ */ e("div", { id: `week-${p}`, className: "fds-datepicker-popover__week", children: r.map((l, _) => /* @__PURE__ */ e(
            U,
            {
              id: `${p}-${_}`,
              date: l.date,
              type: l.type,
              isSelected: l.isSelected,
              isCurrentDate: l.isCurrentDate,
              onClick: () => m == null ? void 0 : m(l),
              onMouseEnter: () => f == null ? void 0 : f(l)
            }
          )) })) }),
          a !== "date" && z.map((r, p) => /* @__PURE__ */ e("div", { id: `row-${p}`, className: "fds-datepicker-popover__item-row", children: r.map((l, _) => /* @__PURE__ */ e(
            Z,
            {
              id: `${p}-${_}`,
              label: l.label,
              isSelected: l.isSelected,
              onClick: () => u == null ? void 0 : u(l)
            }
          )) }))
        ] })
      ] }),
      /* @__PURE__ */ e(X, { onCancel: B, onApply: G, isApplyDisabled: A })
    ] })
  ] });
}
S.displayName = "DatePickerPopover";
export {
  S as DatePickerPopover
};
