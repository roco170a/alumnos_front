import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { InscripcionService } from '../../services/inscripcion.service';
import { AlumnoService } from '../../services/alumno.service';
import { MateriaService } from '../../services/materia.service';
import { Inscripcion, InscripcionDto } from '../../models/inscripcion.model';
import { AlumnoDto } from '../../models/alumno.model';
import { MateriaDto } from '../../models/materia.model';

@Component({
  selector: 'app-formulario-inscripcion',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './formulario-inscripcion.component.html',
  styleUrls: ['./formulario-inscripcion.component.scss']
})
export class FormularioInscripcionComponent implements OnInit {
  inscripcionForm!: FormGroup;
  inscripcionId: number = 0;
  esNuevo: boolean = true;
  cargando: boolean = false;
  guardando: boolean = false;
  hayError: boolean = false;
  
  alumnos: AlumnoDto[] = [];
  materias: MateriaDto[] = [];
  estadosInscripcion: string[] = ['Activo', 'Pendiente', 'Completado', 'Cancelado'];
  periodosAcademicos: string[] = ['2023-01', '2023-02', '2024-01', '2024-02'];
  
  inscripcion?: InscripcionDto;

  constructor(
    private formBuilder: FormBuilder,
    private inscripcionService: InscripcionService,
    private alumnoService: AlumnoService,
    private materiaService: MateriaService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.cargarAlumnos();
    this.cargarMaterias();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.inscripcionId = +id;
        this.esNuevo = false;
        this.cargarInscripcion();
      }
    });
  }

  inicializarFormulario(inscripcion?: Inscripcion): void {
    this.inscripcionForm = this.formBuilder.group({
      alumnoId: [inscripcion?.alumnoId || '', [Validators.required]],
      materiaId: [inscripcion?.materiaId || '', [Validators.required]],
      fechaInscripcion: [inscripcion?.fechaInscripcion || new Date(), [Validators.required]],
      periodoAcademico: [inscripcion?.periodoAcademico || this.periodosAcademicos[2], [Validators.required]],
      estado: [inscripcion?.estado || 'Activo', [Validators.required]],
      notaFinal: [inscripcion?.notaFinal || null]
    });
  }

  cargarAlumnos(): void {
    this.alumnoService.getAlumnos().subscribe({
      next: (alumnos) => {
        this.alumnos = alumnos;
      },
      error: (error) => {
        console.error('Error al cargar alumnos', error);
        this.mostrarMensaje('Error al cargar la lista de alumnos');
      }
    });
  }

  cargarMaterias(): void {
    this.materiaService.getMaterias().subscribe({
      next: (materias) => {
        this.materias = materias;
      },
      error: (error) => {
        console.error('Error al cargar materias', error);
        this.mostrarMensaje('Error al cargar la lista de materias');
      }
    });
  }

  cargarInscripcion(): void {
    this.cargando = true;
    this.hayError = false;
    
    this.inscripcionService.getInscripcionPorId(this.inscripcionId).subscribe({
      next: (inscripcion) => {
        this.inscripcion = inscripcion;
        
        // Convertir la fecha de string a Date
        const fechaInscripcion = inscripcion.fechaInscripcion instanceof Date ? 
          inscripcion.fechaInscripcion : new Date(inscripcion.fechaInscripcion);
        
        this.inicializarFormulario({
          id: inscripcion.id,
          alumnoId: inscripcion.alumnoId,
          materiaId: inscripcion.materiaId,
          fechaInscripcion: fechaInscripcion,
          periodoAcademico: inscripcion.periodoAcademico,
          estado: inscripcion.estado,
          notaFinal: inscripcion.notaFinal
        });
        
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

  guardar(): void {
    if (this.inscripcionForm.invalid) {
      this.inscripcionForm.markAllAsTouched();
      return;
    }
    
    this.guardando = true;
    const inscripcion: Inscripcion = {
      ...this.inscripcionForm.value
    };
    
    if (!this.esNuevo) {
      inscripcion.id = this.inscripcionId;
      
      this.inscripcionService.actualizarInscripcion(this.inscripcionId, inscripcion).subscribe({
        next: () => {
          this.mostrarMensaje('Inscripción actualizada correctamente');
          this.guardando = false;
          this.router.navigate(['/inscripciones', this.inscripcionId]);
        },
        error: (error) => {
          console.error('Error al actualizar inscripción', error);
          this.mostrarMensaje('Error al actualizar la inscripción');
          this.guardando = false;
        }
      });
    } else {
      this.inscripcionService.crearInscripcion(inscripcion).subscribe({
        next: (nuevaInscripcion) => {
          this.mostrarMensaje('Inscripción creada correctamente');
          this.guardando = false;
          this.router.navigate(['/inscripciones', nuevaInscripcion.id]);
        },
        error: (error) => {
          console.error('Error al crear inscripción', error);
          this.mostrarMensaje('Error al crear la inscripción');
          this.guardando = false;
        }
      });
    }
  }

  cancelar(): void {
    if (this.esNuevo) {
      this.router.navigate(['/inscripciones']);
    } else {
      this.router.navigate(['/inscripciones', this.inscripcionId]);
    }
  }

  mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
} 