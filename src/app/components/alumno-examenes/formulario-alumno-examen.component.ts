import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { AlumnoExamenService } from '../../services/alumno-examen.service';
import { ExamenService } from '../../services/examen.service';
import { AlumnoService } from '../../services/alumno.service';
import { AlumnoExamen, ESTADOS_ALUMNO_EXAMEN } from '../../models/alumno-examen.model';
import { AlumnoDto } from '../../models/alumno.model';
import { ExamenDto } from '../../models/examen.model';

@Component({
  selector: 'app-formulario-alumno-examen',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './formulario-alumno-examen.component.html',
  styleUrls: ['./formulario-alumno-examen.component.scss']
})
export class FormularioAlumnoExamenComponent implements OnInit {
  formularioExamen: FormGroup;
  
  cargando = false;
  cargandoAlumnos = false;
  cargandoExamenes = false;
  hayError = false;
  
  // Parámetros de la ruta
  alumnoId?: number;
  examenId?: number;
  
  // Listas para los selects
  alumnos: AlumnoDto[] = [];
  examenes: ExamenDto[] = [];
  estados = ESTADOS_ALUMNO_EXAMEN;

  constructor(
    private fb: FormBuilder,
    private alumnoExamenService: AlumnoExamenService,
    private alumnoService: AlumnoService,
    private examenService: ExamenService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.formularioExamen = this.fb.group({
      alumnoId: [null, Validators.required],
      examenId: [null, Validators.required],
      estado: ['Pendiente', Validators.required],
      comentarios: [''],
      calificacion: [null]
    });
  }

  ngOnInit(): void {
    // Obtener parámetros de la ruta y queryParams
    this.route.queryParams.subscribe(params => {
      if (params['alumnoId']) {
        this.alumnoId = +params['alumnoId'];
        this.formularioExamen.get('alumnoId')?.setValue(this.alumnoId);
        this.formularioExamen.get('alumnoId')?.disable(); // Deshabilitar el campo si ya tenemos el alumno
      }
      
      if (params['examenId']) {
        this.examenId = +params['examenId'];
        this.formularioExamen.get('examenId')?.setValue(this.examenId);
        this.formularioExamen.get('examenId')?.disable(); // Deshabilitar el campo si ya tenemos el examen
      }
    });
    
    // Cargar los alumnos y exámenes
    this.cargarAlumnos();
    this.cargarExamenes();
  }

  cargarAlumnos(): void {
    this.cargandoAlumnos = true;
    
    this.alumnoService.getAlumnos()
      .subscribe({
        next: (data) => {
          this.alumnos = data;
          this.cargandoAlumnos = false;
        },
        error: (error) => {
          console.error('Error al cargar los alumnos', error);
          this.cargandoAlumnos = false;
          this.snackBar.open('Error al cargar los alumnos', 'Cerrar', { duration: 3000 });
        }
      });
  }

  cargarExamenes(): void {
    this.cargandoExamenes = true;
    
    this.examenService.getExamenes('Activo')
      .subscribe({
        next: (data) => {
          this.examenes = data;
          this.cargandoExamenes = false;
        },
        error: (error) => {
          console.error('Error al cargar los exámenes', error);
          this.cargandoExamenes = false;
          this.snackBar.open('Error al cargar los exámenes', 'Cerrar', { duration: 3000 });
        }
      });
  }

  guardarAlumnoExamen(): void {
    if (this.formularioExamen.invalid) {
      this.snackBar.open('Por favor, complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }
    
    this.cargando = true;
    
    // Habilitar campos que pudieran estar deshabilitados para poder obtener su valor
    if (this.alumnoId) {
      this.formularioExamen.get('alumnoId')?.enable();
    }
    if (this.examenId) {
      this.formularioExamen.get('examenId')?.enable();
    }
    
    const alumnoExamen: AlumnoExamen = {
      alumnoId: this.formularioExamen.value.alumnoId,
      examenId: this.formularioExamen.value.examenId,
      estado: this.formularioExamen.value.estado,
      comentarios: this.formularioExamen.value.comentarios,
      calificacion: this.formularioExamen.value.calificacion,
      activo: true,
      fechaCreacion: new Date()
    };
    
    this.alumnoExamenService.crearAlumnoExamen(alumnoExamen)
      .subscribe({
        next: (nuevoAlumnoExamen) => {
          this.cargando = false;
          this.snackBar.open('Examen de alumno creado correctamente', 'Cerrar', { duration: 3000 });
          
          // Navegar a la página adecuada según el contexto
          if (this.examenId) {
            this.router.navigate(['/alumno-examenes/examen', this.examenId]);
          } else if (this.alumnoId) {
            this.router.navigate(['/alumno-examenes/alumno', this.alumnoId]);
          } else {
            this.router.navigate(['/alumno-examenes', nuevoAlumnoExamen.id]);
          }
        },
        error: (error) => {
          console.error('Error al crear el examen de alumno', error);
          this.cargando = false;
          this.hayError = true;
          this.snackBar.open('Error al crear el examen de alumno', 'Cerrar', { duration: 3000 });
        }
      });
  }

  cancelar(): void {
    // Volver a la página anterior
    window.history.back();
  }
} 