import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Default Component
import { HomeComponent } from './pages/home/home.component';
import { AppCustomPreloader } from './app-routing-loader';

const routes: Routes = [
  {
    path: '', //load with main core bundle
    //redirectTo: 'index',
    //pathMatch: 'full'
    component: HomeComponent,
  },
  {
    path: 'index', //load with main core bundle
    component: HomeComponent,
  },
  {
    path: 'auth',
    loadChildren: './pages/public/public.module#PublicModule',
  },
  {
    path: 'module',
    loadChildren: './pages/private/private.module#PrivateModule',
    data: { preload: true }, //preload in background to be ready to use when user navigates to this route
  },
  {
    path: 'search',
    loadChildren: './pages/search/search.module#SearchModule',
  },
  {
    path: 'advancesearch',
    loadChildren:
      './pages/search/advance-search/advance-search.module#AdvanceSearchModule',
  },
  {
    path: 'widget',
    loadChildren: './pages/widget/widget.module#WidgetModule',
  },
  {
    path: '**',
    redirectTo: 'index',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: AppCustomPreloader,
    }),
  ],
  exports: [RouterModule],
  providers: [AppCustomPreloader],
})
export class AppRoutingModule {}
