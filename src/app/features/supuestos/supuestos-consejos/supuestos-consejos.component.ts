import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupuestosService } from '../../../core/services/supuestos.service';
import { Consejo } from '../../../core/models';

@Component({
  selector: 'app-supuestos-consejos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="screen active" aria-label="Consejos">
      <div class="selector-header">
        <button class="btn btn-ghost btn-back-section" (click)="router.navigate(['/supuestos'])">← Volver</button>
        <h1>Consejos</h1>
        <p>Tips y recomendaciones para aplicar legislación y buenas prácticas.</p>
      </div>

      @if (loading()) {
        <div class="loader-wrap"><div class="loader"></div></div>
      } @else if (error()) {
        <p class="supuestos-error">{{ error() }}</p>
      } @else {
        <div class="dashboard-grid">
          @for (consejo of consejos(); track consejo.id) {
            <button class="dashboard-card" (click)="abrirConsejo(consejo)">
              <div class="dashboard-card-icon">{{ consejo.icon }}</div>
              <h2>{{ consejo.title }}</h2>
              <p>{{ consejo.description }}</p>
              <span class="dashboard-card-cta">Leer más →</span>
            </button>
          }
        </div>
      }
    </section>
  `
})
export class SupuestosConsejosComponent implements OnInit {
  router = inject(Router);
  supuestos = inject(SupuestosService);

  loading = signal(true);
  error = signal<string | null>(null);
  consejos = signal<Consejo[]>([]);

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.supuestos.loadConsejos();
      this.consejos.set(data);
    } catch (e: any) {
      this.error.set('Error cargando consejos: ' + e.message);
    } finally {
      this.loading.set(false);
    }
  }

  abrirConsejo(consejo: Consejo): void {
    this.router.navigate(['/supuestos/consejos', consejo.id]);
  }
}
