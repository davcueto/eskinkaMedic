import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../../guards/auth.guard';
import { GeneralComponent } from './componentes/general/general.component';

export const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "resetageneral",
        component: GeneralComponent,
        canActivate: [authGuard]
      }
    ]
  }
];
