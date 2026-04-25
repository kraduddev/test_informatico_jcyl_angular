import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreguntaSupuesto, Categoria } from '../../../core/models';

@Component({
  selector: 'app-pregunta-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pregunta-card">
      <div class="pregunta-card-header">
        <span class="supuesto-origen-badge">{{ pregunta.origen }}</span>
        @if (categoria) {
          <span class="tag tag-core" style="margin-left:.5rem">{{ categoria.nombre }}</span>
        }
        <span class="pregunta-num">P{{ index + 1 }}</span>
      </div>
      <p class="pregunta-enunciado">{{ pregunta.enunciado }}</p>

      @if (categoria) {
        <div class="supuesto-meta-inline">
          <div class="supuesto-meta-block">
            <span class="supuesto-meta-label">Conceptos core</span>
            <div class="supuesto-tags">
              @for (c of categoria.conceptos_core; track c) {
                <span class="tag tag-core">{{ c }}</span>
              }
            </div>
          </div>
          <div class="supuesto-meta-block">
            <span class="supuesto-meta-label">Leyes relacionadas</span>
            <div class="supuesto-tags">
              @for (l of categoria.leyes_relacionadas; track l) {
                <span class="tag tag-ley">{{ l }}</span>
              }
            </div>
          </div>
        </div>
      }

      <button class="pregunta-plantilla-toggle" [class.active]="plantillaOpen()" (click)="togglePlantilla()">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
             [style.transform]="plantillaOpen() ? 'rotate(180deg)' : ''">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
        Ver plantilla de respuesta
      </button>
      @if (plantillaOpen()) {
        <div class="pregunta-plantilla">
          <strong>💡 Plantilla de respuesta</strong>
          <p>{{ pregunta.plantilla_solucion }}</p>
        </div>
      }
    </div>
  `
})
export class PreguntaCardComponent {
  @Input({ required: true }) pregunta!: PreguntaSupuesto;
  @Input({ required: true }) index!: number;
  @Input() categoria: Categoria | null = null;

  plantillaOpen = signal(false);

  togglePlantilla(): void {
    this.plantillaOpen.update(v => !v);
  }
}
