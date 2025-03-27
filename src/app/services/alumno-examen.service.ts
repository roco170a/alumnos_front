import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AlumnoExamen, AlumnoExamenDto, AlumnoExamenFiltros } from '../models/alumno-examen.model';

@Injectable({
  providedIn: 'root'
})
export class AlumnoExamenService {
  private apiUrl = `${environment.apiUrl}/api/AlumnoExamenes`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene lista de AlumnoExamenes por examen
   * @param examenId - ID del examen a consultar
   * @returns Observable con array de AlumnoExamenDto
   */
  getAlumnoExamenesPorExamen(examenId: number): Observable<AlumnoExamenDto[]> {
    return this.http.get<AlumnoExamenDto[]>(`${this.apiUrl}/examen/${examenId}`);
  }

  /**
   * Obtiene lista de AlumnoExamenes por examen con información detallada
   * @param examenId - ID del examen a consultar
   * @returns Observable con array de AlumnoExamenDto con detalles adicionales
   */
  getAlumnoExamenesPorExamenDetalles(examenId: number): Observable<AlumnoExamenDto[]> {
    return this.http.get<AlumnoExamenDto[]>(`${this.apiUrl}/examen/${examenId}/detalles`);
  }

  /**
   * Obtiene lista de AlumnoExamenes por alumno, opcionalmente filtrado por periodo académico
   * @param alumnoId - ID del alumno a consultar
   * @param periodoAcademico - Periodo académico opcional para filtrar resultados
   * @returns Observable con array de AlumnoExamenDto
   */
  getAlumnoExamenesPorAlumno(alumnoId: number, periodoAcademico?: string): Observable<AlumnoExamenDto[]> {
    let params = new HttpParams();
    if (periodoAcademico) {
      params = params.append('periodoAcademico', periodoAcademico);
    }
    return this.http.get<AlumnoExamenDto[]>(`${this.apiUrl}/alumno/${alumnoId}`, { params });
  }

  /**
   * Obtiene todos los AlumnoExamenes aplicando filtros opcionales
   * @param filtros - Objeto con criterios de filtrado: examenId, alumnoId, estado, terminoBusqueda
   * @returns Observable con array de AlumnoExamenDto filtrados
   */
  getAlumnoExamenes(filtros?: AlumnoExamenFiltros): Observable<AlumnoExamenDto[]> {
    let params = new HttpParams();
    
    if (filtros) {
      if (filtros.examenId) {
        params = params.append('examenId', filtros.examenId.toString());
      }
      if (filtros.alumnoId) {
        params = params.append('alumnoId', filtros.alumnoId.toString());
      }
      if (filtros.estado) {
        params = params.append('estado', filtros.estado);
      }
      if (filtros.terminoBusqueda) {
        params = params.append('busqueda', filtros.terminoBusqueda);
      }
    }
    
    return this.http.get<AlumnoExamenDto[]>(`${this.apiUrl}`, { params });
  }

  /**
   * Obtiene un AlumnoExamen específico por su ID
   * @param id - ID del AlumnoExamen a obtener
   * @returns Observable con objeto AlumnoExamenDto
   */
  getAlumnoExamen(id: number): Observable<AlumnoExamenDto> {
    return this.http.get<AlumnoExamenDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo registro de AlumnoExamen
   * @param alumnoExamen - Objeto con datos del AlumnoExamen a crear
   * @returns Observable con objeto AlumnoExamen creado
   */
  crearAlumnoExamen(alumnoExamen: AlumnoExamen): Observable<AlumnoExamen> {
    return this.http.post<AlumnoExamen>(this.apiUrl, alumnoExamen);
  }

  /**
   * Actualiza un registro existente de AlumnoExamen
   * @param id - ID del AlumnoExamen a actualizar
   * @param alumnoExamen - Objeto con datos actualizados del AlumnoExamen
   * @returns Observable con respuesta del servidor
   */
  actualizarAlumnoExamen(id: number, alumnoExamen: AlumnoExamen): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, alumnoExamen);
  }

  /**
   * Elimina un registro de AlumnoExamen
   * @param id - ID del AlumnoExamen a eliminar
   * @returns Observable con respuesta del servidor
   */
  eliminarAlumnoExamen(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Actualiza la calificación y comentarios de un AlumnoExamen
   * @param id - ID del AlumnoExamen a calificar
   * @param calificacion - Valor numérico de la calificación
   * @param comentarios - Comentarios sobre la evaluación
   * @param estado - Estado actualizado del examen ('Aprobado', 'Reprobado', etc.)
   * @returns Observable con respuesta del servidor
   */
  calificarExamen(id: number, calificacion: number, comentarios: string, estado: string): Observable<any> {
    const alumnoExamen = {
      id: id,
      calificacion: calificacion,
      comentarios: comentarios,
      estado: estado,
      fechaRealizacion: new Date()
    };
    return this.http.put(`${this.apiUrl}/${id}`, alumnoExamen);
  }

  /**
   * Registra la asistencia de un alumno a un examen
   * @param id - ID del AlumnoExamen a actualizar
   * @param asistio - Booleano que indica si el alumno asistió al examen
   * @returns Observable con respuesta del servidor
   */
  registrarAsistencia(id: number, asistio: boolean): Observable<any> {
    const alumnoExamen = {
      id: id,
      estado: asistio ? 'Realizado' : 'Ausente',
      fechaRealizacion: asistio ? new Date() : null
    };
    return this.http.put(`${this.apiUrl}/${id}`, alumnoExamen);
  }
}