import { jsxs as a, jsx as e } from "react/jsx-runtime";
/* empty css             */
import { ChevronDown as c } from "react-feather";
import { cn as d } from "../../../../utils/cn.js";
function f({
  title: s,
  description: l,
  leading: t,
  trailingIndicator: n = "none",
  className: r
}) {
  return /* @__PURE__ */ a("span", { className: d("fds-table-cell-text", r), children: [
    t && /* @__PURE__ */ e("span", { className: "fds-table-cell-text__leading", children: t }),
    /* @__PURE__ */ a("span", { className: "fds-table-cell-text__content", children: [
      /* @__PURE__ */ e("span", { className: "fds-table-cell-text__title BodyMediumRegular", children: s }),
      l && /* @__PURE__ */ e("span", { className: "fds-table-cell-text__description BodySmallRegular", children: l })
    ] }),
    n === "dropdown" && /* @__PURE__ */ e("span", { className: "fds-table-cell-text__trailing", "aria-hidden": "true", children: /* @__PURE__ */ e(c, { size: 20 }) })
  ] });
}
export {
  f as CellText
};
