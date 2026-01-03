import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
    { path: 'ads', loadComponent: () => import('./ad-list/ad-list.component').then(m => m.AdListComponent), },
    { path: 'ads/:id', loadComponent: () => import('./ad-page/ad-page.component').then(m => m.AdPageComponent) }
];
