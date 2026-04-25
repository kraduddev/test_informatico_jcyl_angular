/**
 * supuestos.js
 * Gestiona la carga y renderizado de supuestos prácticos.
 * Modos: por examen (agrupado por origen) y por categoría.
 */

const DATA_URL = 'supuestos/categorias.json';
let cachedData = null;

// Mapa origen → ruta del fichero markdown completo
const ORIGEN_A_FICHERO = {
  'JCyL 2022':      'supuestos/jcyl-2022.md',
  'JCyL 2024':      'supuestos/jcyl-2024.md',
  'Salamanca 2023': 'supuestos/salamanca-2023.md',
};

// Caché de ficheros MD ya cargados
const mdCache = {};

async function loadData() {
  if (cachedData) return cachedData;
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error('No se pudo cargar los supuestos prácticos.');
  cachedData = await res.json();
  return cachedData;
}

// ─── Renderizado por EXAMEN ────────────────────────────────────────────────────

export async function renderPorExamen() {
  const container = document.getElementById('examenes-content');
  container.innerHTML = '<div class="loader-wrap"><div class="loader"></div></div>';

  try {
    const { categorias } = await loadData();

    // Agrupar todas las preguntas de todas las categorías por origen
    const grupos = {}; // { origen: [ { ...pregunta, categoria } ] }
    categorias.forEach(cat => {
      cat.preguntas.forEach(p => {
        if (!grupos[p.origen]) grupos[p.origen] = [];
        grupos[p.origen].push({ ...p, categoria: cat });
      });
    });

    // Ordenar orígenes cronológicamente (por el año que aparece en el string)
    const origenesOrdenados = Object.keys(grupos).sort((a, b) => {
      const yearA = parseInt(a.match(/\d{4}/)?.[0] || '0');
      const yearB = parseInt(b.match(/\d{4}/)?.[0] || '0');
      if (yearA !== yearB) return yearA - yearB;
      return a.localeCompare(b);
    });

    if (!origenesOrdenados.length) {
      container.innerHTML = '<p class="supuestos-empty">No hay supuestos disponibles.</p>';
      return;
    }

    container.innerHTML = origenesOrdenados.map((origen, idx) => {
      const preguntas = grupos[origen];
      const tieneFichero = !!ORIGEN_A_FICHERO[origen];
      return `
        <div class="supuesto-group">
          <button class="supuesto-group-header" data-group="${idx}" aria-expanded="false">
            <span class="supuesto-group-title">
              <span class="supuesto-origen-badge">${origen}</span>
              <span class="supuesto-group-count">${preguntas.length} pregunta${preguntas.length !== 1 ? 's' : ''}</span>
            </span>
            <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="supuesto-group-body" id="group-body-${idx}">
            ${tieneFichero ? `
            <div class="examen-plantilla-wrap">
              <button class="examen-plantilla-toggle" data-origen="${encodeURIComponent(origen)}">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                Ver plantilla de examen
                <svg class="chevron-sm" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div class="examen-plantilla-panel" hidden>
                <div class="examen-plantilla-content"></div>
              </div>
            </div>
            ` : ''}
            ${preguntas.map((p, pi) => renderPreguntaCard(p, pi, true)).join('')}
          </div>
        </div>
      `;
    }).join('');

    bindAccordions(container);
    bindPlantillaExamen(container);
  } catch (err) {
    container.innerHTML = `<p class="supuestos-error">${err.message}</p>`;
  }
}

// ─── Renderizado por CATEGORÍA ─────────────────────────────────────────────────

