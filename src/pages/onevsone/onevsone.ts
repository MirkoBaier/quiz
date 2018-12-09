import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AuthService} from "../../services/auth";
import {OneVoneService} from "../../services/oneVone";



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
