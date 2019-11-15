import { Component } from '@angular/core';
import { NavController} from '@ionic/angular';
import {NgForm} from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: 'page-username',
  templateUrl: 'username.html',
  styleUrls: ['username.scss']
})
export class UsernamePage {

  constructor(
    private router: Router) {
  }

  onStoreUsername(form: NgForm){

      this.router.navigateByUrl('online');

    }
}
