import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {csvjson} from "../../models/csvjson";
import {NgForm} from "@angular/forms";
import {Points} from "../../models/points";
import {NameService} from "../../services/name";


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
  counter = 3;
  germanVoc: string = "Allgemein";
  englishVoc: string= "General";
  rlyvoc: csvjson = new csvjson();
  pointsObj: Points;

  constructor(public nameService: NameService, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {}

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
    let rand = Math.floor(Math.random()*300)+1;
    return rand;
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
      this.nameService.getPoints().then(point=> {
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
        this.nameService.addPoints(helpPoints, helpLeague);
      });
      this.navCtrl.setRoot(HomePage);
    }
  }

}
