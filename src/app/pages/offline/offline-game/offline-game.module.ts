import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {OfflineGamePage} from './offline-game';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    OfflineGamePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: OfflineGamePage
      }
    ])
  ]
})
export class OfflineGamePageModule {
}
