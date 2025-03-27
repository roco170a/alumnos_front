import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmacionDialogData {
  titulo: string;
  mensaje: string;
  botonAceptar: string;
  botonCancelar: string;
}

@Component({
  selector: 'app-confirmacion-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.titulo }}</h2>
    <mat-dialog-content>
      <p>{{ data.mensaje }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">{{ data.botonCancelar }}</button>
      <button mat-button color="warn" [mat-dialog-close]="true">{{ data.botonAceptar }}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      margin-top: 0;
      color: #333;
    }
    p {
      margin-bottom: 16px;
      color: #666;
    }
  `]
})
export class ConfirmacionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmacionDialogData
  ) {}
} 