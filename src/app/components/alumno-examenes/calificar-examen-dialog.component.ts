import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlumnoExamenService } from '../../services/alumno-examen.service';
import { AlumnoExamenDto, ESTADOS_ALUMNO_EXAMEN } from '../../models/alumno-examen.model';

@Component({
  selector: 'app-calificar-examen-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <h1 mat-dialog-title>Calificar Examen</h1>
    <div mat-dialog-content>
      <div class="examen-info">
        <p><strong>Alumno:</strong> {{ data.alumnoExamen.nombreAlumno }} {{ data.alumnoExamen.apellidosAlumno }}</p>
        <p><strong>Materia:</strong> {{ data.alumnoExamen.nombreMateria }} ({{ data.alumnoExamen.codigoMateria }})</p>
        <p><strong>Tipo de Examen:</strong> {{ data.alumnoExamen.nombreTipoExamen }}</p>
      </div>
      <form [formGroup]="calificacionForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Calificación</mat-label>
          <input matInput type="number" formControlName="calificacion" min="0" max="10" step="0.1">
          <mat-error *ngIf="calificacionForm.get('calificacion')?.hasError('required')">
            La calificación es requerida
          </mat-error>
          <mat-error *ngIf="calificacionForm.get('calificacion')?.hasError('min') || calificacionForm.get('calificacion')?.hasError('max')">
            La calificación debe estar entre 0 y 10
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Estado</mat-label>
          <mat-select formControlName="estado">
            <mat-option *ngFor="let estado of estados" [value]="estado">{{ estado }}</mat-option>
          </mat-select>
          <mat-error *ngIf="calificacionForm.get('estado')?.hasError('required')">
            El estado es requerido
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Comentarios</mat-label>
          <textarea matInput formControlName="comentarios" rows="4"></textarea>
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancelar()">Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="calificacionForm.invalid" (click)="onGuardar()">Guardar</button>
    </div>
  `,
  styles: [`
    .examen-info {
      background-color: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
    }
    
    .examen-info p {
      margin: 4px 0;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    mat-dialog-content {
      min-width: 300px;
    }
    
    mat-dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  `]
})
export class CalificarExamenDialogComponent {
  calificacionForm: FormGroup;
  estados = ESTADOS_ALUMNO_EXAMEN.filter(estado => 
    ['Calificado', 'Aprobado', 'Reprobado'].includes(estado)
  );

  constructor(
    public dialogRef: MatDialogRef<CalificarExamenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { alumnoExamen: AlumnoExamenDto },
    private fb: FormBuilder,
    private alumnoExamenService: AlumnoExamenService,
    private snackBar: MatSnackBar
  ) {
    this.calificacionForm = this.fb.group({
      calificacion: [data.alumnoExamen.calificacion || null, [
        Validators.required, 
        Validators.min(0), 
        Validators.max(10)
      ]],
      estado: [data.alumnoExamen.estado || 'Calificado', Validators.required],
      comentarios: [data.alumnoExamen.comentarios || '']
    });
    
    // Autoseleccionar el estado basado en la calificación
    this.calificacionForm.get('calificacion')?.valueChanges.subscribe(value => {
      if (value !== null && value !== undefined) {
        if (value >= 6) {
          this.calificacionForm.get('estado')?.setValue('Aprobado');
        } else {
          this.calificacionForm.get('estado')?.setValue('Reprobado');
        }
      }
    });
  }

  onCancelar(): void {
    this.dialogRef.close(false);
  }

  onGuardar(): void {
    if (this.calificacionForm.invalid) return;
    
    const { calificacion, estado, comentarios } = this.calificacionForm.value;
    
    this.alumnoExamenService.calificarExamen(
      this.data.alumnoExamen.id,
      calificacion,
      comentarios,
      estado
    ).subscribe({
      next: () => {
        this.snackBar.open('Examen calificado correctamente', 'Cerrar', {
          duration: 3000
        });
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error al calificar el examen', error);
        this.snackBar.open('Error al calificar el examen', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
} 