import { Storage } from "@ionic/storage";
import {Points} from "../models/points";
import {Injectable} from "@angular/core";

@Injectable()
export class LeaguePointsService {
  private points: Points;

  constructor(private storage: Storage){

  }

  addPunkte(num: number){
    if(this.loadPunkte().points==undefined){
      console.log("nichts");
    }
    else if(this.loadPunkte().points+num>0){
      this.setPunkte(num);
  }else{
      this.setPunkte(0);
    }}

    setPunkte(num: number){
    this.points = new Points();
    this.storage.set('punkte', this.points)
      .then()
      .catch(
        err=> {
          console.log(err);
        }
      )
    }

  loadPunkte(){
    return this.points;
  }

  fetchPunkte(){
    return this.storage.get('punkte')
      .then(
        (points: Points) => {
          return this.points;
        }
      )
      .catch(
        err => console.log(err)
      );
  }


}
