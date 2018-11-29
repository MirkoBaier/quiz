import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {AuthService} from "../../services/auth";
import {HomePage} from "../home/home";
import {NgForm} from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-username',
  templateUrl: 'username.html',
})
export class UsernamePage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private authService: AuthService,
              private toastCtrl: ToastController) {
  }

  onStoreUsername(form: NgForm){
    // this.authService.addUser(form.value.username);
      this.authService.getActiveUser().getIdToken()
      .then((token: string) => {
        // this.authService.getUsername();
      });
      this.navCtrl.setRoot(HomePage);
    //     .then( res => {
    //       let toast = this.toastCtrl.create({
    //         message: 'User was created successfully',
    //         duration: 3000
    //       });
    //       toast.present();
    //     }, err => {
    //       console.log(err)
    //     })
    }
}
