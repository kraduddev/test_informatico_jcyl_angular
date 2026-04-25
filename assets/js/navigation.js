/**
 * navigation.js
 * Gestión de pantallas de la SPA.
 * Separado de app.js para evitar dependencias circulares con los módulos
 * que necesitan llamar a showScreen (quiz.js, manifest.js, stats.js).
 */

// Pantallas donde se oculta el botón de estadísticas
const SUPUESTOS_SCREENS = new Set([
  'supuestos-menu',
  'supuestos-examenes',
  'supuestos-categorias',
]);

// Caché de elementos DOM — inicializada en initNavigation()
let allScreens = [];
let btnStats   = null;

/**
 * Inicializa la caché de elementos DOM.
 * Debe llamarse una vez en DOMContentLoaded, antes de cualquier showScreen.
 */
export function initNavigation() {
  allScreens = Array.from(document.querySelectorAll('.screen'));
  btnStats   = document.getElementById('btn-go-stats');
}

/**
 * Muestra la pantalla indicada y oculta el resto.
 * @param {string} name  Sufijo del id: "dashboard" → #screen-dashboard
 */
export function showScreen(name) {
  allScreens.forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`screen-${name}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (btnStats) {
    btnStats.style.display = SUPUESTOS_SCREENS.has(name) ? 'none' : '';
  }
}

/**
 * Navega a una pantalla y ejecuta una acción opcional al entrar.
 * @param {string}    name     Nombre de la pantalla (ver showScreen)
 * @param {Function} [onEnter] Callback a ejecutar tras mostrar la pantalla
 */
export function navigate(name, onEnter) {
  showScreen(name);
  onEnter?.();
}
