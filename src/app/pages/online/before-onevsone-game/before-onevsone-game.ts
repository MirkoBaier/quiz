import { Component } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { OneVoneService } from "../../../services/oneVone";
import { TrainingsService } from "../../../services/training";
import { Router } from '@angular/router';
import { OwnVocOnlineService } from '../../../services/ownVocOnlineService';
import { IModus } from '../../../models/IModus';

@Component({
  selector: 'page-before-onevsone-game',
  templateUrl: 'before-onevsone-game.html',
  styleUrls: ['before-onevsone-game.scss']
})
export class BeforeOnevsoneGamePage {
  userName: string;
  enemyName: string;
  userPoints: number;
  enemyPoints: number;
  fieldCorrect: boolean[] = [];
  fieldNotPlayed: boolean[] = [];
  theUserturn: boolean = false;
  matchID: string;

  enemyUsername: string;

  constructor(private router: Router,
              private oneVoneService: OneVoneService,
              private trainingsService: TrainingsService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private ownVocOnlineService: OwnVocOnlineService) {
    for(let i = 51; i>0 ; i--) {
      this.fieldNotPlayed.push(true);
      this.fieldCorrect.push(true);
    }
  }

  async ionViewWillEnter(){
    let loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    loading.present();
    if(this.oneVoneService.modus === IModus.legacyNormalModus) {
        this.setViewData(this.oneVoneService.game);
        loading.dismiss();
    }else if(this.oneVoneService.modus === IModus.legacyTrainingsModus) {
          this.setViewData(this.trainingsService.game);
          loading.dismiss();
    } else {
          this.setViewData(this.ownVocOnlineService.game);
          loading.dismiss();
    }
  }

  setViewData(ress: any) {
    this.theUserturn = ress.userTurn;
    this.enemyUsername = ress.enemy;
    this.matchID = ress.matchId;
    //Für die richtige Seite
    if (ress.startedFrom == ress.user) {
      this.userName = ress.enemy;
      this.enemyName = ress.user;
      this.userPoints = ress.pointsEnemy;
      this.enemyPoints = ress.pointsUser;
    } else {
      this.enemyName = ress.enemy;
      this.userName = ress.user;
      this.userPoints = ress.pointsUser;
      this.enemyPoints = ress.pointsEnemy;
    }
    for (let i = 0; i < (ress.isCorrect.length); i++) {
      this.fieldNotPlayed[i] = false;
      this.fieldCorrect[i] = ress.isCorrect[i];
    }
  }


  async loadGame() {
    if (this.oneVoneService.modus === IModus.legacyNormalModus) {
      this.router.navigateByUrl('oneVsOneGame');
    }else if(this.oneVoneService.modus === IModus.legacyTrainingsModus){
      this.router.navigateByUrl('trainingsGame');
    } else{
      if(this.oneVoneService.modus === IModus.normalModus) {
        this.router.navigateByUrl('oneVsOneGame');
      } else {
        this.router.navigateByUrl('trainingsGame');
      }
    }
  }

  deleteGame(){
    this.showConfirm();
  }

  async showConfirm() {
    const confirm = await this.alertCtrl.create({
      header: 'Spiel löschen?',
      subHeader: 'Möchtest du wirklich das Spiel löschen?',
      buttons: [
        {
          text: 'Nein',
          handler: () => {

          }
        },
        {
          text: 'Ja',
          handler: () => {
            if(this.oneVoneService.modus === IModus.legacyNormalModus) {
              this.oneVoneService.deleteMatch(this.enemyUsername, this.matchID).then(() => this.router.navigateByUrl('online'));
            }else if(this.oneVoneService.modus === IModus.legacyTrainingsModus){
              this.trainingsService.deleteMatch(this.enemyUsername, this.matchID).then(() => this.router.navigateByUrl('online'));
            } else {
              this.ownVocOnlineService.deleteMatch(this.enemyUsername, this.matchID).then(() => this.router.navigateByUrl('online'));
            }
          }
        }
      ],
      cssClass: `alert-head`
    });
    await confirm.present();
  }


}
