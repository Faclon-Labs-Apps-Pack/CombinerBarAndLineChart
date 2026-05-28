import { jsxs as Q, jsx as s, Fragment as xe } from "react/jsx-runtime";
import { forwardRef as ye, useId as Ie, useState as D, useRef as be, useCallback as n } from "react";
import { Tag as he } from "../../data-display/Tag/Tag.js";
import { InputFieldHeader as Ne } from "../../forms/InputFieldHeader/InputFieldHeader.js";
import { InputFieldFooter as _e } from "../../forms/InputFieldFooter/InputFieldFooter.js";
import { cn as k } from "../../../utils/cn.js";
/* empty css             */
const qe = ye(
  ({
    label: u,
    size: f = "Medium",
    maxLines: F = 2,
    placeholder: U,
    value: $,
    defaultValue: B,
    validationState: L = "none",
    helpText: W,
    errorText: R,
    onChange: x,
    onFocus: y,
    onBlur: I,
    isDisabled: X = !1,
    isRequired: b = !1,
    necessityIndicator: Y,
    maxCharacters: d,
    isTagsMode: i = !1,
    tags: V,
    defaultTags: Z,
    onTagsChange: o,
    className: g,
    id: z,
    name: T,
    disabled: M,
    ...C
  }, ee) => {
    const te = Ie(), h = z ?? te, j = `${h}-help`, l = T ?? "", c = X || M || !1, A = U ?? (i ? "Enter Description" : "Enter value"), v = Y ?? (b ? "required" : void 0), [re, H] = D(!1), [de, oe] = D(B ?? ""), p = $ !== void 0, K = p ? $ : de, [ie, P] = D(Z ?? []), [a, w] = D(""), S = be(null), m = V !== void 0, t = m ? V : ie, le = (v === "required" || b) && re && (i ? t.length === 0 : !K), N = L === "error" || le, G = N ? L === "error" ? R ?? "Error" : R ?? `${u} is required` : W ?? "", ae = N ? "error" : "default", se = K.length, ne = d !== void 0 ? `${se}/${d}` : "", J = !!G || !i && d !== void 0, O = f === "Large" ? "BodyLargeRegular" : "BodyMediumRegular", ce = n((e) => {
      const r = e.target.value;
      d !== void 0 && r.length > d || (p || oe(r), x == null || x({ name: l, value: r }));
    }, [p, l, x, d]), ue = n((e) => {
      H(!0), I == null || I({ name: l, value: e.target.value });
    }, [l, I]), fe = n((e) => {
      y == null || y({ name: l, value: e.target.value });
    }, [l, y]), _ = n((e) => {
      const r = e.trim();
      if (!r || t.includes(r)) return;
      const q = [...t, r];
      m || P(q), o == null || o(q);
    }, [t, m, o]), E = n((e) => {
      const r = t.filter((q) => q !== e);
      m || P(r), o == null || o(r);
    }, [t, m, o]), ve = n((e) => {
      e.key === "Enter" && (e.preventDefault(), _(a), w("")), e.key === "Backspace" && a === "" && t.length > 0 && E(t[t.length - 1]);
    }, [a, _, E, t]), pe = n(() => {
      H(!0), a.trim() && (_(a), w(""));
    }, [a, _]), me = k(
      "fds-textarea",
      `fds-textarea--size-${f.toLowerCase()}`,
      F > 2 && `fds-textarea--lines-${F}`,
      c && "fds-textarea--disabled",
      N && "fds-textarea--error",
      i && "fds-textarea--tags",
      g
    );
    return /* @__PURE__ */ Q("div", { className: me, children: [
      /* @__PURE__ */ s(
        Ne,
        {
          label: v === "optional" ? `${u} (optional)` : u,
          necessityIndicator: v === "required" ? "required" : "none",
          size: f,
          htmlFor: h
        }
      ),
      /* @__PURE__ */ s("div", { className: "fds-textarea__field-wrapper", children: /* @__PURE__ */ s(
        "div",
        {
          className: "fds-textarea__field",
          onClick: i ? () => {
            var e;
            return (e = S.current) == null ? void 0 : e.focus();
          } : void 0,
          children: i ? (
            /* —— Tags mode: chips + inline input ——————————————————————— */
            /* @__PURE__ */ Q(xe, { children: [
              t.map((e) => /* @__PURE__ */ s(
                he,
                {
                  id: e,
                  label: e,
                  size: f,
                  isDisabled: c,
                  onDismiss: () => E(e)
                },
                e
              )),
              /* @__PURE__ */ s(
                "input",
                {
                  ref: S,
                  className: k("fds-textarea__tag-input", O),
                  id: h,
                  placeholder: t.length === 0 ? A : "",
                  value: a,
                  onChange: (e) => w(e.target.value),
                  onKeyDown: ve,
                  onBlur: pe,
                  disabled: c,
                  "aria-label": u,
                  "aria-disabled": c || void 0
                }
              )
            ] })
          ) : (
            /* —— Normal textarea mode —————————————————————————————————— */
            /* @__PURE__ */ s(
              "textarea",
              {
                ref: ee,
                className: k("fds-textarea__input", O),
                id: h,
                name: l || void 0,
                placeholder: A,
                value: p ? $ : void 0,
                defaultValue: p ? void 0 : B,
                disabled: c,
                required: v === "required" || b || void 0,
                maxLength: d,
                "aria-label": u,
                "aria-required": v === "required" || b || void 0,
                "aria-disabled": c || void 0,
                "aria-invalid": N || void 0,
                "aria-describedby": J ? j : void 0,
                onChange: ce,
                onBlur: ue,
                onFocus: fe,
                ...C
              }
            )
          )
        }
      ) }),
      J && /* @__PURE__ */ s(
        _e,
        {
          helpText: G || void 0,
          counterText: !i && d !== void 0 ? ne : void 0,
          state: ae,
          size: f,
          id: j
        }
      )
    ] });
  }
);
qe.displayName = "TextArea";
export {
  qe as TextArea
};
