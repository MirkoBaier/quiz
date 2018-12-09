import {Component, ViewChild} from '@angular/core';
import {MenuController, NavController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';



import {AuthService} from "../services/auth";
import {SettingsPage} from "../pages/settings/settings";
import {AngularFireAuth} from "@angular/fire/auth";
import {OneVoneService} from "../services/oneVone";
import {NameService} from "../services/name";


@Component({
  templateUrl: 'app.html'
})
export class VokabelQuiz {
  rootPage:any;
  isAuthenticated = false;
  @ViewChild('nav') nav: NavController;
  afAuth: AngularFireAuth;
  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    afAuth: AngularFireAuth,
    private authService: AuthService,
    private menuCtrl: MenuController,
    private oneVoneService: OneVoneService,
    private nameService: NameService) {
    this.afAuth = afAuth;
    afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.nameService.getUsername().then(res => {
          this.rootPage = 'HomePage';
          console.log(res);
        }).catch(err => {
          console.log('Error' + err);
          this.rootPage = 'NamePage';
          }
        )
      }
      else{
        this.isAuthenticated = false;
        this.rootPage = 'LoginPage';
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }



  onLogout() {
    this.authService.logout();
    this.menuCtrl.close();
    this.nav.setRoot('LoginPage');
  }

  onSettings() {
    this.nav.push('SettingsPage');
  }

}

