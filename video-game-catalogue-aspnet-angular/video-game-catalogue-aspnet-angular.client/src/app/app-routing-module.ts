import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Browse } from './Components/browse/browse';
import { Edit } from './Components/edit/edit';

const routes: Routes = [
  // Browse is the default and also accepts an optional id parameter
  { path: '', component: Browse },
  { path: ':id', component: Browse },
  // Edit page requires an id
  { path: 'edit/:id', component: Edit },
  // Fallback to browse
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
