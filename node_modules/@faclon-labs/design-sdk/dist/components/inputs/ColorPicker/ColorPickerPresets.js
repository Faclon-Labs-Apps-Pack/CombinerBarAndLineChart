import { jsx as C } from "react/jsx-runtime";
import { cn as m } from "../../../utils/cn.js";
import { ColorCell as o } from "./ColorCell.js";
/* empty css                       */
const f = [
  { name: "Blue", colors: ["#E7F6FE", "#CFEDFC", "#A8DFFA", "#79CEF8", "#57C1F6", "#15B0F3", "#1291D0", "#0F78AD", "#0C608A", "#094868"] },
  { name: "Green", colors: ["#EBFAF3", "#DAF5E8", "#B6ECD1", "#91E3BA", "#48D08C", "#00BE5F", "#00A251", "#008743", "#006C36", "#005128"] },
  { name: "Orange", colors: ["#FFF3EB", "#FFE1CC", "#FFC499", "#FFAC70", "#FF9040", "#FF7A1A", "#E9690C", "#C65C10", "#A24D10", "#813E0E"] },
  { name: "Red", colors: ["#FFF5F5", "#FEE4E2", "#FEC6C3", "#FD9D96", "#F96C62", "#F04438", "#D92D20", "#B42318", "#9A0E0E", "#880C0C"] },
  { name: "Neutral", colors: ["#F8FAFC", "#F1F5FA", "#E3EAF3", "#CBD5E2", "#B1C1D2", "#90A5BB", "#768EA7", "#6C849D", "#58728D", "#40566D"] }
], i = [
  ["#000000", "#3B3A3A", "#5F5F5F", "#9A9A9A", "#CBCBCB", "#E1E1E1", "#FFFFFF"],
  ["#AA180E", "#C75300", "#102D90", "#00753B", "#0070A8", "#7609D6", "#C600C6"],
  ["#F04438", "#FF7A1A", "#1364F1", "#00BE5F", "#57C1F6", "#BE57F6", "#F657F3"],
  ["#FEC6C3", "#FFC499", "#A8C8FF", "#B6ECD1", "#A8DFFA", "#DFA5FF", "#FFB3FE"]
];
function p({
  swatches: r = i,
  selectedColor: E,
  onColorSelect: A,
  className: D,
  ...s
}) {
  return /* @__PURE__ */ C("div", { className: m("fds-color-presets", D), ...s, children: r.map((B, a) => /* @__PURE__ */ C("div", { className: "fds-color-presets__row", children: B.map((F) => /* @__PURE__ */ C(
    o,
    {
      color: F,
      isSelected: F.toUpperCase() === (E == null ? void 0 : E.toUpperCase()),
      onClick: () => A == null ? void 0 : A(F)
    },
    F
  )) }, a)) });
}
p.displayName = "ColorPickerPresets";
export {
  p as ColorPickerPresets,
  f as DEFAULT_PALETTES,
  i as DEFAULT_SWATCHES
};
