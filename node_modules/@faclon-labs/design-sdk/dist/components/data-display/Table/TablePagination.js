import { jsxs as d, jsx as e, Fragment as L } from "react/jsx-runtime";
/* empty css                    */
import { useRef as _, useState as b, useLayoutEffect as T } from "react";
import { createPortal as D } from "react-dom";
import { ChevronDown as G } from "react-feather";
import { cn as U } from "../../../utils/cn.js";
import { useClickOutside as k } from "../../../hooks/useClickOutside.js";
import { useDismissOnScrollOutside as H } from "../../../hooks/useDismissOnScrollOutside.js";
import { Pagination as W } from "../../navigation/Pagination/Pagination.js";
import { DropdownMenu as j } from "../../overlays/DropdownMenu/DropdownMenu.js";
import { ActionListItem as F } from "../../overlays/DropdownMenu/ActionListItem.js";
import { ActionListItemGroup as $ } from "../../overlays/DropdownMenu/ActionListItemGroup.js";
import { useTableContextOptional as X } from "./TableContext.js";
const Z = [10, 25, 50, 100], y = 4, M = 200;
function rt({
  pageSizeOptions: R = Z,
  totalItemCount: P,
  showRowsPerPage: S = !0,
  showLabel: w = !0,
  variant: N = "simple",
  label: p,
  resetPageOnSizeChange: x = !0,
  onPageChange: u,
  onPageSizeChange: f,
  className: E
} = {}) {
  const n = X(), a = _(null), g = _(null), [o, l] = b(!1), [c, O] = b(null);
  if (k(g, (t) => {
    var i;
    o && !((i = a.current) != null && i.contains(t.target)) && l(!1);
  }), T(() => {
    if (!o || !a.current) return;
    const t = a.current.getBoundingClientRect(), i = t.bottom + M > window.innerHeight;
    O({
      top: i ? t.top - y - M : t.bottom + y,
      left: t.left,
      minWidth: t.width
    });
  }, [o]), H(g, () => l(!1), o), !n) return null;
  const s = P ?? n.totalItems, { page: m, size: r } = n.pageState, z = s === 0 ? 0 : m * r + 1, h = Math.min((m + 1) * r, s), A = Math.max(1, Math.ceil(s / r)), B = typeof p == "function" ? p({ start: z, end: h, total: s }) : p ?? `Showing ${h} of ${s} Items`, I = (t) => {
    n.setPageSize(t), x && m !== 0 && n.setPage(0), f == null || f({ pageSize: t }), l(!1);
  }, v = (t) => {
    const i = t - 1;
    n.setPage(i), u == null || u({ page: i });
  };
  return /* @__PURE__ */ d("div", { className: U("fds-table__pagination", E), children: [
    w && /* @__PURE__ */ e("span", { className: "fds-table__pagination-label BodyMediumRegular", children: B }),
    /* @__PURE__ */ d("div", { className: "fds-table__pagination-controls", children: [
      S && /* @__PURE__ */ d(L, { children: [
        /* @__PURE__ */ d(
          "button",
          {
            ref: a,
            type: "button",
            className: "fds-table__pagination-size-trigger BodyMediumRegular",
            onClick: () => l((t) => !t),
            "aria-haspopup": "menu",
            "aria-expanded": o,
            "aria-label": "Rows per page",
            children: [
              /* @__PURE__ */ e("span", { children: r }),
              /* @__PURE__ */ e(G, { size: 12, "aria-hidden": "true" })
            ]
          }
        ),
        /* @__PURE__ */ e("span", { className: "fds-table__pagination-size-label BodyMediumRegular", children: "rows / page" })
      ] }),
      /* @__PURE__ */ e(
        W,
        {
          variant: N === "numbered" ? "default" : "simple",
          currentPage: m + 1,
          totalPages: A,
          onPageChange: v
        }
      )
    ] }),
    o && c && typeof document < "u" && D(
      /* @__PURE__ */ e(
        "div",
        {
          ref: g,
          className: "fds-table__pagination-size-menu BodyMediumRegular",
          role: "presentation",
          style: {
            top: c.top,
            left: c.left,
            minWidth: c.minWidth
          },
          children: /* @__PURE__ */ e(j, { children: /* @__PURE__ */ e($, { children: R.map((t) => /* @__PURE__ */ e(
            F,
            {
              title: String(t),
              selectionType: "Single",
              isSelected: t === r,
              onClick: () => I(t)
            },
            t
          )) }) })
        }
      ),
      document.body
    )
  ] });
}
export {
  rt as TablePagination
};
