import { jsxs as f, jsx as l } from "react/jsx-runtime";
import { cn as r } from "../../../utils/cn.js";
/* empty css                    */
function y({
  date: c,
  type: a = "default",
  isSelected: e = !1,
  isDisabled: d = !1,
  isCurrentDate: s = !1,
  className: t,
  ...n
}) {
  const o = a === "currentDate" || s;
  return /* @__PURE__ */ f(
    "button",
    {
      type: "button",
      className: r(
        "fds-day-cell",
        `fds-day-cell--${a}`,
        e && "fds-day-cell--selected",
        s && "fds-day-cell--today",
        d && "fds-day-cell--disabled",
        t
      ),
      tabIndex: -1,
      disabled: d || a === "outOfMonth",
      "aria-selected": e,
      ...n,
      children: [
        /* @__PURE__ */ l("span", { className: "fds-day-cell__inner", children: /* @__PURE__ */ l("span", { className: "fds-day-cell__text BodyMediumRegular", children: c }) }),
        o && /* @__PURE__ */ l("span", { className: "fds-day-cell__dot" })
      ]
    }
  );
}
y.displayName = "CalendarDayCell";
export {
  y as CalendarDayCell
};
