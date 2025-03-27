// Modelo para programaciones de exámenes
export interface ProgramacionExamen {
  id?: number;
  materiaId: number;
  fecha: Date;
  horaInicio: string;
  duracion: string;
  duracionMinutos: number;
  aula: string;
  instrucciones?: string;
  materialRequerido?: string;
  estado: string;
  activo: boolean;
}

// DTO para programaciones de exámenes con datos relacionados
export interface ProgramacionExamenDto {
  id: number;
  materiaId: number;
  nombreMateria: string;
  codigoMateria: string;
  profesorMateria: string;
  fechaProgramada: Date;
  horaInicio: string;
  duracion: string;
  duracionMinutos: number;
  aula: string;
  instrucciones?: string;
  materialRequerido?: string;
  estado: string;
  activo: boolean;
  cantidadExamenes: number;

  // Propiedades calculadas para la UI
  fechaFormateada?: string;
  horaInicioFormateada?: string;
  fechaHoraFormateada?: string;

  // Propiedades especiales
  tipoExamenId: number;
  periodoAcademico: string;
  descripcion: string;
  fechaCreacion: Date;
  nombreTipoExamen: string;
  ponderacionTipoExamen: number;
  cantidadAlumnos: number;
} 

