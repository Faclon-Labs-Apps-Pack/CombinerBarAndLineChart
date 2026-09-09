// Highcharts' own submodule files (`highcharts/modules/pattern-fill`,
// `exporting`, etc. — bundled normally in production since webpack.config.js
// only externalizes the bare `highcharts` specifier, not its submodules) are
// UMD-wrapped. When bundled via a CJS/webpack path, that wrapper reads its
// Highcharts reference from the underscore-prefixed `window._Highcharts`, NOT
// `window.Highcharts` — and composes its patches (e.g. `PatternFill.compose`,
// which extends `SVGRenderer`/`Chart`/`Series` prototypes) against WHATEVER
// instance `_Highcharts` pointed to at that exact module-evaluation moment.
// If that isn't the SAME instance actually used to render our charts
// (`window.Highcharts`, per webpack's externals), the composed patches land
// on a disconnected prototype chain our charts never see — patterns silently
// fall back to a flat fill color, deviceless of any error. This is exactly the
// Comparison-mode bug: the dashed pattern-fill "compare" bars render as flat
// bars because pattern-fill's compose ran against the wrong instance.
//
// Forcing the assignment unconditionally — instead of only when missing —
// realigns `_Highcharts` to the SAME instance our own charts actually render
// with, regardless of whatever a host may have independently set it to first
// (a live host was found where `window._Highcharts` is already a separate,
// disconnected instance). `window.Highcharts` is the one guaranteed-shared
// instance per the host contract (every widget on the page renders through
// it), so redirecting the private alias to match it is correct for any other
// widget relying on this same undocumented convention too.
//
// This file has NO imports of its own and must be the FIRST import in the
// production entry point (src/components/CombinedBarLineChart/index.ts) — ES
// module evaluation resolves each import's full dependency subtree before
// moving to the next sibling import, so a zero-dependency first import is
// guaranteed to run before any `@faclon-labs/design-sdk` (and therefore any
// Highcharts submodule) code executes. Placing this inside the widget .tsx
// (after its own design-sdk imports) is too late.
if (typeof window !== 'undefined') {
  const w = window as unknown as { Highcharts?: unknown; _Highcharts?: unknown };
  if (w.Highcharts) {
    w._Highcharts = w.Highcharts;
  }
}
