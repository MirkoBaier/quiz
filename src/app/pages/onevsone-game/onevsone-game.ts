import { Component } from '@angular/core';
import {AlertController, LoadingController} from '@ionic/angular';
import {NgForm} from "@angular/forms";
import {OneVoneService} from "../../services/oneVone";
import {Game} from "../../models/game";
import { Router } from '@angular/router';
import { OwnVocOnlineService } from '../../services/ownVocOnlineService';
import { IModus } from '../../models/IModus';

@Component({
  selector: 'page-onevsone-game',
  templateUrl: 'onevsone-game.html',
  styleUrls: ['onevsone-game.scss']
})
export class OnevsoneGamePage {
  translate: string = "";
  translation: string = "";
  points = 0;
  counter = 0;
  germanVoc: string[];
  englishVoc: string[];
  isCorrect: boolean[] = [];
  ress: any[] = [];


  constructor(private oneVsOneService: OneVoneService,
              private router: Router,
              private alertController: AlertController,
              private loadingCtrl: LoadingController,
              private ownVocOnlineService: OwnVocOnlineService
              ) {
  }

  async presentAlert(helpMe: string, form: string) {
    const alert = await this.alertController.create({
      header: 'Falsche Übersetzung',
      subHeader: 'Deine Überstzung: ' + form + ' |Richtig wäre: ' + this.translate + ' --> ' + helpMe,
      buttons: [{text: 'Verstanden', cssClass: 'alert-color-button'}],
      cssClass: 'alert-head',
    });
    alert.present();
  }

  ngOnInit() {
    if(this.oneVsOneService.modus === IModus.legacyNormalModus){
    this.oneVsOneService.getLiveGame().then(res => {
     this.setVoc(res);
    });
  } else{
    this.ownVocOnlineService.getLiveGame().then(res => {
      this.setVoc(res);
    })
  }
  }

  private setVoc(res: any) {
    this.englishVoc = res[0].voc;
    this.germanVoc = res[0].trans;
    this.translation = res[0].trans[0];
    this.translate = res[0].voc[0];
  }

  async showResult(game: any[]) {
    let alert;
    if (game[0].pointsEnemy < game[0].pointsUser) {
      alert = this.alertController.create({
        header: 'Gewonnen!',
        subHeader: 'Du hast gegen ' + game[0].enemy + ' mit ' + game[0].pointsUser + ":" + game[0].pointsEnemy + ' gewonnen!',
        buttons: ['OK']
      });
    } else if (game[0].pointsEnemy == game[0].pointsUser) {
      alert = this.alertController.create({
        header: 'Unentschieden!',
        subHeader: 'Du hast gegen ' + game[0].enemy + ' mit ' + game[0].pointsUser + ":" + game[0].pointsEnemy + 'unentschieden gespielt!',
        buttons: ['OK']
      });
    } else {
      alert = this.alertController.create({
        header: 'Verloren!',
        subHeader: 'Du hast gegen ' + game[0].enemy + ' mit ' + game[0].pointsUser + ":" + game[0].pointsEnemy + ' verloren!',
        buttons: ['OK']
      });
    }
    alert.present();
  }


  async onLoadNext(form: NgForm) {

    if (form.value.inputTrans.toUpperCase() == this.translation.toUpperCase() || form.value.inputTrans.toUpperCase() == this.translation.toUpperCase()+" " ) {
      this.isCorrect.push(true);
      this.points++;
    } else {
      this.isCorrect.push(false);
      this.presentAlert(this.translation, form.value.inputTrans);
    }

    this.counter++;
    //Runde zu ende
    if (this.counter > 4) {
      this.router.navigateByUrl('home')
      let loading = await this.loadingCtrl.create({
        message: 'Please wait...'
      });
      loading.present();
      let updatedGame;
      let liveGame;
      if(this.oneVsOneService.modus === IModus.legacyNormalModus){
       liveGame = await this.oneVsOneService.getLiveGame();
       await this.oneVsOneService.updateGameAfterRound(liveGame[0].enemy, liveGame[0].matchId, this.points, this.isCorrect);
        updatedGame = await this.oneVsOneService.getSomething(liveGame[0].enemy, liveGame[0].matchId);
      } else {
        liveGame = await this.ownVocOnlineService.getLiveGame();
        await this.ownVocOnlineService.updateGameAfterRound(liveGame[0].enemy, liveGame[0].matchId, this.points, this.isCorrect);
        updatedGame = await this.ownVocOnlineService.getGameData(liveGame[0].matchId);
      }

      //Spiel zu ende
      if (updatedGame[0].round == 10) {
        this.showResult(updatedGame);
        let game = new Game();
        game.round = updatedGame[0].round;
        game.startedFrom = updatedGame[0].startedFrom;
        game.pointsUser = updatedGame[0].pointsUser;
        game.pointsEnemy = updatedGame[0].pointsEnemy;
        game.user = updatedGame[0].user;
        game.enemy = updatedGame[0].enemy;
        game.matchId = updatedGame[0].matchId;
        game.result = updatedGame[0].result;
        game.vocName = updatedGame[0].vocName;
        this.router.navigateByUrl('home')
        if(this.oneVsOneService.modus === IModus.legacyNormalModus) {
        await this.oneVsOneService.addFinishedGameToHistory(game);
        this.oneVsOneService.deleteMatch(updatedGame[0].enemy, updatedGame[0].matchId);
      } else{
        await this.ownVocOnlineService.addFinishedGameToHistory(game);
        this.ownVocOnlineService.deleteMatch(updatedGame[0].enemy, updatedGame[0].matchId);
      }
    }
      loading.dismiss();
    }
     //neue Vokabeln
   this.translation = this.germanVoc[this.counter];
   this.translate = this.englishVoc[this.counter];
   form.reset();
  }

}
