import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CerPrenupcialComponent } from './components/cer-prenupcial/cer-prenupcial.component';
import { CerAlumbramientoComponent } from './components/cer-alumbramiento/cer-alumbramiento.component';
import { CertificadosComponent } from './certificados.component';
import { CerIncapacidadComponent } from './components/cer-incapacidad/cer-incapacidad.component';
import { CerLesionesComponent } from './components/cer-lesiones/cer-lesiones.component';
import { CerSaludComponent } from './components/cer-salud/cer-salud.component';
import { authGuard } from '../../../guards/auth.guard';

export const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "prenupcial",
        component: CerPrenupcialComponent,
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "alumbramiento",
        component: CerAlumbramientoComponent,
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "incapacidad",
        component: CerIncapacidadComponent,
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "lesiones",
        component: CerLesionesComponent,
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "salud",
        component: CerSaludComponent,
        canActivate: [authGuard]
      }
    ]
  }
];
