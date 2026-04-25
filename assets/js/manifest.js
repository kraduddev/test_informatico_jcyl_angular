/**
 * manifest.js
 * Carga tests/index.json y renderiza la pantalla del selector.
 * Detecta si hay una sesión en curso guardada en localStorage.
 */

import { showScreen } from './navigation.js';
import { startQuizFromSession, loadTest } from './quiz.js';

const STORAGE_SESSION_KEY = 'quizSessionState';

export async function initManifest() {
  const grid = document.getElementById('test-grid');
  grid.innerHTML = '<div class="loader-wrap"><div class="loader"></div></div>';

  try {
    const res = await fetch('tests/index.json');
    if (!res.ok) throw new Error('No se pudo cargar el manifiesto de tests.');
    const tests = await res.json();
    renderTestGrid(tests);
    checkResumeBanner();
  } catch (err) {
    grid.innerHTML = `<p style="color:var(--color-wrong);padding:1rem">${err.message}</p>`;
  }
}

function renderTestGrid(tests) {
  const grid = document.getElementById('test-grid');
  if (!tests.length) {
    grid.innerHTML = '<p style="color:var(--color-text-light)">No hay tests disponibles.</p>';
    return;
  }

  grid.innerHTML = tests.map(t => `
    <button class="test-card" data-file="${t.fichero}" data-id="${t.id}" data-name="${t.nombre}">
      <span class="test-card-badge">${t.ejercicio || 'Examen'}</span>
      <h3>${t.nombre}</h3>
      <div class="test-card-meta">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        ${t.fecha}
      </div>
    </button>
  `).join('');

  grid.querySelectorAll('.test-card').forEach(card => {
    card.addEventListener('click', () => {
      loadTest(card.dataset.file, card.dataset.id, card.dataset.name);
    });
  });
}

function checkResumeBanner() {
  const state = getSessionState();
  const banner = document.getElementById('resume-banner');
  if (!banner) return;

  if (!state) {
    banner.style.display = 'none';
    return;
  }

  const testName = state.testName || 'Test';
  const current  = (state.currentIndex || 0) + 1;
  const total    = state.queue ? state.queue.length : '?';

  document.getElementById('resume-test-name').textContent = testName;
  document.getElementById('resume-progress').textContent  = `Pregunta ${current} de ${total}`;
  banner.style.display = 'flex';

  // Replace buttons to avoid accumulating duplicate listeners on re-entry
  const btnResume  = document.getElementById('btn-resume');
  const btnDiscard = document.getElementById('btn-discard');
  const freshResume  = btnResume.cloneNode(true);
  const freshDiscard = btnDiscard.cloneNode(true);
  btnResume.replaceWith(freshResume);
  btnDiscard.replaceWith(freshDiscard);

  freshResume.addEventListener('click', () => {
    startQuizFromSession(state);
  });

  freshDiscard.addEventListener('click', () => {
    if (confirm('¿Descartar la sesión guardada y empezar desde cero?')) {
      clearSessionState();
      banner.style.display = 'none';
    }
  });
}

export function getSessionState() {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveSessionState(state) {
  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(state));
  } catch {}
}

export function clearSessionState() {
  localStorage.removeItem(STORAGE_SESSION_KEY);
}

