import { jsx as t } from "react/jsx-runtime";
import { cn as n } from "../../../utils/cn.js";
/* empty css                  */
function o({
  label: l,
  isSelected: e = !1,
  className: a,
  ...r
}) {
  return /* @__PURE__ */ t(
    "button",
    {
      type: "button",
      tabIndex: -1,
      className: n(
        "fds-month-year-cell",
        e && "fds-month-year-cell--selected",
        a
      ),
      "aria-selected": e,
      ...r,
      children: /* @__PURE__ */ t("span", { className: "fds-month-year-cell__text BodyMediumRegular", children: l })
    }
  );
}
o.displayName = "MonthYearCell";
export {
  o as MonthYearCell
};
