import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CerPrenupcialComponent } from './components/cer-prenupcial/cer-prenupcial.component';
import { CerAlumbramientoComponent } from './components/cer-alumbramiento/cer-alumbramiento.component';
import { CertificadosComponent } from './certificados.component';
import { CerIncapacidadComponent } from './components/cer-incapacidad/cer-incapacidad.component';
import { CerLesionesComponent } from './components/cer-lesiones/cer-lesiones.component';
import { CerSaludComponent } from './components/cer-salud/cer-salud.component';

export const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "prenupcial",
        component: CerPrenupcialComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "alumbramiento",
        component: CerAlumbramientoComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "incapacidad",
        component: CerIncapacidadComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "lesiones",
        component: CerLesionesComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "salud",
        component: CerSaludComponent
      }
    ]
  }
];
