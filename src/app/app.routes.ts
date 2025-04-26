import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Página inicial',
    loadComponent: () => import('./home-component/home-component.component').then(m => m.HomeComponentComponent),
  },
  {
    path: 'products',
    title: 'Produtos',
    loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
  },
  {
    path: 'products/:id',
    title: 'Detalhes do produto',
    loadComponent: () => import('./product-details/product-details.component').then(m => m.ProductDetailsComponent)
  }
];
