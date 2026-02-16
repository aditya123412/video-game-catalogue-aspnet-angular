import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Browse } from './Components/browse/browse';
import { Edit } from './Components/edit/edit';

const routes: Routes = [
  { path: '', component: Browse },
  { path: 'edit', component: Edit },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
