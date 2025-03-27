import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface DialogoConfirmacionData {
  titulo: string;
  mensaje: string;
  botonConfirmar?: string;
  botonCancelar?: string;
}

@Component({
  selector: 'app-dialogo-confirmacion',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.titulo }}</h2>
    <mat-dialog-content>
      <p>{{ data.mensaje }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">{{ data.botonCancelar || 'Cancelar' }}</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">{{ data.botonConfirmar || 'Confirmar' }}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      margin: 0;
      font-size: 18px;
    }
    mat-dialog-content {
      margin-top: 16px;
    }
  `]
})
export class DialogoConfirmacionComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogoConfirmacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogoConfirmacionData
  ) {}
} 