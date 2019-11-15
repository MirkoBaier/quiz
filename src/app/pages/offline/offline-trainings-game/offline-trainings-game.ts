import {Component} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Router} from '@angular/router';
import {OfflineService} from '../../../services/offlineservice';
import {VocubalarService} from '../../../services/vocubalar';
import {Modus} from '../../../services/modus';

@Component({
  selector: 'page-offline-trainings-game',
  templateUrl: 'offline-trainings-game.html',
  styleUrls: ['offline-trainings-game.scss'],
  animations: [
    trigger('myvisibility', [
      state('visible', style({
        opacity: 1
      })),
      state('invisible', style({
        opacity: 0
      })),
      transition('invisible => visible', animate('0.5s'))
    ])
  ]
})
export class OfflineTrainingsGamePage {
  yoloItem: string[] = [];
  translate: string = '';
  counter: number = 0;
  points: number = 0;
  visibleState = 'invisible';
  voc: string = '';

  constructor(public router: Router,
              private offlineService: OfflineService,
              private alertController: AlertController,
              private vocService: VocubalarService) {
  }

  ionViewWillEnter() {
    for (let i = this.offlineService.actualVoc.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.offlineService.actualVoc[i], this.offlineService.actualVoc[j]] = [this.offlineService.actualVoc[j], this.offlineService.actualVoc[i]];
    }
    this.setRandomVocForSpecificModus();
    this.mixVocabulary();
  }

  onLoadNext(userChoice) {
    if (userChoice === this.voc) {
      this.points++;
      this.visibleState = (this.visibleState == 'invisible') ? 'visible' : 'invisible';
      setTimeout(() => {
        this.visibleState = 'invisible';
      }, 500);
    } else {
      this.showRightAnswerAlert(userChoice);
    }
    if (this.counter >= 10 || this.counter >= this.offlineService.actualVoc.length - 1) {
      this.router.navigateByUrl('offline');
    }

    this.counter++;

    for (let i = this.offlineService.actualVoc.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.offlineService.actualVoc[i], this.offlineService.actualVoc[j]] = [this.offlineService.actualVoc[j], this.offlineService.actualVoc[i]];
    }
    this.setRandomVocForSpecificModus();

    this.mixVocabulary();

  }

  mixVocabulary() {
    for (let i = 0; i <= this.yoloItem.length - 1; i++) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.yoloItem[i], this.yoloItem[j]] = [this.yoloItem[j], this.yoloItem[i]];
    }
  }

  async showRightAnswerAlert(userChoice) {
    const alert = await this.alertController.create({
      header: 'Falsche Übersetzung',
      subHeader: 'Deine Überstzung: ' + userChoice + ' |Richtig wäre: ' + this.translate + ' --> ' + this.voc,
      buttons: [
        {
          text: 'Verstanden',
          handler: () => {

          }
        }
      ],
      cssClass: `alert-head`,
    });
    alert.present();
  }

  setRandomVocForSpecificModus() {
    console.log('hierda', this.vocService.actualModus, Modus.trainingVocToTran, Modus.trainingTranToVoc);
    if (this.vocService.actualModus == Modus.trainingVocToTran) {
      console.log('1');
      this.voc = this.offlineService.actualVoc[0].trans;
      this.translate = this.offlineService.actualVoc[0].voc;
      this.yoloItem[0] = this.offlineService.actualVoc[0].trans;
      this.yoloItem[1] = this.offlineService.actualVoc[1].trans;
      this.yoloItem[2] = this.offlineService.actualVoc[2].trans;
      this.yoloItem[3] = this.offlineService.actualVoc[3].trans;
    } else if (this.vocService.actualModus == Modus.trainingTranToVoc) {
      console.log('2');
      this.voc = this.offlineService.actualVoc[0].voc;
      this.translate = this.offlineService.actualVoc[0].trans;
      this.yoloItem[0] = this.offlineService.actualVoc[0].voc;
      this.yoloItem[2] = this.offlineService.actualVoc[2].voc;
      this.yoloItem[1] = this.offlineService.actualVoc[1].voc;
      this.yoloItem[3] = this.offlineService.actualVoc[3].voc;
    }
  }

}
