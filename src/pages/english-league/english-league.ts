import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {NameService} from "../../services/name";
import {AuthService} from "../../services/auth";
import {PointsService} from "../../services/points";


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


  constructor(private authService: AuthService, private nameService: NameService,private navCtrl: NavController, private pointsService: PointsService) {
  }

  onLoadgame(){
    this.navCtrl.setRoot('LeagueGamePage');
  }

  ngOnInit(){
    this.nameService.getUsername().then(username => {
      this.userName = username;
    });
    this.pointsService.getPoints().then(points=> {
      this.points=points;
    });
    this.pointsService.getlistPoints("EnglishLeague").then(points => {
      this.arrayPoints = points;
    });
    this.arrayPoints.sort(function(a, b){return a - b})
  }


}
