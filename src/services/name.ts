import {Injectable} from "@angular/core";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
import * as firebase from 'firebase';
import {Points} from "../models/points";
import 'firebase/firestore';

@Injectable()
export class NameService{
  userId: string;
  oldpoints: number;

  constructor(public firestore: AngularFirestore, public afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(user => {
      if(user) {
        this.userId = user.uid;
      }
    })
  }

  async getUsername(): Promise<string> {
    const userProfile: firebase.firestore.DocumentSnapshot = await firebase
      .firestore().doc(`userProfile/${this.userId}`)
      .get();
    return userProfile.data().username;
  }

  async addPoints(points: number, league: string): Promise<void> {
    const pointRef: AngularFirestoreDocument<Points> = this.firestore.doc(
      `/EnglishLeague/${this.userId}`
    );
    let hilfUser = "hi";
    await this.getUsername().then(user => hilfUser = user);
    return pointRef.set({
      name: hilfUser,
      league: league,
      points: points
    });
  }

   getlistPoints(collectionObj: string): Promise<any>{
     let obj : Points[] = [];
     return new Promise(resolve => {
       firebase.firestore().collection(collectionObj).get().then(snapshot => {
         snapshot.forEach((doc: any) => {
           console.log(doc.data().points);
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
   console.log(englishLeague.data());
    if(englishLeague.data()===undefined){
      return 0;
    }else{
      console.log(englishLeague.data().points);
      return englishLeague.data().points;
  }

  }

}
