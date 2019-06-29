import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TrainingsGamePage } from './trainings-game';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TrainingsGamePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: TrainingsGamePage
      }
    ])
  ]
})
export class TrainingsGamePageModule {}
