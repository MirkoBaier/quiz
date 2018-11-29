import { Storage} from "@ionic/storage";
import {Injectable} from "@angular/core";
import {Account} from "../models/account";

declare var cordova: any;
@Injectable()
export class AccountsService {
  private accounts: Account;

  constructor(private storage: Storage){}

  addName(name: string){
    const account = new Account(name);
    this.accounts = account;
    this.storage.set('account', this.accounts)
      .then()
      .catch(
       err => {
          console.log(err);
    }
      );
  }

  loadName(){
    return this.accounts;
  }

  fetchNames(){
    return this.storage.get('account')
      .then(
        (accounts: Account) => {
          return this.accounts;
        }
      )
      .catch(
        err => console.log(err)
      );
  }
}
