import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SupuestosService } from '../../../core/services/supuestos.service';
import { Consejo } from '../../../core/models';
import { marked } from 'marked';
import mermaid from 'mermaid';
import katex from 'katex';

// ── Configure marked once at module level ─────────────────────────────────────
marked.use({
  renderer: {
    code({ text, lang }: { text: string; lang?: string }) {
      if (lang === 'mermaid') {
        return `<div class="mermaid">${text}</div>`;
      }
      return false; // fall back to default renderer
    }
  }
});

// ── LaTeX helpers ─────────────────────────────────────────────────────────────
function renderLatex(src: string): string {
  src = src.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
    } catch { return _; }
  });
  src = src.replace(/\$([^\n$]+?)\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
    } catch { return _; }
  });
  return src;
}

// ── Mermaid initialised once ───────────────────────────────────────────────────
let mermaidReady = false;
function ensureMermaid() {
  if (!mermaidReady) {
    mermaid.initialize({ startOnLoad: false, theme: 'default' });
    mermaidReady = true;
  }
}

@Component({
  selector: 'app-supuestos-consejos-detail',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host ::ng-deep .md-body { font-size: 0.95rem; line-height: 1.7; padding: 1rem 0; }
    :host ::ng-deep .md-body h1,
    :host ::ng-deep .md-body h2,
    :host ::ng-deep .md-body h3 { margin: 1.2em 0 0.5em; font-weight: 700; }
    :host ::ng-deep .md-body h2 { font-size: 1.2rem; border-bottom: 2px solid var(--primary-color, #4361ee); padding-bottom: 4px; }
    :host ::ng-deep .md-body h3 { font-size: 1.05rem; }
    :host ::ng-deep .md-body p  { margin: 0.5em 0; }
    :host ::ng-deep .md-body ul,
    :host ::ng-deep .md-body ol { padding-left: 1.5em; margin: 0.5em 0; }
    :host ::ng-deep .md-body code { background: #f0f0f0; padding: 2px 5px; border-radius: 4px; font-size: 0.88em; }
    :host ::ng-deep .md-body pre  { background: #f8f8f8; border-radius: 8px; padding: 1em; overflow: auto; }
    :host ::ng-deep .md-body table { border-collapse: collapse; width: 100%; margin: 0.8em 0; font-size: 0.88rem; }
    :host ::ng-deep .md-body th,
    :host ::ng-deep .md-body td  { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
    :host ::ng-deep .md-body th  { background: var(--primary-color, #4361ee); color: #fff; }
    :host ::ng-deep .md-body strong { font-weight: 700; }
    :host ::ng-deep .md-body blockquote {
      border-left: 4px solid var(--primary-color, #4361ee); margin: 0.8em 0;
      padding: 0.5em 1em; background: #f5f7ff; border-radius: 0 6px 6px 0;
    }
    :host ::ng-deep .md-body .mermaid { margin: 1em 0; overflow: auto; }
    :host ::ng-deep .md-body .katex-display { overflow-x: auto; margin: 0.8em 0; }
  `],
  template: `
    <section class="screen active" aria-label="Detalle de Consejo">
      <div class="selector-header">
        <button class="btn btn-ghost btn-back-section" (click)="router.navigate(['/supuestos/consejos'])">← Volver</button>
        <h1>{{ title() }}</h1>
      </div>

      @if (loading()) {
        <div class="loader-wrap"><div class="loader"></div></div>
      } @else if (error()) {
        <p class="supuestos-error">{{ error() }}</p>
      } @else if (mdContent()) {
        <div class="examen-plantilla-panel" style="display: block; border: none; padding: 0;">
          <div class="examen-plantilla-content">
            <div class="md-body" [innerHTML]="mdContent()"></div>
          </div>
        </div>
      }
    </section>
  `
})
export class SupuestosConsejosDetailComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  supuestos = inject(SupuestosService);
  sanitizer = inject(DomSanitizer);

  loading = signal(true);
  error = signal<string | null>(null);
  mdContent = signal<SafeHtml | null>(null);
  title = signal<string>('Consejo');

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('No se especificó ningún consejo.');
      this.loading.set(false);
      return;
    }

    try {
      const consejos = await this.supuestos.loadConsejos();
      const consejo = consejos.find(c => c.id === id);
      if (!consejo) {
        throw new Error('Consejo no encontrado.');
      }

      this.title.set(consejo.title);

      const text = await this.supuestos.loadConsejoMarkdown(consejo.file);
      const withMath = renderLatex(text);
      const html = await marked.parse(withMath);
      
      this.mdContent.set(this.sanitizer.bypassSecurityTrustHtml(html));

      setTimeout(() => {
        ensureMermaid();
        mermaid.run({ querySelector: '.mermaid:not([data-processed])' });
      }, 50);

    } catch (e: any) {
      this.error.set(e.message || 'Error al cargar el consejo.');
    } finally {
      this.loading.set(false);
    }
  }
}
