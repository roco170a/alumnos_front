import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Inscripcion, InscripcionDto } from '../models/inscripcion.model';
import { formatDate } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  private apiUrl = `${environment.apiUrl}/api/Inscripciones`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las inscripciones con filtros opcionales
   * @param periodoAcademico - Periodo académico para filtrar resultados (opcional)
   * @param soloActivas - Indica si solo se deben obtener inscripciones activas (por defecto true)
   * @returns Observable con array de InscripcionDto procesadas
   */
  getInscripciones(periodoAcademico?: string, soloActivas: boolean = true): Observable<InscripcionDto[]> {
    let params = new HttpParams();
    
    if (periodoAcademico) {
      params = params.set('periodoAcademico', periodoAcademico);
    }
    
    params = params.set('soloActivas', soloActivas.toString());
    
    return this.http.get<InscripcionDto[]>(`${this.apiUrl}/detalles`, { params }).pipe(
      map(inscripciones => this.procesarInscripciones(inscripciones))
    );
  }

  /**
   * Obtiene inscripciones filtradas por alumno
   * @param alumnoId - ID del alumno a consultar
   * @param periodoAcademico - Periodo académico para filtrar resultados (opcional)
   * @param soloActivas - Indica si solo se deben obtener inscripciones activas (por defecto true)
   * @returns Observable con array de InscripcionDto procesadas
   */
  getInscripcionesPorAlumno(alumnoId: number, periodoAcademico?: string, soloActivas: boolean = true): Observable<InscripcionDto[]> {
    let params = new HttpParams();
    
    if (periodoAcademico) {
      params = params.set('periodoAcademico', periodoAcademico);
    }
    
    params = params.set('soloActivas', soloActivas.toString());
    
    return this.http.get<InscripcionDto[]>(`${this.apiUrl}/alumno/${alumnoId}`, { params }).pipe(
      map(inscripciones => this.procesarInscripciones(inscripciones))
    );
  }

  /**
   * Obtiene inscripciones filtradas por materia
   * @param materiaId - ID de la materia a consultar
   * @param periodoAcademico - Periodo académico para filtrar resultados (opcional)
   * @param soloActivas - Indica si solo se deben obtener inscripciones activas (por defecto true)
   * @returns Observable con array de InscripcionDto procesadas
   */
  getInscripcionesPorMateria(materiaId: number, periodoAcademico?: string, soloActivas: boolean = true): Observable<InscripcionDto[]> {
    let params = new HttpParams();
    
    if (periodoAcademico) {
      params = params.set('periodoAcademico', periodoAcademico);
    }
    
    params = params.set('soloActivas', soloActivas.toString());
    
    return this.http.get<InscripcionDto[]>(`${this.apiUrl}/materia/${materiaId}`, { params }).pipe(
      map(inscripciones => this.procesarInscripciones(inscripciones))
    );
  }

  /**
   * Obtiene una inscripción específica por su ID
   * @param id - ID de la inscripción a consultar
   * @returns Observable con objeto InscripcionDto procesado
   */
  getInscripcionPorId(id: number): Observable<InscripcionDto> {
    return this.http.get<InscripcionDto>(`${this.apiUrl}/${id}`).pipe(
      map(inscripcion => this.procesarInscripcion(inscripcion))
    );
  }

  /**
   * Crea un nuevo registro de inscripción
   * @param inscripcion - Objeto con datos de la inscripción a crear
   * @returns Observable con objeto Inscripcion creado
   */
  crearInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    return this.http.post<Inscripcion>(this.apiUrl, inscripcion);
  }

  /**
   * Actualiza un registro existente de inscripción
   * @param id - ID de la inscripción a actualizar
   * @param inscripcion - Objeto con datos actualizados de la inscripción
   * @returns Observable con respuesta del servidor
   */
  actualizarInscripcion(id: number, inscripcion: Inscripcion): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, inscripcion);
  }

  /**
   * Elimina un registro de inscripción
   * @param id - ID de la inscripción a eliminar
   * @returns Observable con respuesta del servidor
   */
  eliminarInscripcion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Procesa un arreglo de inscripciones para agregar propiedades calculadas
   * @param inscripciones - Array de inscripciones a procesar
   * @returns Array de inscripciones con propiedades adicionales
   */
  private procesarInscripciones(inscripciones: InscripcionDto[]): InscripcionDto[] {
    return inscripciones.map(inscripcion => this.procesarInscripcion(inscripcion));
  }

  /**
   * Procesa una inscripción individual para agregar propiedades calculadas
   * @param inscripcion - Objeto inscripción a procesar
   * @returns Inscripción con propiedades adicionales calculadas
   */
  private procesarInscripcion(inscripcion: InscripcionDto): InscripcionDto {
    return {
      ...inscripcion,
      fechaInscripcionFormateada: inscripcion.fechaInscripcion ? 
        formatDate(new Date(inscripcion.fechaInscripcion), 'dd/MM/yyyy', 'es-ES') : '',
      nombreCompletoAlumno: `${inscripcion.nombreAlumno} ${inscripcion.apellidosAlumno}`
    };
  }
} 