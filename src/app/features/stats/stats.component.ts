import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../core/services/quiz.service';
import { HistoryEntry } from '../../core/models';

interface TestGroup {
  name: string;
  sessions: HistoryEntry[];
  pct: number;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="screen active" aria-label="Estadísticas">
      <div class="stats-header">
        <h1>Estadísticas</h1>
        @if (history().length) {
          <button class="btn btn-danger" (click)="clearHistory()">Borrar historial</button>
        }
      </div>

      <div id="stats-content">
        @if (!history().length) {
          <div class="stats-empty">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6"  y1="20" x2="6"  y2="14"></line>
            </svg>
            <p>Todavía no has completado ningún test.<br>¡Empieza a practicar para ver tu progreso aquí!</p>
          </div>
        } @else {
          <div class="stats-global-grid">
            <div class="stat-kpi"><span class="kpi-val">{{ kpis().sessions }}</span><span class="kpi-lbl">Sesiones</span></div>
            <div class="stat-kpi"><span class="kpi-val">{{ kpis().preguntas }}</span><span class="kpi-lbl">Preguntas</span></div>
            <div class="stat-kpi"><span class="kpi-val">{{ kpis().pctGlobal }}%</span><span class="kpi-lbl">Acierto global</span></div>
            <div class="stat-kpi"><span class="kpi-val">{{ kpis().mejor }}%</span><span class="kpi-lbl">Mejor sesión</span></div>
          </div>

          @for (group of groups(); track group.name) {
            <div class="stats-test-group">
              <div class="stats-test-title">
                {{ group.name }}
                <span>{{ group.sessions.length }} sesión{{ group.sessions.length !== 1 ? 'es' : '' }} · {{ group.pct }}% acierto acumulado</span>
              </div>
              <div class="sessions-list">
                @for (s of group.sessions; track s.fecha) {
                  <div class="session-item">
                    <div class="session-item-header">
                      <div>
                        <div class="session-item-title">
                          {{ formatDate(s.fecha) }}{{ s.duracion ? ' · ' + formatDuration(s.duracion) : '' }}
                        </div>
                        <div class="session-item-date">{{ s.aciertos }} / {{ s.total }} preguntas correctas</div>
                      </div>
                      <span class="session-score-pill" [class]="pctClass(s)">{{ sessionPct(s) }}%</span>
                    </div>
                    <div class="session-bar-row">
                      <div class="session-bar-wrap">
                        <div class="session-bar-fill" [class]="pctClass(s)" [style.width.%]="sessionPct(s)"></div>
                      </div>
                      <span style="font-size:.8rem;color:var(--color-text-light);min-width:2.5rem;text-align:right">{{ sessionPct(s) }}%</span>
                    </div>
                    @if (abrevTemas(s).length) {
                      <div class="session-tags">
                        @for (t of abrevTemas(s); track t) {
                          <span class="session-tag">{{ t }}</span>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          }
        }
      </div>
    </section>
  `
})
export class StatsComponent implements OnInit {
  router = inject(Router);
  quiz   = inject(QuizService);

  history = signal<HistoryEntry[]>([]);
  kpis    = signal({ sessions: 0, preguntas: 0, pctGlobal: 0, mejor: 0 });
  groups  = signal<TestGroup[]>([]);

  ngOnInit(): void { this.load(); }

  load(): void {
    const h = this.quiz.getHistory();
    this.history.set(h);
    if (!h.length) return;

    const totalAciertos  = h.reduce((s, e) => s + e.aciertos, 0);
    const totalPreguntas = h.reduce((s, e) => s + e.total, 0);
    this.kpis.set({
      sessions:  h.length,
      preguntas: totalPreguntas,
      pctGlobal: totalPreguntas ? Math.round((totalAciertos / totalPreguntas) * 100) : 0,
      mejor:     h.reduce((best, e) => { const p = e.total ? Math.round((e.aciertos / e.total) * 100) : 0; return p > best ? p : best; }, 0)
    });

    const byTest: Record<string, TestGroup> = {};
    h.forEach(e => {
      if (!byTest[e.testId]) byTest[e.testId] = { name: e.testName, sessions: [], pct: 0 };
      byTest[e.testId].sessions.push(e);
    });
    this.groups.set(Object.values(byTest).map(g => {
      const a = g.sessions.reduce((s, e) => s + e.aciertos, 0);
      const t = g.sessions.reduce((s, e) => s + e.total, 0);
      return { ...g, pct: t ? Math.round((a / t) * 100) : 0 };
    }));
  }

  clearHistory(): void {
    if (!confirm('¿Eliminar todo el historial de estadísticas? Esta acción no se puede deshacer.')) return;
    this.quiz.clearHistory();
    this.load();
  }

  sessionPct(s: HistoryEntry): number {
    return s.total ? Math.round((s.aciertos / s.total) * 100) : 0;
  }

  pctClass(s: HistoryEntry): string {
    const p = this.sessionPct(s);
    return p >= 80 ? 'high' : p >= 50 ? 'medium' : 'low';
  }

  abrevTemas(s: HistoryEntry): string[] {
    return (s.temasFiltrados || []).map(t => {
      const match = t.match(/Tema\s+\d+/i);
      return match ? match[0] : t.split(':')[0].trim();
    });
  }

  formatDate(iso: string): string {
    try {
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }).format(new Date(iso));
    } catch { return iso; }
  }

  formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }
}
