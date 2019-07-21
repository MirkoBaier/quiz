import { Component } from '@angular/core';
import {Storage} from "@ionic/storage";
import {OwnVoc} from "../../models/ownVoc";
import {OneVoneService} from "../../services/oneVone";
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { IModus } from '../../models/IModus';

@Component({
  selector: 'page-onevsone-choice',
  templateUrl: 'onevsone-choice.html',
})
export class OnevsoneChoicePage {
  private ITEM_NAME:string = 'ITEM';
  listName: string = "";
  Vocabulary: OwnVoc[] = [];
  modus: IModus;
  choiceModus: IModus;

  constructor(private router: Router,
              private storage: Storage, 
              private actionSheetController: ActionSheetController,
              private oneVoneService: OneVoneService) {
      
  }


  ionViewWillEnter(){
    this.storage.get(this.ITEM_NAME).then(res => {
      if(JSON.parse(res)[0]!=undefined) {
        this.listName = JSON.parse(res)[0].listName;
        this.Vocabulary = JSON.parse(res);
      }
    });
  }

  onLoadpage(language: string, modus: IModus){
    this.oneVoneService.choiceModus = modus;
    this.oneVoneService.language = language;
    this.router.navigateByUrl('oneVsOne')
  }

  createOwnVocabulary(){
    this.router.navigateByUrl('offline');
  }

  async presentActionSheet(language: string) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Modus wählen',
      buttons: [{
        text: 'Vokabeltest',
        role: 'destructive',
        handler: () => {
          this.onLoadpage(language, IModus.legacyNormalModus);
        }
      }, {
        text: 'Trainingsmodus',
        handler: () => {
          this.onLoadpage(language, IModus.legacyTrainingsModus);
        }
      }]
    });
    await actionSheet.present();
  }

}
