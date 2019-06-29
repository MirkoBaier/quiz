import {Component} from '@angular/core';
import { LoadingController } from '@ionic/angular';
import {AuthService} from "../../services/auth";
import {OneVoneService} from "../../services/oneVone";
import {NameService} from "../../services/name";
import {TrainingsService} from "../../services/training";
import {VocubalarService} from "../../services/vocubalar";
import {OwnVocOnlineService} from "../../services/ownVocOnlineService";
import { Router } from '@angular/router';

@Component({
  selector: 'page-onevsone',
  templateUrl: 'onevsone.html',
  styleUrls: ['onevsone.scss']
})
export class OnevsonePage {
  users: any[];
  oldUsers: any[];
  onlyFriends: boolean = true;

  constructor(private oneVoneService: OneVoneService,
              private authService: AuthService,
              private router: Router,
              private nameService: NameService,
              private trainingsService: TrainingsService,
              private loadingCtrl: LoadingController,
              private vocService: VocubalarService,
              private ownVocOnlineService: OwnVocOnlineService) {
  }

  async ngOnInit() {
    this.setOnlyFriends();

    //Alle User werden angezeigt ausnahme er selber
    let loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    loading.present();
    let username = await this.nameService.getUsername();
    await this.authService.getDocuments("userProfile").then(users => {
      for (let i = users.length - 1; i >= 0; i--) {
        if (users[i].username === username) {
          users.splice(i, 1);
        }
      }
      this.users = users;
      this.oldUsers = users;
      loading.dismiss();
    })
  }


  initializeItems() {
    this.users = this.oldUsers;
  }


  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();
    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.users = this.users.filter((item) => {
        return (item.username.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  onLoadpage(user: any) {
    if (this.vocService.actualModus == '0') {
      this.ownVocOnlineService.addGame(user);
    }
    else if (this.oneVoneService.isToggled == false) {
      this.oneVoneService.addGame(user, false)
    } else {
      this.trainingsService.addGame(user);
    }
    this.vocService.actualModus = '-1';
    this.setHome();
  }

  async randomEnemy() {
    if (this.oneVoneService.isToggled == false) {
      await this.oneVoneService.addRandomGame(this.oneVoneService.language)
    } else {
      await this.trainingsService.addRandomGame(this.oneVoneService.language);
    }
    this.setHome();
  }

  private setHome() {
    this.router.navigateByUrl('home')
  }

  private setOnlyFriends() {
    if (this.vocService.actualModus == '0') {
      this.onlyFriends = false
    } else {
      this.onlyFriends = true;
    }
  }
}
