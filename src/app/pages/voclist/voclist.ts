import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import {VocubalarService} from "../../services/vocubalar";
import {OfflineVoc} from "../../models/offlineVoc";
import { Router } from '@angular/router';

@Component({
  selector: 'page-voclist',
  templateUrl: 'voclist.html',
  styleUrls: ['voclist.scss'],
})
export class VoclistPage {
  offlineArrayListe = [];


  constructor(private router: Router, private  vocService: VocubalarService) {
  }

  ionViewWillEnter() {
    this.vocService.getOfflineDataListOne(this.vocService.actualListName).then(res => this.offlineArrayListe = res);
  }

  async removeItemFromList(voc: OfflineVoc){
    await this.vocService.removeItemFrom(voc.time, voc.listName);
    await this.vocService.getOfflineDataListOne(voc.listName).then(res => this.offlineArrayListe = res);
  }

}
