import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UsernamePage } from './username';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UsernamePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: UsernamePage
      }
    ])
  ]
})
export class UsernamePageModule {}
