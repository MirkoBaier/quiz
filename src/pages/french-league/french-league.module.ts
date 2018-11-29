import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FrenchLeaguePage } from './french-league';

@NgModule({
  declarations: [
    FrenchLeaguePage,
  ],
  imports: [
    IonicPageModule.forChild(FrenchLeaguePage),
  ],
})
export class FrenchLeaguePageModule {}
