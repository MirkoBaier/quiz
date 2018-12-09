import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import {OneVoneService} from "../../services/oneVone";
import {NameService} from "../../services/name";


@IonicPage()
@Component({
  selector: 'page-before-onevsone-game',
  templateUrl: 'before-onevsone-game.html',
})
export class BeforeOnevsoneGamePage {
  userName: string;
  enemyName: string;
  userPoints: number;
  enemyPoints: number;
  fieldCorrect: boolean[] = [];
  fieldNotPlayed: boolean[] = [];

  constructor(private navCtrl: NavController, private oneVoneService: OneVoneService, private nameService: NameService) {
    for(let i = 51; i>0 ; i--) {
      this.fieldNotPlayed.push(true);
      this.fieldCorrect.push(true);
    }
  }

  ngOnInit(){
    this.oneVoneService.getMatchIdByUsername(this.oneVoneService.enemyNow).then(res => {
      this.oneVoneService.getSomething(this.nameService.userId, res).then(ress => {
        //Für die richtige Seite
        if(ress[0].startedFrom == ress[0].user){
          this.userName = ress[0].enemy;
          this.enemyName = ress[0].user;
          this.userPoints = ress[0].pointsEnemy;
          this.enemyPoints = ress[0].pointsUser;
        }else{
          this.enemyName = ress[0].enemy;
          this.userName =  ress[0].user;
          this.userPoints = ress[0].pointsUser;
          this.enemyPoints = ress[0].pointsEnemy;
        }
        for(let i = 0; i<(ress[0].isCorrect.length);i++) {
          this.fieldNotPlayed[i] = false;
          this.fieldCorrect[i] = ress[0].isCorrect[i];
        }

      })
    });
  }

  async loadGame(){
    await this.oneVoneService.updateGameFromOnePlaying(this.oneVoneService.enemyNow);
    this.navCtrl.setRoot('OnevsoneGamePage');
  }

}
