import {Injectable} from "@angular/core";
import { IVocList } from '../models/IVocList';
import { IModus } from '../models/IModus';

@Injectable()
export class OfflineService{
 actualVoc: IVocList[] = [];

 setModus(modus: IModus): void {
     console.log('mod', modus);
     this.actualVoc.forEach((voc, index) => {
        this.actualVoc[index].modus = modus;
     })
 }
}
