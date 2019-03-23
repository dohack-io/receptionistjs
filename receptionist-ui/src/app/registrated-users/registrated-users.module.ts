import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegistratedUsersPage } from './registrated-users.page';

const routes: Routes = [
  {
    path: '',
    component: RegistratedUsersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegistratedUsersPage]
})
export class RegistratedUsersPageModule {}
