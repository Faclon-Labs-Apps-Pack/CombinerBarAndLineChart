import { jsxs as s, jsx as e } from "react/jsx-runtime";
/* empty css          */
import { TableContext as p } from "./TableContext.js";
import { useTableEngine as g } from "./hooks/useTableEngine.js";
import { Spinner as k } from "../../feedback/Spinner/Spinner.js";
function S(r) {
  const {
    toolbar: t,
    footer: a,
    children: d,
    maxHeight: i,
    showBorderedCells: c = !1,
    rowDensity: f = "compact",
    selectionType: n = "none",
    isHeaderSticky: m = !0,
    isFirstColumnSticky: u = !1,
    hasStickyActionColumn: h = !1,
    isLoading: l = !1,
    isRefreshing: o = !1
  } = r, { ctx: b, processedRows: v, scrollContainerRef: y } = g(r);
  return /* @__PURE__ */ s(p.Provider, { value: b, children: [
    /* @__PURE__ */ s(
      "div",
      {
        className: "fds-table-surface",
        "data-density": f,
        "data-bordered": c ? "true" : "false",
        "data-header-sticky": m ? "true" : "false",
        "data-first-col-sticky": u ? "true" : "false",
        "data-action-col-sticky": h ? "true" : "false",
        "data-selection": n,
        "data-has-footer": a ? "true" : "false",
        "data-loading": l ? "true" : void 0,
        "data-refreshing": o ? "true" : void 0,
        style: i !== void 0 ? { maxHeight: i } : void 0,
        children: [
          t && /* @__PURE__ */ e("div", { className: "fds-table-surface__toolbar", children: t }),
          /* @__PURE__ */ s("div", { ref: y, className: "fds-table-surface__scroll", children: [
            /* @__PURE__ */ e("table", { className: "fds-table", children: d(l ? [] : v) }),
            o && /* @__PURE__ */ e(
              "div",
              {
                className: "fds-table-surface__refresh-overlay",
                role: "status",
                "aria-live": "polite",
                "aria-label": "Refreshing data",
                children: /* @__PURE__ */ e(k, { size: "Medium" })
              }
            )
          ] })
        ]
      }
    ),
    a && /* @__PURE__ */ e("div", { className: "fds-table-footer-bar", children: a })
  ] });
}
export {
  S as Table
};
