interface ContributionDay { weekday: number; count: number; level: number }
interface Week { index: number; first_day: string; contribution_days: ContributionDay[] }
interface ContributionsData {
  schema: string;
  generated_at: string;
  from: string;
  to: string;
  range_days: number;
  total_contributions: number;
  private_contributions_included: boolean;
  colors_full: string[];
  weeks: Week[];
  months?: any[];
}

type ApiWrapper = { username: string; generated_at: string; cached: boolean; data: ContributionsData } | ContributionsData;

function $<T extends HTMLElement>(sel: string) {
  return document.querySelector(sel) as T | null;
}

function showError(container: HTMLElement, msg: string) {
  container.innerHTML = `<div class="error">${msg}</div>`;
}

function setLoading(btn: HTMLButtonElement, loading: boolean) {
  btn.disabled = loading;
  btn.textContent = loading ? 'Loading…' : 'Battle';
}

async function fetchContrib(username: string): Promise<ContributionsData> {
  const resp = await fetch(`/api/contributions/${encodeURIComponent(username)}`);
  if (!resp.ok) {
    let body: any = null;
    try { body = await resp.json(); } catch (_) { body = await resp.text(); }
    throw new Error(body?.error || `Upstream error (${resp.status})`);
  }
  const wrapper: ApiWrapper = await resp.json();
  // API returns { username, generated_at, cached, data } — handle both shapes
  if ((wrapper as any).data) return (wrapper as any).data as ContributionsData;
  return wrapper as ContributionsData;
}

function renderGrid(data: ContributionsData) {
  const grid = document.createElement('div');
  grid.className = 'contrib-grid';

  // Prepare palette (levels map to colors_full indexes)
  const palette = data.colors_full && data.colors_full.length ? data.colors_full : ['#ebedf0','#9be9a8','#40c463','#30a14e','#216e39'];

  // GitHub structure: weeks array; each week has 7 contribution_days; render column-major (weeks as columns)
  for (const week of data.weeks) {
    for (const day of week.contribution_days) {
      const cell = document.createElement('div');
      cell.className = 'day';
      const level = Math.max(0, Math.min(palette.length - 1, day.level ?? 0));
      cell.style.background = palette[level];
      cell.title = `${week.first_day} (weekday ${day.weekday}): ${day.count}`;
      grid.appendChild(cell);
    }
  }
  return grid;
}

function renderPlayerPanel(username: string, data: ContributionsData) {
  const panel = document.createElement('div');
  panel.className = 'player-panel';

  const header = document.createElement('div');
  header.className = 'player-header';
  const h = document.createElement('h3');
  h.textContent = username;
  const meta = document.createElement('div');
  meta.className = 'player-meta';
  meta.textContent = `${data.total_contributions} contributions · ${data.from} → ${data.to}`;

  header.appendChild(h);
  header.appendChild(meta);

  const grid = renderGrid(data);

  panel.appendChild(header);
  panel.appendChild(grid);
  return panel;
}

export function initBattle() {
  const btn = document.querySelector('.battle-button') as HTMLButtonElement | null;
  const p1 = document.getElementById('player1') as HTMLInputElement | null;
  const p2 = document.getElementById('player2') as HTMLInputElement | null;
  const results = document.getElementById('results') as HTMLElement | null;
  if (!btn || !p1 || !p2 || !results) return;

  async function doBattle() {
    const u1 = p1.value.trim();
    const u2 = p2.value.trim();
    if (!u1 || !u2) {
      showError(results, 'Both usernames are required.');
      return;
    }

    results.innerHTML = '';
    setLoading(btn, true);

    try {
      const [d1, d2] = await Promise.all([fetchContrib(u1), fetchContrib(u2)]);

      // Build layout: left panel, vs badge, right panel
      const wrapper = document.createElement('div');
      wrapper.className = 'battle-results';

      const left = renderPlayerPanel(u1, d1);
      const right = renderPlayerPanel(u2, d2);

      const vs = document.createElement('div');
      vs.className = 'vs-badge';
      vs.textContent = 'VS';

      wrapper.appendChild(left);
      wrapper.appendChild(vs);
      wrapper.appendChild(right);

      results.appendChild(wrapper);
    } catch (err: any) {
      showError(results, String(err?.message || err));
    } finally {
      setLoading(btn, false);
    }
  }

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    doBattle();
  });

  [p1, p2].forEach((inp) => {
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        doBattle();
      }
    });
  });
}

// Auto-init if loaded in browser
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    try { initBattle(); } catch (e) { /* ignore */ }
  });
}
