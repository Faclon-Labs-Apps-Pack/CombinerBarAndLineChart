import { useState, useEffect, useMemo, useRef } from 'react';
import { CombinedBarLineChart } from './components/CombinerBarLineChart/CombinerBarLineChart';
import { CombinedBarLineChartConfiguration } from './components/CombinerBarLineChartConfiguration/CombinerBarLineChartConfiguration';
import { ColumnChartEnvelope, DataEntry, WidgetEvent, TimeConfig, TimeWindow, Duration } from './iosense-sdk/types';
import { validateSSOToken } from './iosense-sdk/api';
import { resolve } from './iosense-sdk/mini-engine';
import { resolveDurationWindow } from './iosense-sdk/time';
import type { TimeTabConfigurationProps } from '@faclon-labs/design-sdk/TimeTabConfiguration';
import type { GTPPreset } from '@faclon-labs/design-sdk/TimeTabConfiguration';
import '@faclon-labs/design-sdk/styles.css';
import './App.css';

// ── Mock Global Time Picker (dev only) ────────────────────────────────────────
// In prod the Lens shell registers real Global Time Pickers and injects the
// linked one's LIVE window into the engine. The single-widget dev harness has no
// sibling GTP, so we stand in a mock here: the configurator can link to it (its
// durations/cycleTime are inherited into timeConfig) and we simulate it
// "broadcasting" a window that flows straight into resolveAndCompute.
const GTP_DURATIONS: GTPPreset[] = [
  { id: 'gtp_today', label: 'Today',        calendarType: 'today', periodicities: ['Hourly'] },
  { id: 'gtp_7d',    label: 'Last 7 days',  x: 7,  xPeriod: 'day', periodicities: ['Hourly', 'Daily'] },
  { id: 'gtp_30d',   label: 'Last 30 days', x: 30, xPeriod: 'day', periodicities: ['Daily'] },
];

const MOCK_GTPS: NonNullable<TimeTabConfigurationProps['globalTimepickers']> = [
  {
    id: 'gtp-1',
    name: 'Plant Floor GTP',
    // A COMPLETE GTP: when the widget links to this in Global mode, the time tab
    // inherits ALL of these details (timezone, cycle time, durations, shifts,
    // comparison, future-days) and shows them read-only — i.e. "fetched from the
    // GTP". In production the host injects the real GTP with the same shape.
    timezone: 'Asia/Kolkata',
    allDurations: GTP_DURATIONS,
    defaultDurationId: 'gtp_7d',
    cycleTime: {
      cycleTimeType: 'financial',
      identifier: 'start',
      hour: '06',
      minute: '00',
      dayOfWeek: 1,        // Monday
      date: '1',
      month: '4',          // financial year begins in April
      year: '',
    },
    shifts: [
      { id: 'shift_a', name: 'Shift A', startTime: '06:00', endTime: '14:00', color: '#2E90FA' },
      { id: 'shift_b', name: 'Shift B', startTime: '14:00', endTime: '22:00', color: '#F79009' },
      { id: 'shift_c', name: 'Shift C', startTime: '22:00', endTime: '06:00', color: '#7A5AF8' },
    ],
    shiftAggregator: 'max',
    // GTP drives the comparison ON/OFF (inherited, read-only in the widget). On
    // so the editable deviation-pattern + Advanced per-source section shows in
    // global mode (those stay user-editable, like the local picker).
    comparisonMode: true,
    futureDaysAllowed: '0',
  },
];

