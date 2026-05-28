import { jsx as s, jsxs as y, Fragment as P } from "react/jsx-runtime";
import { forwardRef as B } from "react";
import { Spinner as C } from "../../feedback/Spinner/Spinner.js";
import { cn as v } from "../../../utils/cn.js";
/* empty css           */
const M = B(
  ({
    variant: d = "Primary",
    color: i = "Primary",
    size: r = "Medium",
    label: o,
    leadingIcon: n,
    trailingIcon: m,
    iconOnly: e = !1,
    isFullWidth: f = !1,
    isDisabled: l = !1,
    isLoading: a = !1,
    className: b,
    children: t,
    ...p
  }, _) => {
    const c = {
      Large: "BodyLargeSemibold",
      Medium: "BodyMediumSemibold",
      Small: "BodySmallSemibold",
      XSmall: "BodySmallSemibold"
    }, N = v(
      "fds-btn",
      `fds-btn--variant-${d.toLowerCase()}`,
      `fds-btn--color-${i.toLowerCase()}`,
      `fds-btn--size-${r.toLowerCase()}`,
      c[r],
      e && "fds-btn--icon-only",
      f && "fds-btn--full-width",
      a && "fds-btn--loading",
      b
    ), u = r === "Large" ? "Large" : "Medium", S = d === "Primary" ? "White" : {
      Primary: "Brand",
      Negative: "Negative",
      Positive: "Positive",
      Warning: "Warning",
      Info: "Information",
      Neutral: "Neutral"
    }[i];
    return /* @__PURE__ */ s(
      "button",
      {
        ref: _,
        className: N,
        type: "button",
        disabled: l || a,
        "aria-disabled": l || a || void 0,
        "aria-busy": a || void 0,
        ...p,
        children: a ? /* @__PURE__ */ s(C, { color: S, size: u }) : /* @__PURE__ */ y(P, { children: [
          n && /* @__PURE__ */ s("span", { className: "fds-btn__icon fds-btn__icon--leading", children: n }),
          !e && o && /* @__PURE__ */ s("span", { className: "fds-btn__label", children: o }),
          !e && !o && t && /* @__PURE__ */ s("span", { className: "fds-btn__label", children: t }),
          e && !n && !m && t && /* @__PURE__ */ s("span", { className: "fds-btn__icon", children: t }),
          m && /* @__PURE__ */ s("span", { className: "fds-btn__icon fds-btn__icon--trailing", children: m })
        ] })
      }
    );
  }
);
M.displayName = "Button";
export {
  M as Button
};
