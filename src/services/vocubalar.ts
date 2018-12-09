import {Storage} from "@ionic/storage";
import {OwnVoc} from "../models/ownVoc";
import {NgForm} from "@angular/forms";
import {Injectable} from "@angular/core";

@Injectable()
export class VocubalarService{
  ownVocChosen: boolean = false;
  private ITEM_NAME:string = 'ITEM';
  listName: string;
  Vocabulary: OwnVoc[] = [];

  constructor(private storage: Storage) {

  }

  choseOwnVoc(booli: boolean){
    this.ownVocChosen = booli;
  }



  async setVoc(form: NgForm){
    let helpArr: OwnVoc[] = [];
    let vocu = new OwnVoc(form.value.voc, form.value.trans, form.value.listName);
    await this.storage.get(this.ITEM_NAME).then((v) => {
      if (v != null){
        helpArr =  (JSON.parse(v));
        if(helpArr.length>1) {
          vocu.id = (helpArr[helpArr.length -1].id+helpArr[helpArr.length - 1].id+1);
        }else if(helpArr.length==1){
          vocu.id = 2;
        }else {
          vocu.id = 1;
        }
      }
    });


    if(form.value.listName==undefined){
      vocu.listName = this.listName;
    }else{
      this.listName = form.value.listName;
    }
    helpArr.push(vocu);
    this.storage.set(this.ITEM_NAME, JSON.stringify(helpArr));
    this.Vocabulary = helpArr;
  }

  async getVocInit(){
   await this.storage.get(this.ITEM_NAME).then((v) => {
      if (v != null) {
        this.Vocabulary = JSON.parse(v);
        if(JSON.parse(v)[0]!=undefined) {
          this.listName = JSON.parse(v)[0].listName;
        }
      }
    });
  }

  removeVocItem(Vocabulary: OwnVoc[]){
    this.storage.remove(this.ITEM_NAME);
    this.storage.set(this.ITEM_NAME, JSON.stringify(Vocabulary));
  }

}
