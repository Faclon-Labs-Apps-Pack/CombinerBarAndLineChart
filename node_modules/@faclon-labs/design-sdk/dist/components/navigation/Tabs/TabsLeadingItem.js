import { jsx as d } from "react/jsx-runtime";
import { forwardRef as n } from "react";
import { cn as m } from "../../../utils/cn.js";
/* empty css                    */
const f = n(
  ({ leading: a = "Icon", size: e = "16", icon: r, children: t, className: o, ...i }, s) => /* @__PURE__ */ d(
    "span",
    {
      ref: s,
      className: m(
        "fds-tab-leading",
        `fds-tab-leading--size-${e}`,
        `fds-tab-leading--type-${a.toLowerCase()}`,
        o
      ),
      "aria-hidden": "true",
      ...i,
      children: a === "Icon" ? r : t
    }
  )
);
f.displayName = "TabsLeadingItem";
export {
  f as TabsLeadingItem
};
