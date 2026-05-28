import { jsx as n } from "react/jsx-runtime";
import { useCallback as m } from "react";
import { cn as d } from "../../../utils/cn.js";
import { DatePresetBase as f } from "./DatePresetBase.js";
/* empty css                      */
const y = [
  { label: "Custom", value: "custom" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Current Week", value: "current_week" },
  { label: "Previous 7 Days", value: "previous_7_days" },
  { label: "Current Month", value: "current_month" },
  { label: "Previous Month", value: "previous_month" },
  { label: "Previous 3 Month", value: "previous_3_month" },
  { label: "Previous 12 Month", value: "previous_12_month" },
  { label: "Current Year", value: "current_year" },
  { label: "Previous Year", value: "previous_year" }
];
function c({
  presets: i = y,
  selectedValue: o,
  onPresetSelect: t,
  className: s,
  ...v
}) {
  const b = m((e) => {
    const u = e.target;
    if (u.tagName !== "BUTTON") return;
    const r = Array.from(
      e.currentTarget.querySelectorAll("button")
    ), a = r.indexOf(u);
    if (a === -1) return;
    let l = -1;
    e.key === "ArrowDown" ? (e.preventDefault(), l = a < r.length - 1 ? a + 1 : 0) : e.key === "ArrowUp" && (e.preventDefault(), l = a > 0 ? a - 1 : r.length - 1), l >= 0 && r[l].focus();
  }, []);
  return /* @__PURE__ */ n(
    "div",
    {
      className: d("fds-date-preset-sidebar", s),
      role: "listbox",
      onKeyDown: b,
      ...v,
      children: i.map((e) => /* @__PURE__ */ n(
        f,
        {
          id: e.value,
          label: e.label,
          isSelected: o === e.value,
          onClick: () => t == null ? void 0 : t(e.value),
          role: "option",
          "aria-selected": o === e.value
        }
      ))
    }
  );
}
c.displayName = "DatePresetSidebar";
export {
  y as DEFAULT_PRESETS,
  c as DatePresetSidebar
};
