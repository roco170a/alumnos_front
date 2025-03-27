export interface Alumno {
  id?: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: Date;
  email: string;
  telefono: string;
  direccion: string;
  activo: boolean;
  userId?: string;  
}

export interface AlumnoDto {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  apellido: string;
  nombreCompleto: string;
  fechaNacimiento: Date;
  edad: number;
  email: string;
  telefono: string;
  direccion: string;
  userId?: string;
  activo: boolean;  
} 