import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NamePage } from './name';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NamePage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: NamePage
      }
    ])
  ]
})
export class NamePageModule {}
