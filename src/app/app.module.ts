import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage'


import {VokabelQuiz} from './app.component';
import {AuthService} from "../services/auth";
import { AngularFireAuthModule} from 'angularfire2/auth';


import {AngularFireModule} from "@angular/fire";
import {AngularFirestoreModule} from "@angular/fire/firestore";
import {NameService} from "../services/name";
import {OneVoneService} from "../services/oneVone";
import {PointsService} from "../services/points";
import {VocubalarService} from "../services/vocubalar";


var config = {
  apiKey: "AIzaSyBRSdQh2ebE4K8yaB9Gd3QeGmZoSB1DMw8",
  authDomain: "quiz-5e917.firebaseapp.com",
  databaseURL: "https://quiz-5e917.firebaseio.com",
  projectId: "quiz-5e917",
  storageBucket: "quiz-5e917.appspot.com",
  messagingSenderId: "301583012596"
};


@NgModule({
  declarations: [
    VokabelQuiz
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(VokabelQuiz),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    VokabelQuiz
  ],
  providers: [
    AuthService,
    StatusBar,
    SplashScreen,
    NameService,
    OneVoneService,
    PointsService,
    VocubalarService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
