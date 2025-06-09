import { Routes } from '@angular/router';
import { AuthenticationComponent } from './layouts/authentication/authentication.component';
import { LoginComponent } from './authentication/Pages/login/login.component';
import { MainComponent } from './layouts/main/main.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    children: [
      {
        path: '',
        redirectTo: 'authentication/login',
        pathMatch: 'full'
      },
      {
        path: 'authentication/login',
        loadComponent: () => import('./authentication/Pages/login/login.component').then(m => m.LoginComponent)
      }
    ]
  },
  {
    path: 'coremedic',
    component: MainComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/dashboard/certificados/certificados.routes').then(m => m.routes)
      }
    ]
  },
  { path: '**', redirectTo: 'authentication/login' }
];
