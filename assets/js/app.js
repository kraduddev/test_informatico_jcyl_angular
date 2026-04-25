/**
 * app.js
 * Punto de entrada principal.
 * Gestiona la navegación entre pantallas y conecta los módulos.
 */

import { initNavigation, showScreen, navigate } from './navigation.js';
import { initManifest, clearSessionState } from './manifest.js';
import {
  startQuiz, nextCard, retryQuiz,
  selectAllTopics, handleBlank
} from './quiz.js';
import { renderStats, handleClearHistory } from './stats.js';
import { renderPorExamen, renderPorCategoria } from './supuestos.js';

// ─── Bootstrap ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // Inicializar la caché de elementos de navegación
  initNavigation();

  // Pantalla inicial
  showScreen('dashboard');

  // ── Cabecera ──────────────────────────────────────────────────────────────
  document.getElementById('btn-logo').addEventListener('click', e => {
    e.preventDefault();
    clearSessionState();
    showScreen('dashboard');
  });

  document.getElementById('btn-go-stats').addEventListener('click',
    () => navigate('stats', renderStats));

  // ── Dashboard ─────────────────────────────────────────────────────────────
  document.getElementById('btn-go-tests').addEventListener('click',
    () => navigate('tests', initManifest));

  document.getElementById('btn-go-supuestos').addEventListener('click',
    () => showScreen('supuestos-menu'));

  // ── Selector de tests ─────────────────────────────────────────────────────
  document.getElementById('btn-back-from-tests').addEventListener('click',
    () => showScreen('dashboard'));

  // ── Supuestos: menú ───────────────────────────────────────────────────────
  document.getElementById('btn-back-from-supuestos-menu').addEventListener('click',
    () => showScreen('dashboard'));

  document.getElementById('btn-go-examenes').addEventListener('click',
    () => navigate('supuestos-examenes', renderPorExamen));

  document.getElementById('btn-go-categorias').addEventListener('click',
    () => navigate('supuestos-categorias', renderPorCategoria));

  // ── Supuestos: por examen ─────────────────────────────────────────────────
  document.getElementById('btn-back-from-examenes').addEventListener('click',
    () => showScreen('supuestos-menu'));

  // ── Supuestos: por categoría ──────────────────────────────────────────────
  document.getElementById('btn-back-from-categorias').addEventListener('click',
    () => showScreen('supuestos-menu'));

  // ── Configuración ─────────────────────────────────────────────────────────
  document.getElementById('btn-select-all').addEventListener('click', () => selectAllTopics(true));
  document.getElementById('btn-deselect-all').addEventListener('click', () => selectAllTopics(false));
  document.getElementById('btn-start-quiz').addEventListener('click', startQuiz);
  document.getElementById('btn-back-from-config').addEventListener('click',
    () => navigate('tests', initManifest));

  // ── Quiz ──────────────────────────────────────────────────────────────────
  document.getElementById('btn-next').addEventListener('click', nextCard);
  document.getElementById('btn-blank').addEventListener('click', handleBlank);
  document.getElementById('btn-quit-quiz').addEventListener('click', () => {
    if (confirm('¿Salir del test actual? El progreso de esta sesión se perderá.')) {
      clearSessionState();
      navigate('tests', initManifest);
    }
  });

  // ── Resultados ────────────────────────────────────────────────────────────
  document.getElementById('btn-retry').addEventListener('click', retryQuiz);
  document.getElementById('btn-back-from-results').addEventListener('click',
    () => showScreen('dashboard'));
  document.getElementById('btn-results-go-stats').addEventListener('click',
    () => navigate('stats', renderStats));

  // ── Estadísticas ──────────────────────────────────────────────────────────
  document.getElementById('btn-clear-history').addEventListener('click', handleClearHistory);
  document.getElementById('btn-back-from-stats').addEventListener('click',
    () => showScreen('dashboard'));
});
