import { jsxs as a, jsx as r } from "react/jsx-runtime";
import { cn as c } from "../../../utils/cn.js";
import { Button as o } from "../../actions/Button/Button.js";
import { Divider as d } from "../../layout/Divider/Divider.js";
/* empty css                   */
function f({
  cancelLabel: i = "Cancel",
  applyLabel: e = "Apply",
  isApplyDisabled: l = !1,
  onCancel: n,
  onApply: t,
  className: m,
  ...s
}) {
  return /* @__PURE__ */ a("div", { className: c("fds-calendar-footer", m), ...s, children: [
    /* @__PURE__ */ r(d, { variant: "Muted" }),
    /* @__PURE__ */ a("div", { className: "fds-calendar-footer__actions", children: [
      /* @__PURE__ */ r(
        o,
        {
          variant: "Secondary",
          color: "Primary",
          size: "Small",
          label: i,
          onClick: n
        }
      ),
      /* @__PURE__ */ r(
        o,
        {
          variant: "Primary",
          color: "Primary",
          size: "Small",
          label: e,
          isDisabled: l,
          onClick: t
        }
      )
    ] })
  ] });
}
f.displayName = "CalendarFooter";
export {
  f as CalendarFooter
};
