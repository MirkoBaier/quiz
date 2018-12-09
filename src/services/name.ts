import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
import * as firebase from 'firebase/app';


@Injectable()
export class NameService{
  userId: string;


  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(user => {
      if(user) {
        this.userId = user.uid;
      }
    })
  }

  async getUsername(): Promise<string> {
    const userProfile: firebase.firestore.DocumentSnapshot = await firebase.firestore()
      .doc(`userProfile/${this.userId}`).get();

    return userProfile.data().username;
  }



  getUserId(): string{
    return this.userId
  }


}
