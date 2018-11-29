import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsernamePage } from './username';

@NgModule({
  declarations: [
    UsernamePage,
  ],
  imports: [
    IonicPageModule.forChild(UsernamePage),
  ],
})
export class UsernamePageModule {}
