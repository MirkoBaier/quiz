import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
// import * as firebase from 'firebase/app';
// import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import * as firebase from 'firebase/app';
import {userProfile} from '../models/userProfile';
import {Storage} from '@ionic/storage';

@Injectable()
export class NameService {
  userId: string;
  userName: string;
  name: string = 'NAME';

  constructor(private firestore: AngularFirestore,
              private afAuth: AngularFireAuth,
              private storage: Storage) {
    afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  async getUsername() {
    const userProfile: firebase.firestore.DocumentSnapshot = await firebase.firestore()
      .doc(`userProfile/${this.userId}`).get();
    this.userName = userProfile.data().username;
    console.log(this.userName, 'usi');
    return userProfile.data().username;
  }

  async setUsername(username: string) {
    const userProfileDocument: AngularFirestoreDocument<userProfile> = this.firestore.doc(`userProfile/${this.getUserId()}`);

    await userProfileDocument.set({
      id: this.getUserId(),
      username: username
    });

    this.setUsernameToLocalStorage(username);
  }

  setUsernameToLocalStorage(username: string) {
    this.storage.set(this.name, username);
    console.log('hiho', this.getUsernameFromLocalStorage());
  }

  async getUsernameFromLocalStorage() {
    let varName: string;
    await this.storage.get(this.name).then(username => {
      varName = username;
    }).catch(varName = null);
    console.log('tset234', varName);

    return varName;
  }

  getUserId(): string {
    return this.userId;
  }
}
