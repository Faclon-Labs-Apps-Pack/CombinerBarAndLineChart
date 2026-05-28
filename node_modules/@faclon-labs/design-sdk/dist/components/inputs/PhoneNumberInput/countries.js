import { getCountries as a, getCountryCallingCode as u } from "libphonenumber-js";
function l(t) {
  if (!t || t.length !== 2) return "";
  const r = 127397;
  return String.fromCodePoint(
    t.toUpperCase().charCodeAt(0) + r,
    t.toUpperCase().charCodeAt(1) + r
  );
}
let i = null;
function s() {
  if (i) return i;
  const t = new Intl.DisplayNames(["en"], { type: "region" }), r = a().map((e) => ({
    iso: e,
    name: t.of(e) ?? e,
    dialCode: `+${u(e)}`,
    flagEmoji: l(e)
  }));
  return r.sort((e, n) => e.name.localeCompare(n.name)), i = r, r;
}
function c(t) {
  return s().find((r) => r.iso === t);
}
function f(t, r) {
  const e = r.trim().toLowerCase();
  if (!e) return t;
  const n = e.replace(/\D/g, "");
  return t.filter((o) => !!(o.name.toLowerCase().includes(e) || o.iso.toLowerCase().includes(e) || n && o.dialCode.replace("+", "").includes(n)));
}
export {
  f as filterCountries,
  c as getCountryByIso,
  s as getCountryList,
  l as isoToFlagEmoji
};
