import { jsxs as m, jsx as t, Fragment as h } from "react/jsx-runtime";
/* empty css                    */
import { useState as p, useRef as u, useLayoutEffect as w } from "react";
import { createPortal as C } from "react-dom";
import { MoreHorizontal as O } from "react-feather";
import { IconButton as d } from "../../actions/IconButton/IconButton.js";
import { DropdownMenu as I } from "../../overlays/DropdownMenu/DropdownMenu.js";
import { ActionListItem as R } from "../../overlays/DropdownMenu/ActionListItem.js";
import { ActionListItemGroup as v } from "../../overlays/DropdownMenu/ActionListItemGroup.js";
import { useClickOutside as y } from "../../../hooks/useClickOutside.js";
import { useDismissOnScrollOutside as E } from "../../../hooks/useDismissOnScrollOutside.js";
const b = 4, g = 200, M = 180;
function F({
  actions: n,
  moreAriaLabel: D = "More actions",
  menuMinWidth: l = M
}) {
  const [i, r] = p(!1), s = u(null), c = u(null), [a, _] = p(null);
  y(c, (e) => {
    var o;
    i && !((o = s.current) != null && o.contains(e.target)) && r(!1);
  }), w(() => {
    if (!i || !s.current) return;
    const e = s.current.getBoundingClientRect(), o = e.bottom + g > window.innerHeight;
    _({
      top: o ? e.top - b - g : e.bottom + b,
      // Anchor the menu's RIGHT edge to the trigger's right edge.
      left: e.right - l
    });
  }, [i, l]), E(c, () => r(!1), i);
  const f = n.length > 3, k = f ? n.slice(0, 2) : n, P = f ? n.slice(2) : [];
  return /* @__PURE__ */ m(
    "div",
    {
      className: "fds-table__row-actions",
      onClick: (e) => e.stopPropagation(),
      children: [
        k.map((e) => /* @__PURE__ */ t(
          d,
          {
            icon: e.icon,
            "aria-label": e.label,
            isDisabled: e.isDisabled,
            onClick: (o) => {
              o.stopPropagation(), !e.isDisabled && e.onClick(o);
            }
          },
          e.key
        )),
        f && /* @__PURE__ */ m(h, { children: [
          /* @__PURE__ */ t(
            d,
            {
              ref: s,
              icon: /* @__PURE__ */ t(O, { size: 20 }),
              "aria-label": D,
              "aria-haspopup": "menu",
              "aria-expanded": i,
              onClick: (e) => {
                e.stopPropagation(), r((o) => !o);
              }
            }
          ),
          i && a && typeof document < "u" && C(
            /* @__PURE__ */ t(
              "div",
              {
                ref: c,
                className: "fds-table__row-actions-menu",
                role: "presentation",
                style: {
                  top: a.top,
                  left: a.left,
                  minWidth: l
                },
                children: /* @__PURE__ */ t(I, { children: /* @__PURE__ */ t(v, { children: P.map((e) => /* @__PURE__ */ t(
                  R,
                  {
                    title: e.label,
                    leadingIcon: e.icon,
                    isDestructive: e.isDestructive,
                    isDisabled: e.isDisabled,
                    onClick: (o) => {
                      e.isDisabled || (e.onClick(o), r(!1));
                    }
                  },
                  e.key
                )) }) })
              }
            ),
            document.body
          )
        ] })
      ]
    }
  );
}
export {
  F as TableRowActions
};
