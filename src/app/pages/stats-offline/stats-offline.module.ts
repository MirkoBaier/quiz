import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StatsOfflinePage } from './stats-offline';

@NgModule({
  declarations: [
    StatsOfflinePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: StatsOfflinePage
      }
    ])
  ]
})
export class StatsOfflinePageModule {}
