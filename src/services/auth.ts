
import 'firebase/firestore';
import * as firebase from 'firebase';
import {Injectable} from "@angular/core";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
import {userProfile} from "../models/userProfile";
import {Points} from "../models/points";




@Injectable()

export class AuthService {
  hier: boolean = false;
  resi: Points[] = [];
  idFromUsername: number;
  constructor( public afAuth: AngularFireAuth,
               public fireStore: AngularFirestore){
  }

  async signup(email: string, password: string, username: string): Promise<firebase.User> {
    await this.checkUsername(username);
    if(this.hier){
    try{
      const user: firebase.auth.UserCredential = await this.afAuth.auth
        .createUserWithEmailAndPassword(
          email,password
        );
      const userProfileDocument: AngularFirestoreDocument<userProfile> = this.fireStore.doc(`userProfile/${user.user.uid}`);

      await userProfileDocument.set({
        id: user.user.uid,
        email: email,
        username: username});

      return user.user;
    }catch (error) {
      console.log(error)
    }
  }
    else{
      console.log("username belegt");
    }
  }

    async checkUsername(username: string){
      await firebase.firestore().collection("userProfile").get()
      .then(snapshot => {
        this.hier = true;
        snapshot.forEach(doc => {
          if (doc.data().username == username) {
            this.hier = false;
            return;
          }
        }
        );
      }).catch(err => {
      console.log("Error getting documents", err);
    });
  }

  async getUserIdByUsername(username: string){
    await firebase.firestore().collection("userProfile").get()
      .then(snapshot => {
        snapshot.forEach(doc => {
        if(doc.data().username == username){
            this.idFromUsername = doc.data().id;
        }
      })
  });
}



  getDocuments(collectionObj: string) :Promise<any>{
    let obj : any = [];
     return new Promise(resolve => {
      firebase.firestore().collection(collectionObj).get().then(snapshot => {
        snapshot.forEach((doc: any) => {
          obj.push({
            username: doc.data().username
          })
        });
      });
      resolve(obj);
    })
  }



  signin(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    firebase.auth().signOut();
  }

  getActiveUser() {
    return firebase.auth().currentUser;
  }







}
