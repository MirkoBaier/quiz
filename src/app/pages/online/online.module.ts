import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {OnlinePage} from './online';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [OnlinePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: OnlinePage
      }
    ])
  ]
})
export class OnlinePageModule {
}
