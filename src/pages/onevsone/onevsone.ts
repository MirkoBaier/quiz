import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {AuthService} from "../../services/auth";
import {OneVoneService} from "../../services/oneVone";
import {NameService} from "../../services/name";


@IonicPage()
@Component({
  selector: 'page-onevsone',
  templateUrl: 'onevsone.html',
})
export class OnevsonePage {
  users: any[];
  oldUsers: any[];
  constructor(private oneVoneService:  OneVoneService,private authService: AuthService, private navCtrl: NavController, private nameService: NameService) {
  }

  async ngOnInit(){
    //Alle User werden angezeigt ausnahme er selber
    let username = await this.nameService.getUsername();
    await this.authService.getDocuments("userProfile").then(users=> {
      for(let i = users.length - 1; i >= 0; i--) {
        if(users[i].username === username) {
          users.splice(i, 1);
        }
      }
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
   this.navCtrl.setRoot('HomePage')
  }
}
