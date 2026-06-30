import { ColumnChartEnvelope, ColumnChartUIConfig, DataEntry, SeriesPayload, TimeConfig, TimeWindow } from './types';
import { resolveAndCompute } from './api';
import { resolveDurationWindow } from './time';

// Maps widget periodicity values → timeFrame string expected by resolveAndCompute.
// Accepts both the widget's enum form (hourly/daily/…) and the raw cycle form
// (hour/day/…) so the fixed duration's configured periodicity resolves too.
const PERIODICITY_TIME_FRAME: Record<string, string> = {
  minute:  'minute',
  hour:    'hour',  hourly:  'hour',
  day:     'day',   daily:   'day',
  week:    'week',  weekly:  'week',
  month:   'month', monthly: 'month',
};

// ── DEV-ONLY synthetic data ──────────────────────────────────────────────
// In the dev harness there is often no backend/auth, so `resolveAndCompute`
// returns nothing and the chart stays empty. When that happens we synthesize
// plausible series for each configured binding so the widget (and Comparison
// Mode in particular) can be previewed. Set MOCK_WHEN_EMPTY = false to disable.
const MOCK_WHEN_EMPTY = true;
const DUMMY_BUCKETS = 12;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatBucketLabel(ts: number, timeFrame: string): string {
  const d = new Date(ts);
  if (timeFrame === 'minute') return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  if (timeFrame === 'hour')   return `${String(d.getHours()).padStart(2, '0')}:00`;
  if (timeFrame === 'month')  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  if (timeFrame === 'week')   return `Wk ${MONTHS[d.getMonth()]} ${d.getDate()}`;
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

// Deterministic synthetic series — `phase`/`scale` differ between the current
// and comparison windows so the ▲/▼ deviation varies in sign and magnitude.
function makeDummyData(
  bindings: { key: string; topic: string }[],
  startTime: number,
  endTime: number,
  timeFrame: string,
  phase: number,
  scale: number,
): DataEntry[] {
  const span = Math.max(1, endTime - startTime);
  const step = span / DUMMY_BUCKETS;
  return bindings.map((b, bi) => {
    const base = 60 + bi * 28;
    const slots = Array.from({ length: DUMMY_BUCKETS }, (_, i) => {
      const from = Math.round(startTime + i * step);
      const to   = Math.round(startTime + (i + 1) * step);
      const wave = Math.sin(i / 1.7 + bi * 0.9 + phase) * 22 + Math.cos(i / 3.1 + phase) * 10;
      return {
        from, to,
        label: formatBucketLabel(from, timeFrame),
        value: Math.round((base + wave) * scale * 10) / 10,
        quality: 'good',
      };
    });
    return { key: b.key, path: b.topic, range: { from: startTime, to: endTime }, slots };
  });
}

// True when at least one entry carries a non-null slot value (i.e. real data).
// Used to decide whether the dev fallback should synthesize — this also covers
// the case where the backend returns entries but with all-null values (e.g. no
// data for the prior comparison window), which would otherwise leave the
// comparison series empty and suppress the ▲/▼ deviation tooltip.
function hasValues(entries?: DataEntry[]): boolean {
  return Array.isArray(entries) && entries.some(
    (e) => Array.isArray(e.slots) && e.slots.some((s) => s.value != null),
  );
}

interface MiniEngineCtx {
  authentication: string;
  // Local picker emit (intent override). Honored only in `local` mode.
  override?: TimeWindow;
  // The linked Global Time Picker's live broadcast window, injected by the host
  // (Lens Intent Router in prod, App.tsx in dev). Honored only in `global` mode
  // and flows straight into the resolveAndCompute payload.
  globalTimeWindow?: TimeWindow;
}

export async function resolve(
  envelope: ColumnChartEnvelope,
  ctx: MiniEngineCtx,
): Promise<{ config: ColumnChartUIConfig; data: DataEntry[]; comparisonData?: DataEntry[] }> {
  const { startTime, endTime, periodicity } = computeWindow(envelope, ctx);
  const bindings = envelope.dynamicBindingPathList ?? [];

  if (bindings.length === 0) return { config: envelope.uiConfig, data: [] };

  const UNS_TOPIC_RE = /^uns:[^/]+:\/\//;
  const validBindings = bindings.filter(({ topic }) => {
    if (!UNS_TOPIC_RE.test(topic)) {
      console.error(
        `[MiniEngine] Invalid topic format: "${topic}". ` +
        `Expected "uns:wsId://path". ` +
        `Check that Angular's resolveUNSValue returns {{uns:wsId://path}} ` +
        `and that this.meta is keyed by workspace NAME.`
      );
      return false;
    }
    return true;
  });

  if (validBindings.length === 0 && bindings.length > 0) {
    // Dev fallback: topics aren't in `uns:` form (e.g. raw paths typed in the
    // harness) — still synthesize data so the widget can be previewed.
    if (MOCK_WHEN_EMPTY) {
      const tf = PERIODICITY_TIME_FRAME[(periodicity ?? 'daily').toLowerCase()] ?? 'day';
      const data = makeDummyData(bindings, startTime, endTime, tf, 0, 1);
      const comparisonData = envelope.timeConfig?.comparisonMode
        ? makeDummyData(bindings, startTime - Math.max(0, endTime - startTime), startTime, tf, 0.6, 0.88)
        : undefined;
      return { config: envelope.uiConfig, data, comparisonData };
    }
    return { config: envelope.uiConfig, data: [] };
  }

  try {
    // Default to a daily timeFrame when no periodicity is resolved — this
    // matches the widget's periodicity selector, which defaults to "Daily".
    // (Without this the backend falls back to hourly, so the chart shows hourly
    // buckets while the selector says "Daily".)
    const timeFrame =
      PERIODICITY_TIME_FRAME[(periodicity ?? 'daily').toLowerCase()] ?? 'day';

    const bindingsPayload = validBindings.map((binding) =>
      'type' in binding && binding.type === 'series'
        ? { key: binding.key, topic: binding.topic, type: 'series' as const }
        : { key: binding.key, topic: binding.topic },
    );

    // Comparison mode: resolve the comparison window the widget overlays for the
    // ▲/▼ deviation. The window is whatever the date picker's Compare panel chose
    // (Previous period / Same period last year / Custom), passed through
    // ctx.override; otherwise default to the immediately-preceding equivalent
    // window (same length, ending where the current window starts). The backend
    // returns BOTH windows in ONE call — slots (current) + comparisonSlots
    // (prior) per entry — so we request comparison inline rather than refetching.
    const comparisonMode = Boolean(envelope.timeConfig?.comparisonMode);
    let compStart = 0;
    let compEnd = 0;
    if (comparisonMode) {
      const span = Math.max(0, endTime - startTime);
      const ov = ctx.override;
      const hasExplicit = ov?.comparisonStartTime != null && ov?.comparisonEndTime != null;
      compStart = hasExplicit ? ov!.comparisonStartTime! : startTime - span;
      compEnd   = hasExplicit ? ov!.comparisonEndTime!   : startTime;
      console.log('[MiniEngine] comparison window', {
        source: hasExplicit ? 'date-picker Compare panel' : 'default preceding period',
        window: [new Date(compStart).toLocaleString(), new Date(compEnd).toLocaleString()],
      });
    }

    // Comparison and shift are mutually exclusive — comparison wins. When shift
    // comparison is active (comparison off + shifts configured) the engine sends
    // the configured `shifts` array verbatim per the SDK contract.
    const shifts = envelope.timeConfig?.shifts;
    const extras = comparisonMode
      ? { comparisonMode: true, comparisonStartTime: compStart, comparisonEndTime: compEnd }
      : (shifts && shifts.length > 0
          ? { shifts: shifts as unknown as Array<Record<string, unknown>> }
          : undefined);
    if (extras && 'shifts' in extras) {
      console.log('[MiniEngine] shift comparison — sending shifts verbatim', extras.shifts);
    }

    let items: DataEntry[] = [];
    if (ctx.authentication) {
      try {
        items = await resolveAndCompute(
          ctx.authentication, bindingsPayload, startTime, endTime, timeFrame, extras,
        );
      } catch {
        items = [];
      }
    }
    // Dev fallback: no backend data (or no auth, or all-null) → synthesize.
    if (MOCK_WHEN_EMPTY && !hasValues(items)) {
      items = makeDummyData(bindingsPayload, startTime, endTime, timeFrame, 0, 1);
    }

    // Split the prior-period buckets the API returned (entry.comparisonSlots)
    // into a parallel comparisonData: DataEntry[] the widget overlays. Labels on
    // comparisonSlots can be blank, so backfill from the same-index current
    // bucket (equal bucket count) for the tooltip's "vs <date>" footer.
    let comparisonData: DataEntry[] | undefined;
    if (comparisonMode) {
      comparisonData = items.map((e) => ({
        ...e,
        slots: (e.comparisonSlots ?? []).map((s, i) => ({
          ...s,
          label: s.label || e.slots?.[i]?.label || '',
        })),
        comparisonSlots: undefined,
        range: { from: compStart, to: compEnd },
      }));
      // Dev fallback: when the live fetch was empty/unauthenticated (so `items`
      // is synthetic and carried no comparisonSlots) synthesize the comparison
      // window too, so the deviation tooltip still has something to compute.
      if (MOCK_WHEN_EMPTY && !hasValues(comparisonData)) {
        comparisonData = makeDummyData(bindingsPayload, compStart, compEnd, timeFrame, 0.6, 0.88);
      }
    }

    // Pass resolveAndCompute items through AS-IS (raw shape) — same as the
    // production Lens Data Engine. No reshaping/wrapping here.
    return { config: envelope.uiConfig, data: items, comparisonData };
  } catch {
    return { config: envelope.uiConfig, data: [] };
  }
}

export function getSeriesData(key: string, data: DataEntry[]): SeriesPayload | null {
  const entry = data.find((d) => d.key === key);
  if (!entry) return null;
  // Raw API item: series fields live at the top level of the entry.
  if (Array.isArray(entry.slots)) {
    return {
      __type: 'series',
      path: entry.path ?? '',
      meta: entry.meta as SeriesPayload['meta'],
      range: entry.range ?? { from: 0, to: 0 },
      slots: entry.slots,
    };
  }
  // Backward-compat: wrapped DataEntry where value is a SeriesPayload.
  const v = entry.value;
  if (v !== null && typeof v === 'object' && (v as SeriesPayload).__type === 'series') {
    return v as SeriesPayload;
  }
  return null;
}

// Resolve the configured "default duration" of a time config to a window.
// Used as the seed/fallback for local + global modes.
function defaultDurationWindow(timeConfig: TimeConfig, now: number): TimeWindow {
  const dur = timeConfig.allDurations?.find((d) => d.id === timeConfig.defaultDurationId);
  if (dur) {
    return { ...resolveDurationWindow(dur, now, timeConfig.cycleTime), periodicity: timeConfig.defaultPeriodicity };
  }
  return { startTime: now - 86_400_000, endTime: now, periodicity: timeConfig.defaultPeriodicity };
}

// The single window that feeds resolveAndCompute. One owner per picker mode:
//
//   fixed   → the configured set-duration (time tab). Locked: neither the local
//             override nor a global window can shadow it.
//   global  → the linked Global Time Picker's live window (ctx.globalTimeWindow,
//             injected by the host). Falls back to the inherited default
//             duration when no live window is available (e.g. dev before the
//             GTP broadcasts). The local override is ignored — the GTP owns time.
//   local   → the widget's own picker emit (ctx.override) wins; otherwise the
//             configured default duration seeds the window.
//
// This mirrors the platform resolution priority: fixed is absolute; otherwise
// the externally-controlled window (global) or the widget-controlled window
// (local override) wins over the persisted envelope default.
function computeWindow(
  envelope: ColumnChartEnvelope,
  ctx: { override?: TimeWindow; globalTimeWindow?: TimeWindow },
): TimeWindow {
  const { timeConfig } = envelope;
  const now = Date.now();

  if (!timeConfig) {
    // No time config at all → engine safety-net 24h window.
    return ctx.override ?? { startTime: now - 86_400_000, endTime: now };
  }

  const picker = timeConfig.pickerType ?? timeConfig.type;

  // 1. Fixed picker — purely the configured set-duration. Runs first so a stale
  //    override or an injected global window can never shadow it.
  if (picker === 'fixed') {
    if (timeConfig.fixedDuration) {
      const win = resolveDurationWindow(timeConfig.fixedDuration, now, timeConfig.cycleTime);
      return { ...win, periodicity: timeConfig.defaultPeriodicity };
    }
    // Legacy absolute fixed window.
    if (timeConfig.startTime && timeConfig.endTime) {
      return { startTime: timeConfig.startTime, endTime: timeConfig.endTime, periodicity: timeConfig.defaultPeriodicity };
    }
    return defaultDurationWindow(timeConfig, now);
  }

  // 2. Global picker — the linked GTP's live broadcast window (host-injected).
  //    Falls back to the inherited default duration. The local override is
  //    intentionally ignored: in global mode the widget has no local picker.
  if (picker === 'global') {
    if (ctx.globalTimeWindow) return ctx.globalTimeWindow;
    return defaultDurationWindow(timeConfig, now);
  }

  // 3. Local picker — the widget's own picker emit wins over the default.
  if (ctx.override) return ctx.override;
  // Legacy absolute fixed window kept for back-compat with old `type: 'fixed'`.
  if (timeConfig.type === 'fixed' && timeConfig.startTime && timeConfig.endTime) {
    return { startTime: timeConfig.startTime, endTime: timeConfig.endTime, periodicity: timeConfig.defaultPeriodicity };
  }
  return defaultDurationWindow(timeConfig, now);
}
