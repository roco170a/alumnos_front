import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { AlumnoService } from '../../services/alumno.service';
import { Alumno } from '../../models/alumno.model';

@Component({
  selector: 'app-formulario-alumno',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './formulario-alumno.component.html',
  styleUrls: ['./formulario-alumno.component.scss']
})
export class FormularioAlumnoComponent implements OnInit {
  alumnoForm!: FormGroup;
  titulo: string = 'Nuevo Alumno';
  botonAccion: string = 'Guardar';
  cargando: boolean = false;
  esEdicion: boolean = false;
  alumnoId?: number;

  constructor(
    private fb: FormBuilder,
    private alumnoService: AlumnoService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    
    // Verificar si estamos en modo de edición
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.alumnoId = +id;
        this.esEdicion = true;
        this.titulo = 'Editar Alumno';
        this.botonAccion = 'Actualizar';
        this.cargarDatosAlumno(this.alumnoId);
      }
    });
  }

  crearFormulario(): void {
    this.alumnoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellidoPaterno: ['', [Validators.required, Validators.maxLength(100)]],
      apellidoMaterno: ['', [Validators.maxLength(100)]],
      fechaNacimiento: [null, [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      telefono: ['', [Validators.maxLength(20)]],
      direccion: ['', [Validators.maxLength(200)]],
      activo: [true]
    });
  }

  cargarDatosAlumno(id: number): void {
    this.cargando = true;
    this.alumnoService.getAlumnoPorId(id).subscribe({
      next: (alumno) => {
        this.alumnoForm.patchValue({
          nombre: alumno.nombre,
          apellidoPaterno: alumno.apellidoPaterno,
          apellidoMaterno: alumno.apellidoMaterno,
          fechaNacimiento: new Date(alumno.fechaNacimiento),
          email: alumno.email,
          telefono: alumno.telefono,
          direccion: alumno.direccion,
          activo: alumno.activo
        });
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar los datos del alumno', error);
        this.mostrarMensaje('Error al cargar los datos del alumno');
        this.cargando = false;
        this.router.navigate(['/alumnos']);
      }
    });
  }

  guardar(): void {
    if (this.alumnoForm.invalid) {
      this.alumnoForm.markAllAsTouched();
      return;
    }

    const alumnoData: Alumno = this.alumnoForm.value;
    this.cargando = true;

    if (this.esEdicion && this.alumnoId) {

      // Se obtiene el userId del alumno
      alumnoData.id = this.alumnoId;

      // Se agrega el userId para que se pueda actualizar el alumno y posteriormente se pueda agregar esa informacion al usuario
      alumnoData.userId = '';

      console.log(alumnoData);

      this.alumnoService.actualizarAlumno(this.alumnoId, alumnoData).subscribe({
        next: () => {
          this.mostrarMensaje('Alumno actualizado correctamente');
          this.cargando = false;
          this.router.navigate(['/alumnos']);
        },
        error: (error) => {
          console.error('Error al actualizar alumno', error);
          this.mostrarMensaje('Error al actualizar el alumno');
          this.cargando = false;
        }
      });
    } else {
      this.alumnoService.crearAlumno(alumnoData).subscribe({
        next: () => {
          this.mostrarMensaje('Alumno creado correctamente');
          this.cargando = false;
          this.router.navigate(['/alumnos']);
        },
        error: (error) => {
          console.error('Error al crear alumno', error);
          this.mostrarMensaje('Error al crear el alumno');
          this.cargando = false;
        }
      });
    }
  }

  mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  // Getters para facilitar la validación en la plantilla
  get nombreNoValido() {
    return this.alumnoForm.get('nombre')?.invalid && this.alumnoForm.get('nombre')?.touched;
  }

  get apellidoPaternoNoValido() {
    return this.alumnoForm.get('apellidoPaterno')?.invalid && this.alumnoForm.get('apellidoPaterno')?.touched;
  }

  get fechaNacimientoNoValido() {
    return this.alumnoForm.get('fechaNacimiento')?.invalid && this.alumnoForm.get('fechaNacimiento')?.touched;
  }

  get emailNoValido() {
    return this.alumnoForm.get('email')?.invalid && this.alumnoForm.get('email')?.touched;
  }
} 