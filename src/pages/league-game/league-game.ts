import { Component } from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
import {csvjson} from "../../models/csvjson";
import {NgForm} from "@angular/forms";
import {NameService} from "../../services/name";
import {PointsService} from "../../services/points";


@IonicPage()
@Component({
  selector: 'page-league-game',
  templateUrl: 'league-game.html',
})
export class LeagueGamePage {
  myRand: number;
  translate: string = "";
  translation: string = "";
  points = 0;
  counter = 9;
  germanVoc: string = "Allgemein";
  englishVoc: string= "General";
  rlyvoc: csvjson;


  constructor(
    private nameService: NameService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private pointsService: PointsService) {
      this.rlyvoc = new csvjson();
  }

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
    this.myRand = this.random();
    this.setEngVoc(this.englishVoc, this.myRand);
    this.setGerVoc(this.germanVoc, this.myRand);
  }


  random(): number {
    return Math.floor(Math.random()*300)+1;
  }

  onLoadNext(form: NgForm) {
    if (form.value.inputTrans.toUpperCase() == this.translation.toUpperCase()) {
      this.points++;
    } else {
      this.points--;
      this.presentToast(this.translation)
    }

    this.myRand = this.random();
    this.setEngVoc(this.englishVoc, this.myRand);
    this.setGerVoc(this.germanVoc, this.myRand);
    this.counter--;
    form.reset();

    //Runde zu ende
    if(this.counter<0){
      this.pointsService.getPoints().then(point=> {
        let helpPoints = this.points+point;
        let helpLeague:string = "";
        if(helpPoints<0){
          helpPoints = 0;
        }
        if(helpPoints<100){
          helpLeague = "bronze";
        }else if(helpPoints<200){
          helpLeague = "silver";

        }else {
          helpLeague = "gold";
        }
        this.pointsService.addPoints(helpPoints, helpLeague);
      });
      this.navCtrl.setRoot('HomePage');
    }
  }

}
