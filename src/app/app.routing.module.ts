import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'praticiens',
    loadChildren: () => import('./features/praticiens/praticiens.module').then(m => m.PraticiensModule)
  },
  {
    path: 'specialites',
    loadChildren: () => import('./features/specialites/specialites.module').then(m => m.SpecialitesModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
