import { NgModule } from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import { CreateVocPage } from './create-voc';

@NgModule({
  declarations: [
    CreateVocPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateVocPage)
  ],
})
export class CreateVocPageModule {}
