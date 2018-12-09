import {Component, ViewChild } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {AuthService} from "../../services/auth";
import {NameService} from "../../services/name";
import {OneVoneService} from "../../services/oneVone";
import {Game} from "../../models/game";
import {Observable, Subject} from "rxjs";
import { IonicPage } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
//ionic cordova build browser --release --aot --optimizejs --minifyjs --minifycss
export class HomePage{
  @ViewChild('nav') nav: NavController;
  userName: any;
  uid: string;
  openGames: Observable<Game[]>;
  finishedGames: Observable<Game[]>;
  private ngUnsubscribe: Subject<void> = new Subject();


  constructor(private navCtrl: NavController,
              private authService: AuthService,
              private nameService: NameService,
              private alertCtrl: AlertController,
              private oneVoneService: OneVoneService,
              ) {


      }

  async ngOnInit(): Promise<any> {
      if (this.userName == undefined) {
        await this.nameService.getUsername().then(name => {
          this.userName = name;
        });
      }

      this.openGames = this.oneVoneService.getStartedGamesList().valueChanges().takeUntil(this.ngUnsubscribe);
      this.finishedGames = this.oneVoneService.getFinishedGamesList().valueChanges().takeUntil(this.ngUnsubscribe);

      this.oneVoneService.getNewGames().valueChanges().takeUntil(this.ngUnsubscribe).subscribe(res => {
        if (this.authService.getActiveUser() != null) {
          if (res.length > 0) {
            if (res.length != 0) {
                this.showAlert(res[0]);
            }
          }
        }
      })
  }



  async ionViewWillEnter(){
    await this.oneVoneService.showGameStats().then( res => {
      if(res.length!=0) {
        for(let i= (res.length-1); i>=0 ; i--) {
          this.showResult(res[i]);
        }
      }
    });

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

   showAlert(res: any) {
    //Ruft neue Spiele auf
    if(res.started==false) {
      const confirm = this.alertCtrl.create({
        title: 'Spielanfrage',
        message: 'Nimmst du das Spiel gegen ' + res.enemy + ' an ?',
        buttons: [
          {
            text: 'Ablehnen',
            handler: () => {
              this.oneVoneService.deleteMatch(res.enemy, res.matchId);
            }
          },
          {
            text: 'Annehmen',
            handler: () => {
              this.oneVoneService.updateGame(res.enemy);
            }
          }
        ]
      });
      confirm.present();
    }
  }


  onLoadSettings() {
    this.navCtrl.push('SettingsPage');
  }

  onLoadLeague() {
    this.navCtrl.push('LeaguePage');
  }

  onLoadOnevsOne(){
    this.navCtrl.push('OnevsoneChoicePage');
  }

  async onLoadOnevsOneGame(enemy: string){
    this.oneVoneService.enemyNow = enemy;
    this.navCtrl.push('BeforeOnevsoneGamePage');
  }

  showResult(game: any) {
    let alert;
    if (game.pointsEnemy < game.pointsUser) {
      alert = this.alertCtrl.create({
        title: 'Gewonnen!',
        subTitle: 'Du hast gegen ' + game.enemy + ' mit ' + game.pointsUser + ":" + game.pointsEnemy + ' gewonnen!',
        buttons: ['OK']
      });
    } else if (game.pointsEnemy == game.pointsUser) {
      alert = this.alertCtrl.create({
        title: 'Unentschieden!',
        subTitle: 'Du hast gegen ' + game.enemy + ' mit ' + game.pointsUser + ":" + game.pointsEnemy + 'unentschieden gespielt!',
        buttons: ['OK']
      });
    } else {
      alert = this.alertCtrl.create({
        title: 'Verloren!',
        subTitle: 'Du hast gegen ' + game.enemy + ' mit ' + game.pointsUser + ":" + game.pointsEnemy + ' verloren!',
        buttons: ['OK']
      });
    }
    alert.present();
  }

}
