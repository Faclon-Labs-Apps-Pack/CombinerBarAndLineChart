import { jsxs as l, jsx as s } from "react/jsx-runtime";
import { cn as d } from "../../../utils/cn.js";
import { ColorCell as f } from "./ColorCell.js";
/* empty css                 */
function n({
  name: r,
  colors: t,
  selectedColor: i,
  onColorSelect: m,
  className: p,
  ...e
}) {
  return /* @__PURE__ */ l("div", { className: d("fds-color-palette", p), ...e, children: [
    /* @__PURE__ */ s("span", { className: "fds-color-palette__label BodySmallRegular", children: r }),
    /* @__PURE__ */ s("div", { className: "fds-color-palette__row", children: t.map((a) => /* @__PURE__ */ s(
      f,
      {
        color: a,
        isSelected: (i == null ? void 0 : i.toLowerCase()) === a.toLowerCase(),
        onClick: () => m == null ? void 0 : m(a)
      },
      a
    )) })
  ] });
}
n.displayName = "ColorPalette";
export {
  n as ColorPalette
};
