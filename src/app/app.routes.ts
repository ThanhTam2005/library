import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { Upload } from './pages/upload/upload';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'home', component: Home },
    { path: 'login', component: LoginComponent },
    { path: 'upload', component: Upload },

    { path: '**', redirectTo: '' }
];