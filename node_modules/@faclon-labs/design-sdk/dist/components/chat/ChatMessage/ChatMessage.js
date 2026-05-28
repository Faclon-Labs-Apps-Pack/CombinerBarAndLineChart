import { jsx as t, jsxs as j } from "react/jsx-runtime";
import D from "react";
import { cn as i } from "../../../utils/cn.js";
import { SelfMessageBubble as I } from "./SelfMessageBubble.js";
import { DefaultMessageBubble as P } from "./DefaultMessageBubble.js";
import { ThumbnailPreview as W } from "./ThumbnailPreview.js";
import { RollingText as k } from "./RollingText.js";
/* empty css                */
const q = D.forwardRef(
  ({
    senderType: s = "self",
    isLoading: r = !1,
    validationState: f = "none",
    errorText: n,
    onClick: o,
    footerActions: g,
    children: e,
    leading: d,
    loadingText: a,
    wordBreak: _ = "break-word",
    maxWidth: b,
    thumbnails: l,
    onThumbnailClick: u,
    reasoningTraces: x,
    reasoningStatus: p,
    reasoningTitle: y,
    reasoningActiveStepIndex: A,
    testID: C
  }, M) => {
    const m = typeof e == "string" || Array.isArray(e) && e.every((B) => typeof B == "string") || r, N = r && Array.isArray(a) ? /* @__PURE__ */ t(k, { texts: a }) : a, v = r ? Array.isArray(a) ? s === "other" ? "fds-chat-msg__other-text--loading-array" : "" : s === "other" ? "fds-chat-msg__other-text--loading-str" : "" : s === "other" ? "fds-chat-msg__other-text--normal" : "", h = m ? /* @__PURE__ */ t(
      "span",
      {
        className: i(
          "BodyMediumRegular",
          s === "self" ? "fds-chat-msg__self-text" : "fds-chat-msg__other-text",
          f === "error" && "fds-chat-msg__self-text--error",
          v
        ),
        style: { wordBreak: _ },
        children: r ? N : e
      }
    ) : e, R = s === "self" ? /* @__PURE__ */ t(
      I,
      {
        validationState: f,
        errorText: n,
        isChildText: m,
        children: h
      }
    ) : /* @__PURE__ */ t(
      P,
      {
        leading: d,
        isLoading: r,
        footerActions: g,
        isChildText: m,
        reasoningTraces: x,
        reasoningStatus: p,
        reasoningTitle: y,
        reasoningActiveStepIndex: A,
        children: h
      }
    ), w = s === "self" ? "fds-chat-msg__thumbnail-align-end" : "fds-chat-msg__thumbnail-align-start", c = o ? "button" : "div";
    return /* @__PURE__ */ j("div", { className: "fds-chat-msg", style: { maxWidth: b }, "data-testid": C, children: [
      l && l.length > 0 && /* @__PURE__ */ t("div", { className: w, children: /* @__PURE__ */ t(W, { thumbnails: l, onThumbnailClick: u }) }),
      /* @__PURE__ */ t(
        c,
        {
          ref: M,
          className: i(o && "fds-chat-msg--clickable"),
          onClick: o,
          ...c === "button" ? { type: "button" } : {},
          children: R
        }
      )
    ] });
  }
);
q.displayName = "ChatMessage";
export {
  q as ChatMessage
};
