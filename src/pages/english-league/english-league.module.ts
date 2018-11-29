import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnglishLeaguePage } from './english-league';

@NgModule({
  declarations: [
    EnglishLeaguePage,
  ],
  imports: [
    IonicPageModule.forChild(EnglishLeaguePage),
  ],
})
export class EnglishLeaguePageModule {}
