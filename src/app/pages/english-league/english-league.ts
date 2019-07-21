import { Component } from '@angular/core';
import {NameService} from "../../services/name";
import {AuthService} from "../../services/auth";
import {PointsService} from "../../services/points";
import { Router } from '@angular/router';



@Component({
  selector: 'page-english-league',
  templateUrl: 'english-league.html',
  styleUrls: ['english-league.scss']
})
export class EnglishLeaguePage {
  englishLeagues: string = "bronze";
  userName: String = "unbekannt";
  points: number;
  arrayPoints: any[] = [];


  constructor(private nameService: NameService,
              private router: Router,
              private pointsService: PointsService) {
  }

  onLoadgame(){
    this.router.navigateByUrl('leagueGame');
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
