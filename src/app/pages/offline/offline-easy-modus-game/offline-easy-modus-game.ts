import {Component} from '@angular/core';
import {DragulaService} from 'ng2-dragula';
import {Router} from '@angular/router';
import {OfflineService} from '../../../services/offlineservice';

@Component({
  selector: 'page-offline-easy-modus-game',
  templateUrl: 'offline-easy-modus-game.html',
  styleUrls: ['offline-easy-modus-game.scss'],
})


export class OfflineEasyModusGamePage {
  q1 = [];
  q13 = [];
  todo = {value: '', color: ''};
  selectedQuadrant = 'q1';
  vocNumber = 0;
  voc: string = '';

  constructor(private dragulaService: DragulaService,
              private offlineService: OfflineService,
              private router: Router) {

    this.voc = this.offlineService.actualVoc[this.vocNumber].trans;
    const splitvocArray = this.offlineService.actualVoc[this.vocNumber].voc.split('');
    for (let i = splitvocArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [splitvocArray[i], splitvocArray[j]] = [splitvocArray[j], splitvocArray[i]];
    }
    splitvocArray.forEach(item => {
      this.q1.push({value: item});
    });
    this.dragulaService.drag('')
      .subscribe(({name, el, source}) => {
        el.setAttribute('color', 'danger');
      });
  }

  addTodo() {
    this.vocNumber++;
    if (this.vocNumber < this.offlineService.actualVoc.length) {
      this.voc = this.offlineService.actualVoc[this.vocNumber].trans;
      this.q1 = [];
      const splitvocArray = this.offlineService.actualVoc[this.vocNumber].voc.split('');
      for (let i = splitvocArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [splitvocArray[i], splitvocArray[j]] = [splitvocArray[j], splitvocArray[i]];
      }
      splitvocArray.forEach(item => {
        this.q1.push({value: item});
      });
    } else {
      this.router.navigateByUrl('offline');
    }
  }
}
