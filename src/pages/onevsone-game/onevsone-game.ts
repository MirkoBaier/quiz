import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {csvjson} from "../../models/csvjson";
import {Points} from "../../models/points";
import {NameService} from "../../services/name";
import {LeaguePointsService} from "../../services/leaguePoints";
import {NgForm} from "@angular/forms";
import {HomePage} from "../home/home";
import {OneVoneService} from "../../services/oneVone";

/**
 * Generated class for the OnevsoneGamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-onevsone-game',
  templateUrl: 'onevsone-game.html',
})
export class OnevsoneGamePage {
  myRand: number;
  translate: string = "";
  translation: string = "";
  points = 0;
  counter = 9;
  germanVoc: string = "Allgemein";
  englishVoc: string= "General";
  rlyvoc: csvjson = new csvjson();
  pointsObj: Points;

  constructor(public oneVsOneService: OneVoneService, public nameService: NameService, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController,public leaguepointsService: LeaguePointsService) {}

  setEngVoc(helpMe: string, randNum: number){
    for(helpMe in this.rlyvoc) {
      if(this.rlyvoc.hasOwnProperty(helpMe)) {
        var value = this.rlyvoc[helpMe];
        this.translate = value[randNum].General;
      }
    }
  }

  setGerVoc(helpMe: string, randNum: number){
    for(helpMe in this.rlyvoc) {
      if(this.rlyvoc.hasOwnProperty(helpMe)) {
        var value = this.rlyvoc[helpMe];
        this.translation = value[randNum].Allgemein;
      }
    }
  }

  presentToast(helpMe: string){
    const toast = this.toastCtrl.create({
      message: "Richtige Übersetzung: " + helpMe,
      duration: 3000
    });
    toast.present();
  }

  ngOnInit(){
    console.log("hi");
    this.oneVsOneService.getLiveGame().then(res => {
      res
    });
    this.myRand = this.random();
    this.setEngVoc(this.englishVoc, this.myRand);
    this.setGerVoc(this.germanVoc, this.myRand);
  }


  random(): number {
    let rand = Math.floor(Math.random()*300)+1;
    return rand;
  }

 async onLoadNext(form: NgForm) {
    if (form.value.inputTrans.toUpperCase() == this.translation.toUpperCase()) {
      this.points++;
    } else {
      this.points--;
      this.presentToast(this.translation)
    }

   //Runde zu ende
   if(this.counter<0){
     this.navCtrl.setRoot(HomePage);
     await this.oneVsOneService.getLiveGame().then(res => this.oneVsOneService.updateGameAfterRound(res[0].enemy,res[0].matchId, this.points));
   }

    this.myRand = this.random();
    this.setEngVoc(this.englishVoc, this.myRand);
    this.setGerVoc(this.germanVoc, this.myRand);
    this.counter--;
    form.reset();

  }

}



