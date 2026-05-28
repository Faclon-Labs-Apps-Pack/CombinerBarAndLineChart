import { jsx as r, jsxs as f, Fragment as F } from "react/jsx-runtime";
import { useState as s, useEffect as h } from "react";
import { Download as x } from "react-feather";
import { Modal as N } from "../../overlays/Modal/Modal.js";
import { ModalHeader as T } from "../../overlays/Modal/ModalHeader.js";
import { ModalFooter as z } from "../../overlays/Modal/ModalFooter.js";
import { Button as u } from "../../actions/Button/Button.js";
import { Spinner as L } from "../../feedback/Spinner/Spinner.js";
import { FileThumbnail as P } from "./FileThumbnail.js";
import { previewKindFor as y, formatFileSize as S, deriveFileTypeFromName as M, triggerDownload as R } from "./fileHelpers.js";
/* empty css                     */
const j = 256 * 1024;
function B({ file: e, isOpen: a, onClose: t, onDownload: p }) {
  const [i, v] = s(null), [_, n] = s(null), [g, w] = s(!1), [d, m] = s(!1);
  if (h(() => {
    if (!e || !a) return;
    const l = URL.createObjectURL(e);
    return v(l), () => {
      URL.revokeObjectURL(l), v(null);
    };
  }, [e, a]), h(() => {
    if (!e || !a) {
      n(null), w(!1), m(!1);
      return;
    }
    if (y(e) !== "text") return;
    if (e.size > j) {
      w(!0), n(null);
      return;
    }
    let l = !1;
    return m(!0), e.text().then(
      (k) => {
        l || (n(k), m(!1));
      },
      () => {
        l || (n(null), m(!1));
      }
    ), () => {
      l = !0;
    };
  }, [e, a]), !e) return null;
  const c = () => {
    p ? p(e) : R(e);
  }, o = y(e);
  return /* @__PURE__ */ r(
    N,
    {
      size: "Large",
      isOpen: a,
      hasBodyPadding: !1,
      onClose: t,
      header: /* @__PURE__ */ r(T, { title: e.name, subtitle: S(e.size), onClose: t }),
      footer: /* @__PURE__ */ r(
        z,
        {
          primaryAction: /* @__PURE__ */ r(u, { variant: "Primary", color: "Primary", size: "Small", leadingIcon: /* @__PURE__ */ r(x, { size: 16 }), onClick: c, children: "Download" }),
          secondaryAction: /* @__PURE__ */ r(u, { variant: "Secondary", color: "Primary", size: "Small", onClick: t, children: "Close" })
        }
      ),
      children: /* @__PURE__ */ f("div", { className: "fds-file-preview-modal__body", "data-kind": o, children: [
        o === "image" && i && /* @__PURE__ */ r("img", { src: i, alt: e.name, className: "fds-file-preview-modal__image" }),
        o === "pdf" && i && /* @__PURE__ */ r("iframe", { src: i, title: e.name, className: "fds-file-preview-modal__iframe" }),
        o === "text" && /* @__PURE__ */ f(F, { children: [
          d && /* @__PURE__ */ r("div", { className: "fds-file-preview-modal__center", children: /* @__PURE__ */ r(L, { size: "Medium" }) }),
          !d && g && /* @__PURE__ */ r(
            b,
            {
              file: e,
              message: "File is too large to preview as text.",
              onDownload: c
            }
          ),
          !d && !g && _ !== null && /* @__PURE__ */ r("pre", { className: "fds-file-preview-modal__text BodySmallRegular", children: _ })
        ] }),
        o === "unsupported" && /* @__PURE__ */ r(
          b,
          {
            file: e,
            message: "Preview not available for this file type.",
            onDownload: c
          }
        )
      ] })
    }
  );
}
B.displayName = "FilePreviewModal";
function b({ file: e, message: a, onDownload: t }) {
  return /* @__PURE__ */ f("div", { className: "fds-file-preview-modal__fallback", children: [
    /* @__PURE__ */ r(P, { type: M(e.name), className: "fds-file-preview-modal__fallback-thumb" }),
    /* @__PURE__ */ r("span", { className: "fds-file-preview-modal__fallback-name BodyMediumSemibold", children: e.name }),
    /* @__PURE__ */ r("span", { className: "fds-file-preview-modal__fallback-msg BodySmallRegular", children: a }),
    /* @__PURE__ */ r(u, { variant: "Primary", color: "Primary", size: "Small", leadingIcon: /* @__PURE__ */ r(x, { size: 16 }), onClick: t, children: "Download" })
  ] });
}
export {
  B as FilePreviewModal
};
