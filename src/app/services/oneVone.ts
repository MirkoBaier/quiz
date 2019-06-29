
import 'firebase/firestore'
import 'firebase/auth'

import {Injectable} from "@angular/core";
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/firestore";
import {NameService} from "./name";
import {Game} from "../models/game";
import {AuthService} from "./auth";
import {csvjson} from "../models/csvjson";
import {VocubalarService} from "./vocubalar";
import {AlertController} from "@ionic/angular";
import {Notification} from "../models/notification";
import {csvSpanish} from "../models/csvSpanish";
import {Randomgame} from "../models/randomgame";
import {csvFrance} from "../models/csvFrance";
import * as firebase from 'firebase/app';
import { IModus } from '../models/IModus';


@Injectable()
export class OneVoneService {
  matchId: number;
  rlyvoc: csvjson = new csvjson();
  spanishVoc: csvSpanish = new csvSpanish();
  franceVoc: csvFrance = new csvFrance();
  helpGer: string[] = [];
  helpEng: string[] = [];
  helpIsCorr: boolean[] = [];
  enemyNow: string = "";
  language: string = "";
  isToggled: boolean;
  trainingsModus: boolean = false;
  modus: IModus;


  constructor(private authService: AuthService,
              private nameService: NameService,
              private firestore: AngularFirestore,
              private vocService: VocubalarService,
              private alertCtrl: AlertController) {

  }


  //Spiel erstellen (noch nicht gestarted)
  async addGame(enemy: string, startBoolean: boolean): Promise<void> {
    let hilfUser = "";
    await this.authService.getUserIdByUsername(enemy);
    await this.vocService.getVocInit();
    await this.nameService.getUsername().then(user => hilfUser = user);
    //wird nur erstellt wenn es noch keins gibt
    await this.getMatchIdByUsername(enemy).then(res => {
      if (res.toString() == "notFound") {
        let userId = this.authService.getActiveUser().uid;
        let matchId = this.firestore.createId();
        let helpVocName: string = this.language;

        if (this.vocService.ownVocChosen == false) {
          this.setRandomVoc(this.language);
        } else {
          this.setOwnVoc();
          console.log(this.vocService.listName);
          helpVocName = this.vocService.listName;
        }

        this.helpIsCorr.push(false);

        const matchChallenger: AngularFirestoreDocument<Game> = this.firestore.doc(
          `/OneVsOne/${userId}/games/${matchId}`
        );

        const matchEnemy: AngularFirestoreDocument<Game> = this.firestore.doc(
          `/OneVsOne/${this.authService.idFromUsername}/games/${matchId}`
        );

        const matchEnemyNot: AngularFirestoreDocument<Notification> = this.firestore.doc(
          `/notification/${this.authService.idFromUsername}/games/${matchId}`
        );


        this.vocService.choseOwnVoc(false);
        this.showAlertYes();

        matchEnemyNot.set({
          requestedMatch: false,
          round: 0,
          enemyUID: this.authService.idFromUsername,
          matchId: matchId,
          user: hilfUser,
          enemy: enemy,
          status: 'Du hast eine Spielanfrage'
        });


        matchEnemy.set({
          matchId: matchId,
          user: enemy,
          enemy: hilfUser,
          pointsEnemy: 0,
          pointsUser: 0,
          round: 0,
          started: startBoolean,
          userTurn: true,
          playing: false,
          voc: this.helpEng,
          trans: this.helpGer,
          finished: false,
          isCorrect: this.helpIsCorr,
          startedFrom: hilfUser,
          showedGameStats: false,
          result: "?",
          vocName: helpVocName,
          time: firebase.firestore.FieldValue.serverTimestamp(),
          enemyUID: userId
        });

        return matchChallenger.set({
          matchId: matchId,
          user: hilfUser,
          enemy: enemy,
          pointsEnemy: 0,
          pointsUser: 0,
          round: 0,
          started: startBoolean,
          userTurn: false,
          playing: false,
          voc: this.helpEng,
          trans: this.helpGer,
          finished: false,
          isCorrect: this.helpIsCorr,
          startedFrom: hilfUser,
          showedGameStats: false,
          result: "?",
          vocName: helpVocName,
          time: firebase.firestore.FieldValue.serverTimestamp(),
          enemyUID: this.authService.idFromUsername
        });
      } else {
        this.showAlertNo();
        console.log("Nicht mehr als ein Spiel geleichzeitig");
      }
    });
    this.helpGer = [];
    this.helpEng = [];
    this.helpIsCorr = [];
  }

