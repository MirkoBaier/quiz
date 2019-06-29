import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EnglishLeaguePage } from './english-league';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EnglishLeaguePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: EnglishLeaguePage
      }
    ])
  ]
})
export class EnglishLeaguePageModule {}
