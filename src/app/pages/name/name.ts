import {Component, ViewChild} from '@angular/core';
import {AlertController, NavController} from '@ionic/angular';
import {AuthService} from "../../services/auth";

@Component({
  selector: 'page-name',
  templateUrl: 'name.html',
  styleUrls: ['name.scss']
})
export class NamePage {
 public name;

  constructor(private navCtrl: NavController, private authServce: AuthService, private alertCtrl: AlertController) {
  }



  setName(name: string){
    this.authServce.checkUsername(name).then(res => {
      if(res==false) {
        this.authServce.setUsername(name);
        this.navCtrl.navigateRoot('/HomePage');
      }else{
        this.showPrompt();
      }
    })
  }

  async showPrompt() {
    const prompt = await this.alertCtrl.create({
      header: 'Fehlgeschlagen',
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
