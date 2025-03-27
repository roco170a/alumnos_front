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

import { InscripcionService } from '../../services/inscripcion.service';
import { InscripcionDto } from '../../models/inscripcion.model';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);

@Component({
  selector: 'app-lista-inscripciones',
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
    MatSnackBarModule
  ],
  templateUrl: './lista-inscripciones.component.html',
  styleUrls: ['./lista-inscripciones.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ]
})
export class ListaInscripcionesComponent implements OnInit {
  inscripciones: InscripcionDto[] = [];
  inscripcionesFiltradas: InscripcionDto[] = [];
  cargando = true;
  hayError = false;
  soloActivas = true;
  
  // Tipo de vista: 'todos', 'alumno', 'materia'
  tipoVista: string = 'todos';
  idEntidad: number = 0;
  tituloVista: string = 'Inscripciones';
  
  // Filtrado
  filtrosForm = new FormGroup({
    terminoBusqueda: new FormControl(''),
    periodoAcademico: new FormControl('')    
  });
  
  // Opciones para períodos académicos
  periodosAcademicos: string[] = [
    '2023-01', '2023-02', '2024-01', '2024-02'
  ];
  
  // Tabla
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<InscripcionDto>;
  columnasMostradas: string[] = ['fechaInscripcion', 'alumno', 'materia', 'estado', 'notaFinal', 'acciones'];

  constructor(
    private inscripcionService: InscripcionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.determinarTipoVista();
    this.cargarInscripciones();
    
    // Subscribirse a cambios en los filtros
    this.filtrosForm.valueChanges.subscribe(() => {
      this.aplicarFiltros();
    });
  }
  
  determinarTipoVista(): void {
    this.route.paramMap.subscribe(params => {
      const alumnoId = params.get('alumnoId');
      const materiaId = params.get('materiaId');
      
      if (alumnoId) {
        this.tipoVista = 'alumno';
        this.idEntidad = +alumnoId;
        this.tituloVista = 'Inscripciones del Alumno';
        this.columnasMostradas = ['fechaInscripcion', 'materia', 'estado', 'notaFinal', 'acciones'];
      } else if (materiaId) {
        this.tipoVista = 'materia';
        this.idEntidad = +materiaId;
        this.tituloVista = 'Inscripciones de la Materia';
        this.columnasMostradas = ['fechaInscripcion', 'alumno', 'estado', 'notaFinal', 'acciones'];
      } else {
        this.tipoVista = 'todos';
        this.tituloVista = 'Inscripciones';
      }
    });
  }

  cargarInscripciones(): void {
    this.cargando = true;
    this.hayError = false;
    
    const periodoAcademico = this.filtrosForm.get('periodoAcademico')?.value || 'TODOS';
    
    let observable;
    
    switch (this.tipoVista) {
      case 'alumno':
        observable = this.inscripcionService.getInscripcionesPorAlumno(this.idEntidad, periodoAcademico, this.soloActivas);
        break;
      case 'materia':
        observable = this.inscripcionService.getInscripcionesPorMateria(this.idEntidad, periodoAcademico, this.soloActivas);
        break;
      default:
        observable = this.inscripcionService.getInscripciones(periodoAcademico, this.soloActivas);
        break;
    }
    
    observable.subscribe({
      next: (inscripciones) => {
        this.inscripciones = inscripciones;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar inscripciones', error);
        this.cargando = false;
        this.hayError = true;
      }
    });
  }

  cambiarFiltroActivacion(): void {
    this.soloActivas = !this.soloActivas;
    this.cargarInscripciones();
  }

  aplicarFiltros(): void {
    const terminoBusqueda = this.filtrosForm.get('terminoBusqueda')?.value?.toLowerCase() || '';
    
    this.inscripcionesFiltradas = this.inscripciones.filter(inscripcion => {
      return (
        inscripcion.nombreAlumno.toLowerCase().includes(terminoBusqueda) ||
        inscripcion.apellidosAlumno.toLowerCase().includes(terminoBusqueda) ||
        inscripcion.nombreMateria.toLowerCase().includes(terminoBusqueda) ||
        inscripcion.codigoMateria.toLowerCase().includes(terminoBusqueda)
      );
    });
    
    if (this.table) {
      this.table.renderRows();
    }
  }

  confirmarEliminar(inscripcion: InscripcionDto): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { 
        titulo: 'Confirmar eliminación', 
        mensaje: `¿Está seguro que desea eliminar la inscripción de ${inscripcion.nombreAlumno} ${inscripcion.apellidosAlumno} a ${inscripcion.nombreMateria}? Esta acción no se puede deshacer.` 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminarInscripcion(inscripcion.id);
      }
    });
  }

  eliminarInscripcion(id: number): void {
    this.inscripcionService.eliminarInscripcion(id).subscribe({
      next: () => {
        this.mostrarMensaje('Inscripción eliminada correctamente');
        this.cargarInscripciones();
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

  getEstadoClass(estado: string): string {
    estado = estado.toLowerCase();
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