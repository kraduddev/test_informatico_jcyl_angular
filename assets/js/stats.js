/**
 * stats.js
 * Pantalla de estadísticas globales.
 * Lee quizHistory de localStorage, calcula métricas y renderiza.
 */

import { showScreen } from './navigation.js';
import { getHistory, clearHistory } from './quiz.js';

export function renderStats() {
  const history = getHistory();
  const container = document.getElementById('stats-content');

  if (!history.length) {
    container.innerHTML = `
      <div class="stats-empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6"  y1="20" x2="6"  y2="14"></line>
        </svg>
        <p>Todavía no has completado ningún test.<br>¡Empieza a practicar para ver tu progreso aquí!</p>
      </div>`;
    return;
  }

  // ── KPIs globales ──────────────────────────────────────────────────────────
  const totalSesiones  = history.length;
  const totalPreguntas = history.reduce((s, h) => s + h.total, 0);
  const totalAciertos  = history.reduce((s, h) => s + h.aciertos, 0);
  const pctGlobal      = totalPreguntas ? Math.round((totalAciertos / totalPreguntas) * 100) : 0;
  const mejorSesion    = history.reduce((best, h) => {
    const p = h.total ? Math.round((h.aciertos / h.total) * 100) : 0;
    return p > best ? p : best;
  }, 0);

  // ── Agrupar por test ───────────────────────────────────────────────────────
  const byTest = {};
  history.forEach(h => {
    if (!byTest[h.testId]) byTest[h.testId] = { name: h.testName, sessions: [] };
    byTest[h.testId].sessions.push(h);
  });

  let html = `
    <div class="stats-global-grid">
      <div class="stat-kpi">
        <span class="kpi-val">${totalSesiones}</span>
        <span class="kpi-lbl">Sesiones</span>
      </div>
      <div class="stat-kpi">
        <span class="kpi-val">${totalPreguntas}</span>
        <span class="kpi-lbl">Preguntas</span>
      </div>
      <div class="stat-kpi">
        <span class="kpi-val">${pctGlobal}%</span>
        <span class="kpi-lbl">Acierto global</span>
      </div>
      <div class="stat-kpi">
        <span class="kpi-val">${mejorSesion}%</span>
        <span class="kpi-lbl">Mejor sesión</span>
      </div>
    </div>
  `;

  // ── Sesiones por test ──────────────────────────────────────────────────────
  Object.values(byTest).forEach(({ name, sessions }) => {
    const testAciertos  = sessions.reduce((s, h) => s + h.aciertos, 0);
    const testTotal     = sessions.reduce((s, h) => s + h.total, 0);
    const testPct       = testTotal ? Math.round((testAciertos / testTotal) * 100) : 0;

    html += `
      <div class="stats-test-group">
        <div class="stats-test-title">
          ${name}
          <span>${sessions.length} sesión${sessions.length !== 1 ? 'es' : ''} · ${testPct}% acierto acumulado</span>
        </div>
        <div class="sessions-list">
          ${sessions.map(s => renderSessionItem(s)).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function renderSessionItem(s) {
  const pct      = s.total ? Math.round((s.aciertos / s.total) * 100) : 0;
  const cls      = pct >= 80 ? 'high' : pct >= 50 ? 'medium' : 'low';
  const fechaStr = formatDate(s.fecha);
  const durStr   = s.duracion ? formatDuration(s.duracion) : null;

  // Abreviar temas para no colapsar la UI
  const temasAbrev = (s.temasFiltrados || []).map(t => {
    const match = t.match(/Tema\s+\d+/i);
    return match ? match[0] : t.split(':')[0].trim();
  });

  return `
    <div class="session-item">
      <div class="session-item-header">
        <div>
          <div class="session-item-title">${fechaStr}${durStr ? ` · ${durStr}` : ''}</div>
          <div class="session-item-date">${s.aciertos} / ${s.total} preguntas correctas</div>
        </div>
        <span class="session-score-pill ${cls}">${pct}%</span>
      </div>
      <div class="session-bar-row">
        <div class="session-bar-wrap">
          <div class="session-bar-fill ${cls}" style="width:${pct}%"></div>
        </div>
        <span style="font-size:.8rem;color:var(--color-text-light);min-width:2.5rem;text-align:right">${pct}%</span>
      </div>
      ${temasAbrev.length ? `
        <div class="session-tags">
          ${temasAbrev.map(t => `<span class="session-tag">${t}</span>`).join('')}
        </div>` : ''}
    </div>
  `;
}

export function handleClearHistory() {
  if (!confirm('¿Eliminar todo el historial de estadísticas? Esta acción no se puede deshacer.')) return;
  clearHistory();
  renderStats();
}

// ── Utilidades de formato ──────────────────────────────────────────────────────

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(iso));
  } catch { return iso; }
}

function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

