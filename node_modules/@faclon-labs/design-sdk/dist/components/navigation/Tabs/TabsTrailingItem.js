import { jsx as t } from "react/jsx-runtime";
import { forwardRef as i } from "react";
import { cn as m } from "../../../utils/cn.js";
/* empty css                     */
const n = i(
  ({ trailing: a = "Counter", children: r, className: o, ...e }, s) => /* @__PURE__ */ t(
    "span",
    {
      ref: s,
      className: m(
        "fds-tab-trailing",
        `fds-tab-trailing--type-${a.toLowerCase()}`,
        o
      ),
      ...e,
      children: a === "Counter" ? /* @__PURE__ */ t("span", { className: "fds-tab-trailing__counter BodyXSmallMedium", children: r }) : r
    }
  )
);
n.displayName = "TabsTrailingItem";
export {
  n as TabsTrailingItem
};
