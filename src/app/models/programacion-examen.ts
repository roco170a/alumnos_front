export interface ProgramacionExamen {
    id: number;
    materiaId: number;
    fechaProgramada: string;
    duracionMinutos: number;
    aula: string;
    instrucciones?: string;
    materialRequerido?: string;
    estado: string;
}

export interface ProgramacionExamenDetalle {
    id: number;
    materiaId: number;
    materiaNombre: string;
    materiaCodigo: string;
    profesorNombre: string;
    fechaProgramada: string;
    duracionMinutos: number;
    aula: string;
    instrucciones?: string;
    materialRequerido?: string;
    estado: string;
    cantidadExamenes: number;
}

export interface ProgramacionExamenCreate {
    materiaId: number;
    fechaProgramada: string;
    duracionMinutos: number;
    aula: string;
    instrucciones?: string;
    materialRequerido?: string;
    estado: string;
}

export interface ProgramacionExamenListItem {
    id: number;
    materiaNombre: string;
    materiaCodigo: string;
    fechaProgramada: string;
    duracionMinutos: number;
    aula: string;
    estado: string;
    cantidadExamenes: number;
} 