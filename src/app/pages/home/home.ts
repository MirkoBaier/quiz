import {Component, ViewChild} from '@angular/core';
import {AlertController, LoadingController, NavController } from '@ionic/angular';
import {AuthService} from "../../services/auth";
import {NameService} from "../../services/name";
import {OneVoneService} from "../../services/oneVone";
import {Game} from "../../models/game";
import {Observable, Subject} from "rxjs";
import {tap, takeUntil, map} from "rxjs/operators";
import {FcmProvider} from "../../services/fcm";
import {TrainingsGame} from "../../models/trainingsGame";
import {TrainingsService} from "../../services/training";
import {VocubalarService} from "../../services/vocubalar";
// import {NativePageTransitions, NativeTransitionOptions} from "@ionic-native/native-page-transitions";
import 'rxjs/add/operator/takeUntil';
import { Router } from '@angular/router';
import { OwnVocOnlineService } from '../../services/ownVocOnlineService';
import { NetworkService } from '../../services/networkservice';
import { IModus } from '../../models/IModus';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styleUrls: ['home.scss'],
})
//"cordova-plugin-firebase-lib": "^4.0.0", package json
 // "cordova-plugin-ionic-webview": {
      //   "ANDROID_SUPPORT_ANNOTATIONS_VERSION": "27.+"
      // },
//webGl
//ionic cordova build android --build --release --aot  --minifyjs --minifycss -- -- --versionCode=0.0.7
// android:windowSoftInputMode="adjustPan"
export class HomePage {
  @ViewChild('nav') nav: NavController;
  userName: any;
  uid: string;
  openTrainingsGames: Observable<TrainingsGame[]>;
  openTrainingsGamesNotTurn: Observable<TrainingsGame[]>;
  openGames: Observable<Game[]>;
  openGamesNotTurn: Observable<Game[]>;
  openOwnVocGames: Observable<Game[]>;
  openOwnVocGamesNotTurn: Observable<Game[]>;

  finishedOwnVocGames: Observable<Game[]>;
  finishedTrainingsGames: Observable<TrainingsGame[]>;
  finishedGames: Observable<Game[]>;
  private ngUnsubscribe: Subject<void> = new Subject();


  constructor(private router: Router,
              public authService: AuthService,
              private nameService: NameService,
              private alertCtrl: AlertController,
              private oneVoneService: OneVoneService,
              private fcm: FcmProvider,
              private trainingsService: TrainingsService,
              private vocubalarService: VocubalarService,
              private loadingCtrl: LoadingController,
              private ownVocOnlineService: OwnVocOnlineService,
              private networkService: NetworkService
  ) {


  }

  async ngOnInit(): Promise<any> {
    const loader = await this.loadingCtrl.create({
      message: "Please wait...",
    });
    loader.present();
    if (this.userName == undefined) {
      await this.nameService.getUsername().then(name => {
        this.userName = name;
      });
    }

    this.networkService.onlineScreen = true;
    this.oneVoneService.getNewGames().valueChanges().takeUntil(this.ngUnsubscribe).subscribe(res => {
      if (this.authService.getActiveUser() != null) {
        if (res.length > 0) {
          if (res.length != 0) {
            this.showAlert(res[0]);
          }
        }
      }
    });
    this.trainingsService.getNewGames().valueChanges().takeUntil(this.ngUnsubscribe).subscribe(res => {
      if (this.authService.getActiveUser() != null) {
        if (res.length > 0) {
          if (res.length != 0) {
            this.showAlertTraining(res[0]);
          }
        }
      }
    });

    this.ownVocOnlineService.getNewGames().valueChanges().takeUntil(this.ngUnsubscribe).subscribe(res => {
      if (this.authService.getActiveUser() != null) {
        if (res.length > 0) {
          if (res.length != 0) {
            this.showOwnVocAlert(res[0]);
          }
        }
      }
    });
    this.openOwnVocGames = this.ownVocOnlineService.getStartedGamesList().valueChanges().takeUntil(this.ngUnsubscribe);
    this.openOwnVocGamesNotTurn = this.ownVocOnlineService.getStartedGamesListNotTurn().valueChanges().takeUntil(this.ngUnsubscribe);
    this.openTrainingsGamesNotTurn = this.trainingsService.getStartedGamesListNotTurn().valueChanges().takeUntil(this.ngUnsubscribe);
    this.openGamesNotTurn = this.oneVoneService.getStartedGamesListNotTurn().valueChanges().takeUntil(this.ngUnsubscribe);
    this.finishedTrainingsGames = this.trainingsService.getFinishedGamesList().valueChanges().takeUntil(this.ngUnsubscribe);
    this.openTrainingsGames = this.trainingsService.getStartedGamesList().valueChanges().takeUntil(this.ngUnsubscribe);
    this.finishedGames = this.oneVoneService.getFinishedGamesList().valueChanges().takeUntil(this.ngUnsubscribe);
    this.openGames = this.oneVoneService.getStartedGamesList().valueChanges().takeUntil(this.ngUnsubscribe);
    this.authService.OfflineMenu = false;

    this.fcm.listenToNotifications().pipe(tap(async msg => {
     
      })
    )
    .takeUntil(this.ngUnsubscribe).subscribe();
    loader.dismiss();
  }


