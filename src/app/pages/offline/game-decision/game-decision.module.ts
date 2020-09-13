import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GameDecisionPage } from './game-decision.page';
import 'gl-ionic-background-video';

const routes: Routes = [
  {
    path: '',
    component: GameDecisionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GameDecisionPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GameDecisionPageModule {}
