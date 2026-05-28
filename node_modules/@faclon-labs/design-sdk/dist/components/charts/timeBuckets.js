function g(e) {
  const t = new Date(e);
  return t.setMinutes(0, 0, 0), t;
}
function i(e) {
  const t = new Date(e);
  return t.setHours(0, 0, 0, 0), t;
}
function h(e) {
  const t = i(e);
  return t.setDate(t.getDate() - t.getDay()), t;
}
function m(e) {
  const t = new Date(e);
  return t.setDate(1), t.setHours(0, 0, 0, 0), t;
}
function c(e, t, r) {
  const n = new Date(e);
  return t === "Hourly" ? n.setHours(n.getHours() + r) : t === "Daily" ? n.setDate(n.getDate() + r) : t === "Weekly" ? n.setDate(n.getDate() + r * 7) : n.setMonth(n.getMonth() + r), n;
}
function l(e, t) {
  return t === "Hourly" ? g(e) : t === "Daily" ? i(e) : t === "Weekly" ? h(e) : m(e);
}
function D(e, t) {
  if (t === "Hourly") return `${String(e.getHours()).padStart(2, "0")}:00`;
  if (t === "Daily") return e.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (t === "Weekly") {
    const r = c(e, "Weekly", 1);
    return `${e.toLocaleDateString("en-US", { month: "short", day: "numeric" })}–${r.toLocaleDateString("en-US", { day: "numeric" })}`;
  }
  return e.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
function S(e, t, r = {}) {
  const { clipping: n = !0 } = r;
  if (e.end.getTime() <= e.start.getTime()) return [];
  const u = l(e.start, t), s = [];
  let o = n ? new Date(e.start) : u;
  for (; o.getTime() < e.end.getTime(); ) {
    const a = c(l(o, t), t, 1), f = n ? new Date(Math.min(a.getTime(), e.end.getTime())) : a;
    if (s.push({
      start: new Date(o),
      end: f,
      label: D(l(o, t), t)
    }), o = a, s.length > 1e4) break;
  }
  return s;
}
function k(e) {
  if (e.end.getTime() - e.start.getTime() <= 0) return [];
  const r = [];
  let n = new Date(e.start);
  for (; n.getTime() < e.end.getTime(); ) {
    const u = e.end.getTime() - n.getTime();
    let s;
    u >= 864e5 * 28 ? s = "Monthly" : u >= 864e5 * 7 ? s = "Weekly" : u >= 864e5 ? s = "Daily" : s = "Hourly";
    const o = c(l(n, s), s, 1), a = new Date(Math.min(o.getTime(), e.end.getTime()));
    if (r.push({
      start: new Date(n),
      end: a,
      label: D(l(n, s), s)
    }), n = a, r.length > 1e4) break;
  }
  return r;
}
export {
  S as bucketRange,
  k as bucketRangeInexact
};
