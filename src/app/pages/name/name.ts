import {Component} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {AuthService} from '../../services/auth';
import {Router} from '@angular/router';
import {NameService} from '../../services/name';

@Component({
  selector: 'page-name',
  templateUrl: 'name.html',
  styleUrls: ['name.scss']
})
export class NamePage {
  public name;

  constructor(private router: Router,
              private nameService: NameService,
              private alertCtrl: AlertController,
              private authService: AuthService) {
  }


  setName(name: string) {
    this.authService.checkUsername(name).then(res => {
      if (res === false) {
        this.nameService.setUsername(name);
        this.router.navigateByUrl('online');
      } else {
        this.showPrompt();
      }
    });
  }

  async showPrompt() {
    const prompt = await this.alertCtrl.create({
      header: 'Fehlgeschlagen',
      message: 'Benutzername ist bereits vergeben',
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
