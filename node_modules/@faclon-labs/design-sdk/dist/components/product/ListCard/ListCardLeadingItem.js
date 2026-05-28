import { jsx as i } from "react/jsx-runtime";
import { cn as r } from "../../../utils/cn.js";
/* empty css                        */
function t({
  leading: l = "Icon",
  icon: e,
  children: n,
  color: s,
  className: d,
  ...a
}) {
  return l === "Color" ? /* @__PURE__ */ i("div", { className: r("fds-list-card-leading", d), ...a, children: /* @__PURE__ */ i("span", { className: "fds-list-card-leading__color", children: s && /* @__PURE__ */ i(
    "span",
    {
      className: "fds-list-card-leading__color-fill",
      style: { background: s }
    }
  ) }) }) : l === "Slot" ? /* @__PURE__ */ i("div", { className: r("fds-list-card-leading", d), ...a, children: n }) : /* @__PURE__ */ i("div", { className: r("fds-list-card-leading", d), ...a, children: e });
}
t.displayName = "ListCardLeadingItem";
export {
  t as ListCardLeadingItem
};
