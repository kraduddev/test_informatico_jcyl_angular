import { Component, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { ManifestService } from '../../../core/services/manifest.service';
import { QuizService } from '../../../core/services/quiz.service';

const SUPUESTOS_ROUTES = new Set(['/supuestos', '/supuestos/examenes', '/supuestos/categorias']);

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header">
      <a class="logo" (click)="goHome()" style="cursor:pointer" aria-label="Inicio">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
        Quiz JCyL
      </a>
      <div class="header-actions">
        @if (!hideStats()) {
          <button class="btn btn-ghost" (click)="goStats()" title="Estadísticas" aria-label="Ver estadísticas">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6"  y1="20" x2="6"  y2="14"></line>
            </svg>
            <span class="hide-xs">Estadísticas</span>
          </button>
        }
      </div>
    </header>
  `
})
export class HeaderComponent {
  private router = inject(Router);
  private manifest = inject(ManifestService);
  private quiz = inject(QuizService);

  hideStats = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map((e: any) => SUPUESTOS_ROUTES.has(e.urlAfterRedirects))
    ),
    { initialValue: false }
  );

  goHome(): void {
    this.manifest.clearSessionState();
    this.quiz.sessionState.set(null);
    this.router.navigate(['/']);
  }

  goStats(): void {
    this.router.navigate(['/stats']);
  }
}
