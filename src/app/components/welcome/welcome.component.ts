import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  cards = [
    {
      title: 'Alumnos',
      description: 'Gestione la información de los alumnos de la escuela.',
      icon: 'people',
      route: '/alumnos',
      color: '#4285f4'
    },
    {
      title: 'Materias',
      description: 'Administre las materias y asignaturas.',
      icon: 'book',
      route: '/materias',
      color: '#ea4335'
    },
    {
      title: 'Exámenes',
      description: 'Gestione los exámenes y evaluaciones.',
      icon: 'assignment',
      route: '/examenes',
      color: '#34a853'
    },
    {
      title: 'Inscripciones',
      description: 'Gestione las inscripciones de los alumnos.',
      icon: 'settings',
      route: '/inscripciones',
      color: '#fbbc05'
    },
    {
      title: 'Programaciones',
      description: 'Gestione las programaciones de los exámenes.',
      icon: 'settings',
      route: '/programaciones',
      color: '#fbbc05'
    },
    {
      title: 'Alumno Examenes',
      description: 'Gestione los exámenes de los alumnos.',
      icon: 'settings',
      route: '/alumno-examenes',
      color: '#fbbc05'
    }
  ];
} 