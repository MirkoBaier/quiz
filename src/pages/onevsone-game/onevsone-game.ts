import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, ToastController} from 'ionic-angular';
import {NameService} from "../../services/name";
import {NgForm} from "@angular/forms";
import {OneVoneService} from "../../services/oneVone";
import {Game} from "../../models/game";



@IonicPage()
@Component({
  selector: 'page-onevsone-game',
  templateUrl: 'onevsone-game.html',
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
              private nameService: NameService,
              private navCtrl: NavController,
              private toastCtrl: ToastController,
              private alertController: AlertController,
              private loadingCtrl: LoadingController) {
  }


  presentToast(helpMe: string) {
    const toast = this.toastCtrl.create({
      message: "Richtige Übersetzung: " + helpMe,
      duration: 3000
    });
    toast.present();
  }

  ngOnInit() {
    this.oneVsOneService.getLiveGame().then(res => {
      this.englishVoc = res[0].voc;
      this.germanVoc = res[0].trans;
      this.translation = res[0].trans[0];
      this.translate = res[0].voc[0];
    });
  }

  showResult(game: any[]) {
    let alert;
    if (game[0].pointsEnemy < game[0].pointsUser) {
      alert = this.alertController.create({
        title: 'Gewonnen!',
        subTitle: 'Du hast gegen ' + game[0].enemy + ' mit ' + game[0].pointsUser + ":" + game[0].pointsEnemy + ' gewonnen!',
        buttons: ['OK']
      });
    } else if (game[0].pointsEnemy == game[0].pointsUser) {
      alert = this.alertController.create({
        title: 'Unentschieden!',
        subTitle: 'Du hast gegen ' + game[0].enemy + ' mit ' + game[0].pointsUser + ":" + game[0].pointsEnemy + 'unentschieden gespielt!',
        buttons: ['OK']
      });
    } else {
      alert = this.alertController.create({
        title: 'Verloren!',
        subTitle: 'Du hast gegen ' + game[0].enemy + ' mit ' + game[0].pointsUser + ":" + game[0].pointsEnemy + ' verloren!',
        buttons: ['OK']
      });
    }
    alert.present();
  }


  async onLoadNext(form: NgForm) {

    if (form.value.inputTrans.toUpperCase() == this.translation.toUpperCase()) {
      this.isCorrect.push(true);
      this.points++;
    } else {
      this.isCorrect.push(false);
      this.presentToast(this.translation);
    }

    this.counter++;
    //Runde zu ende
    if (this.counter > 4) {
      this.navCtrl.setRoot('HomePage');
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      let liveGame = await this.oneVsOneService.getLiveGame();
      await this.oneVsOneService.updateGameAfterRound(liveGame[0].enemy, liveGame[0].matchId, this.points, this.isCorrect);
      let updatedGame = await this.oneVsOneService.getSomething(liveGame[0].enemy, liveGame[0].matchId);

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
        this.navCtrl.setRoot('HomePage');
        await this.oneVsOneService.addFinishedGameToHistory(game);
        this.oneVsOneService.deleteMatch(updatedGame[0].enemy, updatedGame[0].matchId);
      }
      loading.dismiss();
    }
     //neue Vokabeln
   this.translation = this.germanVoc[this.counter];
   this.translate = this.englishVoc[this.counter];
   form.reset();
  }



}



