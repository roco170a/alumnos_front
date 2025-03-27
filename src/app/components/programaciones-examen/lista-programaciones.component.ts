import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';

import { ProgramacionExamenService } from '../../services/programacion-examen.service';
import { ProgramacionExamenDto } from '../../models/programacion-examen.model';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);

@Component({
  selector: 'app-lista-programaciones',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './lista-programaciones.component.html',
  styleUrls: ['./lista-programaciones.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ]
})
export class ListaProgramacionesComponent implements OnInit {
  programaciones: ProgramacionExamenDto[] = [];
  programacionesFiltradas: ProgramacionExamenDto[] = [];
  cargando = true;
  hayError = false;
  soloActivas = true;
  
  // Tipo de vista: 'todos', 'materia'
  tipoVista: string = 'todos';
  idMateria: number = 0;
  tituloVista: string = 'Programacion de Exámenes';
  
  // Filtrado
  filtrosForm = new FormGroup({
    terminoBusqueda: new FormControl(''),
    fechaDesde: new FormControl<Date | null>(null),
    fechaHasta: new FormControl<Date | null>(null)
  });
  
  // Tabla
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ProgramacionExamenDto>;
  columnasMostradas: string[] = ['fechaHora', 'materia', 'aula', 'duracion', 'estado', 'examenes', 'acciones'];

  constructor(
    private programacionService: ProgramacionExamenService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.determinarTipoVista();
    this.cargarProgramaciones();
    
    // Subscribirse a cambios en los filtros de texto
    this.filtrosForm.get('terminoBusqueda')?.valueChanges.subscribe(() => {
      this.aplicarFiltros();
    });
  }
  
  determinarTipoVista(): void {
    this.route.paramMap.subscribe(params => {
      const materiaId = params.get('materiaId');
      
      if (materiaId) {
        this.tipoVista = 'materia';
        this.idMateria = +materiaId;
        this.tituloVista = 'Programaciones de Exámenes de la Materia';
      } else {
        this.tipoVista = 'todos';
        this.tituloVista = 'Programacion de Exámenes';
      }
    });
  }

  cargarProgramaciones(): void {
    this.cargando = true;
    this.hayError = false;
    
    const fechaDesde = this.filtrosForm.get('fechaDesde')?.value || new Date('1999-01-01');
    const fechaHasta = this.filtrosForm.get('fechaHasta')?.value || new Date('2025-01-01');
    
    let observable;
    
    if (this.tipoVista === 'materia') {
      observable = this.programacionService.getProgramacionesPorMateria(this.idMateria, this.soloActivas);
    } else {
      observable = this.programacionService.getProgramacionesExamenDetalladas(this.soloActivas, fechaDesde, fechaHasta);
    }
    
    observable.subscribe({
      next: (programaciones) => {
        this.programaciones = programaciones;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar programaciones', error);
        this.cargando = false;
        this.hayError = true;
      }
    });
  }

  cambiarFiltroActivacion(): void {
    this.soloActivas = !this.soloActivas;
    this.cargarProgramaciones();
  }

  aplicarFiltros(): void {
    const terminoBusqueda = this.filtrosForm.get('terminoBusqueda')?.value?.toLowerCase() || '';
    
    this.programacionesFiltradas = this.programaciones.filter(programacion => {
      return (
        programacion.nombreMateria?.toLowerCase().includes(terminoBusqueda) ||
        programacion.codigoMateria?.toLowerCase().includes(terminoBusqueda) ||
        programacion.aula?.toLowerCase().includes(terminoBusqueda) ||
        programacion.estado?.toLowerCase().includes(terminoBusqueda)
      );
    });
    
    if (this.table) {
      this.table.renderRows();
    }
  }

  resetearFiltros(): void {
    this.filtrosForm.reset({
      terminoBusqueda: '',
      fechaDesde: null,
      fechaHasta: null
    });
    this.cargarProgramaciones();
  }

  confirmarEliminar(programacion: ProgramacionExamenDto): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { 
        titulo: 'Confirmar eliminación', 
        mensaje: `¿Está seguro que desea eliminar la programación de examen para ${programacion.nombreMateria} del ${programacion.fechaFormateada}? Esta acción no se puede deshacer.` 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminarProgramacion(programacion.id);
      }
    });
  }

  eliminarProgramacion(id: number): void {
    this.programacionService.eliminarProgramacion(id).subscribe({
      next: () => {
        this.mostrarMensaje('Programación eliminada correctamente');
        this.cargarProgramaciones();
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