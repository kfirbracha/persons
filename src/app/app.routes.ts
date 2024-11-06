import { Routes } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { UsersListComponent } from './users-list/users-list.component';

export const routes: Routes = [
  { path: 'users', component: UsersListComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: '', redirectTo: 'users', pathMatch: 'full' },
];
