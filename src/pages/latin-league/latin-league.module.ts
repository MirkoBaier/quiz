import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LatinLeaguePage } from './latin-league';

@NgModule({
  declarations: [
    LatinLeaguePage,
  ],
  imports: [
    IonicPageModule.forChild(LatinLeaguePage),
  ],
})
export class LatinLeaguePageModule {}
