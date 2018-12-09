export class OwnVoc{
  constructor(voc: string, trans: string, listName: string) {
    this.voc = voc;
    this.trans = trans;
    this.listName = listName;
  }

  id: number;
  voc: string;
  trans: string;
  listName: string;

}
