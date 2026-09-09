import path from 'path';
import { fileURLToPath } from 'url';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS = {
  CombinedBarLineChart: './src/components/CombinedBarLineChart/index.ts',
  CombinedBarLineChartConfiguration: './src/components/CombinedBarLineChartConfiguration/index.ts',
};

const FDS_MANIFEST = process.env.FDS_MANIFEST
  || path.resolve(__dirname, '../IOSense/src/assets/react/design-sdk.subpaths.json');
let fdsSubpaths = null;
try {
  fdsSubpaths = new Set(JSON.parse(fs.readFileSync(FDS_MANIFEST, 'utf8')).subpaths);
} catch {
  console.warn(`[design-sdk] manifest not found at ${FDS_MANIFEST} — cannot verify `
    + `imported subpaths exist in the host bundle. Set FDS_MANIFEST to enable the check.`);
}

function designSdkExternal({ request }, callback) {
  const m = /^@faclon-labs\/design-sdk(?:\/(.+))?$/.exec(request || '');
  if (!m) return callback();
  const sub = m[1];
  if (sub && sub.endsWith('.css')) return callback();
  if (sub && fdsSubpaths && !fdsSubpaths.has(sub)) {
    return callback(new Error(
      `[design-sdk] '${request}' is not in the host's shared bundle.\n` +
      `  Add it by running \`npm run build:design-sdk -- --scan\` in IOSense and ` +
      `redeploying design-sdk.global.js, or import a subpath that is included.`));
  }
  return callback(null, sub ? `FDS[${JSON.stringify(sub)}]` : 'FDS.__root');
}

