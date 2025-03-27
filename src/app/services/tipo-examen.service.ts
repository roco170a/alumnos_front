import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoExamen, TipoExamenDto } from '../models/examen.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoExamenService {
  private apiUrl = `${environment.apiUrl}/api/TiposExamen`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los tipos de examen registrados en el sistema
   * @returns Observable con array de TipoExamenDto
   */
  getTiposExamen(): Observable<TipoExamenDto[]> {
    return this.http.get<TipoExamenDto[]>(this.apiUrl);
  }

  /**
   * Obtiene un tipo de examen específico por su ID
   * @param id - ID del tipo de examen a consultar
   * @returns Observable con objeto TipoExamenDto
   */
  getTipoExamenPorId(id: number): Observable<TipoExamenDto> {
    return this.http.get<TipoExamenDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo registro de tipo de examen
   * @param tipoExamen - Objeto con datos del tipo de examen a crear
   * @returns Observable con objeto TipoExamen creado
   */
  crearTipoExamen(tipoExamen: TipoExamen): Observable<TipoExamen> {
    return this.http.post<TipoExamen>(this.apiUrl, tipoExamen);
  }

  /**
   * Actualiza un registro existente de tipo de examen
   * @param id - ID del tipo de examen a actualizar
   * @param tipoExamen - Objeto con datos actualizados del tipo de examen
   * @returns Observable con respuesta del servidor
   */
  actualizarTipoExamen(id: number, tipoExamen: TipoExamen): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, tipoExamen);
  }

  /**
   * Elimina un registro de tipo de examen
   * @param id - ID del tipo de examen a eliminar
   * @returns Observable con respuesta del servidor
   */
  eliminarTipoExamen(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 