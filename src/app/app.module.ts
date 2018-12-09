import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage'


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {AuthService} from "../services/auth";
import {LoginPage} from "../pages/login/login";
import {RegistrationPage} from "../pages/registration/registration";
import {SettingsPage} from "../pages/settings/settings";
import {AccountsService} from "../services/accounts";
import {LeaguePage} from "../pages/league/league";
import {EnglishLeaguePage} from "../pages/english-league/english-league";
import {FrenchLeaguePage} from "../pages/french-league/french-league";
import {LatinLeaguePage} from "../pages/latin-league/latin-league";
import {SpanishLeaguePage} from "../pages/spanish-league/spanish-league";
import {LeagueGamePage} from "../pages/league-game/league-game";
import {LeaguePointsService} from "../services/leaguePoints";
import {RankedService} from "../services/ranked";
import {UsernamePage} from "../pages/username/username";
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule} from 'angularfire2/auth';

import * as firebase from 'firebase';
import {AngularFireModule} from "@angular/fire";
import {AngularFirestoreModule} from "@angular/fire/firestore";
import {NameService} from "../services/name";
import {OnevsonePage} from "../pages/onevsone/onevsone";
import {OneVoneService} from "../services/oneVone";
import {OnevsoneGamePage} from "../pages/onevsone-game/onevsone-game";

// firebase.initializeApp(firebaseConfig);
var config = {
  apiKey: "AIzaSyBRSdQh2ebE4K8yaB9Gd3QeGmZoSB1DMw8",
  authDomain: "quiz-5e917.firebaseapp.com",
  databaseURL: "https://quiz-5e917.firebaseio.com",
  projectId: "quiz-5e917",
  storageBucket: "quiz-5e917.appspot.com",
  messagingSenderId: "301583012596"
};
// firebase.initializeApp(config);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegistrationPage,
    SettingsPage,
    LeaguePage,
    EnglishLeaguePage,
    FrenchLeaguePage,
    LatinLeaguePage,
    SpanishLeaguePage,
    LeagueGamePage,
    UsernamePage,
    OnevsonePage,
    OnevsoneGamePage
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
    HomePage,
    LoginPage,
    RegistrationPage,
    SettingsPage,
    LeaguePage,
    EnglishLeaguePage,
    FrenchLeaguePage,
    LatinLeaguePage,
    SpanishLeaguePage,
    LeagueGamePage,
    UsernamePage,
    OnevsonePage,
    OnevsoneGamePage
  ],
  providers: [
    AuthService,
    StatusBar,
    SplashScreen,
    AccountsService,
    LeaguePointsService,
    RankedService,
    NameService,
    OneVoneService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
