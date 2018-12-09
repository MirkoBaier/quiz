import {Injectable} from "@angular/core";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
import * as firebase from 'firebase/app';
import {Points} from "../models/points";
import {NameService} from "./name";


@Injectable()
export class PointsService{
  userId: string;


  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth, private  nameService: NameService) {
    afAuth.authState.subscribe(user => {
      if(user) {
        this.userId = user.uid;
      }
    })
  }

  async addPoints(points: number, league: string): Promise<void> {
    const pointRef: AngularFirestoreDocument<Points> = this.firestore.doc(
      `/EnglishLeague/${this.userId}`
    );
    let hilfUser = "hilf";
    await this.nameService.getUsername().then(user => hilfUser = user);
    return pointRef.set({
      name: hilfUser,
      league: league,
      points: points
    });
  }

  getlistPoints(collectionObj: string): Promise<any>{
    let obj : Points[] = [];
    return new Promise(resolve => {
      firebase.firestore().collection(collectionObj).orderBy("points", "desc").get().then(snapshot => {
        snapshot.forEach((doc: any) => {
          obj.push({
            points: doc.data().points,
            name: doc.data().name,
            league: doc.data().league
          })
        });
      });
      resolve(obj);
    })
  }

  async getPoints(): Promise<any> {
    const englishLeague: firebase.firestore.DocumentSnapshot = await firebase
      .firestore().doc(`EnglishLeague/${this.userId}`)
      .get();
    if(englishLeague.data()===undefined){
      return 0;
    }else{
      return englishLeague.data().points;
    }

  }
}
