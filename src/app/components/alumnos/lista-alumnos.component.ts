import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import { AlumnoService } from '../../services/alumno.service';
import { AlumnoDto } from '../../models/alumno.model';
import { ConfirmDialogComponent } from '../../components/shared/confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-alumnos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './lista-alumnos.component.html',
  styleUrls: ['./lista-alumnos.component.scss']
})
export class ListaAlumnosComponent implements OnInit {
  alumnos: AlumnoDto[] = [];
  dataSource = new MatTableDataSource<AlumnoDto>([]);
  columnasMostradas: string[] = ['nombreCompleto', 'email', 'telefono', 'activo', 'acciones'];
  cargando = true;
  hayError = false;
  filtroTexto = '';
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<AlumnoDto>;

  constructor(
    private alumnoService: AlumnoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  cargarAlumnos(): void {
    this.cargando = true;
    this.alumnoService.getAlumnos().subscribe({
      next: (data) => {
        this.alumnos = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar alumnos', error);
        this.mostrarMensaje('Error al cargar los alumnos');
        this.cargando = false;
      }
    });
  }

  aplicarFiltro(event: Event): void {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.filtroTexto = valorFiltro.trim().toLowerCase();
    if (this.table) {
      this.table.renderRows();
    }
  }

  eliminarAlumno(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { titulo: 'Confirmar eliminación', mensaje: '¿Está seguro que desea eliminar este alumno?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.alumnoService.eliminarAlumno(id).subscribe({
          next: () => {
            this.mostrarMensaje('Alumno eliminado exitosamente');
            this.cargarAlumnos();
          },
          error: (error) => {
            console.error('Error al eliminar alumno', error);
            this.mostrarMensaje('Error al eliminar el alumno');
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

  filtrarAlumnos(): AlumnoDto[] {
    if (!this.filtroTexto.trim()) {
      return this.alumnos;
    }
    
    const filtro = this.filtroTexto.toLowerCase();
    return this.alumnos.filter(alumno => 
      alumno.nombreCompleto.toLowerCase().includes(filtro) || 
      alumno.email.toLowerCase().includes(filtro) ||
      (alumno.telefono && alumno.telefono.toLowerCase().includes(filtro))
    );
  }
} 