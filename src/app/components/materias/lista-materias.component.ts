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
import { FormsModule } from '@angular/forms';

import { MateriaService } from '../../services/materia.service';
import { MateriaDto } from '../../models/materia.model';
import { ConfirmDialogComponent } from '../../components/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-lista-materias',
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
  templateUrl: './lista-materias.component.html',
  styleUrls: ['./lista-materias.component.scss']
})
export class ListaMateriasComponent implements OnInit {
  materias: MateriaDto[] = [];
  dataSource = new MatTableDataSource<MateriaDto>([]);
  columnasMostradas: string[] = ['codigo', 'nombre', 'profesor', 'creditos', 'activo', 'acciones'];
  cargando = true;
  hayError = false;
  filtroTexto = '';
  mostrarSoloActivas = true;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<MateriaDto>;

  constructor(
    private materiaService: MateriaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarMaterias();
  }

  cargarMaterias(): void {
    this.cargando = true;
    this.materiaService.getMaterias(this.mostrarSoloActivas).subscribe({
      next: (data) => {
        this.materias = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar materias', error);
        this.mostrarMensaje('Error al cargar las materias');
        this.cargando = false;
        this.hayError = true;
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

  cambiarFiltroActivacion(): void {
    this.mostrarSoloActivas = !this.mostrarSoloActivas;
    this.cargarMaterias();
  }

  eliminarMateria(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { titulo: 'Confirmar eliminación', mensaje: '¿Está seguro que desea eliminar esta materia?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.materiaService.eliminarMateria(id).subscribe({
          next: () => {
            this.mostrarMensaje('Materia eliminada exitosamente');
            this.cargarMaterias();
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

  filtrarMaterias(): MateriaDto[] {
    if (!this.filtroTexto.trim()) {
      return this.materias;
    }
    
    const filtro = this.filtroTexto.toLowerCase();
    return this.materias.filter(materia => 
      materia.nombre.toLowerCase().includes(filtro) || 
      materia.codigo.toLowerCase().includes(filtro) ||
      materia.profesor.toLowerCase().includes(filtro) ||
      materia.descripcion.toLowerCase().includes(filtro)
    );
  }
} 