  async showAlertYes() {
    const alert = await this.alertCtrl.create({
      header: 'Spielanfrage!',
      subHeader: 'Erfolgreich gesendet!',
      buttons: ['OK'],
      cssClass: `alert-head`
    });
    return await alert.present();
  }

  async showAlertNo() {
    const alert = await this.alertCtrl.create({
      header: 'Fehlgeschlagen',
      subHeader: 'Nicht mehr als ein Spiel gegen den gleichen Spieler',
      buttons: ['OK'],
      cssClass: `alert-head`
    });
    alert.present();
  }


  //Spiel zur Historie hinzufügen
  async addFinishedGameToHistory(game: Game): Promise<void> {

    let matchHistoryId = this.firestore.createId();
    await this.authService.getUserIdByUsername(game.enemy);
    //wird nur erstellt wenn es noch keins gibt
    let userId = this.authService.getActiveUser().uid;

    let enemyResult: string;
    let userResult: string;
    if (game.pointsEnemy > game.pointsUser) {
      enemyResult = "Gewonnen";
      userResult = "Verloren"
    } else if (game.pointsEnemy < game.pointsUser) {
      enemyResult = "Verloren";
      userResult = "Gewonnen"
    } else {
      enemyResult = "Unentschieden";
      userResult = "Unentschieden"
    }

    const matchChallenger: AngularFirestoreDocument<Game> = this.firestore.doc(
      `/OneVsOne/${userId}/finishedGames/${matchHistoryId}`
    );

    const matchEnemy: AngularFirestoreDocument<Game> = this.firestore.doc(
      `/OneVsOne/${this.authService.idFromUsername}/finishedGames/${matchHistoryId}`
    );

    const matchEnemyNotUpdate: AngularFirestoreDocument<Notification> = this.firestore.doc(
      `/notification/${this.authService.idFromUsername}/games/${game.matchId}`
    );

    const matchEnemyNot: AngularFirestoreCollection<Notification> = this.firestore.collection(
      `/notification/${this.authService.idFromUsername}/games`
    );

    const matchChallengerNot: AngularFirestoreCollection<Notification> = this.firestore.collection(
      `/notification/${userId}/games`
    );


    matchEnemyNotUpdate.update({
      status: enemyResult + ' gegen ' + game.user
    });

    matchEnemyNot.doc(game.matchId).delete();
    matchChallengerNot.doc(game.matchId).delete();

    matchEnemy.set({
      matchId: matchHistoryId,
      user: game.enemy,
      enemy: game.user,
      pointsEnemy: game.pointsUser,
      pointsUser: game.pointsEnemy,
      round: game.round,
      started: true,
      userTurn: true,
      playing: false,
      voc: ['sparen'],
      trans: ['sparen'],
      finished: true,
      isCorrect: [false],
      startedFrom: game.startedFrom,
      showedGameStats: false,
      result: enemyResult,
      vocName: game.vocName,
      time: firebase.firestore.FieldValue.serverTimestamp(),
      enemyUID: userId
    });

    return matchChallenger.set({
      matchId: matchHistoryId,
      user: game.user,
      enemy: game.enemy,
      pointsEnemy: game.pointsEnemy,
      pointsUser: game.pointsUser,
      round: game.round,
      started: true,
      userTurn: false,
      playing: false,
      voc: ['sparen'],
      trans: ['sparen'],
      finished: true,
      isCorrect: [false],
      startedFrom: game.startedFrom,
      showedGameStats: true,
      result: userResult,
      vocName: game.vocName,
      time: firebase.firestore.FieldValue.serverTimestamp(),
      enemyUID: this.authService.idFromUsername
    });
  }


