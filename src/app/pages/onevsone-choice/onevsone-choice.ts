import { Component } from '@angular/core';
import {  NavController } from '@ionic/angular';
import {Storage} from "@ionic/storage";
import {VocubalarService} from "../../services/vocubalar";
import {OwnVoc} from "../../models/ownVoc";
import {OneVoneService} from "../../services/oneVone";
import { Router } from '@angular/router';

@Component({
  selector: 'page-onevsone-choice',
  templateUrl: 'onevsone-choice.html',
})
export class OnevsoneChoicePage {
  private ITEM_NAME:string = 'ITEM';
  listName: string = "";
  Vocabulary: OwnVoc[] = [];
  isToggled: boolean;

  constructor(private router: Router,
              private storage: Storage, 
              private vocService: VocubalarService,
              private oneVoneService: OneVoneService) {
      this.isToggled = false;
  }


  ionViewWillEnter(){
    this.storage.get(this.ITEM_NAME).then(res => {
      if(JSON.parse(res)[0]!=undefined) {
        this.listName = JSON.parse(res)[0].listName;
        this.Vocabulary = JSON.parse(res);
      }
    });
  }

  onLoadpage(language: string){
    this.oneVoneService.isToggled = this.isToggled;
    this.oneVoneService.language = language;
    this.router.navigateByUrl('oneVsOne')
  }

  ownVoc(){
    this.vocService.choseOwnVoc(true);
    this.router.navigateByUrl('oneVsOne');
  }

  createOwnVocabulary(){
    this.router.navigateByUrl('offline');
  }

}
