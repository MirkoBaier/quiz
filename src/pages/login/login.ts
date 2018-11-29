import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AuthService} from "../../services/auth";
import {NgForm} from "@angular/forms";
import {RegistrationPage} from "../registration/registration";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  registrationPage = RegistrationPage;

  constructor(private navCtrl: NavController,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {
  }

  onSignin(form: NgForm){
    const loading = this.loadingCtrl.create({
      content: 'Anmeldung erfolgt...'
    });
    loading.present();
    this.authService.signin(form.value.email, form.value.password)
      .then(data => {
      loading.dismiss();
  })
      .catch( error => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Login fehlgeschlagen',
          message: error.message,
          buttons: ['OK']
        });
        alert.present();
      });
  }

  onLoad(page: any) {
    this.navCtrl.push(page);
  }

}
