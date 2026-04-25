import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <section class="screen active" aria-label="Inicio">
      <div class="dashboard-header">
        <h1>Quiz JCyL</h1>
        <p>Técnico Superior de Informática — Elige una sección para comenzar.</p>
      </div>
      <div class="dashboard-grid">
        <button class="dashboard-card" (click)="router.navigate(['/tests'])">
          <div class="dashboard-card-icon">📝</div>
          <h2>Tests</h2>
          <p>Practica con preguntas tipo test de convocatorias anteriores y consulta tus estadísticas.</p>
          <span class="dashboard-card-cta">Ir a los tests →</span>
        </button>
        <button class="dashboard-card" (click)="router.navigate(['/supuestos'])">
          <div class="dashboard-card-icon">📋</div>
          <h2>Supuestos Prácticos</h2>
          <p>Explora los supuestos de exámenes reales por convocatoria o por categoría temática.</p>
          <span class="dashboard-card-cta">Ir a supuestos →</span>
        </button>
      </div>
    </section>
  `
})
export class DashboardComponent {
  constructor(public router: Router) {}
}
