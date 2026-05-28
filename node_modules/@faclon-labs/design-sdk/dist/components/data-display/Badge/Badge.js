import { jsxs as i, jsx as s } from "react/jsx-runtime";
import { cn as u } from "../../../utils/cn.js";
/* empty css          */
const S = {
  Small: { Subtle: "BodyXSmallMedium", Intense: "BodyXSmallRegular" },
  Medium: { Subtle: "BodySmallMedium", Intense: "BodySmallRegular" },
  Large: { Subtle: "BodySmallMedium", Intense: "BodySmallRegular" }
};
function b({
  color: d = "Positive",
  emphasis: e = "Subtle",
  size: a = "Small",
  label: o,
  children: m,
  leadingIcon: l,
  className: t,
  ...n
}) {
  const r = o ?? m ?? "Label";
  return /* @__PURE__ */ i(
    "span",
    {
      className: u(
        "fds-badge",
        `fds-badge--color-${d.toLowerCase()}`,
        `fds-badge--emphasis-${e.toLowerCase()}`,
        `fds-badge--size-${a.toLowerCase()}`,
        S[a][e],
        t
      ),
      ...n,
      children: [
        l ? /* @__PURE__ */ s("span", { className: "fds-badge__icon", children: l }) : null,
        /* @__PURE__ */ s("span", { className: "fds-badge__label", children: r })
      ]
    }
  );
}
b.displayName = "Badge";
export {
  b as Badge
};
