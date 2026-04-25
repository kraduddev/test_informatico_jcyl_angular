import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SupuestosData } from '../models';

const ORIGEN_A_FICHERO: Record<string, string> = {
  'JCyL 2022':      'assets/supuestos/jcyl-2022.md',
  'JCyL 2024':      'assets/supuestos/jcyl-2024.md',
  'Salamanca 2023': 'assets/supuestos/salamanca-2023.md',
};

@Injectable({ providedIn: 'root' })
export class SupuestosService {
  private http = inject(HttpClient);
  private cachedData: SupuestosData | null = null;
  private mdCache: Record<string, string> = {};

  async loadData(): Promise<SupuestosData> {
    if (this.cachedData) return this.cachedData;
    this.cachedData = await firstValueFrom(this.http.get<SupuestosData>('assets/supuestos/categorias.json'));
    return this.cachedData;
  }

  async loadMarkdown(origen: string): Promise<string> {
    if (this.mdCache[origen]) return this.mdCache[origen];
    const fichero = ORIGEN_A_FICHERO[origen];
    if (!fichero) throw new Error(`No hay plantilla para ${origen}`);
    const text = await firstValueFrom(this.http.get(fichero, { responseType: 'text' }));
    this.mdCache[origen] = text;
    return text;
  }

  hasFichero(origen: string): boolean {
    return !!ORIGEN_A_FICHERO[origen];
  }
}
