import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage'


import { MyApp } from './app.component';
import {AuthService} from "../services/auth";
import {SettingsPage} from "../pages/settings/settings";
import {LeaguePage} from "../pages/league/league";
import {EnglishLeaguePage} from "../pages/english-league/english-league";
import {LeagueGamePage} from "../pages/league-game/league-game";
import {UsernamePage} from "../pages/username/username";
import { AngularFireAuthModule} from 'angularfire2/auth';

import * as firebase from 'firebase';
import {AngularFireModule} from "@angular/fire";
import {AngularFirestoreModule} from "@angular/fire/firestore";
import {NameService} from "../services/name";
import {OnevsonePage} from "../pages/onevsone/onevsone";
import {OneVoneService} from "../services/oneVone";
import {OnevsoneGamePage} from "../pages/onevsone-game/onevsone-game";
import {LoginPage} from "../pages/login/login";

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
    MyApp,
    SettingsPage,
    LeaguePage,
    EnglishLeaguePage,
    LeagueGamePage,
    UsernamePage,
    OnevsonePage,
    OnevsoneGamePage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SettingsPage,
    LeaguePage,
    EnglishLeaguePage,
    LeagueGamePage,
    UsernamePage,
    OnevsonePage,
    OnevsoneGamePage,
    LoginPage
  ],
  providers: [
    AuthService,
    StatusBar,
    SplashScreen,
    NameService,
    OneVoneService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
