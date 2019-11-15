import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { OnevsonePage } from './onevsone';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    OnevsonePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: OnevsonePage
      }
    ])
  ]
})
export class OnevsonePageModule {}
