/**
 * quiz.js
 * Lógica principal del quiz:
 *  - Carga y parseo del fichero JSON del test
 *  - Pantalla de configuración (filtro de temas, toggle de mezcla)
 *  - Motor de flashcard con aleatoriedad total (Fisher-Yates)
 *  - Persistencia de sesión en curso (localStorage)
 *  - Guardado de sesión finalizada en el historial
 */

import { showScreen } from './navigation.js';
import { saveSessionState, clearSessionState } from './manifest.js';

const STORAGE_HISTORY_KEY = 'quizHistory';

let currentTest   = null;   // { id, name, file, data }
let sessionState  = null;   // estado completo de la sesión en curso

// ─── Carga del test ───────────────────────────────────────────────────────────

export async function loadTest(file, id, name) {
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error('No se pudo cargar el test.');
    const data = await res.json();
    currentTest = { id, name, file, data };
    renderConfigScreen(data, name);
    showScreen('config');
  } catch (err) {
    alert(err.message);
  }
}

// ─── Pantalla de configuración ────────────────────────────────────────────────

function renderConfigScreen(data, name) {
  document.getElementById('config-test-title').textContent = name;
  document.getElementById('config-test-subtitle').textContent =
    `${data.ejercicio} · ${data.fecha}`;

  // Extraer temas únicos con conteo
  const temasMap = {};
  data.preguntas.forEach(p => {
    temasMap[p.tema] = (temasMap[p.tema] || 0) + 1;
  });
  const temas = Object.keys(temasMap).sort();

  const chipsContainer = document.getElementById('topic-chips');
  chipsContainer.innerHTML = temas.map((tema, i) => `
    <label class="topic-chip selected" data-tema="${tema}">
      <input type="checkbox" value="${tema}" checked>
      ${tema}
      <span class="chip-count">${temasMap[tema]}</span>
    </label>
  `).join('');

  // Interactividad de chips
  chipsContainer.querySelectorAll('.topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const cb = chip.querySelector('input');
      cb.checked = !cb.checked;
      chip.classList.toggle('selected', cb.checked);
      updateConfigSummary(data.preguntas);
    });
  });

  updateConfigSummary(data.preguntas);
}

function getSelectedTopics() {
  return [...document.querySelectorAll('#topic-chips input:checked')].map(cb => cb.value);
}

function updateConfigSummary(preguntas) {
  const selected = getSelectedTopics();
  const count = preguntas.filter(p => selected.includes(p.tema)).length;
  const el = document.getElementById('config-summary');
  if (count === 0) {
    el.textContent = 'Selecciona al menos un tema para continuar.';
    el.style.background = 'var(--color-wrong-bg)';
    el.style.color = 'var(--color-wrong)';
  } else {
    el.textContent = `Se practicarán ${count} preguntas de ${selected.length} tema${selected.length !== 1 ? 's' : ''}.`;
    el.style.background = '';
    el.style.color = '';
  }
  document.getElementById('btn-start-quiz').disabled = count === 0;
}

// Seleccionar / deseleccionar todos los temas
export function selectAllTopics(select = true) {
  document.querySelectorAll('#topic-chips .topic-chip').forEach(chip => {
    const cb = chip.querySelector('input');
    cb.checked = select;
    chip.classList.toggle('selected', select);
  });
  updateConfigSummary(currentTest.data.preguntas);
}

// ─── Construcción de la cola (Fisher-Yates) ───────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQueue(preguntas, temasFiltrados, mezclar = true) {
  let filtradas = preguntas.filter(p => temasFiltrados.includes(p.tema));
  if (mezclar) filtradas = shuffle(filtradas);

  return filtradas.map(p => {
    // Convertir opciones a array con clave original
    const opcionesArr = Object.entries(p.opciones).map(([key, text]) => ({ key, text }));
    const opcionesBarajadas = mezclar ? shuffle(opcionesArr) : opcionesArr;

    return {
      numero: p.numero,
      tema: p.tema,
      enunciado: p.enunciado,
      opciones: opcionesBarajadas,           // [{key, text}, ...]
      respuesta_correcta: p.respuesta_correcta,
      explicacion: p['explicación'] || p['explicacion'] || ''
    };
  });
}

