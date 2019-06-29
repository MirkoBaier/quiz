import {Storage} from "@ionic/storage";
import {OwnVoc} from "../models/ownVoc";
import {NgForm} from "@angular/forms";
import {Injectable} from "@angular/core";
import {OfflineVoc} from "../models/offlineVoc";

@Injectable()
export class VocubalarService {
  ownVocChosen: boolean = false;
  private ITEM_NAME: string = 'ITEM';
  private OFFLINE_VOC: string = 'OFFLINE_VOC';
  private OFFLINE_VOC_List: string = 'OFFLINE_VOC_List';
  listName: string;
  Vocabulary: OwnVoc[] = [];
  actualListName: string;
  actualModus: string;

  constructor(private storage: Storage) {

  }


  removeOffline() {
    this.storage.remove(this.OFFLINE_VOC_List);
    this.storage.remove(this.OFFLINE_VOC);
  }

  async removeList(listnamen: string, time: string) {
    await this.storage.get(this.OFFLINE_VOC).then(res => {
      let helpArray = [];
      for (let i = 0; i < res.length; i++) {
        if (res[i].time == time) {
        } else {
          helpArray.push(res[i])
        }
      }
      this.storage.set(this.OFFLINE_VOC, helpArray)
    });
    await this.storage.get(this.OFFLINE_VOC_List).then(rest => {
      let helpArray2 = [];
      for (let i = 0; i < rest.length; i++) {
        if (rest[i].time == time) {
        } else {
          helpArray2.push(rest[i]);
        }
      }
      this.storage.set(this.OFFLINE_VOC_List, helpArray2);
    });
  }

  async removeList2(listnamen: string) {
    await this.storage.get(this.OFFLINE_VOC_List).then(rest => {
      let helpArray2 = [];
      for (let i = 0; i < rest.length; i++) {
        if (rest[i].listName == listnamen) {
        } else {
          helpArray2.push(rest[i]);
        }
      }
      this.storage.set(this.OFFLINE_VOC_List, helpArray2);
    });
  }

  async setOfflineVoc(offlineVoc: OfflineVoc[]) {
    let isNotIn = false;
    await this.storage.get(this.OFFLINE_VOC).then(value => {
      if (value != null) {
        this.storage.set(this.OFFLINE_VOC, offlineVoc.concat(value));
        for (let i = 0; i < value.length; i++) {
          if (value.filter(obj => obj.listName == offlineVoc[0].listName)[i]) {
            isNotIn = true;
          }
        }
      }
      //erstes Item
      else {
        isNotIn = true;
        this.storage.set(this.OFFLINE_VOC, offlineVoc);
        this.storage.set(this.OFFLINE_VOC_List, offlineVoc);
      }
    });
    if (isNotIn == false) {
      await this.storage.get(this.OFFLINE_VOC_List).then(voclist => {
          this.storage.set(this.OFFLINE_VOC_List, offlineVoc.concat(voclist));
        }
      );
    }
  }

  async getOfflineData() {
    let obj = [];
    return await this.storage.get(this.OFFLINE_VOC).then(value => {
      obj.push(value);
      return value;
    });
  }

  async getOfflineDataList() {
    let obj = [];
    return await this.storage.get(this.OFFLINE_VOC_List).then(value => {
      obj.push(value);
      return value;
    });
  }

  async getOfflineDataListOne(name: string) {
    let obj = [];
    return await this.storage.get(this.OFFLINE_VOC).then(value => {
      for (let i = 0; i < value.length; i++) {
        if (value[i].listName == name) {
          obj.push(value[i]);
        }
      }
      return obj;
    });
  }

  async removeItemFrom(name: string, listnamen: string) {
    await this.storage.get(this.OFFLINE_VOC).then(res => {
      let helpArray = [];
      let helpbooli = true;
      //Ein Item aus allen wird rausgefiltert => in helpArray gespeichert
      for (let i = 0; i < res.length; i++) {
        if (res[i].time == name) {
        } else {
          helpArray.push(res[i])
        }
      }
      //Das neue helpArray wird gestzt
      this.storage.set(this.OFFLINE_VOC, helpArray).then(() => {
        this.getOfflineDataList().then(rest => {
              for (let i = 0; i < rest.length; i++) {
                console.log(helpArray[i]);
                if (helpArray[i] != undefined) {
                  if (helpArray[i].listName == listnamen) {
                    helpbooli = false;
                  }
                }
              }
            console.log(helpbooli);
            if (helpbooli == true) {
              this.removeList2(res[0].listName)
            }
          }
        );
      })
    });
  }


  choseOwnVoc(booli: boolean) {
    this.ownVocChosen = booli;
  }

  set(datastring: string, is: boolean) {
    this.storage.set(datastring, is);
  }

  get(datastring: string) {
    this.storage.get(datastring);
  }


  async setVoc(form: NgForm) {
    let helpArr: OwnVoc[] = [];
    let vocu = new OwnVoc(form.value.voc, form.value.trans, form.value.listName);
    await this.storage.get(this.ITEM_NAME).then((v) => {
      if (v != null) {
        helpArr = (JSON.parse(v));
        if (helpArr.length > 1) {
          vocu.id = (helpArr[helpArr.length - 1].id + helpArr[helpArr.length - 1].id + 1);
        } else if (helpArr.length == 1) {
          vocu.id = 2;
        } else {
          vocu.id = 1;
        }
      }
    });


    if (form.value.listName == undefined) {
      vocu.listName = this.listName;
    } else {
      this.listName = form.value.listName;
    }
    helpArr.push(vocu);
    this.storage.set(this.ITEM_NAME, JSON.stringify(helpArr));
    this.Vocabulary = helpArr;
  }

  async getVocInit() {
    await this.storage.get(this.ITEM_NAME).then((v) => {
      if (v != null) {
        this.Vocabulary = JSON.parse(v);
        if (JSON.parse(v)[0] != undefined) {
          this.listName = JSON.parse(v)[0].listName;
        }
      }
    });
  }

  removeVocItem(Vocabulary: OwnVoc[]) {
    this.storage.remove(this.ITEM_NAME);
    this.storage.set(this.ITEM_NAME, JSON.stringify(Vocabulary));
  }

}