// ── DEV seed envelope ─────────────────────────────────────────────────────
// Prefills the harness with a configured chart (two data sources) and
// Comparison Mode ON, so the widget renders immediately against the
// mini-engine's synthetic data — no manual configuration or auth needed.
// Editing in the configurator replaces this via onChange.
function makeSeedEnvelope(): ColumnChartEnvelope {
  const s1 = 'seed_series_1';
  const s2 = 'seed_series_2';
  // One configured duration ("Last 12 days") used by both the engine-facing
  // timeConfig and the configurator-facing timeTabConfig, so the picker resolves
  // a clean 12-bucket daily window and the two stay in sync across re-emits.
  const seedDuration = { id: 'seed_12d', label: 'Last 12 days', x: 12, xPeriod: 'day', periodicities: ['Daily'] };
  // Demo shifts (local picker) so the date picker's Shift toggle is visible.
  const seedShifts = [
    { id: 'shift_a', name: 'Shift A', startTime: '06:00', endTime: '14:00', color: '#2E90FA' },
    { id: 'shift_b', name: 'Shift B', startTime: '14:00', endTime: '22:00', color: '#F79009' },
  ];
  return {
    _id: 'seed-widget',
    type: 'ColumnChart',
    general: { title: 'Energy vs Target' },
    timeConfig: {
      timezone: 'Asia/Kolkata',
      type: 'local',
      pickerType: 'local',
      startTime: null,
      endTime: null,
      defaultDurationId: 'seed_12d',
      allDurations: [seedDuration as unknown as Duration],
      defaultPeriodicity: 'daily',
      comparisonMode: true,
      deviationPattern: 'green-up-positive',
      shifts: seedShifts,
      shiftAggregator: 'max',
    },
    // The configurator's Time tab reads its state from `timeTabConfig` (not
    // `timeConfig`). Seed it so Comparison Mode shows as ON and survives every
    // re-emit — otherwise the TimeTab's mount echo rebuilds timeConfig with
    // comparison OFF and the overlay vanishes on the first time change.
    timeTabConfig: {
      linkTimeWith: 'local',
      timezone: 'Asia/Kolkata',
      defaultDurationId: 'seed_12d',
      allDurations: [seedDuration],
      defaultPeriodicity: 'daily',
      comparisonMode: true,
      deviationPattern: 'green-up-positive',
      shifts: seedShifts,
      shiftAggregator: 'max',
    },
    uiConfig: {
      title: 'Energy vs Target',
      description: 'Demo widget — current period vs previous period with deviation.',
      charts: [
        {
          _id: 'seed_chart_1',
          title: 'Plant Energy',
          series: [
            { _id: s1, unsPath: '{{uns:ws1://plant/energy}}',     label: 'Energy (kWh)', color: '#2E90FA', chartType: 'Column', yAxis: 0 },
            { _id: s2, unsPath: '{{uns:ws1://plant/production}}', label: 'Production',    color: '#F79009', chartType: 'Line',   yAxis: 0 },
          ],
          fixedSeries: [],
          axes: [{ _id: 'axis_left', name: '', yAxis: 0, seriesIds: [s1, s2] }],
          stacks: [],
          plotLines: [],
          plotBands: [],
        },
      ],
      style: {
        card: { wrapInCard: true, bg: '' },
        stacked: false,
        showLegend: true,
        showDataLabels: false,
        yAxisUnit: '',
      },
    },
    dynamicBindingPathList: [
      { key: 'charts[0].series[0].unsPath', topic: 'uns:ws1://plant/energy',     type: 'series' },
      { key: 'charts[0].series[1].unsPath', topic: 'uns:ws1://plant/production', type: 'series' },
    ],
  };
}

// Window-relevant slice of a TimeConfig — the only fields that change what
// resolveAndCompute fetches. Style/cosmetic config edits are intentionally
// excluded so they never trigger a data refetch.
function timeCfgWindowInputs(tc?: TimeConfig) {
  if (!tc) return null;
  return {
    pickerType: tc.pickerType ?? tc.type,
    fixedDuration: tc.fixedDuration ?? null,
    defaultDurationId: tc.defaultDurationId ?? null,
    allDurations: tc.allDurations ?? [],
    cycleTime: tc.cycleTime ?? null,
    globalTimepickerId: tc.globalTimepickerId ?? null,
    startTime: tc.startTime ?? null,
    endTime: tc.endTime ?? null,
    // Periodicity drives the resolveAndCompute timeFrame, so a change must
    // re-resolve (e.g. switching a fixed duration from Daily → Hourly).
    defaultPeriodicity: tc.defaultPeriodicity ?? null,
    // Comparison Mode decides whether the engine ALSO fetches the prior-period
    // window. Toggling it must re-resolve so `comparisonData` is (re)generated —
    // otherwise enabling comparison never produces the overlay/deviation tooltip.
    comparisonMode: tc.comparisonMode ?? false,
  };
}

