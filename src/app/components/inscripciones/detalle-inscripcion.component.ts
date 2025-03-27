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

import { InscripcionService } from '../../services/inscripcion.service';
import { InscripcionDto } from '../../models/inscripcion.model';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-detalle-inscripcion',
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
    MatTooltipModule
  ],
  templateUrl: './detalle-inscripcion.component.html',
  styleUrls: ['./detalle-inscripcion.component.scss']
})
export class DetalleInscripcionComponent implements OnInit {
  inscripcion: InscripcionDto | null = null;
  cargando = true;
  hayError = false;
  inscripcionId: number = 0;

  constructor(
    private inscripcionService: InscripcionService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.inscripcionId = +id;
        this.cargarInscripcion();
      }
    });
  }

  cargarInscripcion(): void {
    this.cargando = true;
    this.hayError = false;
    
    this.inscripcionService.getInscripcionPorId(this.inscripcionId).subscribe({
      next: (inscripcion) => {
        this.inscripcion = inscripcion;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar inscripción', error);
        this.mostrarMensaje('Error al cargar los datos de la inscripción');
        this.cargando = false;
        this.hayError = true;
      }
    });
  }

  confirmarEliminar(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { 
        titulo: 'Confirmar eliminación', 
        mensaje: '¿Está seguro que desea eliminar esta inscripción? Esta acción no se puede deshacer.' 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminarInscripcion();
      }
    });
  }

  eliminarInscripcion(): void {
    this.inscripcionService.eliminarInscripcion(this.inscripcionId).subscribe({
      next: () => {
        this.mostrarMensaje('Inscripción eliminada correctamente');
        this.router.navigate(['/inscripciones']);
      },
      error: (error) => {
        console.error('Error al eliminar inscripción', error);
        this.mostrarMensaje('Error al eliminar la inscripción');
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

  getEstadoClass(): string {
    if (!this.inscripcion) return '';
    
    const estado = this.inscripcion.estado.toLowerCase();
    if (estado === 'activo' || estado === 'aprobado') {
      return 'estado-activo';
    } else if (estado === 'pendiente') {
      return 'estado-pendiente';
    } else if (estado === 'completado' || estado === 'finalizado') {
      return 'estado-completado';
    } else if (estado === 'cancelado' || estado === 'reprobado') {
      return 'estado-cancelado';
    }
    return '';
  }
} 