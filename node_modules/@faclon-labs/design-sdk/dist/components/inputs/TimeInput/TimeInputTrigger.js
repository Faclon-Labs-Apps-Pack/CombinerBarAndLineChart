import { jsx as r } from "react/jsx-runtime";
import { forwardRef as x } from "react";
import { Clock as h } from "react-feather";
import { cn as I } from "../../../utils/cn.js";
import { TextInput as v } from "../TextInput/TextInput.js";
/* empty css                     */
const w = x(
  ({
    label: o,
    name: m,
    placeholder: t = "00 : 00 AM",
    displayValue: p = "",
    size: a = "Medium",
    isOpen: e = !1,
    isDisabled: s = !1,
    isRequired: f = !1,
    necessityIndicator: d,
    helpText: g,
    errorText: n,
    successText: l,
    validationState: i = "none",
    onClick: u,
    className: c
  }, T) => /* @__PURE__ */ r(
    "div",
    {
      className: I(
        "fds-time-trigger",
        `fds-time-trigger--size-${a.toLowerCase()}`,
        e && "fds-time-trigger--open",
        c
      ),
      onClick: u,
      children: /* @__PURE__ */ r(
        v,
        {
          ref: T,
          label: o,
          name: m,
          placeholder: t,
          value: p,
          readOnly: !0,
          icon: /* @__PURE__ */ r(h, { size: 16 }),
          helpText: i === "error" ? void 0 : g,
          errorText: n,
          successText: l,
          validationState: i,
          isDisabled: s,
          isRequired: f,
          necessityIndicator: d,
          "aria-haspopup": "dialog",
          "aria-expanded": e
        }
      )
    }
  )
);
w.displayName = "TimeInputTrigger";
export {
  w as TimeInputTrigger
};
