import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(private router: Router,
              ) {
  }

  onSubmit(form: NgForm){
    this.router.navigateByUrl('online')
    form.reset();
  }






}