  //Vorgefertigte Vokabeln
  setRandomVoc(language: string) {
    if (language == 'Englisch') {
      for (let i = 5; i > 0; i--) {
        let rand = Math.floor(Math.random() * 300) + 1;
        this.helpGer.push(this.rlyvoc.ger[rand].Allgemein);
        this.helpEng.push(this.rlyvoc.ger[rand].General)
      }
    } else if (language == 'Spanisch') {
      for (let i = 5; i > 0; i--) {
        let rand = Math.floor(Math.random() * 300) + 1;
        this.helpGer.push(this.spanishVoc.ger[rand].Allgemein);
        this.helpEng.push(this.spanishVoc.ger[rand].General)
      }
    } else if (language == 'Französisch') {
      for (let i = 5; i > 0; i--) {
        let rand = Math.floor(Math.random() * 300) + 1;
        this.helpGer.push(this.franceVoc.ger[rand].Allgemein);
        this.helpEng.push(this.franceVoc.ger[rand].General)
      }
    }
  }

  //Eigene Vokabeln benutzen
  setOwnVoc() {
    for (let i = 5; i > 0; i--) {
      let rand = Math.floor(Math.random() * this.vocService.Vocabulary.length) + 1;
      this.helpGer.push(this.vocService.Vocabulary[rand - 1].trans);
      this.helpEng.push(this.vocService.Vocabulary[rand - 1].voc);
      console.log(this.helpEng);
    }
  }

  //Game wird angenommen
  async updateGame(username: string): Promise<void> {
    await this.getMatchIdByUsername(username).then(res => this.matchId = res);
    await this.authService.getUserIdByUsername(username);

    const matchChallenger: AngularFirestoreDocument<Game> = this.firestore.doc(
      `/OneVsOne/${this.nameService.userId}/games/${this.matchId}`
    );

    const matchEnemy: AngularFirestoreDocument<Game> = this.firestore.doc(
      `/OneVsOne/${this.authService.idFromUsername}/games/${this.matchId}`
    );

    matchEnemy.update({
      started: true
    });

    return matchChallenger.update({
      started: true
    });
  }

  async updateGameAfterRound(username: string, matchID: string, userPoints: number, checkCorrect: boolean[]): Promise<void> {
    await this.authService.getUserIdByUsername(username);

    const matchChallenger: AngularFirestoreDocument<Game> = this.firestore.doc(
      `/OneVsOne/${this.nameService.userId}/games/${matchID}`
    );

    const matchEnemy: AngularFirestoreDocument<Game> = this.firestore.doc(
      `/OneVsOne/${this.authService.idFromUsername}/games/${matchID}`
    );


    const matchEnemyNot: AngularFirestoreDocument<Notification> = this.firestore.doc(
      `/notification/${this.authService.idFromUsername}/games/${matchID}`
    );

    const matchChallengerNot: AngularFirestoreDocument<Notification> = this.firestore.doc(
      `/notification/${this.authService.idFromUsername}/games/${matchID}`
    );

    await this.getSomething(this.nameService.userId, matchID).then(res => {
      //Neue Vokabeln nachdem beide sie hatten
      if (res[0].round == 1 || res[0].round == 3 || res[0].round == 5 || res[0].round == 7 || res[0].round == 9) {
        if (res[0].vocName === 'Englisch' || res[0].vocName === 'Spanisch') {
          this.setRandomVoc(res[0].vocName);
        } else {
          this.setOwnVoc();
        }
        matchEnemy.update({
          voc: this.helpEng,
          trans: this.helpGer
        });
        matchChallenger.update({
          voc: this.helpEng,
          trans: this.helpGer
        });
        this.helpGer = [];
        this.helpEng = [];
      }

      //Match beendet
      if (res[0].round == 9) {
        matchChallenger.update({
          finished: true
        });
      } else {
        if (res[0].round == 0) {
          matchChallengerNot.set({
            requestedMatch: true,
            round: 0,
            enemyUID: this.authService.idFromUsername,
            matchId: res[0].matchId,
            user: res[0].user,
            enemy: res[0].enemy,
            status: 'Du bist dran',
          });
        }
        if (res[0].round == 1 || res[0].round == 3 || res[0].round == 5 || res[0].round == 7) {
          matchEnemyNot.update({
            round: res[0].round,
            status: 'Du bist dran'
          });
        } else if (res[0].round == 2 || res[0].round == 4 || res[0].round == 6 || res[0].round == 8) {
          matchChallengerNot.update({
            round: res[0].round,
            status: 'Du bist dran'
          })
        }
      }


      //normales update
      matchEnemy.update({
        pointsEnemy: userPoints + res[0].pointsUser,
        userTurn: true,
        round: res[0].round + 1,
        isCorrect: res[0].isCorrect.concat(checkCorrect),
        time: firebase.firestore.FieldValue.serverTimestamp()
      });


      //normales update
      return matchChallenger.update({
        pointsUser: userPoints + res[0].pointsUser,
        userTurn: false,
        playing: false,
        round: res[0].round + 1,
        isCorrect: res[0].isCorrect.concat(checkCorrect),
        time: firebase.firestore.FieldValue.serverTimestamp()
      });

    });

  }

