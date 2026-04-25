export interface TestMeta {
  id: string;
  nombre: string;
  ejercicio: string;
  fecha: string;
  fichero: string;
}

export interface Opcion {
  key: string;
  text: string;
}

export interface Pregunta {
  numero: number;
  tema: string;
  enunciado: string;
  opciones: { a: string; b: string; c: string; d: string };
  respuesta_correcta: string;
  explicacion?: string;
  explicación?: string;
}

export interface TestData {
  examen: string;
  ejercicio: string;
  fecha: string;
  preguntas: Pregunta[];
}

export interface QueueItem {
  numero: number;
  tema: string;
  enunciado: string;
  opciones: Opcion[];
  respuesta_correcta: string;
  explicacion: string;
}

export type AnswerResult = 'correct' | 'wrong' | 'blank';

export interface Answer {
  result: AnswerResult;
}

export interface SessionState {
  testId: string;
  testName: string;
  testFile: string;
  temasFiltrados: string[];
  mezclar: boolean;
  queue: QueueItem[];
  currentIndex: number;
  answers: Answer[];
  startedAt: string;
}

export interface HistoryEntry {
  testId: string;
  testName: string;
  temasFiltrados: string[];
  total: number;
  aciertos: number;
  fallos: number;
  blancos: number;
  fecha: string;
  duracion: number | null;
}

export interface PreguntaSupuesto {
  origen: string;
  enunciado: string;
  plantilla_solucion: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  conceptos_core: string[];
  leyes_relacionadas: string[];
  preguntas: PreguntaSupuesto[];
}

export interface SupuestosData {
  categorias: Categoria[];
}
