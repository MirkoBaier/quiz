import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
// import * as firebase from 'firebase/app';
// import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs';

@Injectable()
export class NameService{
  userId: string;
  userName: string;
  private ngUnsubscribe: Subject<void> = new Subject();

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
    this.userName = userProfile.data().username;
    return userProfile.data().username;
  }



  getUserId(): string{
    return this.userId
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
