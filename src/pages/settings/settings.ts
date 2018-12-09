import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import {NgForm} from "@angular/forms";




@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(private navCtrl: NavController,
              ) {
  }

  onSubmit(form: NgForm){
    this.navCtrl.setRoot('HomePage');
    form.reset();
  }






}
