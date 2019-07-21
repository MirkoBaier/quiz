import { Component, ViewChild, ElementRef } from '@angular/core';
import {AlertController, LoadingController, MenuController } from '@ionic/angular';
import {AuthService} from "../../services/auth";
import {NgForm} from "@angular/forms";
import { Router } from '@angular/router';
import { FcmProvider } from '../../services/fcm';

@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
  styleUrls: ['registration.scss'],
})
export class RegistrationPage {

  @ViewChild('backgroundImg', {read: ElementRef}) backgroundImg;
  constructor(private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private menuCtrl: MenuController,
              private router: Router,
              private fcm: FcmProvider,
              ) {
  }

  ngOnInit(){
  }

  async onSignup(form: NgForm) {
    this.menuCtrl.close();
    let helpMe: boolean = false;
    const loading = await this.loadingCtrl.create({
      message: 'Signin you up...'
    });
    loading.present();
    this.authService.signup(form.value.email, form.value.password, form.value.name)
      .then(data => {
        this.authService.newReg = true;
        this.fcm.getToken();
        loading.dismiss();
      })
      .catch(async error => {
        loading.dismiss();
        console.log(error);
        const alert = await this.alertCtrl.create({
          header: 'Sign up failed',
          message: error.message,
          buttons: ['OK']
        });
        alert.present();
      });

  }

  // loginWithGoogle(){
  //   this.authService.googleLogin();
  // }

  onLoad() {
    this.router.navigateByUrl('login');
  }

  OfflineModus(){
    this.router.navigateByUrl('offline');
  }


}
