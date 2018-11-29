import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnevsoneGamePage } from './onevsone-game';

@NgModule({
  declarations: [
    OnevsoneGamePage,
  ],
  imports: [
    IonicPageModule.forChild(OnevsoneGamePage),
  ],
})
export class OnevsoneGamePageModule {}
