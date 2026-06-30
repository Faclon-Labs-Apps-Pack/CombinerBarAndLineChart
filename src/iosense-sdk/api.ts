import { BindingEntry, DataEntry } from './types';

const API_BASE = 'https://appserver.iosense.io/api';
const GRAPH = 'iosense_test_uns';

// Optional comparison / shift inputs for resolveAndCompute. Mutually exclusive
// per the engine contract — comparison wins. When comparison* fields are present
// the API returns each entry's prior-period buckets as `comparisonSlots`
// (parallel to `slots`). When `shifts` is present (and comparison is off) the
// array is sent VERBATIM as a top-level key (id/name/color/startTime/endTime/
// enabled) — the backend echoes the shift names back in each entry's meta.shifts.
export interface ResolveExtras {
  comparisonMode?: boolean;
  comparisonStartTime?: number;
  comparisonEndTime?: number;
  shifts?: Array<Record<string, unknown>>;
}

export async function validateSSOToken(ssoToken: string): Promise<string> {
  const res = await fetch(`${API_BASE}/account/validateSSO`, {
    method: 'GET',
    headers: { token: ssoToken },
  });
  const json = await res.json();
  if (!json.success || !json.token) throw new Error('SSO validation failed');
  return json.token;
}

export async function resolveAndCompute(
  authentication: string,
  config: Array<BindingEntry>,
  startTime: number,
  endTime: number,
  timeFrame?: string,
  extras?: ResolveExtras,
): Promise<DataEntry[]> {
  const body: Record<string, unknown> = { graph: GRAPH, config, startTime, endTime };
  if (timeFrame) body.timeFrame = timeFrame;
  // Comparison and shift are mutually exclusive — comparison wins.
  if (extras?.comparisonMode && extras.comparisonStartTime != null && extras.comparisonEndTime != null) {
    // Comparison: one request returns both windows (slots + comparisonSlots).
    body.comparisonMode = true;
    body.comparisonStartTime = extras.comparisonStartTime;
    body.comparisonEndTime = extras.comparisonEndTime;
  } else if (extras?.shifts && extras.shifts.length > 0) {
    // Shift comparison: send the configured shifts array verbatim.
    body.shifts = extras.shifts;
  }
  const res = await fetch(`${API_BASE}/account/uns/resolveAndCompute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authentication}`,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  // Pass the API items through AS-IS — no reshaping. This mirrors what the
  // production Lens Data Engine hands the widget (series fields at the top
  // level of each item, scalars as { key, value }). The widget's
  // getSeriesData()/getValue() read this raw shape directly.
  return (json?.data ?? []) as DataEntry[];
}

export async function fetchUNSNodes(
  authentication: string,
  graph: string,
  label?: string,
  limit = 100,
  expandPostfix = false,
): Promise<Array<{ id: string; type: string; name?: string; path: string | null; parentId: string | null }>> {
  const params = new URLSearchParams({ graph, limit: String(limit) });
  if (label) params.set('label', label);
  if (expandPostfix) params.set('expandPostfix', 'true');
  const res = await fetch(`${API_BASE}/account/uns/nodes?${params}`, {
    headers: { Authorization: `Bearer ${authentication}` },
  });
  const json = await res.json();
  return (json?.data?.data ?? []) as Array<{
    id: string; type: string; name?: string; path: string | null; parentId: string | null;
  }>;
}
