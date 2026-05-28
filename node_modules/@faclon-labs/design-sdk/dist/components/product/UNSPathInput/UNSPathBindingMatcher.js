const u = "{{", c = "}}", e = /^\{\{(.+)\}\}$/, r = /^\{\{(.*)$/;
function o(n) {
  return e.test(n);
}
function s(n) {
  return r.test(n);
}
function i(n) {
  var t;
  return ((t = n.match(e)) == null ? void 0 : t[1]) ?? null;
}
function E(n) {
  return `{{${n}}}`;
}
function P(n) {
  const t = i(n);
  return t === null ? null : t.split("/");
}
export {
  c as WRAP_CLOSE,
  u as WRAP_OPEN,
  i as extractInnerPath,
  o as isMappedBinding,
  s as isOpenBinding,
  P as mappedSegments,
  E as wrap
};
