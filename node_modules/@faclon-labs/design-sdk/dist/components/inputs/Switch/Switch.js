import { jsxs as _, jsx as s } from "react/jsx-runtime";
import { forwardRef as k, useId as N, useCallback as C } from "react";
import { cn as b } from "../../../utils/cn.js";
/* empty css           */
function x({ size: c }) {
  return /* @__PURE__ */ s(
    "svg",
    {
      width: c,
      height: c,
      viewBox: "0 0 12 12",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "true",
      className: "fds-switch__check-icon",
      children: /* @__PURE__ */ s(
        "path",
        {
          d: "M9.46967 2.46967C9.76256 2.17678 10.2373 2.17678 10.5302 2.46967C10.8231 2.76256 10.8231 3.23732 10.5302 3.53022L5.03022 9.03022C4.73732 9.32311 4.26256 9.32311 3.96967 9.03022L1.46967 6.53022C1.17678 6.23732 1.17678 5.76256 1.46967 5.46967C1.76256 5.17678 2.23732 5.17678 2.53022 5.46967L4.49994 7.4394L9.46967 2.46967Z",
          fill: "currentColor"
        }
      )
    }
  );
}
const I = { Small: 8, Medium: 10 }, L = k(
  ({
    size: c = "Medium",
    isChecked: i,
    defaultChecked: l,
    isDisabled: r = !1,
    onChange: t,
    name: h,
    value: e,
    accessibilityLabel: o,
    className: n,
    id: m,
    ...w
  }, f) => {
    const p = N(), a = m ?? p, u = C(
      (d) => {
        t == null || t({ isChecked: d.target.checked, event: d, value: e });
      },
      [e, t]
    );
    return /* @__PURE__ */ _(
      "label",
      {
        className: b(
          "fds-switch",
          `fds-switch--${c.toLowerCase()}`,
          r && "fds-switch--disabled",
          n
        ),
        htmlFor: a,
        children: [
          /* @__PURE__ */ s(
            "input",
            {
              ref: f,
              id: a,
              type: "checkbox",
              role: "switch",
              className: "fds-switch__input",
              name: h,
              value: e,
              checked: i,
              defaultChecked: l,
              disabled: r,
              "aria-label": o,
              "aria-checked": i,
              onChange: u,
              ...w
            }
          ),
          /* @__PURE__ */ s("span", { className: "fds-switch__wrapper", children: /* @__PURE__ */ s("span", { className: "fds-switch__track", children: /* @__PURE__ */ s("span", { className: "fds-switch__thumb", children: /* @__PURE__ */ s(x, { size: I[c] }) }) }) })
        ]
      }
    );
  }
);
L.displayName = "Switch";
export {
  L as Switch
};