// ─── Inicio del quiz ──────────────────────────────────────────────────────────

export function startQuiz() {
  const temasFiltrados = getSelectedTopics();
  if (!temasFiltrados.length) return;

  const mezclar = document.getElementById('toggle-shuffle').checked;
  const queue   = buildQueue(currentTest.data.preguntas, temasFiltrados, mezclar);

  sessionState = {
    testId:       currentTest.id,
    testName:     currentTest.name,
    testFile:     currentTest.file,
    temasFiltrados,
    mezclar,
    queue,
    currentIndex: 0,
    answers:      [],   // { result: 'correct' | 'wrong' | 'blank' }
    startedAt:    new Date().toISOString()
  };

  saveSessionState(sessionState);
  showScreen('quiz');
  renderCard();
}

export function startQuizFromSession(state) {
  sessionState = state;
  // Si currentTest no está cargado (recarga de página), recuperar datos
  if (!currentTest || currentTest.id !== state.testId) {
    fetch(state.testFile)
      .then(r => r.json())
      .then(data => {
        currentTest = { id: state.testId, name: state.testName, file: state.testFile, data };
        showScreen('quiz');
        renderCard();
      })
      .catch(() => alert('No se pudo recuperar el test de la sesión guardada.'));
  } else {
    showScreen('quiz');
    renderCard();
  }
}

// ─── Renderizado de la tarjeta ────────────────────────────────────────────────

function renderCard() {
  const { queue, currentIndex, answers } = sessionState;
  const total    = queue.length;
  const aciertos = answers.filter(a => a.result === 'correct').length;
  const fallos   = answers.filter(a => a.result === 'wrong').length;

  // Topbar
  document.getElementById('quiz-progress-text').textContent =
    `${currentIndex + 1} / ${total}`;
  document.getElementById('quiz-score-badge').textContent =
    `✓ ${aciertos}  ✗ ${fallos}`;

  // Barra de progreso
  const pct = (currentIndex / total) * 100;
  document.getElementById('progress-bar-fill').style.width = pct + '%';

  // Pregunta actual
  const pregunta = queue[currentIndex];

  document.getElementById('question-tema').textContent     = pregunta.tema;
  document.getElementById('question-enunciado').textContent = pregunta.enunciado;

  // Opciones
  const opsList = document.getElementById('options-list');
  const LETTERS  = ['A', 'B', 'C', 'D', 'E'];
  opsList.innerHTML = pregunta.opciones.map((op, i) => `
    <button class="option-btn" data-key="${op.key}">
      <span class="option-letter">${LETTERS[i]}</span>
      <span>${op.text}</span>
    </button>
  `).join('');

  // Ocultar explicación y botón siguiente; mostrar botón dejar en blanco
  const expl   = document.getElementById('explanation-box');
  const btnNext  = document.getElementById('btn-next');
  const btnBlank = document.getElementById('btn-blank');
  expl.classList.remove('visible');
  expl.querySelector('p').textContent = '';
  btnNext.style.display  = 'none';
  btnBlank.style.display = '';

  // Eventos de opciones
  opsList.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(btn, pregunta));
  });
}

function handleAnswer(selectedBtn, pregunta) {
  // Bloquear todas las opciones
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

  // Ocultar botón dejar en blanco
  document.getElementById('btn-blank').style.display = 'none';

  const isCorrect = selectedBtn.dataset.key === pregunta.respuesta_correcta;

  // Marcar seleccionada
  selectedBtn.classList.add(isCorrect ? 'correct' : 'wrong');

  // Si fue incorrecta, mostrar la correcta
  if (!isCorrect) {
    document.querySelectorAll('.option-btn').forEach(b => {
      if (b.dataset.key === pregunta.respuesta_correcta) {
        b.classList.add('correct');
      }
    });
  }

  // Mostrar explicación
  const expl = document.getElementById('explanation-box');
  expl.querySelector('p').textContent = pregunta.explicacion;
  expl.classList.add('visible');

  // Guardar respuesta
  sessionState.answers.push({ result: isCorrect ? 'correct' : 'wrong' });
  saveSessionState(sessionState);

  // Mostrar botón siguiente / finalizar
  const btnNext = document.getElementById('btn-next');
  const esUltima = sessionState.currentIndex === sessionState.queue.length - 1;
  btnNext.textContent = esUltima ? 'Ver resultados' : 'Siguiente →';
  btnNext.style.display = 'inline-flex';
}

