import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth";
import {HomePage} from "../home/home";


declare var cordova: any;
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private authService: AuthService) {
  }

  onSubmit(form: NgForm){
    this.navCtrl.setRoot(HomePage);

    form.reset();
  }



  ngOnInit(){

  }


}
