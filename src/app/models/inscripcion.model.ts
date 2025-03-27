// Modelo para inscripciones
export interface Inscripcion {
  id?: number;
  alumnoId: number;
  materiaId: number;
  fechaInscripcion?: Date;
  periodoAcademico: string;
  estado: string;
  notaFinal?: number;
}

// DTO para inscripciones con datos relacionados
export interface InscripcionDto {
  id: number;
  alumnoId: number;
  materiaId: number;
  fechaInscripcion: Date;
  periodoAcademico: string;
  estado: string;
  notaFinal?: number;
  nombreAlumno: string;
  apellidosAlumno: string;
  nombreMateria: string;
  codigoMateria: string;
  
  // Propiedades calculadas para la UI
  fechaInscripcionFormateada?: string;
  nombreCompletoAlumno?: string;
} 