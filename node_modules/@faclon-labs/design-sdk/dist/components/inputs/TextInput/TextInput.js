import { jsxs as N, jsx as e } from "react/jsx-runtime";
import { forwardRef as Ne, useId as he, useState as R, useCallback as h } from "react";
import { X as be } from "react-feather";
import { IconButton as ye } from "../../actions/IconButton/IconButton.js";
import { Spinner as we } from "../../feedback/Spinner/Spinner.js";
import { InputFieldHeader as Ie } from "../../forms/InputFieldHeader/InputFieldHeader.js";
import { InputFieldFooter as Ee } from "../../forms/InputFieldFooter/InputFieldFooter.js";
import { cn as b } from "../../../utils/cn.js";
/* empty css              */
const Te = {
  name: "name",
  email: "email",
  countryName: "country-name",
  postalCode: "postal-code",
  telephone: "tel",
  username: "username",
  none: "off",
  currentPassword: "current-password",
  newPassword: "new-password",
  oneTimeCode: "one-time-code"
}, Pe = {
  text: "text",
  search: "search",
  telephone: "tel",
  email: "email",
  url: "url",
  number: "number",
  password: "password"
}, qe = Ne(
  ({
    label: c,
    size: y = "Medium",
    labelPosition: X = "top",
    necessityIndicator: Y,
    name: G,
    type: J = "text",
    placeholder: K,
    value: w,
    defaultValue: V,
    validationState: I = "none",
    helpText: Q,
    errorText: A,
    successText: W,
    onChange: s,
    onFocus: u,
    onBlur: p,
    isDisabled: Z = !1,
    isRequired: m = !1,
    icon: E,
    leadingSlot: f,
    showClearButton: H = !1,
    onClearButtonClicked: v,
    prefix: T,
    suffix: P,
    trailingIcon: L,
    isLoading: d = !1,
    maxCharacters: r,
    autoFocus: B = !1,
    autoCompleteSuggestionType: O,
    keyboardReturnKeyType: g,
    className: k,
    id: C,
    disabled: ee,
    ...te
  }, se) => {
    const re = he(), q = C ?? re, j = `${q}-help`, t = G ?? "", _ = Z || ee || !1, ie = K ?? "Enter value", o = Y ?? (m ? "required" : void 0), [de, oe] = R(!1), [ae, D] = R(V ?? ""), i = w !== void 0, M = i ? w : ae, a = I === "error" || (o === "required" || m) && de && !M, F = I === "success" && !a, S = a ? I === "error" ? A ?? "Error" : A ?? `${c} is required` : F ? W ?? "" : Q ?? "", le = a ? "error" : F ? "success" : "default", U = !d && (!!S || r !== void 0), ne = M.length, ce = r !== void 0 ? `${ne}/${r}` : "", ue = h((n) => {
      const z = n.target.value;
      r !== void 0 && z.length > r || (i || D(z), s == null || s({ name: t, value: z }));
    }, [i, t, s, r]), pe = h((n) => {
      oe(!0), p == null || p({ name: t, value: n.target.value });
    }, [t, p]), me = h((n) => {
      u == null || u({ name: t, value: n.target.value });
    }, [t, u]), fe = h(() => {
      i || D(""), v == null || v(), s == null || s({ name: t, value: "" });
    }, [i, t, v, s]), x = y === "Large", $ = x ? "BodyLargeRegular" : "BodyMediumRegular", ve = x ? 20 : 16, _e = x ? "20" : "16", l = f != null && f !== !1;
    process.env.NODE_ENV !== "production" && l && (E || T) && console.warn(
      "[TextInput] `leadingSlot` is set — `icon` and `prefix` are ignored."
    );
    const xe = b(
      "fds-text-input",
      x && "fds-text-input--size-large",
      X === "left" && "fds-text-input--label-left",
      _ && "fds-text-input--disabled",
      d && "fds-text-input--loading",
      a && "fds-text-input--error",
      F && "fds-text-input--success",
      l && "fds-text-input--with-leading-slot",
      k
    );
    return /* @__PURE__ */ N("div", { className: xe, children: [
      /* @__PURE__ */ e(
        Ie,
        {
          label: o === "optional" ? `${c} (optional)` : c,
          necessityIndicator: o === "required" ? "required" : "none",
          size: y,
          htmlFor: q
        }
      ),
      /* @__PURE__ */ e("div", { className: "fds-text-input__field-wrapper", children: /* @__PURE__ */ N("div", { className: "fds-text-input__field", children: [
        l && /* @__PURE__ */ e("div", { className: "fds-text-input__leading-slot", children: f }),
        /* @__PURE__ */ N("div", { className: "fds-text-input__leading", children: [
          !l && E && /* @__PURE__ */ e("span", { className: "fds-text-input__icon", children: E }),
          !l && T && /* @__PURE__ */ e("span", { className: b("fds-text-input__prefix", $), children: T }),
          /* @__PURE__ */ e(
            "input",
            {
              ref: se,
              className: b("fds-text-input__input", $),
              type: Pe[J],
              id: q,
              name: t || void 0,
              placeholder: ie,
              value: i ? w : void 0,
              defaultValue: i ? void 0 : V,
              disabled: _,
              required: o === "required" || m || void 0,
              autoFocus: B || void 0,
              autoComplete: O ? Te[O] : void 0,
              enterKeyHint: g !== "default" ? g : void 0,
              maxLength: r,
              "aria-label": c,
              "aria-required": o === "required" || m || void 0,
              "aria-disabled": _ || void 0,
              "aria-invalid": a || void 0,
              "aria-describedby": U ? j : void 0,
              "aria-busy": d || void 0,
              onChange: ue,
              onBlur: pe,
              onFocus: me,
              ...te
            }
          )
        ] }),
        (P || H || d || L) && /* @__PURE__ */ N("span", { className: "fds-text-input__trailing", children: [
          P && /* @__PURE__ */ e("span", { className: b("fds-text-input__suffix", $), children: P }),
          H && M && !_ && !d && /* @__PURE__ */ e(
            ye,
            {
              icon: /* @__PURE__ */ e(be, { size: ve }),
              size: _e,
              onClick: fe,
              "aria-label": "Clear",
              className: "fds-text-input__clear"
            }
          ),
          d && /* @__PURE__ */ e(we, { color: "Brand", size: "Medium", accessibilityLabel: "Loading" }),
          L
        ] })
      ] }) }),
      U && /* @__PURE__ */ e(
        Ee,
        {
          helpText: S || void 0,
          counterText: r !== void 0 ? ce : void 0,
          state: le,
          size: y,
          id: j
        }
      )
    ] });
  }
);
qe.displayName = "TextInput";
export {
  qe as TextInput
};
