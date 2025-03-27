import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import { AlumnoExamenService } from '../../services/alumno-examen.service';
import { AlumnoExamenDto, ESTADOS_ALUMNO_EXAMEN, AlumnoExamenFiltros } from '../../models/alumno-examen.model';
import { DialogoConfirmacionComponent } from '../shared/dialogo-confirmacion/dialogo-confirmacion.component';

@Component({
  selector: 'app-lista-alumno-examenes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './lista-alumno-examenes.component.html',
  styleUrls: ['./lista-alumno-examenes.component.scss']
})
export class ListaAlumnoExamenesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<AlumnoExamenDto>;

  alumnoExamenes: AlumnoExamenDto[] = [];
  alumnoExamenesFiltrados: AlumnoExamenDto[] = [];
  columnasMostradas: string[] = ['fechaExamen', 'alumno', 'materia', 'tipoExamen', 'estado', 'calificacion', 'acciones'];
  
  filtrosForm: FormGroup;
  cargando = true;
  hayError = false;
  tipoVista = 'todos';
  estadosExamen = ESTADOS_ALUMNO_EXAMEN;
  
  // Parámetros de ruta
  examenId?: number;
  alumnoId?: number;
  tituloVista = 'Exámenes de Alumnos';

  constructor(
    private alumnoExamenService: AlumnoExamenService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.filtrosForm = this.fb.group({
      terminoBusqueda: [''],
      estado: [''],
      fechaDesde: [null],
      fechaHasta: [null]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const examenIdParam = params.get('examenId');
      const alumnoIdParam = params.get('alumnoId');
      
      if (examenIdParam) {
        this.examenId = +examenIdParam;
        this.tipoVista = 'examen';
        this.tituloVista = 'Alumnos del Examen';
        this.cargarAlumnoExamenesPorExamen();
      } else if (alumnoIdParam) {
        this.alumnoId = +alumnoIdParam;
        this.tipoVista = 'alumno';
        this.tituloVista = 'Exámenes del Alumno';
        this.cargarAlumnoExamenesPorAlumno();
      } else {
        this.tipoVista = 'todos';
        this.tituloVista = 'Exámenes de Alumnos';
        // Cargar todos los exámenes con filtros vacíos
        this.cargarTodosAlumnoExamenes();
      }
    });

    // Comentamos esta línea para evitar que se apliquen filtros automáticamente con cada cambio
    // this.filtrosForm.valueChanges.subscribe(() => {
    //   this.aplicarFiltros();
    // });
  }

  cargarTodosAlumnoExamenes(): void {
    this.cargando = true;
    this.hayError = false;
    
    const filtros: AlumnoExamenFiltros = {};
    
    this.alumnoExamenService.getAlumnoExamenes(filtros)
      .subscribe({
        next: (data) => {
          this.alumnoExamenes = data;
          this.alumnoExamenesFiltrados = data;
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar los exámenes de alumnos', error);
          this.hayError = true;
          this.cargando = false;
        }
      });
  }

  cargarAlumnoExamenesPorExamen(): void {
    if (!this.examenId) return;
    
    this.cargando = true;
    this.hayError = false;
    
    this.alumnoExamenService.getAlumnoExamenesPorExamenDetalles(this.examenId)
      .subscribe({
        next: (data) => {
          this.alumnoExamenes = data;
          this.alumnoExamenesFiltrados = data;
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar los exámenes de alumnos', error);
          this.hayError = true;
          this.cargando = false;
        }
      });
  }

  cargarAlumnoExamenesPorAlumno(): void {
    if (!this.alumnoId) return;
    
    this.cargando = true;
    this.hayError = false;
    
    this.alumnoExamenService.getAlumnoExamenesPorAlumno(this.alumnoId)
      .subscribe({
        next: (data) => {
          this.alumnoExamenes = data;
          this.alumnoExamenesFiltrados = data;
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar los exámenes del alumno', error);
          this.hayError = true;
          this.cargando = false;
        }
      });
  }

  aplicarFiltros(): void {
    this.cargando = true;
    this.hayError = false;
    
    const filtros: AlumnoExamenFiltros = {
      terminoBusqueda: this.filtrosForm.value.terminoBusqueda,
      estado: this.filtrosForm.value.estado,
      examenId: this.examenId,
      alumnoId: this.alumnoId
    };
    
    // Llamar al servicio con los filtros aplicados
    this.alumnoExamenService.getAlumnoExamenes(filtros)
      .subscribe({
        next: (data) => {
          this.alumnoExamenes = data;
          this.alumnoExamenesFiltrados = data;
          this.cargando = false;
          
          if (this.table) {
            this.table.renderRows();
            
            if (this.paginator) {
              this.paginator.firstPage();
            }
          }
        },
        error: (error) => {
          console.error('Error al aplicar filtros', error);
          this.hayError = true;
          this.cargando = false;
        }
      });
  }

  resetearFiltros(): void {
    this.filtrosForm.reset({
      terminoBusqueda: '',
      estado: '',
      fechaDesde: null,
      fechaHasta: null
    });
    
    if (this.tipoVista === 'examen') {
      this.cargarAlumnoExamenesPorExamen();
    } else if (this.tipoVista === 'alumno') {
      this.cargarAlumnoExamenesPorAlumno();
    } else {
      this.cargarTodosAlumnoExamenes();
    }
  }

  confirmarEliminar(alumnoExamen: AlumnoExamenDto): void {
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      data: {
        titulo: 'Confirmar Eliminación',
        mensaje: `¿Está seguro que desea eliminar el registro del examen para el alumno ${alumnoExamen.nombreAlumno} ${alumnoExamen.apellidosAlumno}?`,
        botonConfirmar: 'Eliminar',
        botonCancelar: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminarAlumnoExamen(alumnoExamen.id);
      }
    });
  }

  eliminarAlumnoExamen(id: number): void {
    this.alumnoExamenService.eliminarAlumnoExamen(id)
      .subscribe({
        next: () => {
          this.snackBar.open('Registro de examen eliminado correctamente', 'Cerrar', {
            duration: 3000
          });
          
          // Refrescar la lista
          if (this.examenId) {
            this.cargarAlumnoExamenesPorExamen();
          } else if (this.alumnoId) {
            this.cargarAlumnoExamenesPorAlumno();
          } else {
            this.cargarTodosAlumnoExamenes();
          }
        },
        error: (error) => {
          console.error('Error al eliminar el registro del examen', error);
          this.snackBar.open('Error al eliminar el registro del examen', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  registrarAsistencia(alumnoExamen: AlumnoExamenDto, asistio: boolean): void {
    this.alumnoExamenService.registrarAsistencia(alumnoExamen.id, asistio)
      .subscribe({
        next: () => {
          const mensaje = asistio ? 'Asistencia registrada correctamente' : 'Ausencia registrada correctamente';
          this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
          
          // Refrescar los datos
          if (this.examenId) {
            this.cargarAlumnoExamenesPorExamen();
          } else if (this.alumnoId) {
            this.cargarAlumnoExamenesPorAlumno();
          } else {
            this.cargarTodosAlumnoExamenes();
          }
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
} 