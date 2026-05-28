import { ensureHighchartsExport as g } from "./highchartsExportSetup.js";
const l = {
  PNG: "image/png",
  JPEG: "image/jpeg",
  SVG: "image/svg+xml"
};
function P({
  instance: o,
  engine: f,
  format: e,
  fileName: n = "chart"
}) {
  var c, u, h, S, G, a;
  if (!o) return;
  if (f === "highcharts") {
    g();
    const t = o.exporting;
    if (!t) return;
    if (e === "CSV") {
      (c = t.downloadCSV) == null || c.call(t);
      return;
    }
    if (e === "XLSX") {
      (u = t.downloadXLS) == null || u.call(t);
      return;
    }
    t.exportChart({
      type: l[e],
      filename: n
    });
    return;
  }
  const s = o, r = s.exports;
  if (r) {
    if (e === "PNG" || e === "JPEG") {
      (h = r.exportToPNG) == null || h.call(r, { filename: n });
      return;
    }
    if (e === "SVG") {
      (S = r.exportToSVG) == null || S.call(r, { filename: n });
      return;
    }
    if (e === "CSV") {
      const i = (G = s.opts) == null ? void 0 : G.series;
      Array.isArray(i) && i.length > 0 && ((a = r.exportToCSV) == null || a.call(r, { series: i, columnDelimiter: ",", filename: n }));
      return;
    }
  }
}
export {
  P as exportChart
};