export default function App() {
  const [envelope, setEnvelope] = useState<ColumnChartEnvelope | undefined>(makeSeedEnvelope);
  const [data, setData] = useState<DataEntry[]>([]);
  const [comparisonData, setComparisonData] = useState<DataEntry[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [auth, setAuth] = useState<string>(localStorage.getItem('bearer_token') ?? '');
  const [timeOverride, setTimeOverride] = useState<TimeWindow | undefined>(undefined);
  // Which mock-GTP duration is currently "broadcasting" — stands in for a user
  // changing the live Global Time Picker on the dashboard.
  const [gtpBroadcastId, setGtpBroadcastId] = useState('gtp_7d');
  const widgetSize = envelope?.uiConfig.style.widgetSize ?? { width: 880, height: 400 };

  const picker = envelope?.timeConfig?.pickerType ?? envelope?.timeConfig?.type;
  const isGlobal = picker === 'global';

  // The mock GTP's current broadcast window. This is what the host feeds the
  // engine as ctx.globalTimeWindow → straight into the resolveAndCompute payload.
  const globalWindow: TimeWindow = useMemo(() => {
    const dur = GTP_DURATIONS.find((d) => d.id === gtpBroadcastId) ?? GTP_DURATIONS[1];
    const win = resolveDurationWindow(dur as unknown as Duration, Date.now(), MOCK_GTPS[0].cycleTime as TimeConfig['cycleTime']);
    return { ...win, periodicity: (dur.periodicities?.[0] ?? 'Daily').toLowerCase() };
  }, [gtpBroadcastId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ssoToken = params.get('token');
    if (ssoToken && !auth) {
      validateSSOToken(ssoToken)
        .then((jwt) => {
          if (jwt) {
            localStorage.setItem('bearer_token', jwt);
            setAuth(jwt);
            const url = new URL(window.location.href);
            url.searchParams.delete('token');
            window.history.replaceState({}, '', url.toString());
          }
        })
        .catch(console.error);
    }
  }, []);

  // Single resolve effect, gated on the DATA-relevant inputs only. Style edits,
  // tab switches and accordion toggles change the envelope but not this
  // signature, so they update the widget instantly WITHOUT a network round-trip.
  const lastDataSigRef = useRef('');
  const lastTimeCfgSigRef = useRef<string | null>(null);
  useEffect(() => {
    // No `auth` gate: the mini-engine synthesizes dummy data when the live
    // fetch is empty/unauthenticated, so the harness previews without a token.
    if (!envelope) return;
    const tc = envelope.timeConfig;
    const mode = tc?.pickerType ?? tc?.type;
    const timeCfgSig = JSON.stringify(timeCfgWindowInputs(tc));

    // Editing the time config invalidates any stale LOCAL override so the new
    // configured default takes effect in one fetch (no stale-window flash).
    let effOverride = timeOverride;
    if (timeCfgSig !== lastTimeCfgSigRef.current) {
      lastTimeCfgSigRef.current = timeCfgSig;
      if (timeOverride !== undefined) {
        effOverride = undefined;
        setTimeOverride(undefined);
      }
    }

    const gw = mode === 'global' ? globalWindow : undefined;
    const dataSig = JSON.stringify({
      bindings: envelope.dynamicBindingPathList ?? [],
      time: timeCfgSig,
      override: effOverride ?? null,
      global: gw ?? null,
      auth,
    });
    if (dataSig === lastDataSigRef.current) return;
    lastDataSigRef.current = dataSig;

    console.log('[App] resolve (data inputs changed)', { mode, override: effOverride, globalTimeWindow: gw });
    setLoading(true);
    setError(false);
    resolve(envelope, { authentication: auth, override: effOverride, globalTimeWindow: gw })
      .then(({ data: resolved, comparisonData: resolvedComparison }) => {
        console.log('[App] resolved data:', resolved, 'comparison:', resolvedComparison);
        setData(resolved);
        setComparisonData(resolvedComparison);
      })
      .catch((err) => {
        console.error('[App] resolve failed:', err);
        setData([]);
        setComparisonData(undefined);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [envelope, auth, timeOverride, globalWindow]);

  function handleEvent(event: WidgetEvent) {
    console.log('[Widget Event]', event);
    if (event.type === 'TIME_CHANGE') {
      // Only the LOCAL picker emits TIME_CHANGE; treat it as the override. When
      // the Compare panel is applied the payload also carries the comparison
      // window — pass it through so the engine resolves that exact period.
      const { comparisonStartTime, comparisonEndTime } = event.payload;
      const override: TimeWindow = {
        startTime: Number(event.payload.startTime),
        endTime: Number(event.payload.endTime),
        periodicity: event.payload.periodicity,
        ...(comparisonStartTime != null && comparisonEndTime != null
          ? { comparisonStartTime: Number(comparisonStartTime), comparisonEndTime: Number(comparisonEndTime) }
          : {}),
      };
      console.log('[App] TIME_CHANGE override', {
        main: [new Date(override.startTime).toLocaleString(), new Date(override.endTime).toLocaleString()],
        comparison: override.comparisonStartTime != null
          ? [new Date(override.comparisonStartTime).toLocaleString(), new Date(override.comparisonEndTime!).toLocaleString()]
          : '(none — engine uses preceding period)',
      });
      setTimeOverride(override);
    }
  }

  return (
    <div className="app">
      <div className="app__config">
        <CombinedBarLineChartConfiguration
          config={envelope}
          authentication={auth}
          onChange={setEnvelope}
          globalTimepickers={MOCK_GTPS}
        />
      </div>
      <div className="app__stage">
        {/* Dev-only: simulate the linked Global Time Picker broadcasting a
            different window, proving it flows into resolveAndCompute. */}
        {envelope && isGlobal && (
          <div className="app__gtp-sim">
            <span className="app__gtp-sim-label">Simulate GTP broadcast:</span>
            {GTP_DURATIONS.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`app__gtp-sim-btn${gtpBroadcastId === d.id ? ' app__gtp-sim-btn--active' : ''}`}
                onClick={() => setGtpBroadcastId(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>
        )}
        <div
          className="app__widget"
          style={envelope ? { flex: '0 0 auto', width: widgetSize.width, height: widgetSize.height } : undefined}
        >
          {envelope ? (
            <CombinedBarLineChart config={envelope.uiConfig} data={data} comparisonData={comparisonData} onEvent={handleEvent} timeConfig={envelope.timeConfig} loading={loading} error={error} />
          ) : (
            <div className="app__empty">
              <p className="BodyMediumRegular">Configure the widget in the left panel to preview it here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
