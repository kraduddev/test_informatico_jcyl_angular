import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SupuestosService } from '../../../core/services/supuestos.service';
import mermaid from 'mermaid';
import { renderMarkdown } from '../../../core/utils/markdown-render.util';

@Component({
  selector: 'app-supuestos-consejos-detail',
  standalone: true,
  imports: [CommonModule],
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
        <article class="md-reader">
          <div class="md-body" [innerHTML]="mdContent()"></div>
        </article>
      }
    </section>
  `
})
export class SupuestosConsejosDetailComponent implements OnInit, OnDestroy {
  router    = inject(Router);
  route     = inject(ActivatedRoute);
  supuestos = inject(SupuestosService);
  sanitizer = inject(DomSanitizer);

  loading   = signal(true);
  error     = signal<string | null>(null);
  mdContent = signal<SafeHtml | null>(null);
  title     = signal<string>('Consejo');

  ngOnInit(): void {
    document.body.classList.add('page-reading');
    this.load();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('page-reading');
  }

  private async load(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('No se especificó ningún consejo.');
      this.loading.set(false);
      return;
    }

    try {
      const consejos = await this.supuestos.loadConsejos();
      const consejo  = consejos.find(c => c.id === id);
      if (!consejo) {
        this.error.set('Consejo no encontrado.');
        return;
      }

      this.title.set(consejo.title);
      const text = await this.supuestos.loadConsejoMarkdown(consejo.file);
      const html = await renderMarkdown(text);
      this.mdContent.set(this.sanitizer.bypassSecurityTrustHtml(html));

    } catch (e: any) {
      this.error.set(e.message || 'Error al cargar el consejo.');
    } finally {
      this.loading.set(false);
      // mermaid.run() after Angular has flushed [innerHTML] to the real DOM
      setTimeout(() => {
        mermaid.run({ querySelector: '.mermaid:not([data-processed])' });
      }, 150);
    }
  }
}
