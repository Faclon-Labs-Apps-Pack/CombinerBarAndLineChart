import { jsx as t, jsxs as s, Fragment as T } from "react/jsx-runtime";
import { forwardRef as Y, useId as Z, useRef as $, useCallback as v } from "react";
import { ChevronDown as q } from "react-feather";
import { cn as a } from "../../../utils/cn.js";
import { Tag as A } from "../../data-display/Tag/Tag.js";
import { InputFieldHeader as S } from "../../forms/InputFieldHeader/InputFieldHeader.js";
import { InputFieldFooter as O } from "../../forms/InputFieldFooter/InputFieldFooter.js";
const V = Y(
  ({
    type: B = "multiple",
    label: N,
    name: g,
    placeholder: M = "Select",
    tags: u = [],
    maxVisibleTags: b = 2,
    helpText: G,
    errorText: J,
    validationState: L = "none",
    isDisabled: l = !1,
    isOpen: i = !1,
    isReadOnly: R = !1,
    searchValue: r,
    onSearchChange: d,
    onBackspace: o,
    onSubmit: h,
    leadingIcon: f,
    leadingText: m,
    children: F,
    onClick: c,
    onFocus: z,
    onBlur: D,
    onChevronClick: n,
    className: Q
  }, U) => {
    const y = Z(), W = $(null), _ = U ?? W, x = B === "multiple-flex", p = u.length > 0, w = L === "error", K = w ? J : G, j = x ? u : u.slice(0, b), E = x ? 0 : u.length - b, X = v(
      (e) => {
        var I;
        l || ((I = _.current) == null || I.focus(), c == null || c(e));
      },
      [l, c, _]
    ), P = v(
      (e) => {
        d == null || d(e.target.value);
      },
      [d]
    ), H = v(
      (e) => {
        e.key === "Backspace" && !r && (o == null || o()), e.key === "Enter" && r && h && (e.preventDefault(), h(r));
      },
      [r, o, h]
    );
    return /* @__PURE__ */ t("div", { className: a("fds-select-input__multi", Q), children: /* @__PURE__ */ s(
      "div",
      {
        className: a(
          "fds-text-input",
          l && "fds-text-input--disabled",
          w && "fds-text-input--error",
          i && "fds-select-input--open"
        ),
        children: [
          /* @__PURE__ */ t(S, { label: N, htmlFor: y }),
          /* @__PURE__ */ s("div", { className: "fds-text-input__field-wrapper fds-select-input__multi-field-wrapper", children: [
            /* @__PURE__ */ t(
              "div",
              {
                className: a(
                  "fds-text-input__field fds-select-input__multi-trigger",
                  x && "fds-select-input__multi-trigger--flex"
                ),
                role: "combobox",
                "aria-expanded": i,
                "aria-haspopup": "listbox",
                "aria-disabled": l || void 0,
                onClick: X,
                children: x ? /* @__PURE__ */ s(T, { children: [
                  /* @__PURE__ */ s("span", { className: "fds-select-input__leading-col", children: [
                    p && /* @__PURE__ */ t("span", { className: "fds-select-input__tags fds-select-input__tags--flex", children: j.map((e) => /* @__PURE__ */ t(
                      A,
                      {
                        id: e.label,
                        label: e.label,
                        size: "Medium",
                        isDisabled: l,
                        onDismiss: e.onDismiss
                      }
                    )) }),
                    /* @__PURE__ */ s(
                      "span",
                      {
                        className: a(
                          "fds-select-input__input-row",
                          p && !i && "fds-select-input__input-row--hidden"
                        ),
                        children: [
                          f && /* @__PURE__ */ t("span", { className: "fds-text-input__icon", children: f }),
                          m && /* @__PURE__ */ t("span", { className: "fds-text-input__prefix BodyMediumRegular", children: m }),
                          /* @__PURE__ */ t(
                            "input",
                            {
                              ref: _,
                              id: y,
                              type: "text",
                              role: "searchbox",
                              className: "fds-select-input__multi-input BodyMediumRegular",
                              name: g,
                              placeholder: p ? "" : M,
                              value: r ?? "",
                              disabled: l,
                              readOnly: R,
                              "aria-label": N,
                              "aria-autocomplete": "list",
                              autoComplete: "off",
                              onChange: P,
                              onKeyDown: H,
                              onFocus: z,
                              onBlur: D
                            }
                          )
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ t("span", { className: "fds-select-input__trailing--flex", children: /* @__PURE__ */ t(
                    "span",
                    {
                      className: a(
                        "fds-select-input__multi-chevron",
                        i && "fds-select-input__multi-chevron--open"
                      ),
                      role: "button",
                      "aria-label": i ? "Close menu" : "Open menu",
                      onMouseDown: (e) => e.preventDefault(),
                      onClick: (e) => {
                        l || (e.stopPropagation(), n == null || n());
                      },
                      children: /* @__PURE__ */ t(q, { size: 16 })
                    }
                  ) })
                ] }) : /* @__PURE__ */ s(T, { children: [
                  /* @__PURE__ */ s("span", { className: "fds-text-input__leading", children: [
                    f && /* @__PURE__ */ t("span", { className: "fds-text-input__icon", children: f }),
                    m && /* @__PURE__ */ t("span", { className: "fds-text-input__prefix BodyMediumRegular", children: m }),
                    p && /* @__PURE__ */ s("span", { className: "fds-select-input__tags", children: [
                      j.map((e) => /* @__PURE__ */ t(
                        A,
                        {
                          id: e.label,
                          label: e.label,
                          size: "Medium",
                          isDisabled: l,
                          onDismiss: e.onDismiss
                        }
                      )),
                      E > 0 && /* @__PURE__ */ s("span", { className: "fds-select-input__overflow BodySmallRegular", children: [
                        "+",
                        E,
                        " more"
                      ] })
                    ] }),
                    /* @__PURE__ */ t(
                      "input",
                      {
                        ref: _,
                        id: y,
                        type: "text",
                        role: "searchbox",
                        className: "fds-select-input__multi-input BodyMediumRegular",
                        name: g,
                        placeholder: p ? "" : M,
                        value: r ?? "",
                        disabled: l,
                        readOnly: R,
                        "aria-label": N,
                        "aria-autocomplete": "list",
                        autoComplete: "off",
                        onChange: P,
                        onKeyDown: H,
                        onFocus: z,
                        onBlur: D
                      }
                    )
                  ] }),
                  /* @__PURE__ */ t("span", { className: "fds-text-input__trailing", children: /* @__PURE__ */ t(
                    "span",
                    {
                      className: a(
                        "fds-select-input__multi-chevron",
                        i && "fds-select-input__multi-chevron--open"
                      ),
                      role: "button",
                      "aria-label": i ? "Close menu" : "Open menu",
                      onMouseDown: (e) => e.preventDefault(),
                      onClick: (e) => {
                        l || (e.stopPropagation(), n == null || n());
                      },
                      children: /* @__PURE__ */ t(q, { size: 16 })
                    }
                  ) })
                ] })
              }
            ),
            i && F && /* @__PURE__ */ t("div", { className: "fds-select-input__popover", children: F })
          ] }),
          K && /* @__PURE__ */ t(
            O,
            {
              helpText: K,
              state: w ? "error" : "default"
            }
          )
        ]
      }
    ) });
  }
);
V.displayName = "MultiSelectField";
export {
  V as MultiSelectField
};