export default (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    mode: isProd ? 'production' : 'development',
    entry: isProd ? COMPONENTS : { app: './src/index.tsx' },
    output: {
      path: path.resolve(__dirname, isProd ? 'dist-bundle' : 'dist'),
      filename: isProd ? '[name].bundle.js' : '[name].js',
      globalObject: 'this',
      clean: true,
    },
    externals: isProd
      ? [
        designSdkExternal,
        {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-dom/client': 'ReactDOM',
          'react-dom/server': 'ReactDOMServer',
          'react/jsx-runtime': 'ReactJSXRuntime',
          'react/jsx-dev-runtime': 'ReactJSXRuntime',
          // NOTE: `highcharts` is deliberately NOT external. design-sdk's gauges
          // build their charts with `highcharts/esm/highcharts.js`, which webpack
          // bundles no matter what this list says — so externalizing the BARE
          // specifier didn't remove a copy, it ADDED a second identity (the host
          // page's `window.Highcharts`) that only `Chart/highchartsExportSetup.js`
          // ever saw. That split is what broke export: the exporting modules were
          // composed onto the host copy while `chart.exporting` was looked up on a
          // chart built by the bundled ESM copy, so it was `undefined` and the
          // SDK's `exportChart` returned silently. `resolve.alias` below now folds
          // the bare specifier into the same ESM copy — ONE Highcharts identity.
          //
          // ⚠️ SINCE design-sdk BECAME EXTERNAL this block is INERT for this
          // bundle: nothing in src/ imports highcharts directly, so webpack never
          // resolves any highcharts specifier and no copy is emitted (verify with
          // `grep -ci highcharts dist-bundle/Gauge.bundle.js`). The identity
          // decision now lives in the HOST — design-sdk.global.js resolves every
          // highcharts specifier to `window.Highcharts` and IOSense loads the
          // matching UMD module builds (HIGHCHARTS_MODULE_URLS in
          // react-loader.service.ts). Kept here because it documents the failure
          // and because the widget must not start bundling its own copy again.
          // ApexCharts must resolve to the SINGLE host copy (window.ApexCharts).
          // react-apexcharts (the engine behind the SDK's Circle / Semi-Circle
          // gauges) imports the SUBPATH specifiers `apexcharts/client` and
          // `apexcharts/core` — NOT bare `apexcharts` — so the bare-only external
          // below let webpack BUNDLE a second ApexCharts into Gauge.bundle.js
          // while the host page already had its own `window.ApexCharts`. Each
          // ApexCharts ships its own inlined svg.js, so two copies coexisted and
          // an element created by one was added to a parent owned by the other →
          // `create.addTo → ….put is not a function` on render, and a corrupted
          // half-built chart whose later `_updateOptions → clear →
          // clearDomElements` then read `.node` of an undefined Paper. Both crash
          // signatures appeared when switching between the two Apex gauge types.
          // Externalizing EVERY ApexCharts specifier to the host global collapses
          // it to ONE identity (one svg.js), which removes the conflict. Highcharts
          // has no svg.js and its dual copy is benign (all-Series boards never
          // crashed), so it is deliberately left as-is.
          apexcharts: 'ApexCharts',
          'apexcharts/client': 'ApexCharts',
          'apexcharts/core': 'ApexCharts',
        },
      ]
      : [],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      // Force a single React instance — design-sdk ships a copy of React inside
      // its own dist/node_modules which otherwise wins module resolution and
      // crashes hooks (e.g. useId returns null).
      alias: {
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime.js'),
        'react/jsx-dev-runtime': path.resolve(__dirname, 'node_modules/react/jsx-dev-runtime.js'),
        // ── ONE Highcharts identity ──────────────────────────────────────────
        // design-sdk mixes two specifier styles for the same library:
        //   - the gauges import `highcharts/esm/highcharts.js` (ESM build)
        //   - `Chart/highchartsExportSetup.js` imports bare `highcharts` plus
        //     `highcharts/modules/{exporting,export-data}` (UMD builds)
        // Left alone those resolve to different files, so webpack bundles two
        // independent Highcharts namespaces. The exporting modules then compose
        // onto the UMD one while every chart is created by the ESM one, leaving
        // `chart.exporting` undefined and every download a silent no-op.
        //
        // The UMD builds are also a load-time hazard on their own: their factory
        // reads `window._Highcharts`, a global ONLY the UMD entry sets — the ESM
        // build never does, and neither does a host that loads Highcharts from a
        // <script> tag. Pointing every specifier at the ESM build fixes both:
        // one namespace, and no `_Highcharts` global to depend on.
        // `$` = exact match, so `highcharts/esm/*` still resolves normally.
        //
        // ⚠️ Also INERT now that design-sdk is external — see the externals note.
        // Retained as the tripwire: if a future edit imports highcharts directly
        // these aliases keep it to one copy, and the guard above keeps SDK
        // components on the host's.
        highcharts$: path.resolve(__dirname, 'node_modules/highcharts/esm/highcharts.js'),
        'highcharts/modules/exporting$': path.resolve(__dirname, 'node_modules/highcharts/esm/modules/exporting.js'),
        'highcharts/modules/export-data$': path.resolve(__dirname, 'node_modules/highcharts/esm/modules/export-data.js'),
        'highcharts/modules/pattern-fill$': path.resolve(__dirname, 'node_modules/highcharts/esm/modules/pattern-fill.js'),
      },
    },
    module: {
      rules: [
        {
          // The design-sdk re-exports several files from highcharts using
          // extension-less imports (e.g. `'highcharts/modules/exporting'`).
          // Webpack 5's ESM treatment refuses those without this opt-out.
          test: /\.m?js$/,
          resolve: { fullySpecified: false },
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|webp|svg)$/i,
          type: 'asset/resource',
          generator: { filename: 'assets/[name][ext]' },
        },
      ],
    },
    plugins: [
      ...(isProd ? [new MiniCssExtractPlugin({ filename: '[name].bundle.css' })] : []),
    ],
    ...(!isProd && {
      devServer: {
        static: path.resolve(__dirname, 'public'),
        port: Number(process.env.PORT) || 3000,
        host: '0.0.0.0',
        allowedHosts: 'all',
        hot: true,
        open: false,
        historyApiFallback: true,
        client: { webSocketURL: 'auto://0.0.0.0:0/ws' },
      },
    }),
  };
};

