// import firebase from 'firebase/app';

// import 'firebase/firestore'
// import 'firebase/auth'
import {Injectable} from "@angular/core";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
import {userProfile} from "../models/userProfile";
import {NameService} from "./name";
// import { Platform } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { AlertController, ToastController } from '@ionic/angular';



@Injectable()

export class AuthService {
  hier: boolean = false;
  idFromUsername: string;
  newReg: boolean = false;
  loggedIn: boolean = false;
  OfflineMenu: boolean;
  splash: boolean = true;
  constructor( private afAuth: AngularFireAuth,
               private fireStore: AngularFirestore,
               private nameService: NameService,
               private alertCtrl: AlertController,
               private toastController: ToastController
             ){
  }

  splashing(){
    setTimeout(() => {
      this.splash = false
    }, 4000);
  }

  signup(email: string, password: string, username: string) {
       return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

    async setUsername(username: string){
      const userProfileDocument: AngularFirestoreDocument<userProfile> = this.fireStore.doc(`userProfile/${this.nameService.getUserId()}`);

      await userProfileDocument.set({
        id: this.nameService.getUserId(),
        username: username});
    }



  async checkUsername(username: string): Promise<boolean>{
    return await new Promise<boolean>((resolve, reject) => {
       firebase.firestore().collection("userProfile").get().then(snapshot => {
         let isUsed: boolean = false;
        snapshot.forEach(doc => {
            if (doc.data().username == username) {
              isUsed = true;
            }
          }
        );
        resolve(isUsed);
      }).catch(err => {
        reject(err);
        console.log("Error getting documents", err);
      });
    })
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
        resolve(obj);
      });
    })
  }



  signin(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return firebase.auth().signOut();
  }

  getActiveUser() {
    return firebase.auth().currentUser;
  }

  private passwordReset(email: string) {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  async resetPassword() {
    let prompt = await this.alertCtrl.create({
      message: "Gib deine Email an um dein Passwort zu resetten",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Reset',
          handler: data => {
            this.passwordReset(data.email).
            then(() => this.presentToast('Es wurde eine Email verschickt an ihre angegebene Adresse')).
            catch(error => this.presentToast('ungültige Email Adresse'));
          }
        }
      ]
    });
    await prompt.present();
  }

  async presentToast(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }

//  googleLogin(){
//     if(this.platform.is('cordova')){
//       this.nativeGoogleLogin();
//     } else{
//       this.webGoogleLogin();
//     }
//  }




  //  async nativeGoogleLogin(): Promise<void> {
  //    try {

  //      const gplusUser = await this.gplus.login({
  //        'webClientId': '301583012596-c32nc1ai2h3iqt6jpnfbpansunrsseg8.apps.googleusercontent.com',
  //        'offline': true,
  //        'scopes': 'profile email'
  //      });
  //       console.log(gplusUser);
  //       await firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken));
  //      // await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken))

  //    } catch(err) {
  //      console.log(err)
  //    }
  //  }
 

//  async webGoogleLogin(): Promise<void> {
//     try {
//       const provider = new firebase.auth.GoogleAuthProvider();
//       console.log("tests");
//       console.log(provider);
//       await this.afAuth.auth.signInWithPopup(provider);
//     }catch (err) {
//       console.log(err);
//     }
//  }





}
