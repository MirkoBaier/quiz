import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnevsonePage } from './onevsone';

@NgModule({
  declarations: [
    OnevsonePage,
  ],
  imports: [
    IonicPageModule.forChild(OnevsonePage),
  ],
})
export class OnevsonePageModule {}
