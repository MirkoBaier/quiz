import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { VoclistPage } from './voclist';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    VoclistPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: VoclistPage
      }
    ])
  ]
})
export class VoclistPageModule {}
