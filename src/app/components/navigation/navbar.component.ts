import { Component, EventEmitter, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() menuToggle = new EventEmitter<void>();
  
  usuario = {
    nombre: 'Usuario N/D',
    avatar: '',
  };

  currentLanguage = 'English';
  
  toggleMenu(): void {
    this.menuToggle.emit();
  }

  changeLanguage(language: string): void {
    this.currentLanguage = language;
  }

  logout(): void {
    // Implementar lógica de cierre de sesión
    console.log('Cerrar sesión');
  }
} 