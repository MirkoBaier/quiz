import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LeaguePage } from './league';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LeaguePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: LeaguePage
      }
    ])
  ]
})
export class LeaguePageModule {}
