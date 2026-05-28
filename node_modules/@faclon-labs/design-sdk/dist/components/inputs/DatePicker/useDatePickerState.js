import { useState as D, useCallback as n, useRef as r, useEffect as P, useMemo as v } from "react";
import { formatDate as f, formatTime as k, generateCalendarDays as jt, generateMonths as zt, generateYears as Gt, getPresetDateRange as Jt, formatDateInput as Ot, parseDateDMY as l, parseTime as st, getHeaderLabel as Pt } from "./datePickerUtils.js";
function Zt({
  mode: o,
  controlledOpen: X,
  onOpenChange: Q,
  value: d,
  onChange: U,
  rangeValue: t,
  onRangeChange: I,
  controlledPreset: N,
  controlledPresetSelect: W,
  isDisabled: Qt
}) {
  const [it, ct] = D(!1), R = X ?? it, T = n(
    (s) => {
      X === void 0 && ct(s), Q == null || Q(s);
    },
    [X, Q]
  ), e = /* @__PURE__ */ new Date(), q = o === "single" ? d : t == null ? void 0 : t.start, [m, H] = D((q == null ? void 0 : q.getMonth()) ?? e.getMonth()), [S, p] = D((q == null ? void 0 : q.getFullYear()) ?? e.getFullYear()), [w, A] = D("date"), Z = Math.floor(S / 12) * 12, [ot, u] = D(t ?? null), ft = t !== void 0 ? t : ot, [h, E] = D((t == null ? void 0 : t.start) ?? null), [L, Y] = D((t == null ? void 0 : t.end) ?? null), [_, b] = D(t ? 2 : 0), [g, j] = D(null), [z, V] = D(!1), [dt, a] = D(N ?? "custom"), $ = N ?? dt, y = n(
    (s) => {
      a(s), W == null || W(s);
    },
    [W]
  ), [B, K] = D(d ?? null), [nt, G] = D(d ? f(d) : ""), [Dt, x] = D(t != null && t.start ? f(t.start) : ""), [ht, F] = D(t != null && t.end ? f(t.end) : ""), [wt, J] = D(t != null && t.start ? k(t.start) : "00:00"), [Mt, O] = D(t != null && t.end ? k(t.end) : "00:00"), tt = r(null), mt = r(!1), C = r($);
  P(() => {
    o === "single" && (K(d ?? null), G(d ? f(d) : ""), d && (H(d.getMonth()), p(d.getFullYear())));
  }, [d, o]), P(() => {
    o === "range" && (E((t == null ? void 0 : t.start) ?? null), Y((t == null ? void 0 : t.end) ?? null), x(t != null && t.start ? f(t.start) : ""), F(t != null && t.end ? f(t.end) : ""), J(t != null && t.start ? k(t.start) : "00:00"), O(t != null && t.end ? k(t.end) : "00:00"), b(t ? 2 : 0), t != null && t.start && (H(t.start.getMonth()), p(t.start.getFullYear())));
  }, [t, o]), P(() => {
    N !== void 0 && a(N);
  }, [N]), P(() => {
    if (R) {
      C.current = $;
      const s = o === "single" ? d : t == null ? void 0 : t.start;
      s && (H(s.getMonth()), p(s.getFullYear())), A("date");
    }
  }, [R]), P(() => {
    z && requestAnimationFrame(() => {
      var c;
      const s = (c = tt.current) == null ? void 0 : c.querySelector(".fds-datepicker__preset-dropdown"), i = s == null ? void 0 : s.querySelector('[role="menuitem"]:not([aria-disabled="true"])');
      i == null || i.focus();
    });
  }, [z]);
  const pt = n(() => {
    R && (o === "single" ? (K(d ?? null), G(d ? f(d) : "")) : (E((t == null ? void 0 : t.start) ?? null), Y((t == null ? void 0 : t.end) ?? null), x(t != null && t.start ? f(t.start) : ""), F(t != null && t.end ? f(t.end) : ""), J(t != null && t.start ? k(t.start) : "00:00"), O(t != null && t.end ? k(t.end) : "00:00"), b(t ? 2 : 0)), y(C.current), j(null), A("date"), T(!1)), z && V(!1);
  }, [R, z, o, d, t, T, y]), yt = v(
    () => jt(
      S,
      m,
      o === "range" ? h : null,
      o === "range" ? L : null,
      o === "single" ? B : null,
      o === "range" ? g : null
    ),
    [S, m, h, L, B, g, o]
  ), Tt = v(() => zt(m), [m]), Ht = v(() => Gt(Z, S), [Z, S]), St = Pt(w, S, m, Z), Yt = n(() => {
    w === "date" ? m === 0 ? (H(11), p((s) => s - 1)) : H((s) => s - 1) : p(w === "month" ? (s) => s - 1 : (s) => s - 12);
  }, [w, m]), kt = n(() => {
    w === "date" ? m === 11 ? (H(0), p((s) => s + 1)) : H((s) => s + 1) : p(w === "month" ? (s) => s + 1 : (s) => s + 12);
  }, [w, m]), Et = n(() => {
    w === "date" ? A("month") : w === "month" && A("year");
  }, [w]), Ft = n((s) => {
    w === "year" ? (p(s.value), A("month")) : w === "month" && (H(s.value), A("date"));
  }, [w]), It = n((s) => {
    if (s.type === "outOfMonth") return;
    const i = new Date(S, m, s.date);
    o === "single" ? (K(i), G(f(i))) : _ === 0 || _ === 2 ? (E(i), Y(null), x(f(i)), F(""), b(1), y("custom")) : (i < h ? (E(i), Y(h), x(f(i)), F(f(h))) : (Y(i), F(f(i))), b(2), j(null));
  }, [S, m, o, _, h, y]), bt = n((s) => {
    y(s);
    const i = Jt(s);
    if (i) {
      E(i.start), Y(i.end), x(f(i.start)), F(f(i.end)), J(k(i.start)), O(k(i.end)), b(2), H(i.start.getMonth()), p(i.start.getFullYear());
      const c = { start: i.start, end: i.end };
      I == null || I(c), u(c), T(!1);
    }
  }, [y, I, T]), xt = n(() => {
    if (o === "single") U == null || U(B);
    else if (h && L) {
      const s = { start: h, end: L };
      I == null || I(s), u(s);
    }
    T(!1);
  }, [o, B, h, L, U, I, T]), Rt = n(() => {
    o === "single" ? (K(d ?? null), G(d ? f(d) : "")) : (E((t == null ? void 0 : t.start) ?? null), Y((t == null ? void 0 : t.end) ?? null), x(t != null && t.start ? f(t.start) : ""), F(t != null && t.end ? f(t.end) : ""), J(t != null && t.start ? k(t.start) : "00:00"), O(t != null && t.end ? k(t.end) : "00:00"), b(t ? 2 : 0)), y(C.current), j(null), A("date"), T(!1);
  }, [o, d, t, T, y]), At = n((s) => {
    o !== "range" || _ !== 1 || s.type === "outOfMonth" || j(new Date(S, m, s.date));
  }, [o, _, S, m]), qt = n(() => {
    j(null);
  }, []), Lt = n((s) => {
    const i = Ot(s);
    if (G(i), i === "") {
      K(null);
      return;
    }
    const c = l(i);
    c && (K(c), H(c.getMonth()), p(c.getFullYear()), R || T(!0));
  }, [R, T]), _t = n((s) => {
    x(s);
    const i = l(s);
    i && (E((c) => {
      const M = new Date(i);
      return c && M.setHours(c.getHours(), c.getMinutes()), M;
    }), H(i.getMonth()), p(i.getFullYear()), b(1), y("custom"));
  }, [y]), Bt = n((s) => {
    F(s);
    const i = l(s);
    if (i) {
      if (h && i < h) {
        const c = new Date(i), M = new Date(h);
        c.setHours(h.getHours(), h.getMinutes()), E(c), Y(M), x(f(c)), F(f(M));
      } else
        Y((c) => {
          const M = new Date(i);
          return c && M.setHours(c.getHours(), c.getMinutes()), M;
        });
      b(2), y("custom");
    }
  }, [h, y]), Kt = n((s) => {
    J(s);
    const i = st(s);
    i && E((c) => {
      if (!c) return c;
      const M = new Date(c);
      return M.setHours(i.hours, i.minutes), M;
    });
  }, []), Nt = n((s) => {
    O(s);
    const i = st(s);
    i && Y((c) => {
      if (!c) return c;
      const M = new Date(c);
      return M.setHours(i.hours, i.minutes), M;
    });
  }, []);
  return {
    // State
    open: R,
    setOpen: T,
    presetOpen: z,
    setPresetOpen: V,
    preset: $,
    view: w,
    // Refs
    containerRef: tt,
    closedByKeyboard: mt,
    // Calendar data
    days: yt,
    monthItems: Tt,
    yearItems: Ht,
    headerLabel: St,
    // Draft values
    draftSingle: B,
    singleInputText: nt,
    startRawText: Dt,
    endRawText: ht,
    startTimeRaw: wt,
    endTimeRaw: Mt,
    resolvedRange: ft,
    // Derived
    isApplyDisabled: o === "single" ? B === null : !(h && L && _ === 2),
    // Handlers
    closeAndRevert: pt,
    handlePrev: Yt,
    handleNext: kt,
    handleHeaderClick: Et,
    handleItemClick: Ft,
    handleDayClick: It,
    handleDayHover: At,
    handleDayHoverEnd: qt,
    handlePresetSelect: bt,
    handleApply: xt,
    handleCancel: Rt,
    handleSingleInputChange: Lt,
    handleStartDateChange: _t,
    handleEndDateChange: Bt,
    handleStartTimeChange: Kt,
    handleEndTimeChange: Nt
  };
}
export {
  Zt as useDatePickerState
};
