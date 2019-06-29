import {Component, ViewChild} from '@angular/core';
import {Events, LoadingController, MenuController, NavController, Platform} from '@ionic/angular';
import {AngularFireAuth} from "@angular/fire/auth";
import {OneVoneService} from "./services/oneVone";
import {NameService} from "./services/name";
import {ConnectionStatusEnum, NetworkService} from "./services/networkservice";
import { AuthService } from './services/auth';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { timer } from 'rxjs/internal/observable/timer';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class VokabelQuiz {
  rootPage: any;
  isAuthenticated = false;
  @ViewChild('nav') nav: NavController;
  afAuth: AngularFireAuth;
  showSplash = true;
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              afAuth: AngularFireAuth,
              public authService: AuthService,
              private menuCtrl: MenuController,
              private oneVoneService: OneVoneService,
              private nameService: NameService,
              public events: Events,
              public network: Network,
              public networkProvider: NetworkService,
              public loadingCtrl: LoadingController,
              private router: Router) {

    this.afAuth = afAuth;
    this.networkProvider.initializeNetworkEvents();

    this.events.subscribe('network:online', () => {
      if(this.isAuthenticated==true){
        this.rootPage = 'OfflinePage'
      }
    });


    afAuth.authState.subscribe(user => {
      if (user) {
        console.log('user');
        this.authService.loggedIn = true;
        this.isAuthenticated = true;
        this.nameService.getUsername().then(res => {
        this.router.navigateByUrl('home')
        }).catch(err => {
            console.log('Error' + err);
          console.log(this.authService.newReg);
            if(this.authService.newReg==true){
              console.log("go into Name");
            this.router.navigateByUrl('name')
            }
            else if (this.networkProvider.previousStatus == ConnectionStatusEnum.Offline) {
              this.router.navigateByUrl('login')
            }else{
              this.router.navigateByUrl('name')
            }
          }
        )
      }
      else {
        this.authService.loggedIn = false;
        this.isAuthenticated = false;
        this.rootPage = 'OfflinePage';
      }
    });

    platform.ready().then(() => {

      statusBar.styleDefault();
      splashScreen.hide();
      timer(3000).subscribe(() =>{ this.showSplash = false; this.authService.splash = false})

    });
  }

  logout() {
    this.authService.logout();
    this.menuCtrl.close();
    this.router.navigateByUrl('login');
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // onSettings() {
  //   this.nav.navigateForward('SettingsPage');
  // }

  onLoadOnline(){
    if(this.networkProvider.isOnline == true) {
      if (this.authService.loggedIn == false) {
        this.router.navigateByUrl('registration');
      } else {
        this.router.navigateByUrl('home');
      }
    }else{

    }
  }

  onLoadOffline() {
    this.router.navigateByUrl('offline');
  }

}

