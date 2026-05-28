import { jsxs as p, jsx as i } from "react/jsx-runtime";
import { MoreHorizontal as e, ChevronsLeft as t, ChevronsRight as l } from "react-feather";
import { cn as r } from "../../../utils/cn.js";
/* empty css                       */
function m({ direction: s, className: o, ...a }) {
  const n = s === "previous" ? t : l;
  return /* @__PURE__ */ p(
    "button",
    {
      type: "button",
      className: r("fds-pagination-ellipsis", o),
      "aria-label": s === "previous" ? "Skip to previous pages" : "Skip to next pages",
      ...a,
      children: [
        /* @__PURE__ */ i("span", { className: "fds-pagination-ellipsis__dots", children: /* @__PURE__ */ i(e, { size: 16 }) }),
        /* @__PURE__ */ i("span", { className: "fds-pagination-ellipsis__skip", children: /* @__PURE__ */ i(n, { size: 16 }) })
      ]
    }
  );
}
m.displayName = "PaginationEllipsis";
export {
  m as PaginationEllipsis
};
