export interface AlumnoExamen {
  id?: number;
  alumnoId: number;
  examenId: number;
  fechaRealizacion?: Date;
  calificacion?: number;
  comentarios?: string;
  estado?: string;
  activo: boolean;
  fechaCreacion: Date;
  alumno?: any;
  examen?: any;
  materiaId?: number;
}

export interface AlumnoExamenDto {
  id: number;
  alumnoId: number;
  examenId: number;
  fechaRealizacion?: Date;
  calificacion?: number;
  comentarios?: string;
  estado?: string;
  activo: boolean;
  fechaCreacion: Date;
  nombreAlumno?: string;
  apellidosAlumno?: string;
  emailAlumno?: string;
  documentoAlumno?: string;
  tituloExamen?: string;
  nombreMateria?: string;
  codigoMateria?: string;
  nombreTipoExamen?: string;
  ponderacionTipoExamen: number;
  fechaExamen?: string;
  fechaRealizacionFormateada?: string;
  materiaId?: number;
}

export const ESTADOS_ALUMNO_EXAMEN = [
  'Pendiente',  
  'Ausente',
  'Realizado',
  'Calificado',
  'Aprobado',
  'Reprobado'
];

export interface AlumnoExamenFiltros {
  examenId?: number;
  alumnoId?: number;
  estado?: string;
  terminoBusqueda?: string;
}