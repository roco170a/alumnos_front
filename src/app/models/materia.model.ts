export interface Materia {
  id?: number;
  nombre: string;
  codigo: string;
  profesor: string;
  descripcion: string;
  creditos: number;
  activa: boolean;
  fechaCreacion?: Date;
}

export interface MateriaDto {
  id: number;
  nombre: string;
  codigo: string;
  profesor: string;
  descripcion: string;
  creditos: number;
  activa: boolean;
  fechaCreacion: Date;
  cantidadInscripciones: number;
  cantidadExamenes: number;
} 