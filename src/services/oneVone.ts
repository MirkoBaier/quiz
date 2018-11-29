import {Injectable} from "@angular/core";
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
import * as firebase from 'firebase';
import 'firebase/firestore';
import {NameService} from "./name";
import {Game} from "../models/game";
import {AuthService} from "./auth";
import 'rxjs/add/operator/mergeMap';
import {csvjson} from "../models/csvjson";


@Injectable()
export class OneVoneService{
  matchId: number;
  rlyvoc: csvjson = new csvjson();
  helpGer: string[] = [];
  helpEng: string[] = [];
  constructor(public authService: AuthService, public nameService: NameService, public firestore: AngularFirestore, public afAuth: AngularFireAuth){

  }


  //Spiel erstellen (noch nicht gestarted)
  async addGame(enemy: string, startBoolean: boolean): Promise<void> {
    let hilfUser = "";
    await this.authService.getUserIdByUsername(enemy);
    await this.nameService.getUsername().then(user => hilfUser = user);
    //wird nur erstellt wenn es noch keins gibt
    await this.getMatchIdByUsername(enemy).then(res => {if(res.toString()=="notFound"){
      let userId = this.authService.getActiveUser().uid;
      let matchId = this.firestore.createId();
      this.setRandomVoc();

      const matchChallenger: AngularFirestoreDocument<Game> = this.firestore.doc(
        `/OneVsOne/${userId}/games/${matchId}`
      );

      const matchEnemy: AngularFirestoreDocument<Game> = this.firestore.doc(
        `/OneVsOne/${this.authService.idFromUsername}/games/${matchId}`
      );

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
        finished: false
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
        finished: false
      });
    }else{
      console.log(res);
    }});
    this.helpGer = [];
    this.helpEng = [];
  }

  setRandomVoc(){
    for(let i = 10; i>0; i--) {
      let rand = Math.floor(Math.random() * 300) + 1;
      this.helpGer.push(this.rlyvoc.ger[rand].Allgemein);
      this.helpEng.push(this.rlyvoc.ger[rand].General)
    }
    console.log(this.helpGer);
  }


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

  async updateGameAfterRound(username: string, matchID: string, userPoints: number): Promise<void>{
    await this.authService.getUserIdByUsername(username);

    const matchChallenger: AngularFirestoreDocument<Game> = this.firestore.doc(
      `/OneVsOne/${this.nameService.userId}/games/${matchID}`
    );

    const matchEnemy: AngularFirestoreDocument<Game> = this.firestore.doc(
      `/OneVsOne/${this.authService.idFromUsername}/games/${matchID}`
    );

    this.getSomething(this.nameService.userId, matchID).then(res => {
      if(res[0].round == 1 || res[0].round == 3 || res[0].round == 5 || res[0].round == 7 || res[0].round == 9|| res[0].round == 1){
        this.setRandomVoc();
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

      matchEnemy.update({
        pointsEnemy: userPoints+res[0].pointsUser,
        userTurn: true,
        round: res[0].round+1,
      });

      matchChallenger.update({
        pointsUser: userPoints+res[0].pointsUser,
        userTurn: false,
        playing: false,
        round: res[0].round+1,
      });

      if(res[0].round == 9){
        matchChallenger.update({
        finished: true
        });
      }

    });
    console.log(this.helpGer);

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

  //Für Spielanfragen
 async getNewGames() :Promise<any>{
    let idUser = this.authService.getActiveUser().uid;
    let obj : any = [];
     return  new Promise(resolve => {
      firebase.firestore().collection( `/OneVsOne/${idUser}/games`).get().then(snapshot => {
        snapshot.forEach((doc: any) => {
          if(doc.data().started==false&&doc.data().userTurn==true) {
            obj.push({
              started: false,
              enemy: doc.data().enemy
            })
          }
        });
      });
      resolve(obj);
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
            console.log(doc.data().trans);
            obj.push({
              matchId: doc.data().matchId,
              enemy: doc.data().enemy,
              voc: doc.data().voc,
              trans: doc.data().trans
            });
            console.log(obj);
          }
        });
        resolve(obj);
      });
    })
  }

  //Daten vom Spiel kann man erhalten
  async getSomething(idUser: string, matchId: string) :Promise<any>{
    return new Promise(resolve => {
      firebase.firestore().collection( `/OneVsOne/${idUser}/games`).get().then((snapshot) => {
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
              playing: doc.data().playing
            });
          }
          resolve(obj);
      });
    })
  })
  }

}
