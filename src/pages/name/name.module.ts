import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NamePage } from './name';

@NgModule({
  declarations: [
    NamePage,
  ],
  imports: [
    IonicPageModule.forChild(NamePage),
  ],
})
export class NamePageModule {}
