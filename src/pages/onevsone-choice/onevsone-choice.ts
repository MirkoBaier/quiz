import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {VocubalarService} from "../../services/vocubalar";
import {OwnVoc} from "../../models/ownVoc";


@IonicPage()
@Component({
  selector: 'page-onevsone-choice',
  templateUrl: 'onevsone-choice.html',
})
export class OnevsoneChoicePage {
  private ITEM_NAME:string = 'ITEM';
  listName: string = "";
  Vocabulary: OwnVoc[] = [];

  constructor(private navCtrl: NavController, private storage: Storage, private vocService: VocubalarService) {
  }


  ionViewWillEnter(){
    this.storage.get(this.ITEM_NAME).then(res => {
      if(JSON.parse(res)[0]!=undefined) {
        this.listName = JSON.parse(res)[0].listName;
        this.Vocabulary = JSON.parse(res);
      }
    });
  }

  onLoadpage(){
    this.navCtrl.push('OnevsonePage')
  }

  ownVoc(){
    this.vocService.choseOwnVoc(true);
    this.navCtrl.push('OnevsonePage')
  }

  createOwnVocabulary(){
    this.navCtrl.push('CreateVocPage')
  }

}
