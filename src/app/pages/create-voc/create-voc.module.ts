import { NgModule } from '@angular/core';
import {IonicModule} from '@ionic/angular';
import { CreateVocPage } from './create-voc';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CreateVocPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: CreateVocPage
      }
    ])
  ]
})
export class CreateVocPageModule {}
