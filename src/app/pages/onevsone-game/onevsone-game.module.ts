import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { OnevsoneGamePage } from './onevsone-game';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    OnevsoneGamePage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: OnevsoneGamePage
      }
    ])
  ]
})
export class OnevsoneGamePageModule {}
