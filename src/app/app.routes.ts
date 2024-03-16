import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FileDirectoriesComponent } from './components/file-directories/file-directories.component';
import { permissionGuard } from './shared/core/guards/permission.guard';

export const routes: Routes = [
  {
    path: '',
    component: FileDirectoriesComponent,
    canActivate: [permissionGuard]
  },
  { path: 'login', component: LoginComponent },
];
