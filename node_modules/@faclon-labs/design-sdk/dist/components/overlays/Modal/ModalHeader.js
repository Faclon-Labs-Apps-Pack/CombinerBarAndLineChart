import { jsx as e, jsxs as a } from "react/jsx-runtime";
import { X as n } from "react-feather";
import { cn as h } from "../../../utils/cn.js";
import { IconButton as t } from "../../actions/IconButton/IconButton.js";
import { Divider as _ } from "../../layout/Divider/Divider.js";
/* empty css                */
function f({
  title: r,
  subtitle: d,
  leadingItem: s,
  trailingItem: o,
  counter: l,
  onClose: i,
  className: m,
  ...c
}) {
  return /* @__PURE__ */ e("div", { className: h("fds-modal-header", m), ...c, children: /* @__PURE__ */ a("div", { className: "fds-modal-header__root", children: [
    /* @__PURE__ */ a("div", { className: "fds-modal-header__wrapper", children: [
      /* @__PURE__ */ a("div", { className: "fds-modal-header__left", children: [
        s,
        /* @__PURE__ */ a("div", { className: "fds-modal-header__content", children: [
          /* @__PURE__ */ a("div", { className: "fds-modal-header__heading", children: [
            /* @__PURE__ */ e("span", { className: "fds-modal-header__title BodyLargeSemibold", children: r }),
            l && /* @__PURE__ */ e("div", { className: "fds-modal-header__counter", children: l })
          ] }),
          d && /* @__PURE__ */ e("span", { className: "fds-modal-header__subtitle BodySmallRegular", children: d })
        ] })
      ] }),
      o,
      /* @__PURE__ */ e(
        t,
        {
          icon: /* @__PURE__ */ e(n, { size: 20 }),
          size: "20",
          onClick: i,
          "aria-label": "Close",
          className: "fds-modal-header__close"
        }
      )
    ] }),
    /* @__PURE__ */ e(_, { variant: "Muted" })
  ] }) });
}
f.displayName = "ModalHeader";
export {
  f as ModalHeader
};
