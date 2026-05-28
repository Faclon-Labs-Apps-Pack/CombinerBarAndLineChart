import { jsx as a } from "react/jsx-runtime";
/* empty css              */
import { cn as c } from "../../../utils/cn.js";
function p({ children: e, className: s, contentType: t = "text", ...l }) {
  const { isSticky: i, ...o } = l, r = t === "text" || t === "text-action";
  return /* @__PURE__ */ a(
    "td",
    {
      className: c("fds-table__cell", "BodyMediumRegular", s),
      "data-content-type": t,
      ...o,
      children: r ? /* @__PURE__ */ a("span", { className: "fds-table__cell-text", children: e }) : e
    }
  );
}
export {
  p as TableCell
};