  async updateGameFromOnePlaying(username: string): Promise<void> {
    await this.getMatchIdByUsername(username).then(res => this.matchId = res);
    await this.authService.getUserIdByUsername(username);
    const matchChallenger: AngularFirestoreDocument<Game> = this.firestore.doc(
      `/OneVsOne/${this.nameService.userId}/games/${this.matchId}`
    );

    return matchChallenger.update({
      playing: true
    });
  }


  getMatchIdByUsername(username: string): Promise<any> {
    let idUser = this.authService.getActiveUser().uid;
    return new Promise(resolve => {
      firebase.firestore().collection(`/OneVsOne/${idUser}/games`).get().then((querySnapshot) => {
        let obj: string = "notFound";
        querySnapshot.forEach((doc: any) => {
          if (doc.data().enemy === username) {
            obj = doc.data().matchId;
          }
        });
        resolve(obj);
      });
    })
  }

  //Für die angezeigte Liste
  getStartedGamesList(): AngularFirestoreCollection<Game> {
    let idUser = this.authService.getActiveUser().uid;
    return this.firestore.collection<Game>(
      `/OneVsOne/${idUser}/games`, //Adds the reference.
      ref =>
        ref.orderBy('time', 'desc').where('started', '==', true).where('userTurn','==', true)
    );
  }

  getStartedGamesListNotTurn(): AngularFirestoreCollection<Game> {
    let idUser = this.authService.getActiveUser().uid;
    return this.firestore.collection<Game>(
      `/OneVsOne/${idUser}/games`, //Adds the reference.
      ref =>
        ref.orderBy('time', 'desc').where('started', '==', true).where('userTurn','==', false)
    );
  }

  getFinishedGamesList(): AngularFirestoreCollection<Game> {
    let idUser = this.authService.getActiveUser().uid;
    return this.firestore.collection<Game>(
      `/OneVsOne/${idUser}/finishedGames`, //Adds the reference.
      ref =>
        ref.orderBy('time', 'desc').where('started', '==', true).limit(5)
    );
  }

  //Für Spielanfragen
  getNewGames(): AngularFirestoreCollection<Game> {
    let idUser = this.authService.getActiveUser().uid;
    return this.firestore.collection<Game>(
      `/OneVsOne/${idUser}/games`, //Adds the reference.
      ref =>
        ref
          .where('started', '==', false)
          .where('userTurn', '==', true)
    );
  }


  //zeigt Gamestats
  async showGameStats(): Promise<any> {
    let idUser = this.authService.getActiveUser().uid;
    let obj: any = [];
    return new Promise(resolve => {
      firebase.firestore().collection(`/OneVsOne/${idUser}/finishedGames`).get().then(snapshot => {
        snapshot.forEach((doc: any) => {
          if (doc.data().showedGameStats == false) {
            obj.push({
              showedGameStats: true,
              enemy: doc.data().enemy,
              matchId: doc.data().matchId,
              voc: doc.data().voc,
              trans: doc.data().trans,
              round: doc.data().round,
              finished: doc.data().finished,
              pointsEnemy: doc.data().pointsEnemy,
              pointsUser: doc.data().pointsUser,
              user: doc.data().user
            });
            const matchChallenger: AngularFirestoreDocument<Game> = this.firestore.doc(
              `/OneVsOne/${idUser}/finishedGames/${doc.data().matchId}`
            );
            matchChallenger.update({
              showedGameStats: true,
            });
          }
        });
        resolve(obj);
      });

    })
  }

