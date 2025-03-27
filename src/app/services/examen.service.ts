import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Examen, ExamenDto, ExamenListItem } from '../models/examen.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {
  private apiUrl = `${environment.apiUrl}/api/Examenes`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los exámenes, opcionalmente filtrados por estado activo
   * @param activos - Cadena que indica si solo se deben traer los exámenes activos ('true'/'false')
   * @returns Observable con array de ExamenDto
   */
  getExamenes(activos?: string): Observable<ExamenDto[]> {
    let params = new HttpParams();
    if (activos !== undefined) {
      params = params.set('activos', activos);
    }
    return this.http.get<ExamenDto[]>(this.apiUrl, { params });
  }

  /**
   * Obtiene exámenes filtrados por materia y estado
   * @param materiaId - ID de la materia a consultar
   * @param estado - Estado de los exámenes a filtrar (por defecto "Activo")
   * @returns Observable con array de ExamenDto
   */
  getExamenesPorMateria(materiaId: number, estado: string = 'Activo'): Observable<ExamenDto[]> {
    const params = new HttpParams()
      .set('materiaId', materiaId.toString())
      .set('estado', estado);
    return this.http.get<ExamenDto[]>(`${this.apiUrl}/porMateria`, { params });
  }

  /**
   * Obtiene exámenes con información detallada, opcionalmente filtrados por materia y estado
   * @param materiaId - ID opcional de la materia para filtrar resultados
   * @param estado - Estado de los exámenes a filtrar (por defecto "Activo")
   * @returns Observable con array de ExamenDto con detalles adicionales
   */
  getExamenesConDetalles(materiaId?: number, estado: string = 'Activo'): Observable<ExamenDto[]> {
    let params = new HttpParams().set('estado', estado);
    if (materiaId !== undefined) {
      params = params.set('materiaId', materiaId.toString());
    }
    return this.http.get<ExamenDto[]>(`${this.apiUrl}/detalles`, { params });
  }

  /**
   * Obtiene exámenes asociados a una programación específica
   * @param programacionId - ID de la programación de examen a consultar
   * @returns Observable con array de ExamenListItem
   */
  obtenerPorProgramacionId(programacionId: number): Observable<ExamenListItem[]> {
    return this.http.get<ExamenListItem[]>(`${this.apiUrl}/programacion/${programacionId}`);
  }

  /**
   * Obtiene exámenes asociados a una programación específica (alias para mantener coherencia de nombres)
   * @param programacionId - ID de la programación de examen a consultar
   * @returns Observable con array de ExamenDto
   */
  getExamenesPorProgramacion(programacionId: number): Observable<ExamenDto[]> {
    return this.http.get<ExamenDto[]>(`${this.apiUrl}/programacion/${programacionId}`);
  }

  /**
   * Obtiene un examen específico por su ID
   * @param id - ID del examen a consultar
   * @returns Observable con objeto ExamenDto
   */
  getExamenPorId(id: number): Observable<ExamenDto> {
    return this.http.get<ExamenDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo registro de examen
   * @param examen - Objeto con datos del examen a crear
   * @returns Observable con objeto Examen creado
   */
  crearExamen(examen: Examen): Observable<Examen> {
    return this.http.post<Examen>(this.apiUrl, examen);
  }

  /**
   * Actualiza un registro existente de examen
   * @param id - ID del examen a actualizar
   * @param examen - Objeto con datos actualizados del examen
   * @returns Observable con respuesta del servidor
   */
  actualizarExamen(id: number, examen: Examen): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, examen);
  }

  /**
   * Elimina un registro de examen
   * @param id - ID del examen a eliminar
   * @returns Observable con respuesta del servidor
   */
  eliminarExamen(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Elimina un registro de examen (método con nombre alineado al resto de servicios)
   * @param id - ID del examen a eliminar
   * @returns Observable con respuesta del servidor
   */
  eliminar(id: number): Observable<void> {
    return this.eliminarExamen(id);
  }
} 