import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {AuthService} from "../../services/auth";
import {NgForm} from "@angular/forms";
import {RegistrationPage} from "../registration/registration";
import { Router } from '@angular/router';
import { FcmProvider } from '../../services/fcm';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['login.scss']
})
export class LoginPage {
  registrationPage = RegistrationPage;

  constructor(private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private router: Router,
              private fcm: FcmProvider) {
  }

  async onSignin(form: NgForm){
    const loading = await this.loadingCtrl.create({
      message: 'Anmeldung erfolgt...'
    });
    loading.present();
   await this.authService.signin(form.value.email, form.value.password)
      .then(data => {
        this.fcm.getToken();
      loading.dismiss();
  })
      .catch( async error => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Login fehlgeschlagen',
          message: error.message,
          buttons: ['OK']
        });
         alert.present();
      });
  }

  onLoad(page: any) {
    this.router.navigateByUrl('registration')
  }

}
