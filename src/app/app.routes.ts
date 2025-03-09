import { Routes } from '@angular/router';
import { MainAuthComponent } from './layouts/main-auth/main-auth.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { loggedGuard } from './core/guards/logged/logged.guard';
import { authGuard } from './core/guards/auth/auth.guard';

export const routes: Routes = [
  {path: '', redirectTo: 'auth/login', pathMatch: 'full'},
  {path: 'auth', component: MainAuthComponent, children: [
    {path: 'login', loadComponent: () => import('./pages/login/login.component').then((c) => c.LoginComponent), canActivate: [loggedGuard], title: 'login'},
    {path: 'register', loadComponent: () => import('./pages/register/register.component').then((c) => c.RegisterComponent), canActivate: [loggedGuard], title: 'register'},
    {path: 'forget-password', loadComponent: () => import('./pages/forget-password/forget-password.component').then((c) => c.ForgetPasswordComponent), canActivate: [loggedGuard], title: 'forget-password'}
  ]},
  {path: '', component: MainLayoutComponent, children: [
    {path: 'home', loadComponent: () => import('./pages/home/home.component').then((c) => c.HomeComponent), canActivate: [authGuard], title: 'home'},
    {path: 'products', loadComponent: () => import('./pages/products/products.component').then((c) => c.ProductsComponent), canActivate: [authGuard], title: 'products'},
    {path: 'brands', loadComponent: () => import('./pages/brands/brands.component').then((c) => c.BrandsComponent), canActivate: [authGuard], title: 'brands'},
    {path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then((c) => c.CartComponent), canActivate: [authGuard], title: 'cart'},
    {path: 'categories', loadComponent: () => import('./pages/categories/categories.component').then((c) => c.CategoriesComponent), canActivate: [authGuard], title: 'categories'},
    {path: 'wishlist', loadComponent: () => import('./pages/wishlist/wishlist.component').then((c) => c.WishlistComponent), canActivate: [authGuard], title: 'wishlist'},
    {path: 'allorders', loadComponent: () => import('./pages/all-orders/all-orders.component').then((c) => c.AllOrdersComponent), canActivate: [authGuard], title: 'all orders'},
    {path: 'checkout/:id', loadComponent: () => import('./pages/checkout/checkout.component').then((c) => c.CheckoutComponent), canActivate: [authGuard], title: 'checkout'},
    {path: 'details/:id', loadComponent: () => import('./pages/details/details.component').then((c) => c.DetailsComponent), canActivate: [authGuard], title: 'details'},
    {path: '**', loadComponent: () => import('./pages/notfound/notfound.component').then((c) => c.NotfoundComponent), title: '404'}
  ]}
];
