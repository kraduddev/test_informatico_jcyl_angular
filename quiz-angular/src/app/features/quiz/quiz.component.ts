import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../core/services/quiz.service';
import { QueueItem } from '../../core/models';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="screen active" aria-label="Quiz">
      <div class="quiz-topbar">
        <span class="quiz-progress-text">{{ quiz.currentIndex() + 1 }} / {{ quiz.queue().length }}</span>
        <span class="quiz-score-badge">✓ {{ quiz.aciertos() }}  ✗ {{ quiz.fallos() }}</span>
        <button class="btn btn-ghost" (click)="quit()">✕ Salir</button>
      </div>

      <div class="progress-bar-wrap">
        <div class="progress-bar-fill" [style.width.%]="quiz.progress()"></div>
      </div>

      @if (quiz.currentCard(); as card) {
        <div class="question-card">
          <span class="question-tema">{{ card.tema }}</span>
          <p class="question-enunciado">{{ card.enunciado }}</p>

          <div class="options-list" id="options-list">
            @for (op of card.opciones; track op.key; let i = $index) {
              <button class="option-btn"
                      [class.correct]="answered() && op.key === card.respuesta_correcta"
                      [class.wrong]="answered() && selectedKey() === op.key && op.key !== card.respuesta_correcta"
                      [disabled]="answered()"
                      (click)="handleAnswer(op.key, card)">
                <span class="option-letter">{{ letters[i] }}</span>
                <span>{{ op.text }}</span>
              </button>
            }
          </div>

          @if (answered() && card.explicacion) {
            <div class="explanation-box visible">
              <p>{{ card.explicacion }}</p>
            </div>
          }
        </div>
      }

      <div class="quiz-nav">
        @if (!answered()) {
          <button class="btn btn-ghost" (click)="handleBlank()">Dejar en blanco</button>
        }
        @if (answered()) {
          <button class="btn btn-primary" (click)="next()">
            {{ quiz.isLastCard() ? 'Ver resultados' : 'Siguiente →' }}
          </button>
        }
      </div>
    </section>
  `
})
export class QuizComponent implements OnInit {
  router  = inject(Router);
  quiz    = inject(QuizService);

  readonly letters = ['A', 'B', 'C', 'D', 'E'];
  answered    = signal(false);
  selectedKey = signal<string | null>(null);

  ngOnInit(): void {
    if (!this.quiz.sessionState()) {
      this.router.navigate(['/tests']);
    }
  }

  handleAnswer(key: string, card: QueueItem): void {
    if (this.answered()) return;
    this.selectedKey.set(key);
    this.answered.set(true);
    const result = key === card.respuesta_correcta ? 'correct' : 'wrong';
    this.quiz.submitAnswer(result);
  }

  handleBlank(): void {
    if (this.answered()) return;
    this.answered.set(true);
    this.quiz.submitAnswer('blank');
  }

  next(): void {
    if (this.quiz.isLastCard()) {
      this.quiz.finishQuiz();
      this.router.navigate(['/results']);
    } else {
      this.quiz.nextCard();
      this.answered.set(false);
      this.selectedKey.set(null);
    }
  }

  quit(): void {
    const inProgress = this.quiz.queue().length > 0;
    if (inProgress && !confirm('¿Salir del test? Se guardará tu progreso.')) return;
    this.router.navigate(['/tests']);
  }
}
