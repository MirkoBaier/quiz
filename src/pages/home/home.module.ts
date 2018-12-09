import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import {AngularFireModule} from "@angular/fire";
import {AngularFireAuthModule} from "@angular/fire/auth";
import {AngularFirestoreModule} from "@angular/fire/firestore";

var config = {
  apiKey: "AIzaSyBRSdQh2ebE4K8yaB9Gd3QeGmZoSB1DMw8",
  authDomain: "quiz-5e917.firebaseapp.com",
  databaseURL: "https://quiz-5e917.firebaseio.com",
  projectId: "quiz-5e917",
  storageBucket: "quiz-5e917.appspot.com",
  messagingSenderId: "301583012596"
};

@NgModule({
  declarations: [HomePage],
  imports: [IonicPageModule.forChild(HomePage),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFirestoreModule],
  exports: [HomePage]
})
export class HomePageModule {

}
