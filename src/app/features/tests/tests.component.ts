import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ManifestService } from '../../core/services/manifest.service';
import { QuizService } from '../../core/services/quiz.service';
import { TestMeta, SessionState } from '../../core/models';

@Component({
  selector: 'app-tests',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="screen active" aria-label="Selección de test">
      <div class="selector-header">
        <button class="btn btn-ghost btn-back-section" (click)="router.navigate(['/'])">← Volver</button>
        <h1>Elige un test</h1>
        <p>Selecciona el examen que quieres practicar.</p>
      </div>

      @if (session()) {
        <div class="resume-banner" role="alert" style="display:flex">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <div class="resume-banner-text">
            <strong>Tienes una sesión en curso: {{ session()!.testName }}</strong>
            <span>Pregunta {{ (session()!.currentIndex || 0) + 1 }} de {{ session()!.queue.length }}</span>
          </div>
          <div class="resume-actions">
            <button class="btn btn-secondary" (click)="discardSession()">Descartar</button>
            <button class="btn btn-primary" (click)="resumeSession()">Continuar</button>
          </div>
        </div>
      }

      @if (loading()) {
        <div class="loader-wrap"><div class="loader"></div></div>
      } @else if (error()) {
        <p style="color:var(--color-wrong);padding:1rem">{{ error() }}</p>
      } @else {
        <div class="test-grid">
          @for (test of tests(); track test.id) {
            <button class="test-card" (click)="selectTest(test)">
              <span class="test-card-badge">{{ test.ejercicio || 'Examen' }}</span>
              <h3>{{ test.nombre }}</h3>
              <div class="test-card-meta">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {{ test.fecha }}
              </div>
            </button>
          }
        </div>
      }
    </section>
  `
})
export class TestsComponent implements OnInit {
  router = inject(Router);
  private manifest = inject(ManifestService);
  private quiz = inject(QuizService);

  tests   = signal<TestMeta[]>([]);
  loading = signal(true);
  error   = signal<string | null>(null);
  session = signal<SessionState | null>(null);

  async ngOnInit(): Promise<void> {
    this.session.set(this.manifest.getSessionState());
    try {
      const tests = await this.manifest.loadTests();
      this.tests.set(tests);
    } catch (e: any) {
      this.error.set(e.message ?? 'No se pudo cargar el manifiesto de tests.');
    } finally {
      this.loading.set(false);
    }
  }

  async selectTest(test: TestMeta): Promise<void> {
    await this.quiz.loadTest(test);
    this.router.navigate(['/tests', test.id, 'config']);
  }

  async resumeSession(): Promise<void> {
    const state = this.session();
    if (!state) return;
    await this.quiz.resumeSession(state);
    this.router.navigate(['/quiz']);
  }

  discardSession(): void {
    if (!confirm('¿Descartar la sesión guardada y empezar desde cero?')) return;
    this.manifest.clearSessionState();
    this.quiz.sessionState.set(null);
    this.session.set(null);
  }
}
