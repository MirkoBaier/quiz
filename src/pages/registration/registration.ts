import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, MenuController, NavController} from 'ionic-angular';
import {AuthService} from "../../services/auth";
import {NgForm} from "@angular/forms";
import {UsernamePage} from "../username/username";
import {LoginPage} from "../login/login";



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
    // this.navCtrl.setRoot(LoginPage);
    const loading = this.loadingCtrl.create({
      content: 'Signin you up...'
    });
    loading.present();
    this.authService.signup(form.value.email, form.value.password, form.value.name)
      .then(data => {
        loading.dismiss();
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Sign up failed',
          message: error.message,
          buttons: ['OK']
        });
        alert.present();
      });
  }


}
