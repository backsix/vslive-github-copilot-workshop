function showError(container, msg) {
  container.innerHTML = "<div class=\"error\">" + msg + "</div>";
  console.warn('Battle UI error:', msg);
}
function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.textContent = loading ? 'Loading…' : 'Battle';
  if (loading) btn.classList.add('loading'); else btn.classList.remove('loading');
}
async function fetchContrib(username) {
  console.debug('Fetching contributions for', username);
  const resp = await fetch(`/api/contributions/${encodeURIComponent(username)}`);
  if (!resp.ok) {
    let body = null;
    try { body = await resp.json(); } catch (_) { body = await resp.text(); }
    console.error('Upstream fetch failed', username, resp.status, body);
    throw new Error((body && body.error) || `Upstream error (${resp.status})`);
  }
  const wrapper = await resp.json();
  if (wrapper && wrapper.data) {
    console.debug('Received wrapper data for', username, 'weeks=', wrapper.data.weeks?.length);
    return wrapper.data;
  }
  console.debug('Received direct data for', username, 'weeks=', wrapper.weeks?.length);
  return wrapper;
}
// tooltip element (lazy-created)
let __battle_tooltip = null;
function ensureTooltip() {
  if (__battle_tooltip) return __battle_tooltip;
  const t = document.createElement('div');
  t.className = 'contrib-tooltip';
  t.style.position = 'fixed';
  t.style.zIndex = '9999';
  t.style.pointerEvents = 'none';
  t.style.display = 'none';
  document.body.appendChild(t);
  __battle_tooltip = t;
  return t;
}
function showTooltip(ev, text) {
  try {
    const t = ensureTooltip();
    t.textContent = text;
    t.style.display = 'block';
    positionTooltip(ev);
  } catch (e) { console.error('showTooltip error', e); }
}
function positionTooltip(ev) {
  const t = __battle_tooltip;
  if (!t) return;
  const pad = 12;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // set to top-left first so getBoundingClientRect measures correctly
  t.style.left = '0px';
  t.style.top = '0px';
  const rect = t.getBoundingClientRect();
  let x = ev.clientX + pad;
  let y = ev.clientY + pad;
  if (x + rect.width > vw) x = ev.clientX - rect.width - pad;
  if (y + rect.height > vh) y = ev.clientY - rect.height - pad;
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  t.style.left = x + 'px';
  t.style.top = y + 'px';
}
function hideTooltip() {
  if (!__battle_tooltip) return;
  __battle_tooltip.style.display = 'none';
}

function renderGrid(data) {
  const grid = document.createElement('div');
  grid.className = 'contrib-grid';
  const palette = data.colors_full && data.colors_full.length ? data.colors_full : ['#ebedf0','#9be9a8','#40c463','#30a14e','#216e39'];

  if (!data || !Array.isArray(data.weeks) || data.weeks.length === 0) {
    const note = document.createElement('div');
    note.className = 'error';
    note.textContent = 'No contribution data available.';
    grid.appendChild(note);
    return grid;
  }

  let cellCount = 0;
  for (const week of data.weeks) {
    if (!week || !Array.isArray(week.contribution_days)) continue;
    for (const day of week.contribution_days) {
      const cell = document.createElement('div');
      cell.className = 'day';
      const level = Math.max(0, Math.min(palette.length - 1, day.level == null ? 0 : day.level));
      cell.style.background = palette[level];
      // store data attributes for a custom tooltip (avoid native title tooltip)
      cell.dataset.date = week.first_day;
      cell.dataset.weekday = String(day.weekday);
      cell.dataset.count = String(day.count);
      // attach tooltip handlers
      cell.addEventListener('mouseenter', (ev) => showTooltip(ev, `${cell.dataset.date}: ${cell.dataset.count} contributions`));
      cell.addEventListener('mouseleave', hideTooltip);
      cell.addEventListener('mousemove', positionTooltip);
      grid.appendChild(cell);
      cellCount++;
    }
  }
  console.debug('Rendered grid with cells=', cellCount);
  return grid;
}
function renderPlayerPanel(username, data) {
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
function initBattle() {
  const btn = document.querySelector('.battle-button');
  const p1 = document.getElementById('player1');
  const p2 = document.getElementById('player2');
  const results = document.getElementById('results');
  if (!btn || !p1 || !p2 || !results) {
    console.error('Battle UI missing elements', { btn: !!btn, p1: !!p1, p2: !!p2, results: !!results });
    return;
  }
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
      console.debug('Fetched both contributions', { u1, weeks1: d1.weeks?.length, u2, weeks2: d2.weeks?.length });
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
    } catch (err) {
      console.error('Battle error', err);
      showError(results, String(err && err.message || err));
    } finally {
      setLoading(btn, false);
    }
  }
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    doBattle();
  });
  [p1, p2].forEach(function (inp) {
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        doBattle();
      }
    });
  });
}
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', function () {
    try { initBattle(); } catch (e) { console.error('initBattle failed', e); }
  });
}
