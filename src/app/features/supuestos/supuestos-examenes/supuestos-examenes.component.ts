import { Component, OnInit, AfterViewChecked, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SupuestosService } from '../../../core/services/supuestos.service';
import { AccordionGroupComponent } from '../../../shared/components/accordion-group/accordion-group.component';
import { PreguntaCardComponent } from '../../../shared/components/pregunta-card/pregunta-card.component';
import { PreguntaSupuesto, Categoria } from '../../../core/models';
import { marked } from 'marked';
import mermaid from 'mermaid';

interface GrupoExamen {
  origen: string;
  preguntas: Array<PreguntaSupuesto & { categoria: Categoria }>;
  tieneFichero: boolean;
  mdContent: SafeHtml | null;
  mdLoading: boolean;
  mdOpen: boolean;
}

@Component({
  selector: 'app-supuestos-examenes',
  standalone: true,
  imports: [CommonModule, AccordionGroupComponent, PreguntaCardComponent],
  styles: [`
    :host ::ng-deep .md-body { font-size: 0.95rem; line-height: 1.7; }
    :host ::ng-deep .md-body h1, :host ::ng-deep .md-body h2, :host ::ng-deep .md-body h3 { margin: 1.2em 0 0.5em; font-weight: 700; }
    :host ::ng-deep .md-body h2 { font-size: 1.2rem; border-bottom: 2px solid #4361ee; padding-bottom: 4px; }
    :host ::ng-deep .md-body h3 { font-size: 1.05rem; }
    :host ::ng-deep .md-body p { margin: 0.5em 0; }
    :host ::ng-deep .md-body ul, :host ::ng-deep .md-body ol { padding-left: 1.5em; margin: 0.5em 0; }
    :host ::ng-deep .md-body code { background: #f0f0f0; padding: 2px 5px; border-radius: 4px; font-size: 0.88em; }
    :host ::ng-deep .md-body pre { background: #f8f8f8; border-radius: 8px; padding: 1em; overflow: auto; }
    :host ::ng-deep .md-body table { border-collapse: collapse; width: 100%; margin: 0.8em 0; font-size: 0.88rem; }
    :host ::ng-deep .md-body th, :host ::ng-deep .md-body td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
    :host ::ng-deep .md-body th { background: #4361ee; color: #fff; }
    :host ::ng-deep .md-body strong { font-weight: 700; }
    :host ::ng-deep .md-body blockquote { border-left: 4px solid #4361ee; margin: 0.8em 0; padding: 0.5em 1em; background: #f5f7ff; border-radius: 0 6px 6px 0; }
  `],
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
                        <div class="md-body" [innerHTML]="grupo.mdContent"></div>
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
export class SupuestosExamenesComponent implements OnInit, AfterViewChecked {
  router    = inject(Router);
  supuestos = inject(SupuestosService);
  sanitizer = inject(DomSanitizer);

  loading = signal(true);
  error   = signal<string | null>(null);
  grupos  = signal<GrupoExamen[]>([]);

  private mermaidInit = false;
  private pendingMermaid = false;

  ngAfterViewChecked(): void {
    if (this.pendingMermaid) {
      this.pendingMermaid = false;
      mermaid.run({ querySelector: '.mermaid:not([data-processed])' });
    }
  }

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
    this.grupos.update(g => [...g]);
    if (grupo.mdOpen && grupo.mdContent === null) {
      grupo.mdLoading = true;
      this.grupos.update(g => [...g]);
      try {
        const text = await this.supuestos.loadMarkdown(grupo.origen);
        // Configure marked to wrap mermaid code blocks in .mermaid divs
        const renderer = new (marked as any).Renderer();
        const origCode = renderer.code.bind(renderer);
        renderer.code = (code: string, lang: string) => {
          if (lang === 'mermaid') {
            return `<div class="mermaid">${code}</div>`;
          }
          return origCode(code, lang);
        };
        const html = await marked(text, { renderer });
        grupo.mdContent = this.sanitizer.bypassSecurityTrustHtml(html);
        this.pendingMermaid = true;
        if (!this.mermaidInit) {
          mermaid.initialize({ startOnLoad: false, theme: 'default' });
          this.mermaidInit = true;
        }
      } catch (e: any) {
        grupo.mdContent = `<p class="supuestos-error">${e.message}</p>`;
      } finally {
        grupo.mdLoading = false;
        this.grupos.update(g => [...g]);
      }
    } else if (grupo.mdOpen) {
      // Panel re-opened, re-render mermaid diagrams
      this.pendingMermaid = true;
    }
  }
}
