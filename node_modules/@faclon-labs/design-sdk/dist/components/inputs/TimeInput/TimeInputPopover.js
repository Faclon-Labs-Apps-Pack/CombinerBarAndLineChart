import { jsx as e, jsxs as x } from "react/jsx-runtime";
import { cn as f } from "../../../utils/cn.js";
import { TimeColumn as o } from "./TimeColumn.js";
/* empty css                     */
const i = ["AM", "PM"];
function v({
  hourFormat: m,
  hourItems: t,
  minuteItems: s,
  hourIndex: n,
  minuteIndex: l,
  meridiem: r,
  onHourChange: d,
  onMinuteChange: c,
  onMeridiemChange: p,
  className: a,
  ...I
}) {
  const u = r === "AM" ? 0 : 1;
  return /* @__PURE__ */ e("div", { className: f("fds-time-popover", a), ...I, children: /* @__PURE__ */ x("div", { className: "fds-time-popover__columns", children: [
    /* @__PURE__ */ e(
      o,
      {
        label: "Hours",
        items: t,
        selectedIndex: n,
        onSelect: d
      }
    ),
    /* @__PURE__ */ e(
      o,
      {
        label: "Minutes",
        items: s,
        selectedIndex: l,
        onSelect: c
      }
    ),
    m === "12" && /* @__PURE__ */ e(
      o,
      {
        label: "Meridiem",
        items: i,
        selectedIndex: u,
        onSelect: (M) => p(i[M])
      }
    )
  ] }) });
}
v.displayName = "TimeInputPopover";
export {
  v as TimeInputPopover
};
