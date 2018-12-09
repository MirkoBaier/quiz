import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';
import {AuthService} from "../../services/auth";


@IonicPage()
@Component({
  selector: 'page-name',
  templateUrl: 'name.html',
})
export class NamePage {

  constructor(private navCtrl: NavController, private authServce: AuthService, private alertCtrl: AlertController) {
  }

  setName(name: string){
    this.authServce.checkUsername(name).then(res => {
      if(res==false) {
        this.authServce.setUsername(name);
        this.navCtrl.setRoot('HomePage');
      }else{
        this.showPrompt();
      }
    })
  }

  showPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'Fehlgeschlagen',
      message: "Benutzername ist bereits vergeben",
      buttons: [
        {
          text: 'Ok',
          handler: data => {
          }
        }
      ]
    });
    prompt.present();
  }

}
