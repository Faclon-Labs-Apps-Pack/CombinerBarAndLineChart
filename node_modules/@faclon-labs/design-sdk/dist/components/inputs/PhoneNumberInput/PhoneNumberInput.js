import { jsx as h } from "react/jsx-runtime";
import { forwardRef as z, useRef as k, useCallback as i, useMemo as g } from "react";
import { parsePhoneNumberFromString as F, getCountryCallingCode as c, AsYouType as D, getExampleNumber as B } from "libphonenumber-js";
import C from "libphonenumber-js/examples.mobile.json";
import { TextInput as ee } from "../TextInput/TextInput.js";
import { useControllableState as A } from "../../../hooks/useControllableState.js";
import { cn as re } from "../../../utils/cn.js";
import { CountrySelector as te } from "./CountrySelector.js";
/* empty css                     */
function oe(r, e) {
  return r ? new D(e).input(r) : "";
}
function E(r) {
  return (r ?? "").replace(/\D/g, "");
}
function ue(r, e) {
  if (!r) return "";
  const l = F(r, e);
  return l ? l.number : `+${c(e)}${r}`;
}
function se(r) {
  try {
    const e = B(r, C);
    return (e == null ? void 0 : e.formatNational()) ?? "";
  } catch {
    return "";
  }
}
const le = z(
  ({
    label: r,
    name: e,
    value: l,
    defaultValue: M,
    country: Y,
    defaultCountry: N = "IN",
    onChange: u,
    onCountryChange: p,
    onFocus: j,
    onBlur: q,
    showCountrySelector: b = !0,
    showDialCode: v = !0,
    allowedCountries: x,
    size: y = "Medium",
    placeholder: V,
    isDisabled: P = !1,
    isRequired: G = !1,
    validationState: H = "none",
    errorText: J,
    helpText: K,
    successText: L,
    showClearButton: O = !1,
    onClearButtonClicked: m,
    ...$
  }, Q) => {
    const [o = N, I] = A({
      value: Y,
      defaultValue: N,
      onChange: (t) => {
        const s = `+${c(t)}`;
        p == null || p({ country: t, dialCode: s });
      }
    }), [T = "", f] = A({
      value: l,
      defaultValue: M ?? ""
    }), d = k(E(T)), a = i(
      (t, s) => {
        const R = oe(t, s);
        d.current = t, f(R);
        const S = ue(t, s), n = F(S);
        u == null || u({
          name: e ?? "",
          value: S,
          phoneNumber: R,
          dialCode: `+${c(s)}`,
          country: s,
          isValid: (n == null ? void 0 : n.isValid()) ?? !1
        });
      },
      [e, u, f]
    ), U = i(
      ({ value: t }) => {
        const s = E(t);
        a(s, o);
      },
      [o, a]
    ), W = i(
      (t) => {
        I(t), a(d.current, t);
      },
      [I, a]
    ), X = i(() => {
      d.current = "", f(""), m == null || m(), u == null || u({
        name: e ?? "",
        value: "",
        phoneNumber: "",
        dialCode: `+${c(o)}`,
        country: o,
        isValid: !1
      });
    }, [o, e, u, m, f]), Z = g(
      () => V ?? se(o),
      [V, o]
    ), _ = b ? /* @__PURE__ */ h(
      te,
      {
        country: o,
        onCountryChange: W,
        allowedCountries: x,
        showDialCode: v,
        size: y,
        isDisabled: P
      }
    ) : void 0, w = !b && v ? `+${c(o)}` : void 0;
    return /* @__PURE__ */ h(
      ee,
      {
        ...$,
        ref: Q,
        label: r,
        name: e,
        type: "telephone",
        size: y,
        placeholder: Z,
        value: T,
        onChange: U,
        onFocus: j,
        onBlur: q,
        validationState: H,
        errorText: J,
        helpText: K,
        successText: L,
        isDisabled: P,
        isRequired: G,
        showClearButton: O,
        onClearButtonClicked: X,
        leadingSlot: _,
        prefix: w,
        className: re("fds-phone-number-input", $.className)
      }
    );
  }
);
le.displayName = "PhoneNumberInput";
export {
  le as PhoneNumberInput
};
