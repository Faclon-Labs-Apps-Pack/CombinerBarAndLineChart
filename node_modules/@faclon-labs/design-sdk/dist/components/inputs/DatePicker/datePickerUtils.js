function O(a, e, t, n, r, s) {
  const D = new Date(a, e, 1).getDay(), M = new Date(a, e + 1, 0).getDate(), I = new Date(a, e, 0).getDate(), _ = D + M, T = Math.ceil(_ / 7), p = /* @__PURE__ */ new Date(), C = `${p.getFullYear()}-${p.getMonth()}-${p.getDate()}`, y = [];
  let g = 1, x = 1;
  for (let w = 0; w < T; w++) {
    const d = [];
    for (let m = 0; m < 7; m++) {
      const $ = w * 7 + m;
      if ($ < D) {
        const h = I - D + $ + 1;
        d.push({ date: h, type: "outOfMonth" });
      } else if (g > M)
        d.push({ date: x++, type: "outOfMonth" });
      else {
        const h = new Date(a, e, g), S = `${a}-${e}-${g}` === C;
        let i = S ? "currentDate" : "default", f = !1;
        if (t && n) {
          const c = t.getTime(), l = n.getTime(), u = h.getTime();
          c === l && u === c ? f = !0 : u === c ? i = "rangeStart" : u === l ? i = "rangeEnd" : u > c && u < l && (i = "rangeIn");
        } else if (t && !n) {
          const c = t.getTime(), l = h.getTime();
          if (s) {
            const u = s.getTime();
            if (c === u)
              l === c && (f = !0);
            else {
              const Y = Math.min(c, u), v = Math.max(c, u);
              l === Y ? i = "rangeStart" : l === v ? i = "rangeEnd" : l > Y && l < v && (i = "rangeIn");
            }
          } else
            l === c && (f = !0);
        }
        r && r.getFullYear() === a && r.getMonth() === e && r.getDate() === g && (f = !0), d.push({ date: g, type: i, isSelected: f, isCurrentDate: S }), g++;
      }
    }
    y.push(d);
  }
  return y;
}
const F = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function k(a) {
  const e = [];
  for (let t = 0; t < 4; t++) {
    const n = [];
    for (let r = 0; r < 3; r++) {
      const s = t * 3 + r;
      n.push({ label: F[s], value: s, isSelected: s === a });
    }
    e.push(n);
  }
  return e;
}
function A(a, e) {
  const t = [];
  let n = a;
  for (let r = 0; r < 4; r++) {
    const s = [];
    for (let o = 0; o < 3; o++)
      s.push({ label: String(n), value: n, isSelected: n === e }), n++;
    t.push(s);
  }
  return t;
}
function H(a) {
  const e = /* @__PURE__ */ new Date(), t = new Date(e.getFullYear(), e.getMonth(), e.getDate()), n = new Date(t);
  switch (n.setDate(t.getDate() - 1), a) {
    case "today":
      return { start: t, end: t };
    case "yesterday":
      return { start: n, end: n };
    case "current_week": {
      const r = t.getDay(), s = new Date(t);
      return s.setDate(t.getDate() - (r + 6) % 7), { start: s, end: t };
    }
    case "previous_7_days": {
      const r = new Date(t);
      return r.setDate(t.getDate() - 7), { start: r, end: n };
    }
    case "current_month":
      return { start: new Date(t.getFullYear(), t.getMonth(), 1), end: t };
    case "previous_month": {
      const r = new Date(t.getFullYear(), t.getMonth() - 1, 1), s = new Date(t.getFullYear(), t.getMonth(), 0);
      return { start: r, end: s };
    }
    case "previous_3_month": {
      const r = new Date(t.getFullYear(), t.getMonth() - 3, 1), s = new Date(t.getFullYear(), t.getMonth(), 0);
      return { start: r, end: s };
    }
    case "previous_12_month": {
      const r = new Date(t.getFullYear(), t.getMonth() - 12, 1), s = new Date(t.getFullYear(), t.getMonth(), 0);
      return { start: r, end: s };
    }
    case "current_year":
      return { start: new Date(t.getFullYear(), 0, 1), end: t };
    case "previous_year": {
      const r = t.getFullYear() - 1;
      return { start: new Date(r, 0, 1), end: new Date(r, 11, 31) };
    }
    default:
      return null;
  }
}
function J(a) {
  const e = String(a.getDate()).padStart(2, "0"), t = String(a.getMonth() + 1).padStart(2, "0"), n = a.getFullYear();
  return `${e}/${t}/${n}`;
}
function L(a) {
  const e = a.replace(/\D/g, "").slice(0, 8);
  let t = e.slice(0, 2), n = e.slice(2, 4);
  const r = e.slice(4, 8);
  if (t.length === 2) {
    const o = parseInt(t, 10);
    o < 1 ? t = "01" : o > 31 && (t = "31");
  }
  if (n.length === 2) {
    const o = parseInt(n, 10);
    o < 1 ? n = "01" : o > 12 && (n = "12");
  }
  let s = t;
  return t.length === 2 && e.length > 2 && (s += "/"), n && (s += n), n.length === 2 && e.length > 4 && (s += "/"), r && (s += r), s;
}
function N(a) {
  const e = a.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!e) return null;
  const t = parseInt(e[1], 10), n = parseInt(e[2], 10), r = parseInt(e[3], 10);
  if (n < 1 || n > 12 || t < 1) return null;
  const s = new Date(r, n - 1, t);
  return s.getFullYear() !== r || s.getMonth() !== n - 1 || s.getDate() !== t ? null : s;
}
function B(a) {
  const e = a.replace(/\D/g, "").slice(0, 4);
  let t = e.slice(0, 2);
  const n = e.slice(2, 4);
  t.length === 2 && parseInt(t, 10) > 23 && (t = "23");
  let r = n;
  n.length === 2 && parseInt(n, 10) > 59 && (r = "59");
  let s = t;
  return t.length === 2 && e.length > 2 && (s += ":"), r && (s += r), s;
}
function E(a) {
  const e = a.match(/^(\d{1,2}):(\d{2})$/);
  if (!e) return null;
  const t = parseInt(e[1], 10), n = parseInt(e[2], 10);
  return t > 23 || n > 59 ? null : { hours: t, minutes: n };
}
function P(a) {
  const e = String(a.getHours()).padStart(2, "0"), t = String(a.getMinutes()).padStart(2, "0");
  return `${e}:${t}`;
}
function R(a, e, t, n) {
  switch (a) {
    case "date":
      return `${F[t]} ${e}`;
    case "month":
      return String(e);
    case "year":
      return `${n} - ${n + 11}`;
  }
}
export {
  J as formatDate,
  L as formatDateInput,
  P as formatTime,
  B as formatTimeInput,
  O as generateCalendarDays,
  k as generateMonths,
  A as generateYears,
  R as getHeaderLabel,
  H as getPresetDateRange,
  N as parseDateDMY,
  E as parseTime
};
