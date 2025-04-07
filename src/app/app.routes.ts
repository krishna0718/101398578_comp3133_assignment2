import { provideRouter, Routes, CanActivateFn } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AddEmployeeComponent } from './employees/employee-add/employee-add.component';
import { EmployeeListComponent } from './employees/employee-list/employee-list.component';
import { EditEmployeeComponent } from './employees/employee-update/employee-update.component';
import { ViewEmployeeComponent } from './employees/employee-view/employee-view.component';

const authGuard: CanActivateFn = () => {
  return !!localStorage.getItem('token');
};

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'employees', component: EmployeeListComponent, canActivate: [authGuard] },
  { path: 'employees/add', component: AddEmployeeComponent, canActivate: [authGuard] },
  { path: 'employees/edit/:id', component: EditEmployeeComponent, canActivate: [authGuard] },
  { path: 'employees/:id', component: ViewEmployeeComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];

export const appRouting = provideRouter(routes);