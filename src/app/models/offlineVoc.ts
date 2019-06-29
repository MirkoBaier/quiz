export class OfflineVoc{
  constructor(voc: string, trans: string, listName: string, right: number, falsch: number, factor: number, time: string){
    this.voc = voc;
    this.trans = trans;
    this.listName = listName;
    this.right = right;
    this.falsch = falsch;
    this.factor = factor;
    this.time = time;
}
  voc: string;
  trans: string;
  listName: string;
  right: number;
  falsch: number;
  factor: number;
  time: string;
}
