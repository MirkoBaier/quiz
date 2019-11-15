import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { BeforeOnevsoneGamePage } from './before-onevsone-game';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    BeforeOnevsoneGamePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: BeforeOnevsoneGamePage
      }
    ])
  ]
})
export class BeforeOnevsoneGamePageModule {}
