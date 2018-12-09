import {Injectable} from "@angular/core";
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
import * as firebase from 'firebase/app';
import {NameService} from "./name";
import {Game} from "../models/game";
import {AuthService} from "./auth";
import {csvjson} from "../models/csvjson";
import {VocubalarService} from "./vocubalar";
import {AlertController} from "ionic-angular";



@Injectable()
export class OneVoneService{
  matchId: number;
  rlyvoc: csvjson = new csvjson();
  helpGer: string[] = [];
  helpEng: string[] = [];
  helpIsCorr: boolean[] = [];
  enemyNow: string = "";
  constructor(private authService: AuthService,
              private nameService: NameService,
              private firestore: AngularFirestore,
              private afAuth: AngularFireAuth,
              private vocService: VocubalarService,
              private alertCtrl: AlertController){

  }


  //Spiel erstellen (noch nicht gestarted)
  async addGame(enemy: string, startBoolean: boolean): Promise<void> {
    let hilfUser = "";
    await this.authService.getUserIdByUsername(enemy);
    await this.vocService.getVocInit();
    await this.nameService.getUsername().then(user => hilfUser = user);
    //wird nur erstellt wenn es noch keins gibt
    await this.getMatchIdByUsername(enemy).then(res => {if(res.toString()=="notFound"){
      let userId = this.authService.getActiveUser().uid;
      let matchId = this.firestore.createId();
      let helpVocName: string = "Englisch";

      if(this.vocService.ownVocChosen==false) {
        this.setRandomVoc();
      }else{
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

      this.vocService.choseOwnVoc(false);
      this.showAlertYes();

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
        time: firebase.firestore.FieldValue.serverTimestamp()
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
        time: firebase.firestore.FieldValue.serverTimestamp()
      });
    }else{
      this.showAlertNo();
      console.log("Nicht mehr als ein Spiel geleichzeitig");
    }});
    this.helpGer = [];
    this.helpEng = [];
    this.helpIsCorr = [];
  }

  showAlertYes() {
    const alert = this.alertCtrl.create({
      title: 'Spielanfrage!',
      subTitle: 'Erfolgreich gesendet!',
      buttons: ['OK']
    });
    alert.present();
  }

  showAlertNo() {
    const alert = this.alertCtrl.create({
      title: 'Fehlgeschlagen',
      subTitle: 'Nicht mehr als ein Spiel gegen den gleichen Spieler',
      buttons: ['OK']
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
    console.log(game.pointsEnemy);
    console.log(game.pointsUser);
    if(game.pointsEnemy>game.pointsUser){
      enemyResult = "Gewonnen";
      userResult = "Verloren"
    }else if(game.pointsEnemy<game.pointsUser){
      enemyResult = "Verloren";
      userResult = "Gewonnen"
    }else{
      enemyResult = "Unentschieden";
      userResult = "Unentschieden"
    }

      const matchChallenger: AngularFirestoreDocument<Game> = this.firestore.doc(
        `/OneVsOne/${userId}/finishedGames/${matchHistoryId}`
      );

      const matchEnemy: AngularFirestoreDocument<Game> = this.firestore.doc(
        `/OneVsOne/${this.authService.idFromUsername}/finishedGames/${matchHistoryId}`
      );


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
        time: firebase.firestore.FieldValue.serverTimestamp()
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
        time: firebase.firestore.FieldValue.serverTimestamp()
      });
    }


  //Vorgefertigte Vokabeln
  setRandomVoc(){
    for(let i = 5; i>0; i--) {
      let rand = Math.floor(Math.random() * 300) + 1;
      this.helpGer.push(this.rlyvoc.ger[rand].Allgemein);
      this.helpEng.push(this.rlyvoc.ger[rand].General)
    }
  }

  //Eigene Vokabeln benutzen
   setOwnVoc(){
    for(let i = 5; i>0; i--) {
      let rand = Math.floor(Math.random() * this.vocService.Vocabulary.length) + 1;
      this.helpGer.push(this.vocService.Vocabulary[rand-1].trans);
      this.helpEng.push(this.vocService.Vocabulary[rand-1].voc);
      console.log(this.helpEng);
    }
  }

  //Game wird angenommen
  async updateGame(username: string): Promise<void>{
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

  async updateGameAfterRound(username: string, matchID: string, userPoints: number, checkCorrect: boolean[]): Promise<void>{
    await this.authService.getUserIdByUsername(username);

    const matchChallenger: AngularFirestoreDocument<Game> = this.firestore.doc(
      `/OneVsOne/${this.nameService.userId}/games/${matchID}`
    );

    const matchEnemy: AngularFirestoreDocument<Game> = this.firestore.doc(
      `/OneVsOne/${this.authService.idFromUsername}/games/${matchID}`
    );

      await this.getSomething(this.nameService.userId, matchID).then(res => {
        //Neue Vokabeln nachdem beide sie hatten
        if (res[0].round == 1 || res[0].round == 3 || res[0].round == 5 || res[0].round == 7 || res[0].round == 9) {
         if(res[0].vocName==='Englisch') {
           this.setRandomVoc();
         }else{
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
        if (res[0].round == 1) {
          matchChallenger.update({
            finished: true
          });

        }


        //normales update
        matchEnemy.update({
          pointsEnemy: userPoints + res[0].pointsUser,
          userTurn: true,
          round: res[0].round + 1,
          isCorrect: res[0].isCorrect.concat(checkCorrect),
        });


        //normales update
        return matchChallenger.update({
          pointsUser: userPoints + res[0].pointsUser,
          userTurn: false,
          playing: false,
          round: res[0].round + 1,
          isCorrect: res[0].isCorrect.concat(checkCorrect),
        });

      });

  }

  async updateGameFromOnePlaying(username: string): Promise<void>{
    await this.getMatchIdByUsername(username).then(res => this.matchId = res);
    await this.authService.getUserIdByUsername(username);
    const matchChallenger: AngularFirestoreDocument<Game> = this.firestore.doc(
      `/OneVsOne/${this.nameService.userId}/games/${this.matchId}`
    );

    return matchChallenger.update({
      playing: true
    });
  }



   getMatchIdByUsername(username: string): Promise<any>{
    let idUser = this.authService.getActiveUser().uid;
    return new Promise(resolve => {
      firebase.firestore().collection( `/OneVsOne/${idUser}/games`).get().then((querySnapshot) => {
        let obj : string = "notFound";
        querySnapshot.forEach((doc: any) => {
          if(doc.data().enemy===username) {
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
        ref
          .where('started', '==', true)
    );
  }

  getFinishedGamesList(): AngularFirestoreCollection<Game> {
    let idUser = this.authService.getActiveUser().uid;
    return this.firestore.collection<Game>(
      `/OneVsOne/${idUser}/finishedGames`, //Adds the reference.
      ref =>
          ref.orderBy('time', 'desc').where('started', '==', true)
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
          .where('userTurn','==', true)
    );
  }




  //zeigt Gamestats
  async showGameStats() :Promise<any>{
    let idUser = this.authService.getActiveUser().uid;
    let obj : any = [];
    return  new Promise(resolve => {
      firebase.firestore().collection( `/OneVsOne/${idUser}/finishedGames`).get().then(snapshot => {
        snapshot.forEach((doc: any) => {
          if(doc.data().showedGameStats==false) {
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
  async getLiveGame() :Promise<any>{
    let idUser = this.authService.getActiveUser().uid;
    return new Promise(resolve => {
      firebase.firestore().collection( `/OneVsOne/${idUser}/games`).get().then(snapshot => {
        let obj : any = [];
        snapshot.forEach((doc: any) => {
          if(doc.data().playing==true) {
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


  //Spiel löschen aus der Spielliste
  async deleteMatch(username: string, matchId: string){
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
  async getSomething(idUser: string, matchId: string) :Promise<any>{
    let idPlayer = this.authService.getActiveUser().uid;
    return new Promise(resolve => {
      firebase.firestore().collection( `/OneVsOne/${idPlayer}/games`).get().then((snapshot) => {
        let obj: any[] = [];
        snapshot.forEach((doc: any) => {
          if(doc.data().matchId == matchId) {
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
              vocName: doc.data().vocName
            });
          }
      });
        resolve(obj);
    })
  })
  }

}
