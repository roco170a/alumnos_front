import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ListaAlumnosComponent } from './components/alumnos/lista-alumnos.component';
import { FormularioAlumnoComponent } from './components/alumnos/formulario-alumno.component';
import { DetalleAlumnoComponent } from './components/alumnos/detalle-alumno.component';
import { ListaMateriasComponent } from './components/materias/lista-materias.component';
import { FormularioMateriaComponent } from './components/materias/formulario-materia.component';
import { DetalleMateriaComponent } from './components/materias/detalle-materia.component';
import { ListaExamenesComponent } from './components/examenes/lista-examenes.component';
import { FormularioExamenComponent } from './components/examenes/formulario-examen.component';
import { DetalleExamenComponent } from './components/examenes/detalle-examen.component';
import { ListaInscripcionesComponent } from './components/inscripciones/lista-inscripciones.component';
import { DetalleInscripcionComponent } from './components/inscripciones/detalle-inscripcion.component';
import { FormularioInscripcionComponent } from './components/inscripciones/formulario-inscripcion.component';
import { ListaProgramacionesComponent } from './components/programaciones-examen/lista-programaciones.component';
import { DetalleProgramacionComponent } from './components/programaciones-examen/detalle-programacion.component';
import { FormularioProgramacionComponent } from './components/programaciones-examen/formulario-programacion.component';
import { ListaAlumnoExamenesComponent } from './components/alumno-examenes/lista-alumno-examenes.component';
import { DetalleAlumnoExamenComponent } from './components/alumno-examenes/detalle-alumno-examen.component';
import { FormularioAlumnoExamenComponent } from './components/alumno-examenes/formulario-alumno-examen.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: WelcomeComponent },
  
  // Rutas para alumnos
  { path: 'alumnos', component: ListaAlumnosComponent },
  { path: 'alumnos/nuevo', component: FormularioAlumnoComponent },
  { path: 'alumnos/editar/:id', component: FormularioAlumnoComponent },
  { path: 'alumnos/:id', component: DetalleAlumnoComponent },
  
  // Rutas para materias
  { path: 'materias', component: ListaMateriasComponent },
  { path: 'materias/nuevo', component: FormularioMateriaComponent },
  { path: 'materias/editar/:id', component: FormularioMateriaComponent },
  { path: 'materias/:id', component: DetalleMateriaComponent },
  
  // Rutas para exámenes
  { path: 'examenes', component: ListaExamenesComponent },
  { path: 'examenes/nuevo', component: FormularioExamenComponent },
  { path: 'examenes/editar/:id', component: FormularioExamenComponent },
  { path: 'examenes/:id', component: DetalleExamenComponent },
  
  // Rutas para inscripciones
  { path: 'inscripciones', component: ListaInscripcionesComponent },
  { path: 'inscripciones/nueva', component: FormularioInscripcionComponent },
  { path: 'inscripciones/editar/:id', component: FormularioInscripcionComponent },
  { path: 'inscripciones/alumno/:alumnoId', component: ListaInscripcionesComponent },
  { path: 'inscripciones/materia/:materiaId', component: ListaInscripcionesComponent },
  { path: 'inscripciones/:id', component: DetalleInscripcionComponent },
  
  // Rutas para programaciones de examen
  { path: 'programaciones', component: ListaProgramacionesComponent },
  { path: 'programaciones/nueva', component: FormularioProgramacionComponent },
  { path: 'programaciones/editar/:id', component: FormularioProgramacionComponent },
  { path: 'programaciones/materia/:materiaId', component: ListaProgramacionesComponent },
  { path: 'programaciones/:id', component: DetalleProgramacionComponent },
  
  // Rutas para alumno-examenes
  { path: 'alumno-examenes', component: ListaAlumnoExamenesComponent },
  { path: 'alumno-examenes/alumno/:alumnoId', component: ListaAlumnoExamenesComponent },
  { path: 'alumno-examenes/examen/:examenId', component: ListaAlumnoExamenesComponent },
  { path: 'alumno-examenes/nuevo', component: FormularioAlumnoExamenComponent },
  { path: 'alumno-examenes/calificar/:id', component: DetalleAlumnoExamenComponent },
  { path: 'alumno-examenes/:id', component: DetalleAlumnoExamenComponent },
  
  { path: '**', redirectTo: '/dashboard' } // Ruta comodín para manejar rutas no encontradas
];
