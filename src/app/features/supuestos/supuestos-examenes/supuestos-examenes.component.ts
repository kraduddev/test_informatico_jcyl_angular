import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupuestosService } from '../../../core/services/supuestos.service';
import { AccordionGroupComponent } from '../../../shared/components/accordion-group/accordion-group.component';
import { PreguntaCardComponent } from '../../../shared/components/pregunta-card/pregunta-card.component';
import { PreguntaSupuesto, Categoria } from '../../../core/models';

interface GrupoExamen {
  origen: string;
  preguntas: Array<PreguntaSupuesto & { categoria: Categoria }>;
  tieneFichero: boolean;
  mdContent: string | null;
  mdLoading: boolean;
  mdOpen: boolean;
}

@Component({
  selector: 'app-supuestos-examenes',
  standalone: true,
  imports: [CommonModule, AccordionGroupComponent, PreguntaCardComponent],
  template: `
    <section class="screen active" aria-label="Supuestos por examen">
      <div class="selector-header">
        <button class="btn btn-ghost btn-back-section" (click)="router.navigate(['/supuestos'])">← Volver</button>
        <h1>Por Examen</h1>
      </div>

      @if (loading()) {
        <div class="loader-wrap"><div class="loader"></div></div>
      } @else if (error()) {
        <p class="supuestos-error">{{ error() }}</p>
      } @else {
        @for (grupo of grupos(); track grupo.origen) {
          <app-accordion-group>
            <ng-container slot="title">
              <span class="supuesto-origen-badge">{{ grupo.origen }}</span>
              <span class="supuesto-group-count">{{ grupo.preguntas.length }} pregunta{{ grupo.preguntas.length !== 1 ? 's' : '' }}</span>
            </ng-container>

            @if (grupo.tieneFichero) {
              <div class="examen-plantilla-wrap">
                <button class="examen-plantilla-toggle" [class.active]="grupo.mdOpen" (click)="togglePlantilla(grupo)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                       fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  Ver plantilla de examen
                  <svg class="chevron-sm" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                       fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                       [style.transform]="grupo.mdOpen ? 'rotate(180deg)' : ''">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                @if (grupo.mdOpen) {
                  <div class="examen-plantilla-panel">
                    <div class="examen-plantilla-content">
                      @if (grupo.mdLoading) {
                        <div class="loader-wrap"><div class="loader"></div></div>
                      } @else if (grupo.mdContent) {
                        <div [innerHTML]="grupo.mdContent"></div>
                      }
                    </div>
                  </div>
                }
              </div>
            }

            @for (p of grupo.preguntas; track p.enunciado; let i = $index) {
              <app-pregunta-card [pregunta]="p" [index]="i" [categoria]="p.categoria" />
            }
          </app-accordion-group>
        }
      }
    </section>
  `
})
export class SupuestosExamenesComponent implements OnInit {
  router    = inject(Router);
  supuestos = inject(SupuestosService);

  loading = signal(true);
  error   = signal<string | null>(null);
  grupos  = signal<GrupoExamen[]>([]);

  async ngOnInit(): Promise<void> {
    try {
      const { categorias } = await this.supuestos.loadData();
      const map: Record<string, Array<PreguntaSupuesto & { categoria: Categoria }>> = {};
      categorias.forEach(cat => {
        cat.preguntas.forEach(p => {
          if (!map[p.origen]) map[p.origen] = [];
          map[p.origen].push({ ...p, categoria: cat });
        });
      });
      const sorted = Object.keys(map).sort((a, b) => {
        const ya = parseInt(a.match(/\d{4}/)?.[0] ?? '0');
        const yb = parseInt(b.match(/\d{4}/)?.[0] ?? '0');
        return ya !== yb ? ya - yb : a.localeCompare(b);
      });
      this.grupos.set(sorted.map(origen => ({
        origen,
        preguntas: map[origen],
        tieneFichero: this.supuestos.hasFichero(origen),
        mdContent: null,
        mdLoading: false,
        mdOpen: false
      })));
    } catch (e: any) {
      this.error.set(e.message ?? 'Error cargando supuestos.');
    } finally {
      this.loading.set(false);
    }
  }

  async togglePlantilla(grupo: GrupoExamen): Promise<void> {
    grupo.mdOpen = !grupo.mdOpen;
    this.grupos.update(g => [...g]); // trigger change detection
    if (grupo.mdOpen && grupo.mdContent === null) {
      grupo.mdLoading = true;
      this.grupos.update(g => [...g]);
      try {
        const text = await this.supuestos.loadMarkdown(grupo.origen);
        const win = window as any;
        grupo.mdContent = win.marked?.parse ? win.marked.parse(text) : `<pre>${text.replace(/</g, '&lt;')}</pre>`;
      } catch (e: any) {
        grupo.mdContent = `<p class="supuestos-error">${e.message}</p>`;
      } finally {
        grupo.mdLoading = false;
        this.grupos.update(g => [...g]);
      }
    }
  }
}
