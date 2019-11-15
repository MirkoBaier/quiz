import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {VocubalarService} from '../../../services/vocubalar';
import {OfflineVoc} from '../../../models/offlineVoc';

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

  async removeItemFromList(voc: OfflineVoc) {
    await this.vocService.removeItemFrom(voc.time, voc.listName);
    await this.vocService.getOfflineDataListOne(voc.listName).then(res => this.offlineArrayListe = res);
  }

}
