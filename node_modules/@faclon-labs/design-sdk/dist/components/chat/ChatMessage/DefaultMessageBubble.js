import { jsxs as l, jsx as e } from "react/jsx-runtime";
import { cn as i } from "../../../utils/cn.js";
import { Rotate as _ } from "./Rotate.js";
import { ReasoningTraces as n } from "./ReasoningTraces.js";
const N = ({
  children: s,
  leading: r,
  isLoading: a = !1,
  footerActions: d,
  isChildText: o,
  reasoningTraces: c,
  reasoningStatus: m,
  reasoningTitle: f,
  reasoningActiveStepIndex: h
}) => {
  const t = c && c.length > 0;
  return /* @__PURE__ */ l("div", { className: "fds-chat-msg__other-grid", children: [
    /* @__PURE__ */ e("div", { className: "fds-chat-msg__leading", children: /* @__PURE__ */ e(_, { animate: a, children: r }) }),
    /* @__PURE__ */ l("div", { className: i("fds-chat-msg__content", o && "fds-chat-msg__content-padded"), children: [
      t && m === "loading" && a && s,
      t && /* @__PURE__ */ e(
        n,
        {
          traces: c,
          status: m,
          title: f,
          activeStepIndex: h
        }
      ),
      t && m === "complete" && !a && s,
      !t && s
    ] }),
    d && /* @__PURE__ */ e("div", { className: "fds-chat-msg__footer-actions", children: d })
  ] });
};
export {
  N as DefaultMessageBubble
};
