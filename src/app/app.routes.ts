import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './Register/register';
import { AdminComponent } from './admin/admin';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent }
];