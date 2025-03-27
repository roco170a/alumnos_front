import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { MateriaService } from '../../services/materia.service';
import { MateriaDto } from '../../models/materia.model';
import { ConfirmDialogComponent } from '../../components/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-detalle-materia',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './detalle-materia.component.html',
  styleUrls: ['./detalle-materia.component.scss']
})
export class DetalleMateriaComponent implements OnInit {
  materia?: MateriaDto;
  cargando: boolean = true;
  error: boolean = false;

  constructor(
    private materiaService: MateriaService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarMateria();
  }

  cargarMateria(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargando = true;
      this.materiaService.getMateriaPorId(+id).subscribe({
        next: (data) => {
          this.materia = data;
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar la materia', error);
          this.cargando = false;
          this.error = true;
        }
      });
    } else {
      this.router.navigate(['/materias']);
    }
  }

  eliminarMateria(): void {
    if (!this.materia) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { titulo: 'Confirmar eliminación', mensaje: '¿Está seguro que desea eliminar esta materia?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.materia) {
        this.materiaService.eliminarMateria(this.materia.id).subscribe({
          next: () => {
            this.mostrarMensaje('Materia eliminada exitosamente');
            this.router.navigate(['/materias']);
          },
          error: (error) => {
            console.error('Error al eliminar materia', error);
            this.mostrarMensaje('Error al eliminar la materia');
          }
        });
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

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
} 