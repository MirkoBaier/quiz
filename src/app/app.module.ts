import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { VokabelQuiz } from './app.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { OwnVocOnlineService } from './services/ownVocOnlineService';
import { OfflineService } from './services/offlineservice';
import { Network } from '@ionic-native/network/ngx';
import { NetworkService } from './services/networkservice';
import { TrainingsService } from './services/training';
import { FcmProvider } from './services/fcm';
import { Firebase } from '@ionic-native/firebase/ngx';
import { VocubalarService } from './services/vocubalar';
import { PointsService } from './services/points';
import { OneVoneService } from './services/oneVone';
import { NameService } from './services/name';
import { AuthService } from './services/auth';

import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';
// import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

var config = {
  apiKey: "AIzaSyBRSdQh2ebE4K8yaB9Gd3QeGmZoSB1DMw8",
  authDomain: "quiz-5e917.firebaseapp.com",
  databaseURL: "https://quiz-5e917.firebaseio.com",
  projectId: "quiz-5e917",
  storageBucket: "quiz-5e917.appspot.com",
  messagingSenderId: "301583012596"
};

@NgModule({
  declarations: [VokabelQuiz],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFirestoreModule,
    DragulaModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    NameService,
    OneVoneService,
    PointsService,
    VocubalarService,
    Firebase,
    FcmProvider,
    TrainingsService,
    NetworkService,
    Network,
    OfflineService,
    OwnVocOnlineService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [VokabelQuiz]
})
export class AppModule {}
