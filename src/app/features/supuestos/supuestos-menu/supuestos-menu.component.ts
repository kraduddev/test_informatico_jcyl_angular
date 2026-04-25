import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supuestos-menu',
  standalone: true,
  template: `
    <section class="screen active" aria-label="Supuestos Prácticos">
      <div class="selector-header">
        <button class="btn btn-ghost btn-back-section" (click)="router.navigate(['/'])">← Volver</button>
        <h1>Supuestos Prácticos</h1>
        <p>Selecciona cómo quieres explorar los supuestos.</p>
      </div>
      <div class="dashboard-grid">
        <button class="dashboard-card" (click)="router.navigate(['/supuestos/examenes'])">
          <div class="dashboard-card-icon">📄</div>
          <h2>Por Examen</h2>
          <p>Consulta todos los supuestos agrupados por convocatoria.</p>
          <span class="dashboard-card-cta">Ver por examen →</span>
        </button>
        <button class="dashboard-card" (click)="router.navigate(['/supuestos/categorias'])">
          <div class="dashboard-card-icon">🗂️</div>
          <h2>Por Categoría</h2>
          <p>Explora los supuestos por bloque temático.</p>
          <span class="dashboard-card-cta">Ver por categoría →</span>
        </button>
      </div>
    </section>
  `
})
export class SupuestosMenuComponent {
  constructor(public router: Router) {}
}
