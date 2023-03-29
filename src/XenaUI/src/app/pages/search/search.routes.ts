import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search.component';
import { CanActivateGuard } from 'app/services';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
    canActivate: [CanActivateGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
