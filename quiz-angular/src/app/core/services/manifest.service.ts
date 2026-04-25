import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { StorageService } from './storage.service';
import { TestMeta, SessionState } from '../models';

const SESSION_KEY = 'quizSessionState';

@Injectable({ providedIn: 'root' })
export class ManifestService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  async loadTests(): Promise<TestMeta[]> {
    return firstValueFrom(this.http.get<TestMeta[]>('tests/index.json'));
  }

  getSessionState(): SessionState | null {
    return this.storage.get<SessionState>(SESSION_KEY);
  }

  saveSessionState(state: SessionState): void {
    this.storage.set(SESSION_KEY, state);
  }

  clearSessionState(): void {
    this.storage.remove(SESSION_KEY);
  }
}
