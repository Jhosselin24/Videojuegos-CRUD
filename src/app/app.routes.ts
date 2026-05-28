import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'tabs',
    loadComponent: () =>
      import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    canActivate: [authGuard],
    children: [
      {
        path: 'videojuegos',
        loadComponent: () =>
          import('./pages/videojuegos/videojuegos.page').then(m => m.VideojuegosPage)
      },
      {
        path: 'registros',
        loadComponent: () =>
          import('./pages/registros/registros.page').then(m => m.RegistrosPage)
      },
      {
        path: 'encuestas',
        loadComponent: () =>
          import('./pages/encuestas/encuestas.page').then(m => m.EncuestasPage)
      },
      {
        path: 'promo',
        loadComponent: () =>
          import('./pages/promo/promo.page').then(m => m.PromoPage)
      },
      {
        path: '',
        redirectTo: 'encuestas',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'videojuegos-form',
    loadComponent: () =>
      import('./pages/videojuego-form/videojuego-form.page').then(m => m.VideojuegoFormPage),
    canActivate: [authGuard]
  },
  {
    path: 'videojuegos-form/:id',
    loadComponent: () =>
      import('./pages/videojuego-form/videojuego-form.page').then(m => m.VideojuegoFormPage),
    canActivate: [authGuard]
  },
  {
    path: 'registro-form',
    loadComponent: () =>
      import('./pages/registro-form/registro-form.page').then(m => m.RegistroFormPage),
    canActivate: [authGuard]
  },
  {
    path: 'encuesta-form',
    loadComponent: () =>
      import('./pages/encuesta-form/encuesta-form.page').then(m => m.EncuestaFormPage),
    canActivate: [authGuard]
  },
  {
    path: 'encuestas',
    loadComponent: () =>
      import('./pages/encuestas/encuestas.page').then(m => m.EncuestasPage),
    canActivate: [authGuard]
  },
  // Redirigir cualquier ruta desconocida al login
  {
    path: '**',
    redirectTo: 'login'
  }
];