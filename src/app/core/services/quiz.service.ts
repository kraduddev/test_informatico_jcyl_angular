import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { StorageService } from './storage.service';
import { ManifestService } from './manifest.service';
import {
  TestData, TestMeta, QueueItem, SessionState,
  Answer, AnswerResult, HistoryEntry, Opcion
} from '../models';

const HISTORY_KEY = 'quizHistory';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private manifest = inject(ManifestService);

  // ── Signals ──────────────────────────────────────────────────────────────────
  currentTestMeta = signal<TestMeta | null>(null);
  currentTestData = signal<TestData | null>(null);
  sessionState    = signal<SessionState | null>(null);

  // Computed shortcuts
  queue         = computed(() => this.sessionState()?.queue ?? []);
  currentIndex  = computed(() => this.sessionState()?.currentIndex ?? 0);
  answers       = computed(() => this.sessionState()?.answers ?? []);
  currentCard   = computed(() => this.queue()[this.currentIndex()] ?? null);
  isLastCard    = computed(() => this.currentIndex() >= this.queue().length - 1);
  aciertos      = computed(() => this.answers().filter(a => a.result === 'correct').length);
  fallos        = computed(() => this.answers().filter(a => a.result === 'wrong').length);
  blancos       = computed(() => this.answers().filter(a => a.result === 'blank').length);
  progress      = computed(() => {
    const total = this.queue().length;
    return total ? (this.currentIndex() / total) * 100 : 0;
  });

  // ── Load test ─────────────────────────────────────────────────────────────────
  async loadTest(meta: TestMeta): Promise<void> {
    const data = await firstValueFrom(this.http.get<TestData>(meta.fichero));
    this.currentTestMeta.set(meta);
    this.currentTestData.set(data);
  }

  // ── Start / Resume ────────────────────────────────────────────────────────────
  startQuiz(temasFiltrados: string[], mezclar: boolean): void {
    const data = this.currentTestData();
    const meta = this.currentTestMeta();
    if (!data || !meta) return;

    const queue = this.buildQueue(data.preguntas, temasFiltrados, mezclar);
    const state: SessionState = {
      testId: meta.id,
      testName: meta.nombre,
      testFile: meta.fichero,
      temasFiltrados,
      mezclar,
      queue,
      currentIndex: 0,
      answers: [],
      startedAt: new Date().toISOString()
    };
    this.sessionState.set(state);
    this.manifest.saveSessionState(state);
  }

  async resumeSession(state: SessionState): Promise<void> {
    this.sessionState.set(state);
    // Ensure test data is loaded
    if (!this.currentTestData() || this.currentTestMeta()?.id !== state.testId) {
      const data = await firstValueFrom(this.http.get<TestData>(state.testFile));
      this.currentTestData.set(data);
      this.currentTestMeta.set({
        id: state.testId,
        nombre: state.testName,
        fichero: state.testFile,
        ejercicio: '',
        fecha: ''
      });
    }
  }

  // ── Answer ────────────────────────────────────────────────────────────────────
  submitAnswer(result: AnswerResult): void {
    const state = this.sessionState();
    if (!state) return;
    const updated = { ...state, answers: [...state.answers, { result }] };
    this.sessionState.set(updated);
    this.manifest.saveSessionState(updated);
  }

  // ── Navigation ────────────────────────────────────────────────────────────────
  nextCard(): boolean {
    const state = this.sessionState();
    if (!state) return false;
    const nextIndex = state.currentIndex + 1;
    if (nextIndex >= state.queue.length) return false; // quiz finished
    const updated = { ...state, currentIndex: nextIndex };
    this.sessionState.set(updated);
    this.manifest.saveSessionState(updated);
    return true;
  }

  // ── Finish ────────────────────────────────────────────────────────────────────
  finishQuiz(): void {
    const state = this.sessionState();
    if (!state) return;
    const entry: HistoryEntry = {
      testId: state.testId,
      testName: state.testName,
      temasFiltrados: state.temasFiltrados,
      total: state.queue.length,
      aciertos: state.answers.filter(a => a.result === 'correct').length,
      fallos: state.answers.filter(a => a.result === 'wrong').length,
      blancos: state.answers.filter(a => a.result === 'blank').length,
      fecha: new Date().toISOString(),
      duracion: state.startedAt
        ? Math.round((Date.now() - new Date(state.startedAt).getTime()) / 1000)
        : null
    };
    this.addToHistory(entry);
    this.manifest.clearSessionState();
  }

  // ── Retry ─────────────────────────────────────────────────────────────────────
  retryQuiz(): void {
    const state = this.sessionState();
    const data  = this.currentTestData();
    const meta  = this.currentTestMeta();
    if (!state || !data || !meta) return;
    this.startQuiz(state.temasFiltrados, true);
  }

  // ── History ───────────────────────────────────────────────────────────────────
  getHistory(): HistoryEntry[] {
    return this.storage.get<HistoryEntry[]>(HISTORY_KEY) ?? [];
  }

  clearHistory(): void {
    this.storage.remove(HISTORY_KEY);
  }

  // ── Utilities ─────────────────────────────────────────────────────────────────
  scoreClass(pct: number): string {
    if (pct >= 80) return 'excellent';
    if (pct >= 60) return 'good';
    if (pct >= 40) return 'average';
    return 'poor';
  }

  calcScore(aciertos: number, fallos: number, total: number): number {
    const puntuacion = aciertos - fallos / 3;
    return total ? Math.round((puntuacion / total) * 100) : 0;
  }

  private addToHistory(entry: HistoryEntry): void {
    const history = this.getHistory();
    history.unshift(entry);
    this.storage.set(HISTORY_KEY, history);
  }

  private buildQueue(preguntas: any[], temas: string[], mezclar: boolean): QueueItem[] {
    let filtradas = preguntas.filter(p => temas.includes(p.tema));
    if (mezclar) filtradas = this.shuffle(filtradas);
    return filtradas.map(p => {
      const opcionesArr: Opcion[] = Object.entries(p.opciones).map(([key, text]) => ({ key, text: text as string }));
      return {
        numero: p.numero,
        tema: p.tema,
        enunciado: p.enunciado,
        opciones: mezclar ? this.shuffle(opcionesArr) : opcionesArr,
        respuesta_correcta: p.respuesta_correcta,
        explicacion: p['explicación'] || p['explicacion'] || ''
      };
    });
  }

  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
