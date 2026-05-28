import { jsx as c, jsxs as N } from "react/jsx-runtime";
import { useRef as g, useState as w, useLayoutEffect as x, useCallback as P } from "react";
import { X as R } from "react-feather";
import { cn as o } from "../../../utils/cn.js";
import { IconButton as j } from "../../actions/IconButton/IconButton.js";
import { useKeyboard as z } from "../../../hooks/useKeyboard.js";
/* empty css          */
function B({
  size: n = "Small",
  isOpen: s = !1,
  hasBodyPadding: u = !0,
  header: f,
  footer: p,
  children: i,
  onClose: a,
  className: _,
  positionX: r,
  positionY: e,
  ...h
}) {
  const t = r !== void 0 && e !== void 0, l = g(null), [b, k] = w(null);
  x(() => {
    if (!t || !l.current) return;
    const d = l.current, m = 8, v = Math.max(m, Math.min(r, window.innerWidth - d.offsetWidth - m)), y = Math.max(m, Math.min(e, window.innerHeight - d.offsetHeight - m));
    k({ left: v, top: y });
  }, [t, r, e]);
  const M = P(
    (d) => {
      d.target === d.currentTarget && (a == null || a());
    },
    [a]
  );
  return z("Escape", () => a == null ? void 0 : a(), s), s ? /* @__PURE__ */ c(
    "div",
    {
      className: o("fds-modal__backdrop", t && "fds-modal__backdrop--transparent", _),
      onClick: M,
      role: "dialog",
      "aria-modal": "true",
      ...h,
      children: /* @__PURE__ */ N(
        "div",
        {
          ref: l,
          className: o("fds-modal", `fds-modal--${n.toLowerCase()}`, t && "fds-modal--positioned"),
          style: t ? b ?? { left: r, top: e } : void 0,
          children: [
            f,
            !f && a && /* @__PURE__ */ c(
              j,
              {
                icon: /* @__PURE__ */ c(R, { size: 20 }),
                size: "20",
                onClick: a,
                "aria-label": "Close modal",
                className: "fds-modal__close"
              }
            ),
            i && /* @__PURE__ */ c("div", { className: o("fds-modal__body", u && "fds-modal__body--padded"), children: i }),
            p
          ]
        }
      )
    }
  ) : null;
}
B.displayName = "Modal";
export {
  B as Modal
};