export function handleBlank() {
  const pregunta = sessionState.queue[sessionState.currentIndex];

  // Bloquear todas las opciones
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

  // Ocultar botón dejar en blanco
  document.getElementById('btn-blank').style.display = 'none';

  // Revelar la respuesta correcta
  document.querySelectorAll('.option-btn').forEach(b => {
    if (b.dataset.key === pregunta.respuesta_correcta) {
      b.classList.add('correct');
    }
  });

  // Mostrar explicación
  const expl = document.getElementById('explanation-box');
  expl.querySelector('p').textContent = pregunta.explicacion;
  expl.classList.add('visible');

  // Guardar respuesta en blanco
  sessionState.answers.push({ result: 'blank' });
  saveSessionState(sessionState);

  // Mostrar botón siguiente / finalizar
  const btnNext = document.getElementById('btn-next');
  const esUltima = sessionState.currentIndex === sessionState.queue.length - 1;
  btnNext.textContent = esUltima ? 'Ver resultados' : 'Siguiente →';
  btnNext.style.display = 'inline-flex';
}

export function nextCard() {
  sessionState.currentIndex++;
  if (sessionState.currentIndex >= sessionState.queue.length) {
    finishQuiz();
  } else {
    saveSessionState(sessionState);
    renderCard();
  }
}

// ─── Fin del quiz ─────────────────────────────────────────────────────────────

function finishQuiz() {
  const { answers, queue, testId, testName, temasFiltrados, startedAt } = sessionState;
  const aciertos = answers.filter(a => a.result === 'correct').length;
  const fallos   = answers.filter(a => a.result === 'wrong').length;
  const blancos  = answers.filter(a => a.result === 'blank').length;
  const total    = queue.length;

  // Guardar en historial
  const sesion = {
    testId,
    testName,
    temasFiltrados,
    total,
    aciertos,
    fallos,
    blancos,
    fecha: new Date().toISOString(),
    duracion: startedAt ? Math.round((Date.now() - new Date(startedAt).getTime()) / 1000) : null
  };
  addToHistory(sesion);

  // Limpiar sesión en curso
  clearSessionState();

  renderResults(aciertos, fallos, blancos, total, queue, answers);
  showScreen('results');
}

// ─── Pantalla de resultados ───────────────────────────────────────────────────

