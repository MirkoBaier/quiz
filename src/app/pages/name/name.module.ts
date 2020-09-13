import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NamePage } from './name';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import 'gl-ionic-background-video';


@NgModule({
  declarations: [
    NamePage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: NamePage
      }
    ])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NamePageModule {}
