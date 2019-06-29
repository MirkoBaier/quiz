import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { OfflinePage } from './offline';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    OfflinePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: OfflinePage
      }
    ])
  ]
})
export class OfflinePageModule {}
