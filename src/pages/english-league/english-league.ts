import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LeagueGamePage} from "../league-game/league-game";
import {NameService} from "../../services/name";
import {AuthService} from "../../services/auth";

/**
 * Generated class for the EnglishLeaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-english-league',
  templateUrl: 'english-league.html',
})
export class EnglishLeaguePage {
  englishLeagues: string = "englishLeagues";
  userName: String = "unbekannt";
  points: number;
  arrayPoints: any[] = [];


  constructor(public authService: AuthService, public nameService: NameService,public navCtrl: NavController, public navParams: NavParams) {
  }

  onLoadgame(){
    this.navCtrl.setRoot(LeagueGamePage);
  }

  ngOnInit(){
    this.nameService.getUsername().then(username => {
      this.userName = username;
    });
    this.nameService.getPoints().then(points=> {
      this.points=points;
    });
    this.nameService.getlistPoints("EnglishLeague").then(points => {
      this.arrayPoints = points;
      console.log(this.arrayPoints)
    });
    this.arrayPoints.sort(function(a, b){return a - b})
  }


}
