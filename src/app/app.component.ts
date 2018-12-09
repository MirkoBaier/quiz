import {Component, ViewChild} from '@angular/core';
import {MenuController, NavController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';



import {AuthService} from "../services/auth";
import {LoginPage} from "../pages/login/login";
import {SettingsPage} from "../pages/settings/settings";
import * as firebase from 'firebase';
import {UsernamePage} from "../pages/username/username";
import {AngularFireAuth} from "@angular/fire/auth";
import {HomePage} from "../pages/home/home";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  isAuthenticated = false;
  @ViewChild('nav') nav: NavController;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    afAuth: AngularFireAuth,
    private authService: AuthService,
    private menuCtrl: MenuController){
    afAuth.authState.subscribe(user =>{
      if(user){
          this.isAuthenticated = true;
          this.rootPage = HomePage;
      }else {
        this.isAuthenticated = false;
        this.rootPage = LoginPage;
      }
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit(){

  }

  onLogout() {
    this.authService.logout();
    this.menuCtrl.close();
    this.nav.setRoot(LoginPage);
  }

  onSettings() {
    this.nav.push(SettingsPage);
  }

}

