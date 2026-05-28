import { jsxs as z, jsx as f } from "react/jsx-runtime";
import { forwardRef as ce, useEffect as G, useRef as w, useId as ue, useCallback as n, useImperativeHandle as le } from "react";
import { createPortal as J } from "react-dom";
import { TextInput as ie } from "../TextInput/TextInput.js";
import { MultiSelectField as pe } from "../SelectInput/MultiSelectField.js";
import { cn as L } from "../../../utils/cn.js";
import { useControllableState as Q } from "../../../hooks/useControllableState.js";
import { useDropdownPortal as de } from "../../../hooks/useDropdownPortal.js";
/* empty css                */
const me = ce(
  ({
    type: c = "single",
    label: D = "",
    name: R,
    placeholder: x = "Search",
    inputValue: E,
    defaultValue: O,
    onInputChange: T,
    helpText: V,
    errorText: k,
    validationState: p = "none",
    isDisabled: u = !1,
    isRequired: W,
    isOpen: X,
    onOpenChange: Y,
    icon: q,
    prefix: Z,
    children: F,
    onFocus: I,
    onBlur: d,
    className: M,
    tags: $,
    maxVisibleTags: B,
    onBackspace: ee,
    onSubmit: m,
    noResultsText: P = "No results found",
    showClearButton: re = !0,
    onClearButtonClicked: h,
    isLoading: te = !1,
    ...K
  }, ne) => {
    process.env.NODE_ENV !== "production" && G(() => {
      E !== void 0 && O !== void 0 && console.error(
        "[SearchInput] Pass either `inputValue` (controlled) or `defaultValue` (uncontrolled), not both."
      );
    }, []);
    const [oe, l] = Q({
      value: E,
      defaultValue: O ?? "",
      onChange: T
    }), v = oe ?? "", [se, j] = Q({
      value: X,
      defaultValue: !1,
      onChange: Y
    }), r = se ?? !1, C = w(r), y = w(!1), b = w(null), o = w(null), A = ue(), s = n(
      (e) => {
        e || (y.current = !0), j(e);
      },
      [j]
    ), { portalRef: g, pos: t } = de(b, r, () => s(!1)), H = () => {
      if (y.current) {
        y.current = !1;
        return;
      }
      u || s(!0), I == null || I();
    };
    G(() => {
      C.current && !r && requestAnimationFrame(() => {
        var e;
        (e = o.current) == null || e.focus();
      }), C.current = r;
    }, [r]), le(
      ne,
      () => ({
        focus: () => {
          var e;
          return (e = o.current) == null ? void 0 : e.focus();
        },
        blur: () => {
          var e;
          return (e = o.current) == null ? void 0 : e.blur();
        },
        clear: () => l("")
      }),
      [l]
    );
    const S = n(() => g.current ? Array.from(
      g.current.querySelectorAll(
        '[role="menuitem"]:not([aria-disabled="true"])'
      )
    ) : [], []), a = n(
      (e) => {
        const i = S();
        i.length !== 0 && (e === "first" ? i[0] : i[i.length - 1]).focus();
      },
      [S]
    ), N = n(
      (e) => {
        if (r) {
          a(e);
          return;
        }
        s(!0), requestAnimationFrame(() => a(e));
      },
      [r, s, a]
    ), U = n(
      (e) => {
        if (u) return;
        const _ = e.target.getAttribute("role") === "menuitem";
        switch (e.key) {
          case "Escape":
            r && (e.preventDefault(), e.stopPropagation(), s(!1));
            break;
          case "ArrowDown":
            _ || (e.preventDefault(), N("first"));
            break;
          case "ArrowUp":
            _ || (e.preventDefault(), N("last"));
            break;
          case "Home":
            r && (e.preventDefault(), a("first"));
            break;
          case "End":
            r && (e.preventDefault(), a("last"));
            break;
          case "Enter":
            c === "single" && !_ && m && (e.preventDefault(), m(v));
            break;
        }
      },
      [u, r, s, N, a, c, m, v]
    ), ae = n(
      (e) => {
        l(e.value);
      },
      [l]
    ), fe = n(() => {
      h == null || h(), requestAnimationFrame(() => {
        var e;
        return (e = o.current) == null ? void 0 : e.focus();
      });
    }, [h]);
    return c === "multiple" || c === "multiple-flex" ? /* @__PURE__ */ z("div", { ref: b, className: L("fds-search-input", M), onKeyDown: U, ...K, children: [
      /* @__PURE__ */ f(
        pe,
        {
          type: c,
          ref: o,
          label: D,
          name: R,
          placeholder: x,
          tags: $,
          maxVisibleTags: B,
          searchValue: v,
          onSearchChange: l,
          onBackspace: ee,
          onSubmit: m,
          helpText: p === "error" ? void 0 : V,
          errorText: k,
          validationState: p,
          isDisabled: u,
          isOpen: r,
          leadingIcon: q,
          onFocus: H,
          onBlur: d
        }
      ),
      r && t && typeof document < "u" && J(
        /* @__PURE__ */ f(
          "div",
          {
            ref: g,
            id: A,
            className: "fds-search-input__popover",
            style: { top: t.top, left: t.left, width: t.width },
            children: F || /* @__PURE__ */ f("div", { className: "fds-search-input__empty", children: P })
          }
        ),
        document.body
      )
    ] }) : /* @__PURE__ */ z("div", { ref: b, className: L("fds-search-input", M), onKeyDown: U, ...K, children: [
      /* @__PURE__ */ f(
        ie,
        {
          ref: o,
          label: D,
          name: R,
          placeholder: x,
          value: v,
          onChange: ae,
          onFocus: () => H(),
          onBlur: () => d == null ? void 0 : d(),
          helpText: p === "error" ? void 0 : V,
          errorText: k,
          validationState: p,
          isDisabled: u,
          isRequired: W,
          icon: q,
          prefix: Z,
          suffix: void 0,
          autoComplete: "off",
          showClearButton: re,
          onClearButtonClicked: fe,
          isLoading: te,
          role: "combobox",
          "aria-expanded": r,
          "aria-haspopup": "listbox",
          "aria-autocomplete": "list",
          "aria-controls": r ? A : void 0
        }
      ),
      r && t && typeof document < "u" && J(
        /* @__PURE__ */ f(
          "div",
          {
            ref: g,
            id: A,
            className: "fds-search-input__popover",
            style: { top: t.top, left: t.left, width: t.width },
            children: F || /* @__PURE__ */ f("div", { className: "fds-search-input__empty", children: P })
          }
        ),
        document.body
      )
    ] });
  }
);
me.displayName = "SearchInput";
export {
  me as SearchInput
};
