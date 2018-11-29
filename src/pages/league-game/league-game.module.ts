import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeagueGamePage } from './league-game';

@NgModule({
  declarations: [
    LeagueGamePage,
  ],
  imports: [
    IonicPageModule.forChild(LeagueGamePage),
  ],
})
export class LeagueGamePageModule {}
