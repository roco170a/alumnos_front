import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';

import { ProgramacionExamenService } from '../../services/programacion-examen.service';
import { ExamenService } from '../../services/examen.service';
import { ProgramacionExamenDto } from '../../models/programacion-examen.model';
import { ExamenDto } from '../../models/examen.model';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-detalle-programacion',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTableModule
  ],
  templateUrl: './detalle-programacion.component.html',
  styleUrls: ['./detalle-programacion.component.scss']
})
export class DetalleProgramacionComponent implements OnInit {
  programacion: ProgramacionExamenDto | null = null;
  examenes: ExamenDto[] = [];
  cargando = true;
  cargandoExamenes = false;
  hayError = false;
  programacionId: number = 0;

  // Tabla de exámenes
  columnasMostradas: string[] = ['fechaRealizacion', 'tipoExamen', 'estado', 'acciones'];

  constructor(
    private programacionService: ProgramacionExamenService,
    private examenService: ExamenService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.programacionId = +id;
        this.cargarProgramacion();
      }
    });
  }

  cargarProgramacion(): void {
    this.cargando = true;
    this.hayError = false;
    
    this.programacionService.getProgramacionPorId(this.programacionId).subscribe({
      next: (programacion) => {
        this.programacion = programacion;
        this.cargando = false;
        this.cargarExamenesPorProgramacion();
      },
      error: (error) => {
        console.error('Error al cargar programación', error);
        this.mostrarMensaje('Error al cargar los datos de la programación');
        this.cargando = false;
        this.hayError = true;
      }
    });
  }

  cargarExamenesPorProgramacion(): void {
    this.cargandoExamenes = true;

    this.examenService.getExamenesPorProgramacion(this.programacionId).subscribe({
      next: (examenes) => {
        this.examenes = examenes;
        this.cargandoExamenes = false;
      },
      error: (error) => {
        console.error('Error al cargar exámenes', error);
        this.cargandoExamenes = false;
      }
    });
  }

  confirmarEliminar(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { 
        titulo: 'Confirmar eliminación', 
        mensaje: '¿Está seguro que desea eliminar esta programación de examen? Esta acción no se puede deshacer y también eliminará todos los exámenes asociados.' 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminarProgramacion();
      }
    });
  }

  eliminarProgramacion(): void {
    this.programacionService.eliminarProgramacion(this.programacionId).subscribe({
      next: () => {
        this.mostrarMensaje('Programación eliminada correctamente');
        this.router.navigate(['/programaciones']);
      },
      error: (error) => {
        console.error('Error al eliminar programación', error);
        this.mostrarMensaje('Error al eliminar la programación');
      }
    });
  }

  mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  getEstadoClass(estado: string): string {
    estado = estado?.toLowerCase() || '';
    if (estado === 'activo' || estado === 'programado') {
      return 'estado-activo';
    } else if (estado === 'pendiente') {
      return 'estado-pendiente';
    } else if (estado === 'realizado' || estado === 'completado') {
      return 'estado-completado';
    } else if (estado === 'cancelado') {
      return 'estado-cancelado';
    }
    return '';
  }
} 