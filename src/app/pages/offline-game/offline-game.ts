import {Component, ViewChild} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {OfflineService} from "../../services/offlineservice";
import {VocubalarService} from "../../services/vocubalar";
import {NgForm} from "@angular/forms";
import {animate, state, style, transition, trigger} from "@angular/animations";
import { Router } from '@angular/router';
import { Modus } from '../../services/modus';

@Component({
  selector: 'page-offline-game',
  templateUrl: 'offline-game.html',
  styleUrls: ['offline-game.scss'],
  animations: [
    trigger('myvisibility' ,[
      state('visible', style ({
        opacity: 1
      })),
      state('invisible', style({
        opacity: 0
      })),
      transition('invisible => visible', animate('0.8s'))
    ])
  ]
})
export class OfflineGamePage {
  @ViewChild('input') myInput;

  iscorr: boolean = false;
  actVoc = [];
  voc: string = "";
  trans: string = "";
  userTrans: string = "";
  counter;
  visibleState = 'invisible';
  actualModus: Modus;
  showMaxLength: number;
  private correctCounter: number = 0;

  constructor(private offlineService: OfflineService, 
              private vocService: VocubalarService,
              private alertController: AlertController,
              private router: Router) {
   
               this.actualModus = this.vocService.actualModus;
  }

  ionViewWillEnter() {
    this.counter = 0;
    this.actVoc = this.offlineService.actualVoc;
    this.actVoc.length < 10 ? this.showMaxLength = this.actVoc.length : this.showMaxLength = 10;

    this.actVoc.forEach((item, index) => {
      const j = Math.floor(Math.random() * (index + 1));
      [this.offlineService.actualVoc[index], this.offlineService.actualVoc[j]] = [this.offlineService.actualVoc[j], this.offlineService.actualVoc[index]];
    })

    this.setNextVoc();
  }


  ionViewDidLoad(){
    setTimeout(() => {
      this.myInput.setFocus();
    },500);
  }

  async checkCorrect(form: NgForm){
    if(this.userTrans == this.trans || this.userTrans+"" == this.trans){
      this.correct();
    }else{
     this.false();
    }

    this.counter++;
    this.checkEnd();
    this.setNextVoc();
    this.userTrans = '';
  }


  private checkEnd() {
    if(this.actVoc[this.counter] === undefined || this.counter === 10) {
      this.vocService.setCorrectCounter(this.correctCounter);
      this.vocService.setMaxCounter(this.actVoc.length)
      this.router.navigateByUrl('statsOffline');
    }
  }

  private setNextVoc() {
    if(this.actVoc[this.counter]!=undefined) {
      if(this.vocService.actualModus == Modus.vocToTran) {
        this.voc = this.actVoc[this.counter].voc;
        this.trans = this.actVoc[this.counter].trans;
      }else if(this.vocService.actualModus == Modus.tranToVoc){
        this.trans = this.actVoc[this.counter].voc;
        this.voc = this.actVoc[this.counter].trans;
      }
    }
  }

  private correct() {
    let TIME_IN_MS = 500;

    this.visibleState = (this.visibleState == 'invisible') ? 'visible' : 'invisible';
      setTimeout( () => {
        this.visibleState = 'invisible'
      }, TIME_IN_MS);
      setTimeout(() => {
        this.myInput.setFocus();
      },400);

      this.correctCounter++;
  }

  private async false() {
    const alert = await this.alertController.create({
      header: 'Falsche Übersetzung',
      subHeader: 'Deine Überstzung: ' + this.userTrans + '| Richtig wäre: ' + this.trans + ' --> ' + this.voc,
      buttons: [
        {
          text: 'Verstanden',
          handler: () => {
            setTimeout(() => {
              this.myInput.setFocus();
            },400);
          }
        }
      ],
      cssClass: `alert-head`,
    });
    alert.present();
  }

}
