export interface Examen {
  id?: number;
  programacionId: number;
  tipoExamenId: number;
  fechaRealizacion: Date;
  observaciones?: string;
  estado?: string;
  activo: boolean;
  fechaCreacion?: Date;
  programacionExamen?: any;
  tipoExamen?: any;
}

export interface ExamenDto {
  id: number;
  programacionId: number;
  tipoExamenId: number;
  fechaRealizacion: Date;
  observaciones: string;
  estado: string;
  activo: boolean;
  fechaCreacion: Date;
  nombreMateria: string;
  codigoMateria: string;
  nombreTipoExamen: string;
  ponderacionTipoExamen: number;
  fechaRealizacionFormateada: string;
  cantidadInscripciones: number;
  profesorMateria: string;
  nombreProgramacion: string;
  fechaProgramada: Date;
  aula: string;
  duracionMinutos: number;
}

export interface ExamenListItem {
  id: number;
  nombre: string;
  tipoExamen: string;
  puntuacionMaxima: number;
  fechaRealizacion: string;
  estadoExamen: string;
  cantidadAlumnos: number;
}

export interface TipoExamen {
  id?: number;
  nombre: string;
  descripcion: string;
  ponderacion: number;
  activo: boolean;
  fechaCreacion?: Date;
}

export interface TipoExamenDto {
  id: number;
  nombre: string;
  descripcion: string;
  ponderacion: number;
  activo: boolean;
  fechaCreacion: Date;
  cantidadExamenes: number;
}

export interface ProgramacionExamen {
  id?: number;
  materiaId: number;
  tipoExamenId: number;
  fecha: Date;
  horaInicio: string;
  duracion?: string;
  aula?: string;
  periodoAcademico?: string;
  descripcion?: string;
  instrucciones?: string;
  activo: boolean;
  fechaCreacion?: Date;
}

