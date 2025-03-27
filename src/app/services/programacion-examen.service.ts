import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ProgramacionExamen, ProgramacionExamenDto } from '../models/programacion-examen.model';
import { formatDate } from '@angular/common';
import { environment } from '../../environments/environment';
import { 
  ProgramacionExamenCreate, 
  ProgramacionExamenDetalle, 
  ProgramacionExamenListItem 
} from '../models/programacion-examen';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionExamenService {
  private apiUrl = `${environment.apiUrl}/api/ProgramacionExamenes`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las programaciones de exámenes
   * @param soloActivas Si solo se deben incluir programaciones activas
   * @param fechaDesde Fecha desde la cual filtrar
   * @param fechaHasta Fecha hasta la cual filtrar
   */
  getProgramacionesExamen(soloActivas: boolean = true, fechaDesde?: Date, fechaHasta?: Date): Observable<ProgramacionExamenDto[]> {
    let params = new HttpParams();
    params = params.set('soloActivas', soloActivas.toString());
    
    if (fechaDesde) {
      params = params.set('fechaDesde', fechaDesde.toISOString());
    }
    
    if (fechaHasta) {
      params = params.set('fechaHasta', fechaHasta.toISOString());
    }
    
    return this.http.get<ProgramacionExamenDto[]>(`${this.apiUrl}`, { params }).pipe(
      map(programaciones => this.procesarProgramaciones(programaciones))
    );
  }

  /**
   * Obtiene programaciones de exámenes con detalles
   * @param soloActivas Si solo se deben incluir programaciones activas
   * @param fechaDesde Fecha desde la cual filtrar
   * @param fechaHasta Fecha hasta la cual filtrar
   */
  getProgramacionesExamenDetalladas(soloActivas: boolean = true, fechaDesde?: Date, fechaHasta?: Date): Observable<ProgramacionExamenDto[]> {
    let params = new HttpParams();
    params = params.set('soloActivas', soloActivas.toString());
    
    if (fechaDesde) {
      params = params.set('fechaDesde', fechaDesde.toISOString());
    }
    
    if (fechaHasta) {
      params = params.set('fechaHasta', fechaHasta.toISOString());
    }
    
    return this.http.get<ProgramacionExamenDto[]>(`${this.apiUrl}/detalles`, { params }).pipe(
      map(programaciones => this.procesarProgramaciones(programaciones))
    );
  }

  /**
   * Obtiene una programación de examen por su ID
   */
  getProgramacionPorId(id: number): Observable<ProgramacionExamenDto> {
    return this.http.get<ProgramacionExamenDto>(`${this.apiUrl}/${id}`).pipe(
      map(programacion => this.procesarProgramacion(programacion))
    );
  }

  /**
   * Obtiene programaciones de exámenes por materia
   * @param materiaId ID de la materia
   * @param soloActivas Si solo se deben incluir programaciones activas
   * @param periodoAcademico Periodo académico a filtrar
   */
  getProgramacionesPorMateria(materiaId: number, soloActivas: boolean = true, periodoAcademico?: string): Observable<ProgramacionExamenDto[]> {
    let params = new HttpParams();
    params = params.set('soloActivas', soloActivas.toString());
    
    if (periodoAcademico) {
      params = params.set('periodoAcademico', periodoAcademico);
    }
    
    return this.http.get<ProgramacionExamenDto[]>(`${this.apiUrl}/materia/${materiaId}`, { params }).pipe(
      map(programaciones => this.procesarProgramaciones(programaciones))
    );
  }

  /**
   * Crea una nueva programación de examen
   */
  crearProgramacion(programacion: ProgramacionExamen): Observable<ProgramacionExamen> {
    return this.http.post<ProgramacionExamen>(this.apiUrl, programacion);
  }

  /**
   * Actualiza una programación de examen existente
   */
  actualizarProgramacion(id: number, programacion: ProgramacionExamen): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, programacion);
  }

  /**
   * Elimina una programación de examen
   */
  eliminarProgramacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Procesar arreglo de programaciones para agregar propiedades calculadas
  private procesarProgramaciones(programaciones: ProgramacionExamenDto[]): ProgramacionExamenDto[] {
    return programaciones.map(programacion => this.procesarProgramacion(programacion));
  }

  // Procesar una programación individual para agregar propiedades calculadas
  private procesarProgramacion(programacion: ProgramacionExamenDto): ProgramacionExamenDto {
    const fechaProgramada = programacion.fechaProgramada instanceof Date ? 
      programacion.fechaProgramada : new Date(programacion.fechaProgramada);
      
    return {
      ...programacion,
      fechaFormateada: formatDate(fechaProgramada, 'dd/MM/yyyy', 'es-ES'),
      horaInicioFormateada: programacion.horaInicio ? this.formatearHora(programacion.horaInicio) : '',
      fechaHoraFormateada: `${formatDate(fechaProgramada, 'dd/MM/yyyy', 'es-ES')} - ${this.formatearHora(programacion.horaInicio)}`
    };
  }

  // Dar formato a la hora (convertir de HH:mm:ss a HH:mm)
  private formatearHora(hora: string): string {
    if (!hora) return '';
    
    // Si la hora está en formato HH:mm:ss, extraer solo HH:mm
    if (hora.includes(':')) {
      const partes = hora.split(':');
      if (partes.length >= 2) {
        return `${partes[0]}:${partes[1]}`;
      }
    }
    
    return hora;
  }

  obtenerTodos(): Observable<ProgramacionExamenListItem[]> {
    return this.http.get<ProgramacionExamenListItem[]>(`${this.apiUrl}`);
  }

  obtenerPorId(id: number): Observable<ProgramacionExamenDetalle> {
    return this.http.get<ProgramacionExamenDetalle>(`${this.apiUrl}/${id}`);
  }

  obtenerPorMateriaId(materiaId: number): Observable<ProgramacionExamenListItem[]> {
    return this.http.get<ProgramacionExamenListItem[]>(`${this.apiUrl}/materia/${materiaId}`);
  }

  crear(programacion: ProgramacionExamenCreate): Observable<ProgramacionExamen> {
    return this.http.post<ProgramacionExamen>(`${this.apiUrl}`, programacion);
  }

  actualizar(id: number, programacion: ProgramacionExamenCreate): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, programacion);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
} 