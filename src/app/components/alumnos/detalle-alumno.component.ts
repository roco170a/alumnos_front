import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { AlumnoService } from '../../services/alumno.service';
import { AlumnoDto } from '../../models/alumno.model';

@Component({
  selector: 'app-detalle-alumno',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './detalle-alumno.component.html',
  styleUrls: ['./detalle-alumno.component.scss']
})
export class DetalleAlumnoComponent implements OnInit {
  alumno?: AlumnoDto;
  cargando: boolean = true;
  error: boolean = false;

  constructor(
    private alumnoService: AlumnoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.cargarAlumno(+id);
      } else {
        this.router.navigate(['/alumnos']);
      }
    });
  }

  cargarAlumno(id: number): void {
    this.cargando = true;
    this.error = false;
    
    this.alumnoService.getAlumnoPorId(id).subscribe({
      next: (data) => {
        this.alumno = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar los datos del alumno', error);
        this.error = true;
        this.cargando = false;
        this.mostrarMensaje('Error al cargar los datos del alumno');
      }
    });
  }

  eliminarAlumno(): void {
    if (!this.alumno) return;
    
    if (confirm('¿Está seguro que desea eliminar este alumno?')) {
      this.cargando = true;
      this.alumnoService.eliminarAlumno(this.alumno.id).subscribe({
        next: () => {
          this.mostrarMensaje('Alumno eliminado exitosamente');
          this.router.navigate(['/alumnos']);
        },
        error: (error) => {
          console.error('Error al eliminar alumno', error);
          this.mostrarMensaje('Error al eliminar el alumno');
          this.cargando = false;
        }
      });
    }
  }

  mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  formatearFecha(fecha: Date): string {
    if (!fecha) return '';
    const nuevaFecha = new Date(fecha);
    return nuevaFecha.toLocaleDateString();
  }
} 