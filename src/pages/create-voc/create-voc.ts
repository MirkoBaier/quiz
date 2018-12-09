import { Component } from '@angular/core';
import {AlertController, IonicPage} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {OwnVoc} from "../../models/ownVoc";
import {VocubalarService} from "../../services/vocubalar";


@IonicPage()
@Component({
  selector: 'page-create-voc',
  templateUrl: 'create-voc.html',
})
export class CreateVocPage {
  Vocabulary: OwnVoc[] = [];
  listName: string;
  constructor(private alertCtrl: AlertController, private vocService: VocubalarService) {

  }

  async ionViewWillEnter(){
   await this.vocService.getVocInit();
    this.Vocabulary = this.vocService.Vocabulary;
    this.listName = this.vocService.listName;
  }

 async changeName(){
   await this.showPrompt();
   this.Vocabulary = this.vocService.Vocabulary;
   this.listName = this.vocService.listName;
  }

   remove(voc: OwnVoc){
    const position = this.Vocabulary.findIndex((vocEl: OwnVoc) => {
      return (vocEl.id == voc.id);
    });
    this.Vocabulary.splice(position, 1);
    this.vocService.removeVocItem(this.Vocabulary);
  }

  helpMe(){
    const alert = this.alertCtrl.create({
      title: 'Achtung!',
      subTitle: 'Mindestens 10 Vokabeln notwendig. Wische nach links um eine Vokabel zu entfernen.' +
        ' Es ist nur eine eigene Vokabelliste verfügbar',
      buttons: ['OK']
    });
    alert.present();
  }

   async addVocabulary(form: NgForm){
      await this.vocService.setVoc(form);
      this.Vocabulary = this.vocService.Vocabulary;
      this.listName = this.vocService.listName;
      form.reset();

  }

  async showPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'Name der Liste',
      message: "Ändere den Namen der Vokabelliste",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Save',
          handler: data => {
          this.handlePrompt(data);
          }
        }
      ]
    });
    prompt.present();
  }

  async handlePrompt(data: any){
    this.listName = data.title;
    this.vocService.getVocInit();
    let ownVocabulary = this.vocService.Vocabulary;
    if(ownVocabulary.length>0) {
      for (let i = (ownVocabulary.length-1); i >= 0; i--) {
        ownVocabulary[i].listName = data.title;
      }
    }else {
      let vocu = new OwnVoc("Nach Links wischen","", data.title);
      vocu.id = 0;
      ownVocabulary.push(vocu);
    }
    this.vocService.removeVocItem(ownVocabulary);

  }

}
