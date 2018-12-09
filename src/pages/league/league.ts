import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-league',
  templateUrl: 'league.html',
})
export class LeaguePage {
  searchQuery: string = '';
  items: string[];

  constructor(private navCtrl: NavController) {
    this.initializeItems();
  }

  initializeItems() {
    this.items = [
      'Englisch'
      // 'Spanisch',
      // 'Französisch',
      // 'Latein'
    ];
  }


  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  onLoadpage(page: any){
    if(page == "Englisch"){
      this.navCtrl.push('EnglishLeaguePage');
    // } else if(page == "Französisch"){
    //   this.navCtrl.push('FrenchLeaguePage');
    // } else if(page == "Latein"){
    //   this.navCtrl.push('LatinLeaguePage');
    // } else if(page == "Spanisch"){
    //   this.navCtrl.push('SpanishLeaguePage');
    }

  }

}
