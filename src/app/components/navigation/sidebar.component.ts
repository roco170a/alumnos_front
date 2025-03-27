import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Alumnos',
      icon: 'people',
      route: '/alumnos'
    },
    {
      label: 'Inscripciones',
      icon: 'how_to_reg',
      route: '/inscripciones'
    },
    {
      label: 'Materias',
      icon: 'book',
      route: '/materias'
    },
    {
      label: 'Programaciones',
      icon: 'event',
      route: '/programaciones'
    },
    {
      label: 'Exámenes',
      icon: 'assignment',
      route: '/examenes'
    },
    {
      label: 'Exámenes de Alumnos',
      icon: 'school',
      route: '/alumno-examenes'
    },
    /* {
      label: 'Configuración',
      icon: 'settings',
      route: '/configuracion'
    } */
  ];

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }
} 