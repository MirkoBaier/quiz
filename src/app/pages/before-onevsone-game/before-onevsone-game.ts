import { Component } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { OneVoneService } from "../../services/oneVone";
import { NameService } from "../../services/name";
import { TrainingsService } from "../../services/training";
import { Router } from '@angular/router';
import { OwnVocOnlineService } from '../../services/ownVocOnlineService';
import { IModus } from '../../models/IModus';



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
              private nameService: NameService,
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
      this.oneVoneService.getMatchIdByUsername(this.oneVoneService.enemyNow).then(res => {
        this.oneVoneService.getSomething(this.nameService.userId, res).then(ress => {
          this.setViewData(ress);       
          loading.dismiss();
        })
      });
    }else if(this.oneVoneService.modus === IModus.legacyTrainingsModus) {
      this.trainingsService.getMatchIdByUsername(this.trainingsService.enemyNow).then(res => {
        this.trainingsService.getSomething(this.nameService.userId, res).then(ress => {
          this.setViewData(ress);
          loading.dismiss();
        })
      });
    } else {
      this.ownVocOnlineService.getMatchIdByUsername(this.ownVocOnlineService.enemyNow).then(res => {
        this.ownVocOnlineService.getGameData(res).then(ress => {
          this.setViewData(ress);
          loading.dismiss();
        })
      });
    }
  }

  setViewData(ress: any[]) {
    this.theUserturn = ress[0].userTurn;
    this.enemyUsername = ress[0].enemy;
    this.matchID = ress[0].matchId;
    //Für die richtige Seite
    if (ress[0].startedFrom == ress[0].user) {
      this.userName = ress[0].enemy;
      this.enemyName = ress[0].user;
      this.userPoints = ress[0].pointsEnemy;
      this.enemyPoints = ress[0].pointsUser;
    } else {
      this.enemyName = ress[0].enemy;
      this.userName = ress[0].user;
      this.userPoints = ress[0].pointsUser;
      this.enemyPoints = ress[0].pointsEnemy;
    }
    for (let i = 0; i < (ress[0].isCorrect.length); i++) {
      this.fieldNotPlayed[i] = false;
      this.fieldCorrect[i] = ress[0].isCorrect[i];
    }
  }


  async loadGame() {
    if (this.oneVoneService.modus === IModus.legacyNormalModus) {
      await this.oneVoneService.updateGameFromOnePlaying(this.oneVoneService.enemyNow);
      this.router.navigateByUrl('oneVsOneGame');
    }else if(this.oneVoneService.modus === IModus.legacyTrainingsModus){
      await this.trainingsService.updateGameFromOnePlaying(this.trainingsService.enemyNow);
      this.router.navigateByUrl('trainingsGame');
    } else{
      await this.ownVocOnlineService.updateGameFromOnePlaying(this.ownVocOnlineService.enemyNow);
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
              this.oneVoneService.deleteMatch(this.enemyUsername, this.matchID).then(() => this.router.navigateByUrl('home'));
            }else if(this.oneVoneService.modus === IModus.legacyTrainingsModus){
              this.trainingsService.deleteMatch(this.enemyUsername, this.matchID).then(() => this.router.navigateByUrl('home'));
            } else {
              this.ownVocOnlineService.deleteMatch(this.enemyUsername, this.matchID).then(() => this.router.navigateByUrl('home'));
            }
          }
        }
      ],
      cssClass: `alert-head`
    });
    await confirm.present();
  }


}
