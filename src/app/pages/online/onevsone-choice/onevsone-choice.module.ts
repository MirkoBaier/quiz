import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { OnevsoneChoicePage } from './onevsone-choice';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    OnevsoneChoicePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: OnevsoneChoicePage
      }
    ])
  ]
})
export class OnevsoneChoicePageModule {}
