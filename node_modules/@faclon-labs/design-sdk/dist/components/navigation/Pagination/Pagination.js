import { jsxs as c, jsx as n } from "react/jsx-runtime";
import { useState as f, useMemo as F, useEffect as K } from "react";
import { ChevronLeft as q, ChevronRight as A } from "react-feather";
import { cn as H } from "../../../utils/cn.js";
import { Button as N } from "../../actions/Button/Button.js";
import { PageNumber as Q } from "./PageNumber.js";
import { PaginationEllipsis as T } from "./PaginationEllipsis.js";
/* empty css               */
function U(i, s, p) {
  if (s <= 0) return [];
  if (s === 1) return [{ type: "page", page: 1 }];
  const t = [{ type: "page", page: 1 }], l = Math.max(2, i - p);
  l > 2 && t.push({ type: "ellipsis", direction: "previous" });
  for (let r = l; r <= Math.min(s - 1, i + p); r++)
    t.push({ type: "page", page: r });
  return Math.min(s - 1, i + p) < s - 1 && t.push({ type: "ellipsis", direction: "next" }), s > 1 && t.push({ type: "page", page: s }), t;
}
function W({
  totalPages: i,
  currentPage: s,
  defaultPage: p = 1,
  onPageChange: t,
  variant: l = "default",
  siblingCount: d = 2,
  isDisabled: r = !1,
  showPageSizePicker: M = !1,
  pageSize: g,
  defaultPageSize: S = 10,
  pageSizeOptions: j = [10, 25, 50],
  pageSizeLabel: x = "items / page",
  onPageSizeChange: m,
  showLabel: b = !1,
  label: B,
  className: k,
  ...z
}) {
  const h = s !== void 0, [I, R] = f(p), E = h ? s : I, y = g !== void 0, [G, L] = f(S), $ = y ? g : G, o = (e) => {
    h || R(e), t == null || t(e);
  }, w = (e) => {
    y || L(e), m == null || m(e);
  }, a = Math.max(1, Math.min(E, Math.max(1, i))), C = a <= 1, J = a >= i || i <= 0, O = F(
    () => l === "default" ? U(a, i, d) : [],
    [l, a, i, d]
  ), [v, u] = f(String(a));
  K(() => {
    u(String(a));
  }, [a]);
  const _ = () => {
    const e = parseInt(v, 10);
    !isNaN(e) && e >= 1 && e <= i ? o(e) : u(String(a));
  };
  if (i <= 0) return null;
  const V = B ?? `Page ${a} of ${i}`;
  return /* @__PURE__ */ c(
    "div",
    {
      className: H("fds-pagination", r && "fds-pagination--disabled", k),
      "aria-disabled": r || void 0,
      ...z,
      children: [
        b && /* @__PURE__ */ n("span", { className: "fds-pagination__label BodySmallRegular", children: V }),
        /* @__PURE__ */ n("div", { className: "fds-pagination__root", children: /* @__PURE__ */ c("div", { className: "fds-pagination__wrapper", children: [
          /* @__PURE__ */ n(
            N,
            {
              iconOnly: !0,
              size: "Small",
              variant: "Gray",
              color: "Primary",
              leadingIcon: /* @__PURE__ */ n(q, { size: 16 }),
              isDisabled: C || r,
              onClick: () => o(a - 1),
              "aria-label": "Previous page"
            }
          ),
          l === "default" && /* @__PURE__ */ n("div", { className: "fds-pagination__pages", children: O.map(
            (e) => e.type === "page" ? /* @__PURE__ */ n(
              Q,
              {
                page: e.page,
                isSelected: e.page === a,
                disabled: r,
                onClick: () => o(e.page)
              },
              e.page
            ) : /* @__PURE__ */ n(
              T,
              {
                direction: e.direction,
                disabled: r,
                onClick: () => {
                  o(
                    e.direction === "previous" ? Math.max(1, a - 5) : Math.min(i, a + 5)
                  );
                }
              },
              `ellipsis-${e.direction}`
            )
          ) }),
          l === "jumper" && /* @__PURE__ */ c("div", { className: "fds-pagination__jumper", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "text",
                inputMode: "numeric",
                className: "fds-pagination__jumper-input BodyMediumRegular",
                value: v,
                disabled: r,
                onChange: (e) => u(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && _(),
                onBlur: _,
                "aria-label": "Go to page"
              }
            ),
            /* @__PURE__ */ c("span", { className: "fds-pagination__jumper-label BodyMediumRegular", children: [
              "of ",
              i
            ] })
          ] }),
          /* @__PURE__ */ n(
            N,
            {
              iconOnly: !0,
              size: "Small",
              variant: "Gray",
              color: "Primary",
              leadingIcon: /* @__PURE__ */ n(A, { size: 16 }),
              isDisabled: J || r,
              onClick: () => o(a + 1),
              "aria-label": "Next page"
            }
          )
        ] }) }),
        M && /* @__PURE__ */ c("div", { className: "fds-pagination__size-picker", children: [
          /* @__PURE__ */ n(
            "select",
            {
              className: "fds-pagination__size-select BodySmallRegular",
              value: $,
              disabled: r,
              onChange: (e) => w(Number(e.target.value)),
              "aria-label": "Items per page",
              children: j.map((e) => /* @__PURE__ */ n("option", { value: e, children: e }, e))
            }
          ),
          /* @__PURE__ */ n("span", { className: "fds-pagination__size-label BodySmallRegular", children: x })
        ] })
      ]
    }
  );
}
W.displayName = "Pagination";
export {
  W as Pagination
};
