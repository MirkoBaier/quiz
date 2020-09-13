import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LeagueGamePage } from './league-game';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import 'gl-ionic-background-video';


@NgModule({
  declarations: [
    LeagueGamePage,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule ,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: LeagueGamePage
      }
    ])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LeagueGamePageModule {}
