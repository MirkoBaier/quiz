import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, ToastController} from '@ionic/angular';
import {TrainingsService} from "../../services/training";
import {TrainingsGame} from "../../models/trainingsGame";
import { Router } from '@angular/router';

@Component({
  selector: 'page-trainings-game',
  templateUrl: 'trainings-game.html',
  styleUrls: ['trainings-game.scss']
})
export class TrainingsGamePage {
  translate: string = "";
  translation: string = "";
  points = 0;
  counter = 0;
  yoloCounter = 0;
  germanVoc: string[];
  englishVoc: string[];
  yoloVoc: string[];
  isCorrect: boolean[] = [];
  ress: any[] = [];
  yoloItem: string[] = [];
  languagePic: string = "";

  constructor(private router: Router,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private trainingsService: TrainingsService,
              private alertCtrl: AlertController) {
  }

  async presentAlert(helpMe: string, form: string) {
    const alert = await this.alertCtrl.create({
      header: 'Falsche Übersetzung',
      subHeader: 'Deine Überstzung: ' + form + ' |Richtig wäre: ' + this.translate + ' --> ' + helpMe,
      buttons: [{text: 'Verstanden', cssClass: 'alert-color-button'}],
      cssClass: 'alert-head',
    });
    alert.present();
  }

  ngOnInit() {
    this.trainingsService.getLiveGame().then(res => {
      this.languagePic = res[0].vocName;
      this.englishVoc = res[0].voc;
      this.germanVoc = res[0].trans;
      this.yoloVoc = res[0].yolo;
      this.translation = res[0].trans[0];
      this.translate = res[0].voc[0];
      this.yoloItem.push(res[0].yolo[0]);
      this.yoloItem.push(res[0].yolo[1]);
      this.yoloItem.push(res[0].yolo[2]);
      this.yoloItem.push(res[0].trans[0]);
      this.shuffleArray(this.yoloItem);
    });
  }


  shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      this.yoloItem[i] = array[j];
      this.yoloItem[j] = temp;
    }
  }

  async onLoadNext(form: string) {
    if (form.toUpperCase() == this.translation.toUpperCase() || form.toUpperCase() == this.translation.toUpperCase()+" " ) {
      this.isCorrect.push(true);
      this.points++;
    } else {
      this.isCorrect.push(false);
      this.presentAlert(this.translation, form);
    }

    this.counter++;
    this.yoloCounter = this.yoloCounter+3;
    //Runde zu ende
    if (this.counter > 4) {
      this.router.navigateByUrl('home');
      let loading = await this.loadingCtrl.create({
        message: 'Please wait...'
      });
      loading.present();
      let liveGame = await this.trainingsService.getLiveGame();
      await this.trainingsService.updateGameAfterRound(liveGame[0].enemy, liveGame[0].matchId, this.points, this.isCorrect);
      let updatedGame = await this.trainingsService.getSomething(liveGame[0].enemy, liveGame[0].matchId);

      //Spiel zu ende
      if (updatedGame[0].round == 10) {
        let game = new TrainingsGame();
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
        await this.trainingsService.addFinishedGameToHistory(game);
        this.trainingsService.deleteMatch(updatedGame[0].enemy, updatedGame[0].matchId);
      }
      loading.dismiss();
    }
    //neue Vokabeln
    this.yoloItem = [];
    this.translation = this.germanVoc[this.counter];
    this.translate = this.englishVoc[this.counter];
    this.setYoloVoc();
  }

  setYoloVoc(){
    for(let i = 0; i<3; i++){
      this.yoloItem.push(this.yoloVoc[this.yoloCounter+i])
    }
    this.yoloItem.push(this.translation);
    this.shuffleArray(this.yoloItem);
  }
}
