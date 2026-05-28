import { jsx as r } from "react/jsx-runtime";
import { cn as c } from "../../../utils/cn.js";
/* empty css             */
function e({
  bodyText: a,
  children: d,
  className: s,
  ...t
}) {
  const o = !!d;
  return /* @__PURE__ */ r("div", { className: c("fds-card-body", o && "fds-card-body--slot", s), ...t, children: o ? d : /* @__PURE__ */ r("p", { className: "fds-card-body__text BodyMediumRegular", children: a }) });
}
e.displayName = "CardBody";
export {
  e as CardBody
};
