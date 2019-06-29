import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { OfflineTrainingsGamePage } from './offline-trainings-game';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    OfflineTrainingsGamePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: OfflineTrainingsGamePage
      }
    ])
  ]
})
export class OfflineTrainingsGamePageModule {}
