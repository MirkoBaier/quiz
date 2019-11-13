import {Component} from '@angular/core';
import { LoadingController } from '@ionic/angular';
import {AuthService} from "../../services/auth";
import {OneVoneService} from "../../services/oneVone";
import {NameService} from "../../services/name";
import {TrainingsService} from "../../services/training";
import {VocubalarService} from "../../services/vocubalar";
import {OwnVocOnlineService} from "../../services/ownVocOnlineService";
import { Router } from '@angular/router';
import { IModus } from '../../models/IModus';
import { Modus } from '../../services/modus';

@Component({
  selector: 'page-onevsone',
  templateUrl: 'onevsone.html',
  styleUrls: ['onevsone.scss']
})
export class OnevsonePage {
  users: any[];
  oldUsers: any[];
  onlyFriends: boolean = true;
  showEnemys: boolean = false;

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
  }


  initializeItems() {
    this.oneVoneService.allPlayer = this.oldUsers;
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

   async showAllPlayer() {
    this.showEnemys = !this.showEnemys;

    if( this.oneVoneService.allPlayer === undefined ) { 
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
      this.oneVoneService.allPlayer = users;
      this.oldUsers = users;
      loading.dismiss();
    })
    }
  }

  onLoadpage(user: any) {
    if (this.vocService.actualModus == Modus.online) {
      this.ownVocOnlineService.addGame(user);
    }
    else if (this.oneVoneService.choiceModus === IModus.legacyNormalModus) {
      this.oneVoneService.addGame(user, false)
    } else {
      this.trainingsService.addGame(user);
    }
    this.vocService.actualModus = Modus.none;
    this.setHome();
  }

  async randomEnemy() {
    if (this.oneVoneService.choiceModus === IModus.legacyNormalModus) {
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
    if (this.vocService.actualModus == Modus.online) {
      this.onlyFriends = false
    } else {
      this.onlyFriends = true;
    }
  }
}
