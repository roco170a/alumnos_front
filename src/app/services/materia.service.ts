import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Materia, MateriaDto } from '../models/materia.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private apiUrl = `${environment.apiUrl}/api/Materias`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las materias, opcionalmente filtradas por estado activo
   * @param soloActivas - Indica si solo se deben traer las materias activas (por defecto true)
   * @returns Observable con array de MateriaDto
   */
  getMaterias(soloActivas: boolean = true): Observable<MateriaDto[]> {
    const params = new HttpParams().set('soloActivas', soloActivas.toString());
    return this.http.get<MateriaDto[]>(this.apiUrl, { params });
  }

  /**
   * Obtiene una materia específica por su ID
   * @param id - ID de la materia a consultar
   * @returns Observable con objeto MateriaDto
   */
  getMateriaPorId(id: number): Observable<MateriaDto> {
    return this.http.get<MateriaDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene una materia específica por su código
   * @param codigo - Código único de la materia a consultar
   * @returns Observable con objeto MateriaDto
   */
  getMateriaPorCodigo(codigo: string): Observable<MateriaDto> {
    return this.http.get<MateriaDto>(`${this.apiUrl}/codigo/${codigo}`);
  }

  /**
   * Busca materias que coincidan con los términos de búsqueda
   * @param busqueda - Cadena de texto para buscar coincidencias en materias
   * @param soloActivas - Indica si solo se deben incluir materias activas (por defecto true)
   * @returns Observable con array de MateriaDto que coinciden con los criterios
   */
  buscarMaterias(busqueda: string, soloActivas: boolean = true): Observable<MateriaDto[]> {
    const params = new HttpParams()
      .set('busqueda', busqueda)
      .set('soloActivas', soloActivas.toString());
    return this.http.get<MateriaDto[]>(`${this.apiUrl}/buscar`, { params });
  }

  /**
   * Crea un nuevo registro de materia
   * @param materia - Objeto con datos de la materia a crear
   * @returns Observable con objeto Materia creado
   */
  crearMateria(materia: Materia): Observable<Materia> {
    return this.http.post<Materia>(this.apiUrl, materia);
  }

  /**
   * Actualiza un registro existente de materia
   * @param id - ID de la materia a actualizar
   * @param materia - Objeto con datos actualizados de la materia
   * @returns Observable con respuesta del servidor
   */
  actualizarMateria(id: number, materia: Materia): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, materia);
  }

  /**
   * Elimina un registro de materia
   * @param id - ID de la materia a eliminar
   * @returns Observable con respuesta del servidor
   */
  eliminarMateria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 