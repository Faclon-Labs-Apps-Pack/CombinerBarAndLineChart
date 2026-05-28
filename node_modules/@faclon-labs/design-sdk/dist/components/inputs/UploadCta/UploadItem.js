import { jsx as e, jsxs as i, Fragment as m } from "react/jsx-runtime";
import { CheckCircle as b, Download as k, Eye as w, X as B } from "react-feather";
import { cn as d } from "../../../utils/cn.js";
import { IconButton as l } from "../../actions/IconButton/IconButton.js";
import { Divider as t } from "../../layout/Divider/Divider.js";
import { ProgressBar as C } from "../../feedback/ProgressBar/ProgressBar.js";
import { FileThumbnail as x } from "./FileThumbnail.js";
/* empty css               */
function M({
  fileName: r,
  fileSize: n,
  fileType: c = "xyz",
  uploadState: s = "completed",
  showDownload: p = !0,
  showPreview: f = !0,
  errorText: u,
  progress: _ = 0,
  onRemove: h,
  onDownload: v,
  onPreview: N,
  className: g,
  ...z
}) {
  const a = s === "failed", o = s === "loading", y = !a && !o;
  return /* @__PURE__ */ e(
    "div",
    {
      className: d(
        "fds-upload-item",
        a && "fds-upload-item--failed",
        o && "fds-upload-item--loading",
        g
      ),
      ...z,
      children: /* @__PURE__ */ i("div", { className: "fds-upload-item__root", children: [
        /* @__PURE__ */ i("div", { className: d("fds-upload-item__body", (a || o) && "fds-upload-item__body--top"), children: [
          /* @__PURE__ */ e(x, { type: a ? "error" : c }),
          /* @__PURE__ */ i("div", { className: "fds-upload-item__info", children: [
            /* @__PURE__ */ i("div", { className: "fds-upload-item__name-group", children: [
              /* @__PURE__ */ e("span", { className: d("fds-upload-item__name BodyMediumMedium", (a || o) && "fds-upload-item__name--wide"), children: o ? `Uploading ${r} ...` : r }),
              s === "completed" && /* @__PURE__ */ e(b, { size: 14, className: "fds-upload-item__status-icon" })
            ] }),
            a ? /* @__PURE__ */ e("span", { className: "fds-upload-item__error BodySmallRegular", children: u }) : /* @__PURE__ */ e("span", { className: "fds-upload-item__size BodySmallRegular", children: n })
          ] }),
          /* @__PURE__ */ i("div", { className: "fds-upload-item__actions", children: [
            y && /* @__PURE__ */ i("div", { className: "fds-upload-item__hover-actions", children: [
              p && /* @__PURE__ */ i(m, { children: [
                /* @__PURE__ */ e(
                  l,
                  {
                    icon: /* @__PURE__ */ e(k, { size: 16 }),
                    size: "16",
                    onClick: v,
                    "aria-label": "Download file"
                  }
                ),
                /* @__PURE__ */ e(t, { orientation: "Vertical", thickness: "Thin", variant: "Muted", className: "fds-upload-item__divider" })
              ] }),
              f && /* @__PURE__ */ i(m, { children: [
                /* @__PURE__ */ e(
                  l,
                  {
                    icon: /* @__PURE__ */ e(w, { size: 16 }),
                    size: "16",
                    onClick: N,
                    "aria-label": "Preview file"
                  }
                ),
                /* @__PURE__ */ e(t, { orientation: "Vertical", thickness: "Thin", variant: "Muted", className: "fds-upload-item__divider" })
              ] })
            ] }),
            /* @__PURE__ */ e(
              l,
              {
                icon: /* @__PURE__ */ e(B, { size: 16 }),
                size: "16",
                onClick: h,
                "aria-label": "Remove file"
              }
            )
          ] })
        ] }),
        o && /* @__PURE__ */ e(
          C,
          {
            size: "Small",
            intent: "Neutral",
            value: _,
            showPercentage: !1,
            className: "fds-upload-item__progress"
          }
        )
      ] })
    }
  );
}
M.displayName = "UploadItem";
export {
  M as UploadItem
};
