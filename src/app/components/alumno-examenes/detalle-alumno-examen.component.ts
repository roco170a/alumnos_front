import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { AlumnoExamenService } from '../../services/alumno-examen.service';
import { AlumnoExamenDto } from '../../models/alumno-examen.model';
import { DialogoConfirmacionComponent } from '../shared/dialogo-confirmacion/dialogo-confirmacion.component';
import { CalificarExamenDialogComponent } from './calificar-examen-dialog.component';

@Component({
  selector: 'app-detalle-alumno-examen',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './detalle-alumno-examen.component.html',
  styleUrls: ['./detalle-alumno-examen.component.scss']
})
export class DetalleAlumnoExamenComponent implements OnInit {
  alumnoExamen?: AlumnoExamenDto;
  cargando = true;
  hayError = false;
  idAlumnoExamen: number;

  constructor(
    private alumnoExamenService: AlumnoExamenService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.idAlumnoExamen = parseInt(this.route.snapshot.paramMap.get('id') || '0');
  }

  ngOnInit(): void {
    this.cargarDetalleAlumnoExamen();
  }

  cargarDetalleAlumnoExamen(): void {
    if (this.idAlumnoExamen <= 0) {
      this.hayError = true;
      this.cargando = false;
      return;
    }

    this.cargando = true;
    this.hayError = false;

    this.alumnoExamenService.getAlumnoExamen(this.idAlumnoExamen)
      .subscribe({
        next: (data) => {
          this.alumnoExamen = data;
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar los detalles del examen', error);
          this.hayError = true;
          this.cargando = false;
        }
      });
  }

  confirmarEliminar(): void {
    if (!this.alumnoExamen) return;

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      data: {
        titulo: 'Confirmar Eliminación',
        mensaje: `¿Está seguro que desea eliminar el registro del examen para el alumno ${this.alumnoExamen.nombreAlumno} ${this.alumnoExamen.apellidosAlumno}?`,
        botonConfirmar: 'Eliminar',
        botonCancelar: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminarAlumnoExamen();
      }
    });
  }

  eliminarAlumnoExamen(): void {
    if (!this.alumnoExamen) return;

    this.alumnoExamenService.eliminarAlumnoExamen(this.alumnoExamen.id)
      .subscribe({
        next: () => {
          this.snackBar.open('Registro de examen eliminado correctamente', 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/examenes', this.alumnoExamen?.examenId]);
        },
        error: (error) => {
          console.error('Error al eliminar el registro del examen', error);
          this.snackBar.open('Error al eliminar el registro del examen', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  abrirDialogoCalificacion(): void {
    if (!this.alumnoExamen) return;

    const dialogRef = this.dialog.open(CalificarExamenDialogComponent, {
      width: '500px',
      data: {
        alumnoExamen: this.alumnoExamen
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarDetalleAlumnoExamen();
      }
    });
  }

  registrarAsistencia(asistio: boolean): void {
    if (!this.alumnoExamen) return;

    this.alumnoExamenService.registrarAsistencia(this.alumnoExamen.id, asistio)
      .subscribe({
        next: () => {
          const mensaje = asistio ? 'Asistencia registrada correctamente' : 'Ausencia registrada correctamente';
          this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
          this.cargarDetalleAlumnoExamen();
        },
        error: (error) => {
          console.error('Error al registrar la asistencia', error);
          this.snackBar.open('Error al registrar la asistencia', 'Cerrar', { duration: 3000 });
        }
      });
  }

  getClaseEstado(estado?: string): string {
    if (!estado) return 'estado-pendiente';
    
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'estado-pendiente';
      case 'ausente': return 'estado-ausente';
      case 'realizado': return 'estado-realizado';
      case 'calificado': return 'estado-calificado';
      case 'aprobado': return 'estado-aprobado';
      case 'reprobado': return 'estado-reprobado';
      default: return 'estado-pendiente';
    }
  }

  volver(): void {
    window.history.back();
  }
} 