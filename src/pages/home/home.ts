import {Component, ViewChild} from '@angular/core';
import {AlertController, ModalController, NavController} from 'ionic-angular';
import {SettingsPage} from "../settings/settings";
import {LeaguePage} from "../league/league";
import {AuthService} from "../../services/auth";
import {NameService} from "../../services/name";
import {OnevsonePage} from "../onevsone/onevsone";
import {OneVoneService} from "../../services/oneVone";
import {Game} from "../../models/game";
import {Observable} from "rxjs";
import {OnevsoneGamePage} from "../onevsone-game/onevsone-game";


import { IonicPage } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('nav') nav: NavController;
  userName: any;
  uid: string;
  newGame: any[];
  openGames: Observable<Game[]>;
  constructor(private navCtrl: NavController,
              private authService: AuthService,
              private nameService: NameService,
              private alertCtrl: AlertController,
              private oneVoneService: OneVoneService
              ) {

  }

  ngOnInit() {
    // this.oneVoneService.getNewGames().then(res => {
    //   setTimeout(()=> {
    //     this.showAlert(res)
    //   }, 700);
    // });
    // this.nameService.getUsername().then(name=> {
    //   this.userName = name;
    // });
    this.openGames = this.oneVoneService.getStartedGamesList().valueChanges();
  }



  ionViewWillEnter(){
    // if(this.newGame!=undefined) {
    //   this.oneVoneService.getNewGames().then(res => {
    //     setTimeout(()=> {
    //       this.showAlert(res)
    //     }, 700);
    //   });
    // }
  }



   showAlert(res: any) {
    let start: any = true;
    let helpEnemy: string = "";
    this.newGame = res;
    this.newGame.filter((item) => {helpEnemy = item.enemy});
    this.newGame.filter((item) => {start = item.started});
    //Ruft neue Spiele auf
    if(!start) {
      const confirm = this.alertCtrl.create({
        title: 'Spielanfrage',
        message: 'Nimmst du das Spiel gegen ' + helpEnemy + ' an ?',
        buttons: [
          {
            text: 'Ablehnen',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Annehmen',
            handler: () => {
              console.log('Agree clicked');
              console.log(helpEnemy);
              this.oneVoneService.updateGame(helpEnemy);
            }
          }
        ]
      });
      confirm.present();
    }
  }


  onLoadSettings() {
    this.navCtrl.push(SettingsPage);
  }

  onLoadLeague() {
    this.navCtrl.push(LeaguePage);
  }

  onLoadOnevsOne(){
    this.navCtrl.push(OnevsonePage);
  }

  async onLoadOnevsOneGame(enemy: string){
    await this.oneVoneService.updateGameFromOnePlaying(enemy);
    this.navCtrl.setRoot(OnevsoneGamePage);
  }

}
