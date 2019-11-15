import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {OfflineEasyModusGamePage} from './offline-easy-modus-game';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DragulaModule} from 'ng2-dragula';

// import { DragulaService, DragulaModule } from 'ng2-dragula';

@NgModule({
  declarations: [
    OfflineEasyModusGamePage
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: OfflineEasyModusGamePage
      }
    ]),
    DragulaModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OfflineEasyModusGamePageModule {
}
