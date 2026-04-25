import { Routes } from '@angular/router';
import { quizGuard } from './core/guards/quiz.guard';
import { resultsGuard } from './core/guards/results.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'tests', loadComponent: () => import('./features/tests/tests.component').then(m => m.TestsComponent) },
  { path: 'tests/:id/config', loadComponent: () => import('./features/config/config.component').then(m => m.ConfigComponent) },
  { path: 'quiz', canActivate: [quizGuard], loadComponent: () => import('./features/quiz/quiz.component').then(m => m.QuizComponent) },
  { path: 'results', canActivate: [resultsGuard], loadComponent: () => import('./features/results/results.component').then(m => m.ResultsComponent) },
  { path: 'stats', loadComponent: () => import('./features/stats/stats.component').then(m => m.StatsComponent) },
  { path: 'supuestos', loadComponent: () => import('./features/supuestos/supuestos-menu/supuestos-menu.component').then(m => m.SupuestosMenuComponent) },
  { path: 'supuestos/examenes', loadComponent: () => import('./features/supuestos/supuestos-examenes/supuestos-examenes.component').then(m => m.SupuestosExamenesComponent) },
  { path: 'supuestos/categorias', loadComponent: () => import('./features/supuestos/supuestos-categorias/supuestos-categorias.component').then(m => m.SupuestosCategoriasComponent) },
  { path: 'supuestos/consejos', loadComponent: () => import('./features/supuestos/supuestos-consejos/supuestos-consejos.component').then(m => m.SupuestosConsejosComponent) },
  { path: 'supuestos/consejos/:id', loadComponent: () => import('./features/supuestos/supuestos-consejos-detail/supuestos-consejos-detail.component').then(m => m.SupuestosConsejosDetailComponent) },
  { path: '**', redirectTo: '' }
];
