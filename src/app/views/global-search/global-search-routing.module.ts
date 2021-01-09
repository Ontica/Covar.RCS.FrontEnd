/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GlobalSearchMainPageComponent } from './main-page/gs-main-page.component';


const routes: Routes = [
  { path: 'main', component: GlobalSearchMainPageComponent },
  { path: '', redirectTo: 'main', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobalSearchRoutingModule { }
