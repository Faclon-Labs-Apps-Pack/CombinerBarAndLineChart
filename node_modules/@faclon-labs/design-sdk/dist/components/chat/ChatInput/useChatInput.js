import e from "react";
const j = 200, A = 4e3;
function O(u, I) {
  return I.split(",").map((l) => l.trim()).some((l) => l.startsWith(".") ? u.name.toLowerCase().endsWith(l.toLowerCase()) : l.endsWith("/*") ? u.type.startsWith(l.slice(0, -2)) : u.type === l);
}
function X({
  value: u,
  defaultValue: I,
  onChange: i,
  onSubmit: l,
  isDisabled: _,
  accept: p,
  onFileChange: c,
  suggestions: a,
  onSuggestionAccept: v
}, $) {
  const x = e.useRef(null), T = e.useRef(null);
  e.useImperativeHandle($, () => x.current, []);
  const m = u !== void 0, [G, W] = e.useState(I ?? ""), o = m ? u ?? "" : G, d = e.useCallback(
    (t) => {
      m || W(t), i == null || i({ value: t });
    },
    [m, i]
  ), [s, k] = e.useState([]), [b, w] = e.useState(0), y = o.trim().length > 0, E = s.length > 0, D = !!_ || !y && !E, h = !y && !!(a != null && a.length), H = e.useCallback(() => {
    const t = x.current;
    t && (t.style.height = "auto", t.style.height = `${Math.min(t.scrollHeight, j)}px`);
  }, []);
  e.useEffect(() => {
    H();
  }, [o, H]), e.useEffect(() => {
    if (!a || a.length <= 1 || !h) return;
    const t = setInterval(() => {
      w((r) => (r + 1) % a.length);
    }, A);
    return () => clearInterval(t);
  }, [a, h]), e.useEffect(() => {
    w(0);
  }, [a]);
  const M = e.useCallback(() => {
    D || (l == null || l({ value: o, files: s }), d(""), k([]));
  }, [D, l, o, s, d]), L = e.useCallback(
    (t) => {
      d(t.target.value);
    },
    [d]
  ), U = e.useCallback(
    (t) => {
      if (t.key === "Enter" && !t.shiftKey) {
        t.preventDefault(), M();
        return;
      }
      if (t.key === "Tab" && h && (a != null && a.length)) {
        t.preventDefault();
        const r = a[b];
        d(r), v == null || v({ suggestion: r });
      }
    },
    [M, h, a, b, d, v]
  ), V = e.useCallback(
    (t) => {
      var f;
      const r = Array.from(((f = t.clipboardData) == null ? void 0 : f.files) ?? []);
      if (r.length === 0) return;
      t.preventDefault();
      for (const R of r)
        R.id || (R.id = `${Date.now()}${Math.floor(Math.random() * 1e6)}`);
      const n = [...s, ...r];
      k(n), c == null || c({ files: n });
    },
    [s, c]
  ), B = e.useCallback(() => {
    var t;
    (t = T.current) == null || t.click();
  }, []), K = e.useCallback(
    (t) => {
      const r = Array.from(t.target.files ?? []), n = p ? r.filter((f) => O(f, p)) : r;
      for (const f of n)
        f.id || (f.id = `${Date.now()}${Math.floor(Math.random() * 1e6)}`);
      if (n.length > 0) {
        const f = [...s, ...n];
        k(f), c == null || c({ files: f });
      }
      t.target.value = "";
    },
    [p, s, c]
  ), N = e.useCallback(
    (t) => {
      const r = s.filter((n) => n.id !== t.id);
      k(r), c == null || c({ files: r });
    },
    [s, c]
  ), P = e.useCallback((t) => {
    const r = t.target;
    r && (r.closest("textarea") || t.preventDefault());
  }, []);
  return {
    textValue: o,
    files: s,
    activeSuggestionIndex: b,
    hasText: y,
    hasFiles: E,
    isSubmitDisabled: D,
    showGhostSuggestion: h,
    textareaRef: x,
    fileInputRef: T,
    handleTextChange: L,
    handleKeyDown: U,
    handlePaste: V,
    handleSubmit: M,
    handleUploadClick: B,
    handleFileInputChange: K,
    handleFileRemove: N,
    handleInnerMouseDownCapture: P
  };
}
export {
  X as useChatInput
};
