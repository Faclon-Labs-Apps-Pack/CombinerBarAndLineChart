import { jsxs as p, Fragment as b, jsx as n } from "react/jsx-runtime";
import { Info as g, Settings as h, Menu as x } from "react-feather";
import { IconButton as e } from "../../actions/IconButton/IconButton.js";
function I({
  onInfoClick: r,
  onSettingsClick: i,
  onMoreClick: o,
  showInfo: t,
  showSettings: s,
  showMore: a,
  infoLabel: l = "Info",
  settingsLabel: c = "Settings",
  moreLabel: m = "More",
  trailing: u
}) {
  const f = t ?? r != null, z = s ?? i != null, d = a ?? o != null;
  return /* @__PURE__ */ p(b, { children: [
    f && /* @__PURE__ */ n(
      e,
      {
        size: "16",
        icon: /* @__PURE__ */ n(g, { size: 16 }),
        "aria-label": l,
        onClick: r
      }
    ),
    z && /* @__PURE__ */ n(
      e,
      {
        size: "16",
        icon: /* @__PURE__ */ n(h, { size: 16 }),
        "aria-label": c,
        onClick: i
      }
    ),
    d && /* @__PURE__ */ n(
      e,
      {
        size: "16",
        icon: /* @__PURE__ */ n(x, { size: 16 }),
        "aria-label": m,
        onClick: o
      }
    ),
    u
  ] });
}
I.displayName = "ChartActions";
export {
  I as ChartActions
};