function renderResults(aciertos, fallos, blancos, total, queue, answers) {
  // Puntuación con penalización: correctas - incorrectas/3
  const puntuacion = aciertos - fallos / 3;
  const pct = total ? Math.round((puntuacion / total) * 100) : 0;

  // Círculo de puntuación
  const circle = document.getElementById('score-circle');
  circle.textContent = pct + '%';
  circle.className   = 'score-circle ' + scoreClass(pct);

  document.getElementById('results-correct').textContent = aciertos;
  document.getElementById('results-wrong').textContent   = fallos;
  document.getElementById('results-blank').textContent   = blancos;
  document.getElementById('results-total').textContent   = total;

  // Mensaje motivacional
  const msg = document.getElementById('results-message');
  if      (pct >= 80) msg.textContent = '¡Excelente resultado! Sigue así. 🎉';
  else if (pct >= 60) msg.textContent = 'Buen trabajo. Repasa los fallos y vuelve a intentarlo.';
  else if (pct >= 40) msg.textContent = 'Puedes mejorar. Revisa los temas con más fallos.';
  else                msg.textContent = 'Sigue practicando. ¡Con constancia lo consigues!';

  // Tabla por tema
  const temasStats = {};
  queue.forEach((p, i) => {
    if (!temasStats[p.tema]) temasStats[p.tema] = { ok: 0, total: 0 };
    temasStats[p.tema].total++;
    if (answers[i] && answers[i].result === 'correct') temasStats[p.tema].ok++;
  });

  const tbody = document.getElementById('topics-results-body');
  tbody.innerHTML = Object.entries(temasStats)
    .sort(([,a],[,b]) => (b.ok/b.total) - (a.ok/a.total))
    .map(([tema, s]) => {
      const t_pct = Math.round((s.ok / s.total) * 100);
      const cls   = t_pct >= 80 ? 'high' : t_pct >= 50 ? 'medium' : 'low';
      return `
        <tr>
          <td>${tema}</td>
          <td class="badge-correct">${s.ok}</td>
          <td class="badge-wrong">${s.total - s.ok}</td>
          <td>
            <div style="display:flex;align-items:center;gap:.5rem">
              <div class="mini-bar-wrap">
                <div class="mini-bar-fill ${cls}" style="width:${t_pct}%"></div>
              </div>
              <span style="font-size:.8rem;font-weight:700">${t_pct}%</span>
            </div>
          </td>
        </tr>
      `;
    }).join('');

  // Revisión de errores
  const wrongSection = document.getElementById('wrong-answers-section');
  const wrongList    = document.getElementById('wrong-answers-list');
  const wrongEntries = queue
    .map((p, i) => ({ pregunta: p, answer: answers[i] }))
    .filter(({ answer }) => answer && answer.result === 'wrong');

  if (wrongEntries.length) {
    wrongList.innerHTML = '';
    wrongEntries.forEach(({ pregunta }) => {
      const correctaKey  = pregunta.respuesta_correcta;
      const correctaText = (pregunta.opciones.find(o => o.key === correctaKey) || {}).text || correctaKey;

      const item = document.createElement('div');
      item.className = 'wrong-answer-item';

      const pQuestion = document.createElement('p');
      pQuestion.className = 'wa-question';
      pQuestion.textContent = pregunta.enunciado;
      item.appendChild(pQuestion);

      const pCorrect = document.createElement('p');
      pCorrect.className = 'wa-correct-answer';
      pCorrect.textContent = `✓ Respuesta correcta: ${correctaText}`;
      item.appendChild(pCorrect);

      if (pregunta.explicacion) {
        const pExpl = document.createElement('p');
        pExpl.className = 'wa-explanation';
        pExpl.textContent = pregunta.explicacion;
        item.appendChild(pExpl);
      }

      wrongList.appendChild(item);
    });
    wrongSection.style.display = '';
  } else {
    wrongSection.style.display = 'none';
  }
}

export function retryQuiz() {
  // Repetir con la misma configuración
  if (!currentTest) return;
  const temasFiltrados = sessionState?.temasFiltrados || getSelectedTopics();
  const mezclar = true;
  const queue = buildQueue(currentTest.data.preguntas, temasFiltrados, mezclar);

  sessionState = {
    testId:       currentTest.id,
    testName:     currentTest.name,
    testFile:     currentTest.file,
    temasFiltrados,
    mezclar,
    queue,
    currentIndex: 0,
    answers:      [],
    startedAt:    new Date().toISOString()
  };

  saveSessionState(sessionState);
  showScreen('quiz');
  renderCard();
}

// ─── Historial ────────────────────────────────────────────────────────────────

function addToHistory(sesion) {
  try {
    const history = getHistory();
    history.unshift(sesion);
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(history));
  } catch {}
}

export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_HISTORY_KEY);
}

// ─── Utilidades ───────────────────────────────────────────────────────────────

function scoreClass(pct) {
  if (pct >= 80) return 'excellent';
  if (pct >= 60) return 'good';
  if (pct >= 40) return 'average';
  return 'poor';
}

export function getCurrentTest() { return currentTest; }
export function getSessionState() { return sessionState; }

