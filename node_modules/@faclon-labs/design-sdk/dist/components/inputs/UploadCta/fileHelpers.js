const o = {
  xlsx: "xlsx",
  xls: "xlsx",
  csv: "csv",
  pdf: "pdf",
  doc: "docx",
  docx: "docx",
  png: "png",
  jpg: "jpg",
  jpeg: "jpg",
  gif: "png",
  webp: "png",
  svg: "svg",
  json: "json"
}, i = /* @__PURE__ */ new Set(["png", "jpg", "jpeg", "gif", "webp", "svg"]), c = /* @__PURE__ */ new Set(["txt", "json", "csv", "md", "log", "xml", "yml", "yaml"]);
function d(e) {
  return !Number.isFinite(e) || e < 0 ? "0 B" : e < 1024 ? `${e} B` : e < 1024 * 1024 ? `${Math.round(e / 1024)} KB` : e < 1024 * 1024 * 1024 ? `${(e / (1024 * 1024)).toFixed(1)} MB` : `${(e / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
function r(e) {
  const n = e.lastIndexOf(".");
  return n === -1 ? "" : e.slice(n + 1).toLowerCase();
}
function p(e) {
  return o[r(e)] ?? "xyz";
}
function s(e) {
  const n = e.type.toLowerCase();
  if (n.startsWith("image/")) return "image";
  if (n === "application/pdf") return "pdf";
  if (n.startsWith("text/") || n === "application/json") return "text";
  const t = r(e.name);
  return i.has(t) ? "image" : t === "pdf" ? "pdf" : c.has(t) ? "text" : "unsupported";
}
function u(e, n) {
  return e.id ?? `${e.name}-${e.lastModified}-${n}`;
}
function a(e) {
  const n = URL.createObjectURL(e), t = document.createElement("a");
  t.href = n, t.download = e.name, document.body.appendChild(t), t.click(), t.remove(), URL.revokeObjectURL(n);
}
export {
  p as deriveFileTypeFromName,
  u as ensureFileId,
  d as formatFileSize,
  s as previewKindFor,
  a as triggerDownload
};
