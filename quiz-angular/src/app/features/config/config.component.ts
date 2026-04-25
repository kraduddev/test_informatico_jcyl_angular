import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../core/services/quiz.service';

interface TopicChip {
  tema: string;
  count: number;
  selected: boolean;
}

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="screen active" aria-label="Configuración del test">
      <div class="config-header">
        <button class="btn btn-ghost btn-back-section" (click)="router.navigate(['/tests'])">← Volver</button>
        <h2 id="config-test-title">{{ quiz.currentTestMeta()?.nombre }}</h2>
        <p>{{ quiz.currentTestData()?.ejercicio }} · {{ quiz.currentTestData()?.fecha }}</p>
      </div>

      <div class="card">
        <div class="toggle-row">
          <span>Mezclar preguntas y respuestas</span>
          <label class="toggle-switch">
            <input type="checkbox" [(ngModel)]="mezclar">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div class="topics-controls">
        <button class="btn btn-ghost" (click)="selectAll(true)">Seleccionar todos</button>
        <button class="btn btn-ghost" (click)="selectAll(false)">Deseleccionar todos</button>
      </div>

      <div class="topic-chips">
        @for (chip of chips(); track chip.tema) {
          <label class="topic-chip" [class.selected]="chip.selected" (click)="toggleChip(chip)">
            <input type="checkbox" [checked]="chip.selected" (change)="$event.preventDefault()">
            {{ chip.tema }}
            <span class="chip-count">{{ chip.count }}</span>
          </label>
        }
      </div>

      <div class="config-summary"
           [style.background]="selectedCount() === 0 ? 'var(--color-wrong-bg)' : ''"
           [style.color]="selectedCount() === 0 ? 'var(--color-wrong)' : ''">
        {{ summaryText() }}
      </div>

      <div class="config-actions">
        <button class="btn btn-primary btn-lg" [disabled]="selectedCount() === 0" (click)="startQuiz()">
          Comenzar test →
        </button>
      </div>
    </section>
  `
})
export class ConfigComponent implements OnInit {
  router = inject(Router);
  quiz   = inject(QuizService);

  mezclar = true;
  chips   = signal<TopicChip[]>([]);

  selectedCount = computed(() => this.chips().filter(c => c.selected).length);
  questionCount = computed(() => {
    const data = this.quiz.currentTestData();
    if (!data) return 0;
    const selected = new Set(this.chips().filter(c => c.selected).map(c => c.tema));
    return data.preguntas.filter(p => selected.has(p.tema)).length;
  });
  summaryText = computed(() => {
    const count = this.questionCount();
    const sel   = this.selectedCount();
    if (count === 0) return 'Selecciona al menos un tema para continuar.';
    return `Se practicarán ${count} preguntas de ${sel} tema${sel !== 1 ? 's' : ''}.`;
  });

  ngOnInit(): void {
    const data = this.quiz.currentTestData();
    if (!data) { this.router.navigate(['/tests']); return; }

    const temasMap: Record<string, number> = {};
    data.preguntas.forEach(p => { temasMap[p.tema] = (temasMap[p.tema] || 0) + 1; });
    this.chips.set(
      Object.keys(temasMap).sort().map(tema => ({ tema, count: temasMap[tema], selected: true }))
    );
  }

  toggleChip(chip: TopicChip): void {
    this.chips.update(chips => chips.map(c => c.tema === chip.tema ? { ...c, selected: !c.selected } : c));
  }

  selectAll(select: boolean): void {
    this.chips.update(chips => chips.map(c => ({ ...c, selected: select })));
  }

  startQuiz(): void {
    const selected = this.chips().filter(c => c.selected).map(c => c.tema);
    if (!selected.length) return;
    this.quiz.startQuiz(selected, this.mezclar);
    this.router.navigate(['/quiz']);
  }
}
