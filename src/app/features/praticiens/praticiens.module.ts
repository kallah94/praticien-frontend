import { RouterModule, Routes } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PraticienListComponent } from './praticien-list/praticien-list.component';
import { PraticienFormComponent } from './praticien-form/praticien-form.component';
import { PraticienDetailComponent } from './praticien-detail/praticien-detail.component';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelTitle
} from "@angular/material/expansion";

const routes: Routes = [
  { path: '', component: PraticienListComponent },
  { path: 'new', component: PraticienFormComponent },
  { path: ':id', component: PraticienDetailComponent },
  { path: ':id/edit', component: PraticienFormComponent }
];

@NgModule({
  declarations: [
    PraticienListComponent,
    PraticienFormComponent,
    PraticienDetailComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PraticiensModule { }
