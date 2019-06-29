import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RegistrationPage } from './registration';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RegistrationPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: RegistrationPage
      }
    ])
  ]
})
export class RegistrationPageModule {}
