
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReporteApi {
  id: number;
  titulo: string;
  problema: string;
  aula: string;
  prioridad: string;
  reportadoPor: string;
  estado: string;
  fechaReporte: string;
  fechaAsignacion: string | null;
  fechaResolucion: string | null;
  usuarioId: number | null;
  tecnicoId: number | null;
  categoriaId: number | null;
  ubicacionId: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class ReportesApi {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5253/api/Reporte';

  obtenerTodos(): Observable<ReporteApi[]> {
    return this.http.get<ReporteApi[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<ReporteApi> {
    return this.http.get<ReporteApi>(`${this.apiUrl}/${id}`);
  }

  crear(reporte: Partial<ReporteApi>): Observable<ReporteApi> {
    return this.http.post<ReporteApi>(this.apiUrl, reporte);
  }
}
