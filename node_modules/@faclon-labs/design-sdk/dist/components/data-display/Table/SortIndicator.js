import { jsxs as a, jsx as r } from "react/jsx-runtime";
import { ChevronUp as c, ChevronDown as i } from "react-feather";
import { cn as t } from "../../../utils/cn.js";
function v({ direction: o }) {
  const s = o === "desc", e = o === "asc";
  return /* @__PURE__ */ a("span", { className: "fds-table__sort-indicator", "aria-hidden": "true", children: [
    /* @__PURE__ */ r(
      c,
      {
        size: 12,
        className: t(
          "fds-table__sort-indicator__chevron",
          s && "fds-table__sort-indicator__chevron--active"
        )
      }
    ),
    /* @__PURE__ */ r(
      i,
      {
        size: 12,
        className: t(
          "fds-table__sort-indicator__chevron",
          e && "fds-table__sort-indicator__chevron--active"
        )
      }
    )
  ] });
}
export {
  v as SortIndicator
};
