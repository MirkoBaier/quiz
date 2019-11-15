import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LeagueGamePage } from './league-game';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  ]
})
export class LeagueGamePageModule {}
