import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { SpecialiteListComponent } from './specialite-list/specialite-list.component';
import { SpecialiteFormComponent } from './specialite-form/specialite-form.component';

const routes: Routes = [
  { path: '', component: SpecialiteListComponent },
  { path: 'new', component: SpecialiteFormComponent },
  { path: ':id/edit', component: SpecialiteFormComponent }
];

@NgModule({
  declarations: [
    SpecialiteListComponent,
    SpecialiteFormComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SpecialitesModule { }
