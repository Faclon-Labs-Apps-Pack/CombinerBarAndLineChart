import { jsx as a, jsxs as l } from "react/jsx-runtime";
/* empty css                 */
import { cn as c } from "../../../utils/cn.js";
function f({
  title: e,
  subtitle: o,
  leading: s,
  trailing: r,
  section: d,
  children: t,
  className: i,
  ...b
}) {
  return t ? /* @__PURE__ */ a("div", { className: c("fds-table-toolbar", i), ...b, children: t }) : /* @__PURE__ */ l("div", { className: c("fds-table-toolbar", i), ...b, children: [
    /* @__PURE__ */ l("div", { className: "fds-table-toolbar__row", children: [
      s && /* @__PURE__ */ a("div", { className: "fds-table-toolbar__leading", children: s }),
      /* @__PURE__ */ l("div", { className: "fds-table-toolbar__titles", children: [
        e && /* @__PURE__ */ a("span", { className: "fds-table-toolbar__title BodyLargeSemibold", children: e }),
        o && /* @__PURE__ */ a("span", { className: "fds-table-toolbar__subtitle BodyMediumRegular", children: o })
      ] }),
      r && /* @__PURE__ */ a("div", { className: "fds-table-toolbar__trailing", children: r })
    ] }),
    d && /* @__PURE__ */ a("div", { className: "fds-table-toolbar__section", children: d })
  ] });
}
export {
  f as TableToolbar
};
