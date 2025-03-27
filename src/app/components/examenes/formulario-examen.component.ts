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

import { ExamenService } from '../../services/examen.service';
import { TipoExamenService } from '../../services/tipo-examen.service';
import { ProgramacionExamenService } from '../../services/programacion-examen.service';
import { Examen, ExamenDto, TipoExamenDto } from '../../models/examen.model';
import { ProgramacionExamenDto } from '../../models/programacion-examen.model';

@Component({
  selector: 'app-formulario-examen',
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
  templateUrl: './formulario-examen.component.html',
  styleUrls: ['./formulario-examen.component.scss']
})
export class FormularioExamenComponent implements OnInit {
  examenForm!: FormGroup;
  examenId: number = 0;
  esNuevo: boolean = true;
  cargando: boolean = false;
  guardando: boolean = false;
  hayError: boolean = false;
  tiposExamen: TipoExamenDto[] = [];
  programaciones: ProgramacionExamenDto[] = [];
  estadosExamen: string[] = ['Pendiente', 'Activo', 'Realizado', 'Cancelado'];
  examen?: ExamenDto;

  constructor(
    private formBuilder: FormBuilder,
    private examenService: ExamenService,
    private tipoExamenService: TipoExamenService,
    private programacionExamenService: ProgramacionExamenService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.cargarTiposExamen();
    this.cargarProgramaciones();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.examenId = +id;
        this.esNuevo = false;
        this.cargarExamen();
      }
    });
  }

  inicializarFormulario(examen?: Examen): void {
    this.examenForm = this.formBuilder.group({
      programacionId: [examen?.programacionId || '', [Validators.required]],
      tipoExamenId: [examen?.tipoExamenId || '', [Validators.required]],
      fechaRealizacion: [examen?.fechaRealizacion || new Date(), [Validators.required]],
      observaciones: [examen?.observaciones || ''],
      estado: [examen?.estado || 'Pendiente', [Validators.required]],
      activo: [examen?.activo !== undefined ? examen.activo : true]
    });
  }

  cargarTiposExamen(): void {
    this.tipoExamenService.getTiposExamen().subscribe({
      next: (tiposExamen) => {
        this.tiposExamen = tiposExamen;
      },
      error: (error) => {
        console.error('Error al cargar tipos de examen', error);
        this.mostrarMensaje('Error al cargar los tipos de examen');
      }
    });
  }

  cargarProgramaciones(): void {
    this.programacionExamenService.getProgramacionesExamen().subscribe({
      next: (programaciones) => {
        this.programaciones = programaciones;
      },
      error: (error) => {
        console.error('Error al cargar programaciones', error);
        this.mostrarMensaje('Error al cargar las programaciones de examen');
      }
    });
  }

  cargarExamen(): void {
    this.cargando = true;
    this.hayError = false;
    
    this.examenService.getExamenPorId(this.examenId).subscribe({
      next: (examen) => {
        this.examen = examen;
        
        // Convertir la fecha de string a Date
        const fechaExamen = examen.fechaRealizacion instanceof Date ? 
          examen.fechaRealizacion : new Date(examen.fechaRealizacion);
        
        this.inicializarFormulario({
          id: examen.id,
          programacionId: examen.programacionId,
          tipoExamenId: examen.tipoExamenId,
          fechaRealizacion: fechaExamen,
          observaciones: examen.observaciones,
          estado: examen.estado,
          activo: examen.activo
        });
        
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar examen', error);
        this.mostrarMensaje('Error al cargar los datos del examen');
        this.cargando = false;
        this.hayError = true;
      }
    });
  }

  guardar(): void {
    if (this.examenForm.invalid) {
      this.examenForm.markAllAsTouched();
      return;
    }
    
    this.guardando = true;
    const examen: Examen = {
      ...this.examenForm.value
    };
    
    if (!this.esNuevo) {
      examen.id = this.examenId;
      
      this.examenService.actualizarExamen(this.examenId, examen).subscribe({
        next: () => {
          this.mostrarMensaje('Examen actualizado correctamente');
          this.guardando = false;
          this.router.navigate(['/examenes', this.examenId]);
        },
        error: (error) => {
          console.error('Error al actualizar examen', error);
          this.mostrarMensaje('Error al actualizar el examen');
          this.guardando = false;
        }
      });
    } else {
      this.examenService.crearExamen(examen).subscribe({
        next: (nuevoExamen) => {
          this.mostrarMensaje('Examen creado correctamente');
          this.guardando = false;
          this.router.navigate(['/examenes', nuevoExamen.id]);
        },
        error: (error) => {
          console.error('Error al crear examen', error);
          this.mostrarMensaje('Error al crear el examen');
          this.guardando = false;
        }
      });
    }
  }

  cancelar(): void {
    if (this.esNuevo) {
      this.router.navigate(['/examenes']);
    } else {
      this.router.navigate(['/examenes', this.examenId]);
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