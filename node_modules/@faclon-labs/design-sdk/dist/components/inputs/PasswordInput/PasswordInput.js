import { jsx as a } from "react/jsx-runtime";
import { forwardRef as f, useState as u } from "react";
import { EyeOff as I, Eye as w } from "react-feather";
import { TextInput as v } from "../TextInput/TextInput.js";
import { IconButton as E } from "../../actions/IconButton/IconButton.js";
/* empty css                  */
const _ = {
  Medium: 16,
  Large: 20
}, N = {
  Medium: "16",
  Large: "20"
}, R = f(
  ({
    size: e = "Medium",
    showRevealButton: s = !0,
    isDisabled: o = !1,
    ...n
  }, i) => {
    const [r, p] = u(!1), t = r && !o, d = t ? I : w, m = t ? "Hide password" : "Show password", c = s && !o ? /* @__PURE__ */ a(
      E,
      {
        icon: /* @__PURE__ */ a(d, { size: _[e] }),
        size: N[e],
        "aria-label": m,
        "aria-pressed": r,
        onClick: () => p((l) => !l),
        className: "fds-password-input__reveal"
      }
    ) : void 0;
    return /* @__PURE__ */ a(
      v,
      {
        ref: i,
        size: e,
        isDisabled: o,
        type: t ? "text" : "password",
        trailingIcon: c,
        autoCapitalize: "none",
        ...n
      }
    );
  }
);
R.displayName = "PasswordInput";
export {
  R as PasswordInput
};
