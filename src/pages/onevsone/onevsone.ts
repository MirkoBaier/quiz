import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AuthService} from "../../services/auth";
import {EnglishLeaguePage} from "../english-league/english-league";
import {FrenchLeaguePage} from "../french-league/french-league";
import {LatinLeaguePage} from "../latin-league/latin-league";
import {SpanishLeaguePage} from "../spanish-league/spanish-league";
import {OneVoneService} from "../../services/oneVone";
import {checkNoChangesNode} from "@angular/core/src/view/view";

/**
 * Generated class for the OnevsonePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-onevsone',
  templateUrl: 'onevsone.html',
})
export class OnevsonePage {
  users: any[];
  oldUsers: any[];
  constructor(public oneVoneService:  OneVoneService,public authService: AuthService, public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit(){
    this.authService.getDocuments("userProfile").then(users=> {
      this.users = users;
      this.oldUsers= users;
      })
  }

  initializeItems(){
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

  onLoadpage(user: any){
   this.oneVoneService.addGame(user, false);
  }
}
