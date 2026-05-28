import { jsxs as F, jsx as o } from "react/jsx-runtime";
import { useRef as _e, useEffect as De, useCallback as we } from "react";
import { createPortal as K } from "react-dom";
import { cn as B } from "../../../utils/cn.js";
import { useKeyboard as Te } from "../../../hooks/useKeyboard.js";
import { useDropdownPortal as U } from "../../../hooks/useDropdownPortal.js";
import { DatePickerTrigger as be } from "./DatePickerTrigger.js";
import { DatePickerPopover as Ee } from "./DatePickerPopover.js";
import { CalendarBase as Re } from "./CalendarBase.js";
import { DEFAULT_PRESETS as Se } from "./DatePresetSidebar.js";
import { DropdownMenu as Ae } from "../../overlays/DropdownMenu/DropdownMenu.js";
import { ActionListItem as Ie } from "../../overlays/DropdownMenu/ActionListItem.js";
import { ActionListItemGroup as xe } from "../../overlays/DropdownMenu/ActionListItemGroup.js";
import { useDatePickerState as Ne } from "./useDatePickerState.js";
import { formatDate as P } from "./datePickerUtils.js";
/* empty css               */
const Me = {
  custom: "Custom",
  today: "Today",
  yesterday: "Yesterday",
  current_week: "Current Week",
  previous_7_days: "Past 7 days",
  current_month: "Current Month",
  previous_month: "Previous Month",
  previous_3_month: "Previous 3 Month",
  previous_12_month: "Previous 12 Month",
  current_year: "Current Year",
  previous_year: "Previous Year"
};
function Le({
  mode: r = "single",
  isOpen: Y,
  onOpenChange: j,
  value: f,
  onChange: V,
  rangeValue: $,
  onRangeChange: G,
  showPresets: W = !0,
  showPresetChip: m = !0,
  presets: _,
  selectedPreset: z,
  onPresetSelect: J,
  label: Q,
  placeholder: X,
  helpText: Z,
  errorText: ee,
  validationState: te,
  isDisabled: l,
  showPeriodicity: D = !1,
  periodicitySlot: h,
  className: re,
  ...ne
}) {
  const oe = Ne({
    mode: r,
    controlledOpen: Y,
    onOpenChange: j,
    value: f,
    onChange: V,
    rangeValue: $,
    onRangeChange: G,
    controlledPreset: z,
    controlledPresetSelect: J,
    isDisabled: l
  }), {
    open: t,
    setOpen: c,
    presetOpen: a,
    setPresetOpen: s,
    preset: g,
    view: p,
    containerRef: n,
    closedByKeyboard: d,
    days: w,
    monthItems: T,
    yearItems: b,
    headerLabel: E,
    singleInputText: ae,
    startRawText: se,
    endRawText: ie,
    startTimeRaw: le,
    endTimeRaw: ce,
    isApplyDisabled: R,
    resolvedRange: v,
    closeAndRevert: u,
    handlePrev: S,
    handleNext: A,
    handleHeaderClick: I,
    handleItemClick: x,
    handleDayClick: N,
    handleDayHover: de,
    handleDayHoverEnd: ue,
    handlePresetSelect: M,
    handleApply: L,
    handleCancel: O,
    handleSingleInputChange: pe,
    handleStartDateChange: fe,
    handleEndDateChange: me,
    handleStartTimeChange: he,
    handleEndTimeChange: ge
  } = oe, { portalRef: H, pos: y } = U(n, t, u), { portalRef: ve, pos: k } = U(n, a, () => s(!1));
  Te("Escape", u);
  const C = _e(t);
  De(() => {
    !C.current && t && requestAnimationFrame(() => {
      var i;
      const e = (i = H.current) == null ? void 0 : i.querySelector(
        'input:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      e == null || e.focus();
    }), C.current && !t && d.current && (d.current = !1, requestAnimationFrame(() => {
      var i;
      const e = (i = n.current) == null ? void 0 : i.querySelector(
        "button.fds-date-trigger__field, input.fds-date-trigger__input"
      );
      e == null || e.focus();
    })), C.current = t;
  }, [t, n, d]);
  const ye = we(
    (e) => {
      if (l) return;
      const i = e.target;
      if (!(i.closest(".fds-date-trigger__field") !== null)) {
        e.key === "Escape" && (t || a) && (e.preventDefault(), e.stopPropagation(), d.current = !0, u());
        return;
      }
      const q = i.tagName === "INPUT";
      switch (e.key) {
        case "Enter":
        case " ":
          !q && r === "range" && (e.preventDefault(), s(!1), c(!t));
          break;
        case "Escape":
          (t || a) && (e.preventDefault(), e.stopPropagation(), d.current = !0, u());
          break;
        case "ArrowDown":
        case "ArrowUp":
          q || (e.preventDefault(), t || (s(!1), c(!0)));
          break;
      }
    },
    [l, t, a, r, c, s, u, d]
  ), ke = r === "single" && f ? P(f) : void 0, Ce = r === "range" && v ? `${P(v.start)} - ${P(v.end)}` : void 0, Pe = Me[g] ?? "Custom";
  return /* @__PURE__ */ F("div", { ref: n, className: B("fds-datepicker", re), onKeyDown: ye, ...ne, children: [
    /* @__PURE__ */ F("div", { className: B("fds-datepicker__trigger-row", D && !!h && "fds-datepicker__trigger-row--with-periodicity"), children: [
      /* @__PURE__ */ o(
        be,
        {
          selectionType: r,
          label: Q,
          placeholder: X,
          date: ke,
          presetValue: Pe,
          range: Ce,
          showPreset: m,
          isOpen: t,
          isDisabled: l,
          helpText: Z,
          errorText: ee,
          validationState: te,
          onClick: () => {
            l || (!t && n.current && n.current.dispatchEvent(new MouseEvent("mousedown", { bubbles: !0, cancelable: !0 })), s(!1), c(!t));
          },
          onPresetClick: () => {
            l || (!a && n.current && n.current.dispatchEvent(new MouseEvent("mousedown", { bubbles: !0, cancelable: !0 })), c(!1), s(!a));
          },
          inputValue: r === "single" ? ae : void 0,
          onInputChange: r === "single" ? pe : void 0,
          onInputFocus: () => {
            !l && !t && c(!0);
          }
        }
      ),
      D && h && /* @__PURE__ */ o("div", { className: "fds-datepicker__periodicity", onMouseDown: () => {
        t && c(!1), a && s(!1);
      }, children: h })
    ] }),
    m && a && k && typeof document < "u" && K(
      /* @__PURE__ */ o(
        "div",
        {
          ref: ve,
          className: "fds-datepicker__preset-dropdown",
          style: { top: k.top, left: k.left },
          children: /* @__PURE__ */ o(Ae, { children: /* @__PURE__ */ o(xe, { children: (_ ?? Se).filter((e) => e.value !== "custom").map((e) => /* @__PURE__ */ o(
            Ie,
            {
              title: e.label,
              selectionType: "Single",
              isSelected: g === e.value,
              onClick: () => {
                M(e.value), s(!1);
              }
            },
            e.value
          )) }) })
        }
      ),
      document.body
    ),
    t && y && typeof document < "u" && K(
      /* @__PURE__ */ o(
        "div",
        {
          ref: H,
          className: "fds-datepicker__popover",
          style: { top: y.top, left: y.left },
          children: r === "single" ? /* @__PURE__ */ o(
            Re,
            {
              view: p,
              headerLabel: E,
              days: w,
              items: p === "month" ? T : b,
              onDayClick: N,
              onItemClick: x,
              onHeaderClick: I,
              onPrev: S,
              onNext: A,
              showFooter: !0,
              isApplyDisabled: R,
              onCancel: O,
              onApply: L
            }
          ) : /* @__PURE__ */ o(
            Ee,
            {
              showPresets: W && m,
              presets: _,
              selectedPreset: g,
              onPresetSelect: M,
              startDate: se,
              endDate: ie,
              startTime: le,
              endTime: ce,
              onStartDateChange: fe,
              onEndDateChange: me,
              onStartTimeChange: he,
              onEndTimeChange: ge,
              calendarLabel: E,
              view: p,
              days: w,
              items: p === "month" ? T : b,
              onDayClick: N,
              onDayHover: de,
              onDayHoverEnd: ue,
              onItemClick: x,
              onCalendarLabelClick: I,
              onPrevMonth: S,
              onNextMonth: A,
              isApplyDisabled: R,
              onCancel: O,
              onApply: L
            }
          )
        }
      ),
      document.body
    )
  ] });
}
Le.displayName = "DatePicker";
export {
  Le as DatePicker
};
