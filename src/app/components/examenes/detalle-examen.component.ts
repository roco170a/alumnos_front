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

import { ExamenService } from '../../services/examen.service';
import { ExamenDto } from '../../models/examen.model';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-detalle-examen',
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
  templateUrl: './detalle-examen.component.html',
  styleUrls: ['./detalle-examen.component.scss']
})
export class DetalleExamenComponent implements OnInit {
  examen: ExamenDto | null = null;
  cargando = true;
  hayError = false;
  examenId: number = 0;

  constructor(
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
        this.examenId = +id;
        this.cargarExamen();
      }
    });
  }

  cargarExamen(): void {
    this.cargando = true;
    this.hayError = false;
    
    this.examenService.getExamenPorId(this.examenId).subscribe({
      next: (examen) => {
        this.examen = examen;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar examen', error);
        this.mostrarMensaje('Error al cargar los datos del examen');
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
        mensaje: '¿Está seguro que desea eliminar este examen? Esta acción no se puede deshacer.' 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminarExamen();
      }
    });
  }

  eliminarExamen(): void {
    this.examenService.eliminarExamen(this.examenId).subscribe({
      next: () => {
        this.mostrarMensaje('Examen eliminado correctamente');
        this.router.navigate(['/examenes']);
      },
      error: (error) => {
        console.error('Error al eliminar examen', error);
        this.mostrarMensaje('Error al eliminar el examen');
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
    if (!this.examen) return '';
    return `estado-${this.examen.estado.toLowerCase()}`;
  }
} 