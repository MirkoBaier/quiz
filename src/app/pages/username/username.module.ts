import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UsernamePage } from './username';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import 'gl-ionic-background-video';

@NgModule({
  declarations: [
    UsernamePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: UsernamePage
      }
    ])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsernamePageModule {}
