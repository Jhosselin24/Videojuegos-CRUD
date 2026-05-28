import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/videojuegos',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadComponent: () =>
      import('./pages/tabs/tabs.page').then(m => m.TabsPage),
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
        path: 'promo',
        loadComponent: () =>
          import('./pages/promo/promo.page').then(m => m.PromoPage)
      },
      {
        path: '',
        redirectTo: 'videojuegos',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'videojuegos-form',
    loadComponent: () =>
      import('./pages/videojuego-form/videojuego-form.page').then(m => m.VideojuegoFormPage)
  },
  {
    path: 'videojuegos-form/:id',
    loadComponent: () =>
      import('./pages/videojuego-form/videojuego-form.page').then(m => m.VideojuegoFormPage)
  },
  {
    path: 'registro-form',
    loadComponent: () =>
      import('./pages/registro-form/registro-form.page').then(m => m.RegistroFormPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'encuesta-form',
    loadComponent: () => import('./pages/encuesta-form/encuesta-form.page').then( m => m.EncuestaFormPage)
  },
  {
    path: 'encuestas',
    loadComponent: () => import('./pages/encuestas/encuestas.page').then( m => m.EncuestasPage)
  }
];