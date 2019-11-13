import { Component } from '@angular/core';
import { VocubalarService } from '../../services/vocubalar';
import { Modus } from '../../services/modus';
import { Router } from '@angular/router';
import { OfflineService } from '../../services/offlineservice';
import { AlertController } from '@ionic/angular';
import { NameService } from '../../services/name';
import { IModus } from '../../models/IModus';

enum direction {
  tranToVoc = "tranToVoc",
  vocToTran = "vocToTran"
}

enum onlineOrOffline {
  offline = 'offline',
  online = 'online'
}

@Component({
  selector: 'game-decision',
  templateUrl: './game-decision.page.html',
  styleUrls: ['./game-decision.page.scss'],
})
export class GameDecisionPage {
  directionMode: direction = direction.vocToTran;
  onlineOrOffline: onlineOrOffline = onlineOrOffline.offline;
  
  constructor(private vocService: VocubalarService, 
              private router: Router, 
              private offlineService: OfflineService,
              private alertCtrl: AlertController,
              private nameService: NameService) { }

  startNormal() {
      this.setModus('normal')
  };

  startTraining() {
    if(this.offlineService.actualVoc.length >=4) {
    this.setModus('train')
    }else{
          this.showAlert(4);
    }
  };

  onlineOrOfflineChange(event) {
    this.onlineOrOffline = event.detail.value;
  }

  radioGroupChange(event) {
    this.directionMode = event.detail.value;
  }
  
  private setModus(theCase) {
    this.checkIfOnlineIsSelected(theCase);
    this.checkIfOfflineIsSelected(theCase);
  }

  private checkIfOfflineIsSelected(theCase) {
    if(this.onlineOrOffline === onlineOrOffline.offline) {
    if(this.directionMode === direction.tranToVoc && theCase == 'train') {
      this.vocService.actualModus = Modus.trainingTranToVoc;
      this.router.navigateByUrl('offlineTrainingsGame');
    } else if(this.directionMode === direction.vocToTran && theCase == 'train') {
      this.vocService.actualModus = Modus.trainingVocToTran;
      this.router.navigateByUrl('offlineTrainingsGame');
    } else if(this.directionMode === direction.vocToTran && theCase == 'normal') {
      this.vocService.actualModus = Modus.vocToTran;
      this.router.navigateByUrl('offlineGame');
    } else {
      this.vocService.actualModus = Modus.tranToVoc;
      this.router.navigateByUrl('offlineGame');
    }
  }
  }

  private checkIfOnlineIsSelected(theCase) {
    if(this.onlineOrOffline === onlineOrOffline.online) {
      if(this.nameService.userId === undefined) {
        this.showYouNeedLoggedInAlert();
      } else if(this.offlineService.actualVoc.length >= 10 && theCase === 'normal') {
        this.offlineService.setModus(IModus.normalModus);
        this.router.navigateByUrl('oneVsOne');
      } else if(this.offlineService.actualVoc.length >= 10 && theCase === 'train') {
        this.offlineService.setModus(IModus.trainingsModus);
        this.router.navigateByUrl('oneVsOne');
      } else {
        this.showAlert(10);
      }
    } 
  }
            
async showYouNeedLoggedInAlert() {
  const alert = await this.alertCtrl.create({
      header: 'Fehler!',
      subHeader: 'Du musst eingeloggt sein, um online zu spielen',
      buttons: ['OK'],
      cssClass: `alert-head`,
      });
      alert.present();
}

  
  async showAlert(num: number) {
    const alert = await this.alertCtrl.create({
      header: 'Fehler!',
      subHeader: 'Du benötigst mindestens ' + num + ' Vokabeln für den Modus',
      buttons: ['OK'],
      cssClass: `alert-head`,
    });
    alert.present();
  };

}
