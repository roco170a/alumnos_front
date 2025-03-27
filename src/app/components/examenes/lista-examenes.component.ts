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
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ExamenService } from '../../services/examen.service';
import { MateriaService } from '../../services/materia.service';
import { ExamenDto } from '../../models/examen.model';
import { MateriaDto } from '../../models/materia.model';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-lista-examenes',
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
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './lista-examenes.component.html',
  styleUrls: ['./lista-examenes.component.scss']
})
export class ListaExamenesComponent implements OnInit {
  examenes: ExamenDto[] = [];
  materias: MateriaDto[] = [];
  dataSource = new MatTableDataSource<ExamenDto>([]);
  columnasMostradas: string[] = ['fechaRealizacion', 'materia', 'tipoExamen', 'estado', 'inscripciones', 'acciones'];
  cargando = true;
  hayError = false;
  filtroTexto = '';
  estadoFiltro: string = 'Activo';
  materiaIdFiltro?: number;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ExamenDto>;

  constructor(
    private examenService: ExamenService,
    private materiaService: MateriaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarMaterias();
    this.cargarExamenes();
  }

  cargarMaterias(): void {
    this.materiaService.getMaterias().subscribe({
      next: (materias) => {
        this.materias = materias;
      },
      error: (error) => {
        console.error('Error al cargar materias', error);
        this.mostrarMensaje('Error al cargar las materias');
      }
    });
  }

  cargarExamenes(): void {
    this.cargando = true;
    this.hayError = false;
    
    if (this.materiaIdFiltro) {
      this.examenService.getExamenesPorMateria(this.materiaIdFiltro, this.estadoFiltro).subscribe({
        next: (data) => {
          this.examenes = data;
          this.dataSource.data = data;
          this.configurarDataSource();
          this.cargando = false;
        },
        error: (error) => {
          this.manejarError(error);
        }
      });
    } else {
      this.examenService.getExamenesConDetalles(undefined, this.estadoFiltro).subscribe({
        next: (data) => {
          this.examenes = data;
          this.dataSource.data = data;
          this.configurarDataSource();
          this.cargando = false;
        },
        error: (error) => {
          this.manejarError(error);
        }
      });
    }
  }

  private configurarDataSource(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: ExamenDto, filter: string) => {
      return this.filtrarExamen(data, filter.toLowerCase());
    };
    if (this.filtroTexto) {
      this.dataSource.filter = this.filtroTexto;
    }
  }

  private manejarError(error: any): void {
    console.error('Error al cargar exámenes', error);
    this.mostrarMensaje('Error al cargar los exámenes');
    this.cargando = false;
    this.hayError = true;
  }

  aplicarFiltro(event: Event): void {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.filtroTexto = valorFiltro.trim().toLowerCase();
    this.dataSource.filter = this.filtroTexto;
  }

  cambiarFiltroEstado(estado: string): void {
    this.estadoFiltro = estado;
    this.cargarExamenes();
  }

  cambiarFiltroMateria(): void {
    this.cargarExamenes();
  }

  private filtrarExamen(examen: ExamenDto, filtro: string): boolean {
    return examen.nombreMateria.toLowerCase().includes(filtro) ||
      examen.codigoMateria.toLowerCase().includes(filtro) ||
      examen.nombreTipoExamen.toLowerCase().includes(filtro) ||
      examen.estado.toLowerCase().includes(filtro) ||
      examen.fechaRealizacionFormateada.toLowerCase().includes(filtro);
  }

  eliminarExamen(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { titulo: 'Confirmar eliminación', mensaje: '¿Está seguro que desea eliminar este examen?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.examenService.eliminarExamen(id).subscribe({
          next: () => {
            this.mostrarMensaje('Examen eliminado exitosamente');
            this.cargarExamenes();
          },
          error: (error) => {
            console.error('Error al eliminar examen', error);
            this.mostrarMensaje('Error al eliminar el examen');
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
} 