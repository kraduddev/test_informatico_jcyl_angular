import { Component, OnInit, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../core/services/quiz.service';

interface TopicStat {
  tema: string;
  ok: number;
  total: number;
  pct: number;
  cls: string;
}

interface WrongItem {
  enunciado: string;
  correctaText: string;
  explicacion: string;
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="screen active" aria-label="Resultados">
      <div class="results-hero">
        <div class="score-circle" [class]="scoreClass()">{{ pct() }}%</div>
        <p class="results-message">{{ message() }}</p>
      </div>

      <div class="results-meta">
        <div class="results-meta-item">
          <span class="badge-correct">{{ quiz.aciertos() }}</span>
          <span>Correctas</span>
        </div>
        <div class="results-meta-item">
          <span class="badge-wrong">{{ quiz.fallos() }}</span>
          <span>Incorrectas</span>
        </div>
        <div class="results-meta-item">
          <span class="badge-blank">{{ quiz.blancos() }}</span>
          <span>En blanco</span>
        </div>
        <div class="results-meta-item">
          <span>{{ quiz.queue().length }}</span>
          <span>Total</span>
        </div>
      </div>

      @if (topicStats().length) {
        <table class="topics-results-table">
          <thead>
            <tr><th>Tema</th><th>✓</th><th>✗</th><th>%</th></tr>
          </thead>
          <tbody>
            @for (row of topicStats(); track row.tema) {
              <tr>
                <td>{{ row.tema }}</td>
                <td class="badge-correct">{{ row.ok }}</td>
                <td class="badge-wrong">{{ row.total - row.ok }}</td>
                <td>
                  <div style="display:flex;align-items:center;gap:.5rem">
                    <div class="mini-bar-wrap">
                      <div class="mini-bar-fill" [class]="row.cls" [style.width.%]="row.pct"></div>
                    </div>
                    <span style="font-size:.8rem;font-weight:700">{{ row.pct }}%</span>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }

      <div class="results-actions">
        <button class="btn btn-ghost" (click)="router.navigate(['/tests'])">← Volver a tests</button>
        <button class="btn btn-ghost" (click)="router.navigate(['/stats'])">📊 Estadísticas</button>
        <button class="btn btn-primary" (click)="retry()">Repetir test</button>
      </div>

      @if (wrongItems().length) {
        <div class="wrong-answers-section">
          <h3>Repaso de errores</h3>
          @for (item of wrongItems(); track item.enunciado) {
            <div class="wrong-answer-item">
              <p class="wa-question">{{ item.enunciado }}</p>
              <p class="wa-correct-answer">✓ Respuesta correcta: {{ item.correctaText }}</p>
              @if (item.explicacion) {
                <p class="wa-explanation">{{ item.explicacion }}</p>
              }
            </div>
          }
        </div>
      }
    </section>
  `
})
export class ResultsComponent implements OnInit {
  router = inject(Router);
  quiz   = inject(QuizService);

  pct = computed(() => this.quiz.calcScore(this.quiz.aciertos(), this.quiz.fallos(), this.quiz.queue().length));
  scoreClass = computed(() => 'score-circle ' + this.quiz.scoreClass(this.pct()));
  message = computed(() => {
    const p = this.pct();
    if (p >= 80) return '¡Excelente resultado! Sigue así. 🎉';
    if (p >= 60) return 'Buen trabajo. Repasa los fallos y vuelve a intentarlo.';
    if (p >= 40) return 'Puedes mejorar. Revisa los temas con más fallos.';
    return 'Sigue practicando. ¡Con constancia lo consigues!';
  });

  topicStats = computed<TopicStat[]>(() => {
    const queue   = this.quiz.queue();
    const answers = this.quiz.answers();
    const map: Record<string, { ok: number; total: number }> = {};
    queue.forEach((q, i) => {
      if (!map[q.tema]) map[q.tema] = { ok: 0, total: 0 };
      map[q.tema].total++;
      if (answers[i]?.result === 'correct') map[q.tema].ok++;
    });
    return Object.entries(map)
      .map(([tema, s]) => {
        const pct = Math.round((s.ok / s.total) * 100);
        return { tema, ...s, pct, cls: pct >= 80 ? 'high' : pct >= 50 ? 'medium' : 'low' };
      })
      .sort((a, b) => b.pct - a.pct);
  });

  wrongItems = computed<WrongItem[]>(() => {
    const queue   = this.quiz.queue();
    const answers = this.quiz.answers();
    return queue
      .map((q, i) => ({ q, a: answers[i] }))
      .filter(({ a }) => a?.result === 'wrong')
      .map(({ q }) => ({
        enunciado:    q.enunciado,
        correctaText: q.opciones.find(o => o.key === q.respuesta_correcta)?.text ?? q.respuesta_correcta,
        explicacion:  q.explicacion
      }));
  });

  ngOnInit(): void {
    if (!this.quiz.queue().length) {
      this.router.navigate(['/tests']);
    }
  }

  retry(): void {
    this.quiz.retryQuiz();
    this.router.navigate(['/quiz']);
  }
}
