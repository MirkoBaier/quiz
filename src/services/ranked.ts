import {Injectable} from "@angular/core";
import { Storage} from "@ionic/storage";

@Injectable()
export class RankedService{
  constructor(private storage: Storage){

  }
}