  async ngAfterViewInit() {
    console.log("after");
    this.authService.OfflineMenu=false;
    await this.oneVoneService.showGameStats().then(res => {
      if (res.length != 0) {
        for (let i = (res.length - 1); i >= 0; i--) {
          this.showResult(res[i]);
        }
      }
    });
    await this.trainingsService.showGameStats().then(res => {
      if (res.length != 0) {
        for (let i = (res.length - 1); i >= 0; i--) {
          this.showResult(res[i]);
        }
      }
    });
    await this.ownVocOnlineService.showGameStats().then(res => {
      if (res.length != 0) {
        for (let i = (res.length - 1); i >= 0; i--) {
          this.showResult(res[i]);
        }
      }
    });

  }

  checkAndSetSlideStorage() {
    if (this.vocubalarService.get('showSlide') == undefined) {
      this.vocubalarService.set('showSlide', false);
      //show slide logic should run
    } else {
      // this block is running that means your localStorageService has already been set to false i.e it is not the first time your app is running.
        console.log("kein Slide");
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async showAlert(res: any) {
    this.oneVoneService.game = res;
    let nothingPressed: boolean = true;
    //Ruft neue Spiele auf
    if (res.started == false) {
      const confirm = await this.alertCtrl.create({
        header: 'Spielanfrage',
        subHeader: 'Nimmst du das Spiel gegen ' + res.enemy + ' an ?',
        buttons: [
          {
            text: 'Ablehnen',
            handler: () => {
              nothingPressed = false;
              this.oneVoneService.deleteMatch(res.enemy, res.matchId);
            }
          },
          {
            text: 'Annehmen',
            handler: () => {
              nothingPressed = false;
              this.oneVoneService.updateGame(res.enemy);
            }
          }
        ],
        cssClass: `alert-head`
      });
      confirm.present();
      confirm.onDidDismiss().then( (detail) =>{
         if(nothingPressed == true){
           this.oneVoneService.deleteMatch(res.enemy, res.matchId);
         }
      } 
      )}
  }

  async showOwnVocAlert(res: any) {
    this.ownVocOnlineService.game = res;
    let nothingPressed: boolean = true;
    //Ruft neue Spiele auf
    if (res.started == false) {
      const confirm = await this.alertCtrl.create({
        header: 'Spielanfrage',
        subHeader: 'Nimmst du das Spiel gegen ' + res.enemy + ' an ?',
        buttons: [
          {
            text: 'Ablehnen',
            handler: () => {
              nothingPressed = false;
              this.ownVocOnlineService.deleteMatch(res.enemy, res.matchId);
            }
          },
          {
            text: 'Annehmen',
            handler: () => {
              nothingPressed = false;
              this.ownVocOnlineService.updateGame(res.enemy);
            }
          }
        ],
        cssClass: `alert-head`
      });
      confirm.present();
      confirm.onDidDismiss().then( (detail) =>{
         if(nothingPressed == true){
           this.ownVocOnlineService.deleteMatch(res.enemy, res.matchId);
         }
      } 
      )}
  }

  async showAlertTraining(res: any) {
    this.trainingsService.game = res;
    let nothingPressed: boolean = true;
    //Ruft neue Spiele auf
    if (res.started == false) {
      const confirm = await this.alertCtrl.create({
        header: 'Spielanfrage',
        subHeader: 'Nimmst du das TrainingsSpiel gegen ' + res.enemy + ' an ?',
        buttons: [
          {
            text: 'Ablehnen',
            handler: () => {
              nothingPressed = false;
              this.trainingsService.deleteMatch(res.enemy, res.matchId);
            }
          },
          {
            text: 'Annehmen',
            handler: () => {
              nothingPressed = false;
              this.trainingsService.updateGame(res.enemy);
            }
          }
        ],
        cssClass: `alert-head`
      });
      confirm.present();
      confirm.onDidDismiss().then( (detail) => {
        if(nothingPressed == true){
          this.trainingsService.deleteMatch(res.enemy, res.matchId);
        }
      })
    }
  }

  // onLoadSettings() {
  //   this.router.navigateByUrl('settings')
  // }

  // onLoadLeague() {
  //   this.router.navigateByUrl('league')
  // }

  // onLoadOnevsOne() {
  //   this.router.navigateByUrl('oneVsOneChoice')
  // }

  openPage(name) {
    this.router.navigateByUrl(name);
  }

  // loadOffline() {
  //   // let options: NativeTransitionOptions = {
  //   //   direction: 'up',
  //   //   duration: 600
  //   // };

  //   // this.nativePageTransitions.flip(options);
  //   this.router.navigateByUrl('offline')
  // }

  async onLoadOnevsOneGame(game: Game) {
    this.oneVoneService.enemyNow = game.enemy;
    this.oneVoneService.game = game;
    // this.oneVoneService.trainingsModus = false;
    this.oneVoneService.modus = IModus.legacyNormalModus;
    this.router.navigateByUrl('beforeOneVsOneGame');
  }

  async onLoadTrainingsGame(game: TrainingsGame) {
    console.log('train', game);
    this.trainingsService.enemyNow = game.enemy;
    this.trainingsService.game = game;
    // this.oneVoneService.trainingsModus = true;
    this.oneVoneService.modus = IModus.legacyTrainingsModus;
    this.router.navigateByUrl('beforeOneVsOneGame');
  }

  async onLoadOwnVocGame(game: Game) {
    this.ownVocOnlineService.enemyNow = game.enemy;
    this.ownVocOnlineService.game = game;
      if(game.allVoc[0].modus === IModus.normalModus){
      this.oneVoneService.modus = IModus.normalModus;
      } else {
      this.oneVoneService.modus = IModus.trainingsModus;
      }
      this.router.navigateByUrl('beforeOneVsOneGame');
  }

  async showResult(game: any) {
    let alert;
    if (game.pointsEnemy < game.pointsUser) {
      alert = await this.alertCtrl.create({
        header: 'Gewonnen!',
        subHeader: 'Du hast gegen ' + game.enemy + ' mit ' + game.pointsUser + ":" + game.pointsEnemy + ' gewonnen!',
        buttons: ['OK'],
        cssClass: `alert-head`
      });
    } else if (game.pointsEnemy == game.pointsUser) {
      alert = this.alertCtrl.create({
        header: 'Unentschieden!',
        subHeader: 'Du hast gegen ' + game.enemy + ' mit ' + game.pointsUser + ":" + game.pointsEnemy + 'unentschieden gespielt!',
        buttons: ['OK'],
        cssClass: `alert-head`
      });
    } else {
      alert = this.alertCtrl.create({
        header: 'Verloren!',
        subHeader: 'Du hast gegen ' + game.enemy + ' mit ' + game.pointsUser + ":" + game.pointsEnemy + ' verloren!',
        buttons: ['OK'],
        cssClass: `alert-head`
      });
    }
    alert.present();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('login');
  }

}