export async function renderPorCategoria() {
  const container = document.getElementById('categorias-content');
  container.innerHTML = '<div class="loader-wrap"><div class="loader"></div></div>';

  try {
    const { categorias } = await loadData();

    if (!categorias.length) {
      container.innerHTML = '<p class="supuestos-empty">No hay categorías disponibles.</p>';
      return;
    }

    container.innerHTML = categorias.map((cat, idx) => `
      <div class="supuesto-group">
        <button class="supuesto-group-header" data-group="cat-${idx}" aria-expanded="false">
          <span class="supuesto-group-title">
            <span class="supuesto-cat-name">${cat.nombre}</span>
            <span class="supuesto-group-count">${cat.preguntas.length} pregunta${cat.preguntas.length !== 1 ? 's' : ''}</span>
          </span>
          <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="supuesto-group-body" id="group-body-cat-${idx}">
          <!-- Meta de la categoría -->
          <div class="supuesto-cat-meta">
            <div class="supuesto-meta-block">
              <span class="supuesto-meta-label">Conceptos core</span>
              <div class="supuesto-tags">
                ${cat.conceptos_core.map(c => `<span class="tag tag-core">${c}</span>`).join('')}
              </div>
            </div>
            <div class="supuesto-meta-block">
              <span class="supuesto-meta-label">Leyes relacionadas</span>
              <div class="supuesto-tags">
                ${cat.leyes_relacionadas.map(l => `<span class="tag tag-ley">${l}</span>`).join('')}
              </div>
            </div>
          </div>
          <!-- Preguntas de la categoría -->
          ${cat.preguntas.map((p, pi) => renderPreguntaCard(p, pi, false)).join('')}
        </div>
      </div>
    `).join('');

    bindAccordions(container);
  } catch (err) {
    container.innerHTML = `<p class="supuestos-error">${err.message}</p>`;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderPreguntaCard(pregunta, idx, showCategoria) {
  const { origen, enunciado, plantilla_solucion, categoria } = pregunta;
  return `
    <div class="pregunta-card">
      <div class="pregunta-card-header">
        <span class="supuesto-origen-badge">${origen}</span>
        ${showCategoria ? `<span class="tag tag-core" style="margin-left:.5rem">${categoria.nombre}</span>` : ''}
        <span class="pregunta-num">P${idx + 1}</span>
      </div>
      <p class="pregunta-enunciado">${enunciado}</p>

      ${showCategoria ? `
      <div class="supuesto-meta-inline">
        <div class="supuesto-meta-block">
          <span class="supuesto-meta-label">Conceptos core</span>
          <div class="supuesto-tags">
            ${categoria.conceptos_core.map(c => `<span class="tag tag-core">${c}</span>`).join('')}
          </div>
        </div>
        <div class="supuesto-meta-block">
          <span class="supuesto-meta-label">Leyes relacionadas</span>
          <div class="supuesto-tags">
            ${categoria.leyes_relacionadas.map(l => `<span class="tag tag-ley">${l}</span>`).join('')}
          </div>
        </div>
      </div>
      ` : ''}

      <button class="pregunta-plantilla-toggle" data-pi="${idx}">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
        Ver plantilla de respuesta
      </button>
      <div class="pregunta-plantilla" style="display:none">
        <strong>💡 Plantilla de respuesta</strong>
        <p>${plantilla_solucion}</p>
      </div>
    </div>
  `;
}

function bindPlantillaExamen(container) {
  container.querySelectorAll('.examen-plantilla-toggle').forEach(btn => {
    btn.addEventListener('click', async () => {
      const origen = decodeURIComponent(btn.dataset.origen);
      const panel = btn.nextElementSibling;
      const content = panel.querySelector('.examen-plantilla-content');
      const isOpen = !panel.hidden;

      if (isOpen) {
        panel.hidden = true;
        btn.classList.remove('active');
        return;
      }

      // Abrir panel
      panel.hidden = false;
      btn.classList.add('active');

      // Si ya estaba cargado, no repetir fetch
      if (mdCache[origen]) {
        content.innerHTML = mdCache[origen];
        return;
      }

      content.innerHTML = '<div class="loader-wrap"><div class="loader"></div></div>';

        try {
        const fichero = ORIGEN_A_FICHERO[origen];
        const res = await fetch(fichero);
        if (!res.ok) throw new Error(`No se pudo cargar ${fichero} (HTTP ${res.status})`);
        const text = await res.text();
        if (!window.marked) {
          // marked no disponible: mostrar como texto preformateado
          mdCache[origen] = `<pre style="white-space:pre-wrap;font-size:.85rem">${text.replace(/</g,'&lt;')}</pre>`;
        } else {
          mdCache[origen] = window.marked.parse(text);
        }
        content.innerHTML = mdCache[origen];
      } catch (e) {
        content.innerHTML = `<p class="supuestos-error">${e.message}</p>`;
      }
    });
  });
}

function bindAccordions(container) {
  // Acordeones de grupos (examen / categoría)
  container.querySelectorAll('.supuesto-group-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const bodyId = `group-body-${btn.dataset.group}`;
      const body = document.getElementById(bodyId);
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      body.classList.toggle('open', !expanded);
    });
  });

  // Toggles de plantilla de respuesta dentro de preguntas
  container.querySelectorAll('.pregunta-plantilla-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const plantilla = btn.nextElementSibling;
      const open = plantilla.style.display !== 'none';
      plantilla.style.display = open ? 'none' : 'block';
      btn.classList.toggle('active', !open);
      btn.querySelector('svg').style.transform = open ? '' : 'rotate(180deg)';
    });
  });

}

