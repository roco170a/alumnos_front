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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ProgramacionExamenService } from '../../services/programacion-examen.service';
import { MateriaService } from '../../services/materia.service';
import { ProgramacionExamen } from '../../models/programacion-examen.model';
import { Materia } from '../../models/materia.model';

@Component({
  selector: 'app-formulario-programacion',
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
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './formulario-programacion.component.html',
  styleUrls: ['./formulario-programacion.component.scss']
})
export class FormularioProgramacionComponent implements OnInit {
  programacionForm!: FormGroup;
  materias: Materia[] = [];
  estadosDisponibles: string[] = ['Programado', 'Pendiente', 'En Proceso', 'Completado', 'Cancelado'];
  
  programacionId: number = 0;
  esEdicion: boolean = false;
  cargando: boolean = false;
  guardando: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private programacionService: ProgramacionExamenService,
    private materiaService: MateriaService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarMaterias();
    
    // Determinar si es edición o creación
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.programacionId = +id;
        this.esEdicion = true;
        this.cargarProgramacion(this.programacionId);
      }
    });
  }

  inicializarFormulario(): void {
    this.programacionForm = this.fb.group({
      materiaId: ['', Validators.required],
      fecha: ['', Validators.required],
      horaInicio: ['', [Validators.required, Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]],
      duracionMinutos: ['', [Validators.required, Validators.min(1), Validators.max(300)]],
      aula: ['', [Validators.required, Validators.maxLength(50)]],
      instrucciones: ['', Validators.maxLength(500)],
      materialRequerido: ['', Validators.maxLength(500)],
      estado: ['Programado', Validators.required],
      activo: [true]
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

  cargarProgramacion(id: number): void {
    this.cargando = true;
    this.programacionService.getProgramacionPorId(id).subscribe({
      next: (programacion) => {
        this.programacionForm.patchValue({
          materiaId: programacion.materiaId,
          fecha: new Date(programacion.fechaProgramada),
          horaInicio: programacion.horaInicio,
          duracionMinutos: programacion.duracionMinutos,
          aula: programacion.aula,
          instrucciones: programacion.instrucciones,
          materialRequerido: programacion.materialRequerido,
          estado: programacion.estado,
          activo: programacion.activo
        });
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar programación', error);
        this.mostrarMensaje('Error al cargar los datos de la programación');
        this.cargando = false;
      }
    });
  }

  guardarProgramacion(): void {
    if (this.programacionForm.invalid) {
      this.programacionForm.markAllAsTouched();
      this.mostrarMensaje('Por favor, completa todos los campos requeridos correctamente');
      return;
    }

    this.guardando = true;
    const programacionData: ProgramacionExamen = {...this.programacionForm.value};
    
    // Formateamos la fecha
    const fecha = this.programacionForm.get('fecha')?.value;
    if (fecha instanceof Date) {
      programacionData.fecha = fecha;
    }
    
    if (this.esEdicion) {
      this.programacionService.actualizarProgramacion(this.programacionId, programacionData).subscribe({
        next: () => {
          this.mostrarMensaje('Programación actualizada correctamente');
          this.guardando = false;
          this.router.navigate(['/programaciones', this.programacionId]);
        },
        error: (error) => {
          console.error('Error al actualizar programación', error);
          this.mostrarMensaje('Error al actualizar la programación');
          this.guardando = false;
        }
      });
    } else {
      this.programacionService.crearProgramacion(programacionData).subscribe({
        next: (programacionCreada) => {
          this.mostrarMensaje('Programación creada correctamente');
          this.guardando = false;
          this.router.navigate(['/programaciones', programacionCreada.id]);
        },
        error: (error) => {
          console.error('Error al crear programación', error);
          this.mostrarMensaje('Error al crear la programación');
          this.guardando = false;
        }
      });
    }
  }

  cancelar(): void {
    if (this.esEdicion) {
      this.router.navigate(['/programaciones', this.programacionId]);
    } else {
      this.router.navigate(['/programaciones']);
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
