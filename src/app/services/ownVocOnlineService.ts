import {Injectable} from "@angular/core";
import { OfflineService } from './offlineservice';
import { AuthService } from './auth';
import { VocubalarService } from './vocubalar';
import { NameService } from './name';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Game } from '../models/game';
import {Notification} from "../models/notification";
import { IVocList } from '../models/IVocList';
import { AlertController } from '@ionic/angular';
import { IModus } from '../models/IModus';

@Injectable()
export class OwnVocOnlineService {

  helpGer: string[] = [];
  helpEng: string[] = [];
  helpPlaceholderVoc: string[] = []
  helpIsCorr: boolean[] = [];
  matchId: number;
  voc: IVocList[] = [];
  enemyNow: string = "";
  game: Game;

  constructor(private offlineService: OfflineService,
              private authService: AuthService,
              private vocService: VocubalarService,
              private nameService: NameService,
              private firestore: AngularFirestore,
              private alertCtrl: AlertController){

  }

  addRandomGame(isStarted: boolean) {

  }

  async addGame(enemy: string) {
    this.voc = this.offlineService.actualVoc;
    console.log("hi", this.voc);
    let hilfUser = "";
    await this.authService.getUserIdByUsername(enemy);
    // await this.vocService.getVocInit();
    await this.nameService.getUsername().then(user => hilfUser = user);

    //  wird nur erstellt wenn es noch keins gibt
     await this.getMatchIdByUsername(enemy).then(res => {
      if (res.toString() == "notFound") {
        let userId = this.authService.getActiveUser().uid;
        let matchId = this.firestore.createId();

        this.helpIsCorr.push(false);

        const matchChallenger: AngularFirestoreDocument<Game> = this.firestore.doc(
          `/OwnVoc/${userId}/games/${matchId}`
        );

        const matchEnemy: AngularFirestoreDocument<Game> = this.firestore.doc(
          `/OwnVoc/${this.authService.idFromUsername}/games/${matchId}`
        );

        const matchEnemyNot: AngularFirestoreDocument<Notification> = this.firestore.doc(
          `/notification/${this.authService.idFromUsername}/games/${matchId}`
        );

        this.showAlertYes();

        this.setRandomVoc(this.voc[0].modus, this.voc);

        matchEnemyNot.set({
          requestedMatch: false,          
          round: 0,
          enemyUID: this.authService.idFromUsername,
          matchId: matchId,
          user: hilfUser,
          enemy: enemy,
          status: 'Du hast eine Spielanfrage',
          vocabluar: this.voc
        });

//Es sollen nicht immer die gleichen Vokabeln am Anfang sein
//Es sollte getrackt werden wie oft welche Vokabel benutzt wurde
        matchEnemy.set({
          matchId: matchId,
          user: enemy,
          enemy: hilfUser,
          pointsEnemy: 0,
          pointsUser: 0,
          round: 0,
          started: false,
          userTurn: true,
          voc: this.helpEng,
          trans: this.helpGer,
          finished: false,
          isCorrect: this.helpIsCorr,
          startedFrom: hilfUser,
          showedGameStats: false,
          result: "?",
          vocName: this.voc[0].listName,
          time: firebase.firestore.FieldValue.serverTimestamp(),
          enemyUID: userId,
          allVoc: this.voc,
          placeholderVoc: this.helpPlaceholderVoc
        });

        return matchChallenger.set({
          matchId: matchId,
          user: hilfUser,
          enemy: enemy,
          pointsEnemy: 0,
          pointsUser: 0,
          round: 0,
          started: false,
          userTurn: false,
          voc: this.helpEng,
          trans: this.helpGer,
          finished: false,
          isCorrect: this.helpIsCorr,
          startedFrom: hilfUser,
          showedGameStats: false,
          result: "?",
          vocName: this.voc[0].listName,
          time: firebase.firestore.FieldValue.serverTimestamp(),
          enemyUID: this.authService.idFromUsername,
          allVoc: this.voc,
          placeholderVoc: this.helpPlaceholderVoc
        });
      } else {
        this.showAlertNo();
        console.log("Nicht mehr als ein Spiel geleichzeitig");
      }
    });
    console.log('eng',this.helpEng);
    console.log('ger',this.helpGer)
    this.helpGer = [];
    this.helpEng = [];
    this.helpPlaceholderVoc = [];
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
  
  private setRandomVoc(modus: IModus, voc: IVocList[]): void {
    if(modus === IModus.normalModus){
      this.shuffle(this.voc).forEach((key, index) => {
        if(this.helpEng.length < 5) {
        this.helpGer.push(this.voc[index].trans);
        this.helpEng.push(this.voc[index].voc)
      }
    })
  } else {
    this.shuffle(this.voc).forEach((key, index) => {
      if(this.helpEng.length < 5) {
      this.helpGer.push(this.voc[index].trans);
      this.helpEng.push(this.voc[index].voc)
    }
  })

  while(this.helpPlaceholderVoc.length < 15) {
  this.shuffle(this.voc).forEach((key, index) => {
  this.helpPlaceholderVoc.push(this.voc[index].voc);
})
  }

    }
  }

  private shuffle(arra1): IVocList[] {
    var ctr = arra1.length, temp, index;

// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}

async updateGame(username: string): Promise<void> {
  const matchChallenger: AngularFirestoreDocument<Game> = this.firestore.doc(
    `/OwnVoc/${this.nameService.userId}/games/${this.game.matchId}`
  );

  const matchEnemy: AngularFirestoreDocument<Game> = this.firestore.doc(
    `/OwnVoc/${this.game.enemyUID}/games/${this.game.matchId}`
  );

  matchEnemy.update({
    started: true
  });

  return matchChallenger.update({
    started: true
  });
}

async updateGameAfterRound(matchID: string, userPoints: number, checkCorrect: boolean[]): Promise<void> {

  const matchChallenger: AngularFirestoreDocument<Game> = this.firestore.doc(
    `/OwnVoc/${this.nameService.userId}/games/${matchID}`
  );

  const matchEnemy: AngularFirestoreDocument<Game> = this.firestore.doc(
    `/OwnVoc/${this.game.enemyUID}/games/${matchID}`
  );

  const matchEnemyNot: AngularFirestoreDocument<Notification> = this.firestore.doc(
    `/notification/${this.game.enemyUID}/games/${matchID}`
  );

  const matchChallengerNot: AngularFirestoreDocument<Notification> = this.firestore.doc(
    `/notification/${this.game.enemyUID}/games/${matchID}`
  );

  await this.getGameData(matchID).then(res => {
    //Neue Vokabeln nachdem beide sie hatten
    if (res[0].round == 1 || res[0].round == 3 || res[0].round == 5 || res[0].round == 7 || res[0].round == 9) {
        this.setRandomVoc(res[0].allVoc[0].modus, res[0].allVoc);
     
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
      round: res[0].round + 1,
      isCorrect: res[0].isCorrect.concat(checkCorrect),
      time: firebase.firestore.FieldValue.serverTimestamp()
    });

  });

}

  getMatchIdByUsername(username: string): Promise<any> {
    let idUser = this.authService.getActiveUser().uid;
    return new Promise(resolve => {
      firebase.firestore().collection(`/OwnVoc/${idUser}/games`).get().then((querySnapshot) => {
        let obj: string = "notFound";
        console.log(querySnapshot.size)
        querySnapshot.forEach((doc: any) => {
          if (doc.data().enemy === username) {
            obj = doc.data().matchId;
          }
        });
        resolve(obj);
      });
    })
  }

   //Spiel zur Historie hinzufügen
   async addFinishedGameToHistory(game: Game): Promise<void> {
    let matchHistoryId = this.firestore.createId();
    console.log('own', this.game, game);
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
      `/OwnVoc/${userId}/finishedGames/${matchHistoryId}`
    );

    const matchEnemy: AngularFirestoreDocument<Game> = this.firestore.doc(
      `/OwnVoc/${this.game.enemyUID}/finishedGames/${matchHistoryId}`
    );

    const matchEnemyNotUpdate: AngularFirestoreDocument<Notification> = this.firestore.doc(
      `/notification/${this.game.enemyUID}/games/${game.matchId}`
    );

    const matchEnemyNot: AngularFirestoreCollection<Notification> = this.firestore.collection(
      `/notification/${this.game.enemyUID}/games`
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
      enemyUID: this.game.enemyUID
    });
  }


  async getGameData(matchId: string): Promise<any> {
    let idPlayer = this.authService.getActiveUser().uid;
    return new Promise(resolve => {
      firebase.firestore().collection(`/OwnVoc/${idPlayer}/games`).get().then((snapshot) => {
        let obj: Game[] = [];
        console.log('size', snapshot.size)
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
              enemyUID: doc.data().enemyUID,
              showedGameStats: doc.data().showedGameStats,
              time: doc.data().time,
              allVoc: doc.data().allVoc
            });
          }
        });
        resolve(obj);
      })
    })
  }

  //Spiel löschen aus der Spielliste  username=enemyusername
  async deleteMatch(username: string, matchId: string) {
    let idUser = this.authService.getActiveUser().uid;

    const matchChallenger: AngularFirestoreCollection<Game> = this.firestore.collection(
      `/OwnVoc/${idUser}/games`
    );

    const matchEnemy: AngularFirestoreCollection<Game> = this.firestore.collection(
      `/OwnVoc/${this.game.enemyUID}/games`
    );


    matchChallenger.doc(matchId).delete();
    matchEnemy.doc(matchId).delete();
  }

   //Für die angezeigte Liste
   getStartedGamesList(): AngularFirestoreCollection<Game> {
    let idUser = this.authService.getActiveUser().uid;
    return this.firestore.collection<Game>(
      `/OwnVoc/${idUser}/games`, //Adds the reference.
      ref =>
        ref.orderBy('time', 'desc').where('started', '==', true).where('userTurn','==', true)
    );
  }

  getStartedGamesListNotTurn(): AngularFirestoreCollection<Game> {
    let idUser = this.authService.getActiveUser().uid;
    return this.firestore.collection<Game>(
      `/OwnVoc/${idUser}/games`, //Adds the reference.
      ref =>
        ref.orderBy('time', 'desc').where('started', '==', true).where('userTurn','==', false)
    );
  }

   //Für Spielanfragen
   getNewGames(): AngularFirestoreCollection<Game> {
    let idUser = this.authService.getActiveUser().uid;
    return this.firestore.collection<Game>(
      `/OwnVoc/${idUser}/games`, //Adds the reference.
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
      firebase.firestore().collection(`/OwnVoc/${idUser}/finishedGames`).get().then(snapshot => {
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
              `/OwnVoc/${idUser}/finishedGames/${doc.data().matchId}`
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

  getFinishedGamesList(): AngularFirestoreCollection<Game> {
    let idUser = this.authService.getActiveUser().uid;
    return this.firestore.collection<Game>(
      `/OwnVoc/${idUser}/finishedGames`, //Adds the reference.
      ref =>
        ref.orderBy('time', 'desc').where('started', '==', true).limit(5)
    );
  }

}
