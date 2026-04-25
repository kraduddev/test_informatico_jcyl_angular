import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupuestosService } from '../../../core/services/supuestos.service';
import { AccordionGroupComponent } from '../../../shared/components/accordion-group/accordion-group.component';
import { PreguntaCardComponent } from '../../../shared/components/pregunta-card/pregunta-card.component';
import { Categoria } from '../../../core/models';

@Component({
  selector: 'app-supuestos-categorias',
  standalone: true,
  imports: [CommonModule, AccordionGroupComponent, PreguntaCardComponent],
  template: `
    <section class="screen active" aria-label="Supuestos por categoría">
      <div class="selector-header">
        <button class="btn btn-ghost btn-back-section" (click)="router.navigate(['/supuestos'])">← Volver</button>
        <h1>Por Categoría</h1>
      </div>

      @if (loading()) {
        <div class="loader-wrap"><div class="loader"></div></div>
      } @else if (error()) {
        <p class="supuestos-error">{{ error() }}</p>
      } @else {
        @for (cat of categorias(); track cat.id) {
          <app-accordion-group>
            <ng-container slot="title">
              <span class="supuesto-cat-name">{{ cat.nombre }}</span>
              <span class="supuesto-group-count">{{ cat.preguntas.length }} pregunta{{ cat.preguntas.length !== 1 ? 's' : '' }}</span>
            </ng-container>

            <div class="supuesto-cat-meta">
              <div class="supuesto-meta-block">
                <span class="supuesto-meta-label">Conceptos core</span>
                <div class="supuesto-tags">
                  @for (c of cat.conceptos_core; track c) {
                    <span class="tag tag-core">{{ c }}</span>
                  }
                </div>
              </div>
              <div class="supuesto-meta-block">
                <span class="supuesto-meta-label">Leyes relacionadas</span>
                <div class="supuesto-tags">
                  @for (l of cat.leyes_relacionadas; track l) {
                    <span class="tag tag-ley">{{ l }}</span>
                  }
                </div>
              </div>
            </div>

            @for (p of cat.preguntas; track p.enunciado; let i = $index) {
              <app-pregunta-card [pregunta]="p" [index]="i" />
            }
          </app-accordion-group>
        }
      }
    </section>
  `
})
export class SupuestosCategoriasComponent implements OnInit {
  router    = inject(Router);
  supuestos = inject(SupuestosService);

  loading    = signal(true);
  error      = signal<string | null>(null);
  categorias = signal<Categoria[]>([]);

  async ngOnInit(): Promise<void> {
    try {
      const { categorias } = await this.supuestos.loadData();
      this.categorias.set(categorias);
    } catch (e: any) {
      this.error.set(e.message ?? 'Error cargando categorías.');
    } finally {
      this.loading.set(false);
    }
  }
}
