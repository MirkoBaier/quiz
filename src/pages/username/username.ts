import { Component } from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {NgForm} from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-username',
  templateUrl: 'username.html',
})
export class UsernamePage {

  constructor(
    private navCtrl: NavController) {
  }

  onStoreUsername(form: NgForm){

      this.navCtrl.setRoot('HomePage');

    }
}
