import { jsxs as m, Fragment as I, jsx as t } from "react/jsx-runtime";
import { useRef as S, useState as p, useMemo as C, useLayoutEffect as L, useEffect as k, useCallback as M } from "react";
import { createPortal as j } from "react-dom";
import { ChevronDown as z, Search as A } from "react-feather";
import { cn as O } from "../../../utils/cn.js";
import { useClickOutside as P } from "../../../hooks/useClickOutside.js";
import { useKeyboard as T } from "../../../hooks/useKeyboard.js";
import { useDismissOnScrollOutside as G } from "../../../hooks/useDismissOnScrollOutside.js";
import { DropdownMenu as H } from "../../overlays/DropdownMenu/DropdownMenu.js";
import { ActionListItem as U } from "../../overlays/DropdownMenu/ActionListItem.js";
import { ActionListItemGroup as F } from "../../overlays/DropdownMenu/ActionListItemGroup.js";
import { TextInput as $ } from "../TextInput/TextInput.js";
import { getCountryList as q, filterCountries as D, getCountryByIso as K } from "./countries.js";
/* empty css                    */
const b = 4, E = 360;
function Q({
  country: y,
  onCountryChange: g,
  allowedCountries: l,
  showDialCode: w = !0,
  size: R = "Medium",
  isDisabled: i = !1
}) {
  const s = S(null), a = S(null), [r, c] = p(!1), [u, h] = p(""), [d, v] = p(null), _ = C(() => {
    const e = q();
    if (!l || l.length === 0) return e;
    const o = new Set(l);
    return e.filter((f) => o.has(f.iso));
  }, [l]), N = C(
    () => D(_, u),
    [_, u]
  ), n = K(y);
  P(a, (e) => {
    var o;
    r && !((o = s.current) != null && o.contains(e.target)) && c(!1);
  }), T("Escape", () => c(!1), r), G(a, () => c(!1), r), L(() => {
    if (!r || !s.current) return;
    const e = s.current.getBoundingClientRect(), o = window.innerHeight - e.bottom, f = o < E && e.top > o;
    v({
      top: f ? e.top - b - E : e.bottom + b,
      left: e.left
    });
  }, [r]), k(() => {
    r || h("");
  }, [r]);
  const x = M(
    (e) => {
      var o;
      g(e), c(!1), (o = s.current) == null || o.focus();
    },
    [g]
  ), B = M(() => {
    i || c((e) => !e);
  }, [i]);
  return /* @__PURE__ */ m(I, { children: [
    /* @__PURE__ */ m(
      "button",
      {
        ref: s,
        type: "button",
        className: O(
          "fds-country-selector__trigger",
          R === "Large" && "fds-country-selector__trigger--size-large"
        ),
        onClick: B,
        disabled: i,
        "aria-haspopup": "listbox",
        "aria-expanded": r,
        "aria-label": n ? `Country: ${n.name}, dial code ${n.dialCode}` : "Select country",
        children: [
          /* @__PURE__ */ t("span", { className: "fds-country-selector__flag", "aria-hidden": "true", children: (n == null ? void 0 : n.flagEmoji) ?? "🌐" }),
          w && n && /* @__PURE__ */ t("span", { className: "fds-country-selector__dial-code BodyMediumRegular", children: n.dialCode }),
          /* @__PURE__ */ t(z, { size: 16, "aria-hidden": "true", className: "fds-country-selector__chevron" })
        ]
      }
    ),
    r && d && typeof document < "u" && j(
      /* @__PURE__ */ m(
        "div",
        {
          ref: a,
          className: "fds-country-selector__menu",
          style: { top: d.top, left: d.left },
          children: [
            /* @__PURE__ */ t("div", { className: "fds-country-selector__search", children: /* @__PURE__ */ t(
              $,
              {
                label: "Search country",
                size: "Medium",
                placeholder: "Search country or code",
                icon: /* @__PURE__ */ t(A, { size: 16 }),
                value: u,
                onChange: ({ value: e }) => h(e),
                autoFocus: !0,
                "aria-label": "Search country"
              }
            ) }),
            /* @__PURE__ */ t(H, { className: "fds-country-selector__dropdown", children: N.length === 0 ? /* @__PURE__ */ t("div", { className: "fds-country-selector__empty BodyMediumRegular", children: "No countries found" }) : /* @__PURE__ */ t(F, { children: N.map((e) => /* @__PURE__ */ t(
              U,
              {
                title: e.name,
                leadingIcon: /* @__PURE__ */ t("span", { className: "fds-country-selector__row-flag", "aria-hidden": "true", children: e.flagEmoji }),
                trailing: /* @__PURE__ */ t("span", { className: "fds-country-selector__row-dial-code BodyMediumRegular", children: e.dialCode }),
                selectionType: "Single",
                isSelected: e.iso === y,
                onClick: () => x(e.iso)
              },
              e.iso
            )) }) })
          ]
        }
      ),
      document.body
    )
  ] });
}
Q.displayName = "CountrySelector";
export {
  Q as CountrySelector
};
