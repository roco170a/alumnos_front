import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MateriaService } from '../../services/materia.service';
import { Materia } from '../../models/materia.model';

@Component({
  selector: 'app-formulario-materia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './formulario-materia.component.html',
  styleUrls: ['./formulario-materia.component.scss']
})
export class FormularioMateriaComponent implements OnInit {
  materiaForm!: FormGroup;
  titulo: string = 'Nueva Materia';
  botonAccion: string = 'Guardar';
  cargando: boolean = false;
  esEdicion: boolean = false;
  materiaId?: number;

  constructor(
    private fb: FormBuilder,
    private materiaService: MateriaService,
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
        this.materiaId = +id;
        this.esEdicion = true;
        this.titulo = 'Editar Materia';
        this.botonAccion = 'Actualizar';
        this.cargarDatosMateria(this.materiaId);
      }
    });
  }

  crearFormulario(): void {
    this.materiaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      codigo: ['', [Validators.required, Validators.maxLength(20)]],
      profesor: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(500)]],
      creditos: [3, [Validators.required, Validators.min(1), Validators.max(10)]],
      activa: [true]
    });
  }

  cargarDatosMateria(id: number): void {
    this.cargando = true;
    this.materiaService.getMateriaPorId(id).subscribe({
      next: (materia) => {
        this.materiaForm.patchValue({
          nombre: materia.nombre,
          codigo: materia.codigo,
          profesor: materia.profesor,
          descripcion: materia.descripcion,
          creditos: materia.creditos,
          activa: materia.activa
        });
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar los datos de la materia', error);
        this.mostrarMensaje('Error al cargar los datos de la materia');
        this.cargando = false;
        this.router.navigate(['/materias']);
      }
    });
  }

  guardar(): void {
    if (this.materiaForm.invalid) {
      this.materiaForm.markAllAsTouched();
      return;
    }

    const materiaData: Materia = this.materiaForm.value;
    this.cargando = true;

    if (this.esEdicion && this.materiaId) {

      materiaData.id = this.materiaId;

      this.materiaService.actualizarMateria(this.materiaId, materiaData).subscribe({
        next: () => {
          this.mostrarMensaje('Materia actualizada correctamente');
          this.cargando = false;
          this.router.navigate(['/materias']);
        },
        error: (error) => {
          console.error('Error al actualizar materia', error);
          this.mostrarMensaje('Error al actualizar la materia');
          this.cargando = false;
        }
      });
    } else {
      this.materiaService.crearMateria(materiaData).subscribe({
        next: () => {
          this.mostrarMensaje('Materia creada correctamente');
          this.cargando = false;
          this.router.navigate(['/materias']);
        },
        error: (error) => {
          console.error('Error al crear materia', error);
          this.mostrarMensaje('Error al crear la materia');
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
    return this.materiaForm.get('nombre')?.invalid && this.materiaForm.get('nombre')?.touched;
  }

  get codigoNoValido() {
    return this.materiaForm.get('codigo')?.invalid && this.materiaForm.get('codigo')?.touched;
  }

  get profesorNoValido() {
    return this.materiaForm.get('profesor')?.invalid && this.materiaForm.get('profesor')?.touched;
  }

  get creditosNoValido() {
    return this.materiaForm.get('creditos')?.invalid && this.materiaForm.get('creditos')?.touched;
  }
} 