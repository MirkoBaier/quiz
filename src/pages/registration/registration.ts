import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, MenuController, NavController} from 'ionic-angular';
import {AuthService} from "../../services/auth";
import {NgForm} from "@angular/forms";




@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {

  constructor(private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private navCtrl: NavController,
              private menuCtrl: MenuController) {
  }

  onSignup(form: NgForm) {
    this.menuCtrl.close();
    let helpMe: boolean = false;
    const loading = this.loadingCtrl.create({
      content: 'Signin you up...'
    });
    loading.present();
    this.authService.signup(form.value.email, form.value.password, form.value.name)
      .then(data => {
        console.log(data);
        loading.dismiss();
      })
      .catch(error => {
        loading.dismiss();
        console.log(error);
        const alert = this.alertCtrl.create({
          title: 'Sign up failed',
          message: error.message,
          buttons: ['OK']
        });
        alert.present();
      });

  }



}