  //Spiel welches wirklich jetzt gespielt wird
  async getLiveGame(): Promise<any> {
    let idUser = this.authService.getActiveUser().uid;
    return new Promise(resolve => {
      firebase.firestore().collection(`/OneVsOne/${idUser}/games`).get().then(snapshot => {
        let obj: any = [];
        snapshot.forEach((doc: any) => {
          if (doc.data().playing == true) {
            obj.push({
              matchId: doc.data().matchId,
              enemy: doc.data().enemy,
              voc: doc.data().voc,
              trans: doc.data().trans,
              round: doc.data().round,
              finished: doc.data().finished,
              pointsEnemy: doc.data().pointsEnemy,
              pointsUser: doc.data().pointsUser,
              user: doc.data().user
            });
          }
        });
        resolve(obj);
      });
    })
  }


  //Spiel löschen aus der Spielliste  username=enemyusername
  async deleteMatch(username: string, matchId: string) {
    let idUser = this.authService.getActiveUser().uid;
    await this.authService.getUserIdByUsername(username);

    const matchChallenger: AngularFirestoreCollection<Game> = this.firestore.collection(
      `/OneVsOne/${idUser}/games`
    );

    const matchEnemy: AngularFirestoreCollection<Game> = this.firestore.collection(
      `/OneVsOne/${this.authService.idFromUsername}/games`
    );


    matchChallenger.doc(matchId).delete();
    matchEnemy.doc(matchId).delete();
  }

  //Daten vom Spiel kann man erhalten
  async getSomething(idUser: string, matchId: string): Promise<any> {
    let idPlayer = this.authService.getActiveUser().uid;
    return new Promise(resolve => {
      firebase.firestore().collection(`/OneVsOne/${idPlayer}/games`).get().then((snapshot) => {
        let obj: any[] = [];
        snapshot.forEach((doc: any) => {
          if (doc.data().matchId == matchId) {
            obj.push({
              matchId: doc.data().matchId,
              user: doc.data().user,
              enemy: doc.data().enemy,
              pointsEnemy: doc.data().pointsEnemy,
              pointsUser: doc.data().pointsUser,
              round: doc.data().round,
              started: doc.data().started,
              userTurn: doc.data().userTurn,
              playing: doc.data().playing,
              finished: doc.data().finished,
              isCorrect: doc.data().isCorrect,
              startedFrom: doc.data().startedFrom,
              voc: doc.data().voc,
              trans: doc.data().trans,
              result: doc.data().result,
              vocName: doc.data().vocName,
              enemyUID: doc.data().enemyUID
            });
          }
        });
        resolve(obj);
      })
    })
  }

  async addRandomGame(language: string){
    let idUser = this.authService.getActiveUser().uid;
    await this.nameService.getUsername();
    const matchChallenger: AngularFirestoreDocument<Randomgame> = this.firestore.doc(
      `/Random/${language}/games/${idUser}`
    );


    let enemyUserName = "";
    let enemyUserId = "";
    try {
      await firebase.firestore().collection(`/Random/${language}/games`).limit(1).get().then((snapshot) =>
        snapshot.forEach((doc)=> {
          if(doc.data().userId!=idUser) {
            enemyUserName = doc.data().username;
            enemyUserId = doc.data().userId
          }
        })
      );
    }catch (e) {
      console.log(e);
    }


    if(enemyUserName=='') {
      await matchChallenger.set({
        userId: idUser,
        language: language,
        username: this.nameService.userName
      })
    }else{
      console.log(enemyUserName);
      this.addGame(enemyUserName, false);
      const matchEnemy: AngularFirestoreCollection<Randomgame> = this.firestore.collection(
        `/Random/${language}/games`);

        matchEnemy.doc(enemyUserId).delete();
    }
  }



}
