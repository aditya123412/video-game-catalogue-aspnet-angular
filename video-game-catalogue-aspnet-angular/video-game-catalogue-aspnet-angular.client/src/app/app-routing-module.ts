import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Browse } from './Components/browse/browse';
import { Edit } from './Components/edit/edit';

const routes: Routes = [
  // Browse is the default
  { path: '', component: Browse },
  // Edit/create routes must be registered before the ':id' route so they are not captured as an id
  { path: 'create', component: Edit },
  { path: 'edit/:id', component: Edit },
  // Browse with optional id (kept after edit so that 'edit' isn't treated as an id)
  { path: ':id', component: Browse },
  // Fallback to browse
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
