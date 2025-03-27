import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alumno, AlumnoDto } from '../models/alumno.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private apiUrl = `${environment.apiUrl}/api/Alumnos`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los alumnos registrados en el sistema
   * @returns Observable con array de AlumnoDto
   */
  getAlumnos(): Observable<AlumnoDto[]> {
    return this.http.get<AlumnoDto[]>(this.apiUrl);
  }

  /**
   * Obtiene un alumno específico por su ID
   * @param id - ID del alumno a consultar
   * @returns Observable con objeto AlumnoDto
   */
  getAlumnoPorId(id: number): Observable<AlumnoDto> {
    return this.http.get<AlumnoDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Busca alumnos por su nombre o coincidencia parcial
   * @param nombre - Cadena de texto para buscar coincidencias en nombres de alumnos
   * @returns Observable con array de AlumnoDto que coinciden con el criterio
   */
  getAlumnosPorNombre(nombre: string): Observable<AlumnoDto[]> {
    return this.http.get<AlumnoDto[]>(`${this.apiUrl}/nombre/${nombre}`);
  }

  /**
   * Crea un nuevo registro de alumno
   * @param alumno - Objeto con datos del alumno a crear
   * @returns Observable con objeto Alumno creado
   */
  crearAlumno(alumno: Alumno): Observable<Alumno> {
    return this.http.post<Alumno>(this.apiUrl, alumno);
  }

  /**
   * Actualiza un registro existente de alumno
   * @param id - ID del alumno a actualizar
   * @param alumno - Objeto con datos actualizados del alumno
   * @returns Observable con respuesta del servidor
   */
  actualizarAlumno(id: number, alumno: Alumno): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, alumno);
  }

  /**
   * Elimina un registro de alumno
   * @param id - ID del alumno a eliminar
   * @returns Observable con respuesta del servidor
   */
  eliminarAlumno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 