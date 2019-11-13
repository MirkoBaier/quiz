import {Component, ViewChild} from '@angular/core';
import {ActionSheetController, AlertController, PickerController } from '@ionic/angular';
import {AuthService} from "../../services/auth";
import {NetworkService} from "../../services/networkservice";
import {VocubalarService} from "../../services/vocubalar";
import {OfflineVoc} from "../../models/offlineVoc";
import {OfflineService} from "../../services/offlineservice";
import { Router } from '@angular/router';
import { IModus } from '../../models/IModus';
import { NameService } from '../../services/name';
import { PickerOptions, PickerButton } from '@ionic/core';
import { Modus } from '../../services/modus';

//  "pre-commit": "npm run lint",
// "pre-push": "npm run test"
@Component({
  selector: 'page-offline',
  templateUrl: 'offline.html',
  styleUrls: ['offline.scss'],
})
export class OfflinePage {
  @ViewChild('input') myInput;

  inputvoc: string;
  inputtrans: string;
  listName: string;
  private voclist: boolean = true;
  offlineArrayTemp = [];
  offlineArrayList = [];
  public minimizing: boolean = true;
  // framework = '';
  // selected = ['','',''];

  constructor(public authService: AuthService,
              private netService: NetworkService,
              private vocService: VocubalarService,
              private offlineService: OfflineService,
              public actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private router: Router,
              private networkService: NetworkService,
              private nameService: NameService,
              private pickerCtrl: PickerController
              ) {

  }

  ionViewWillEnter() {
    // setTimeout(() => {
    //   this.myInput.setFocus();
    // },400);
    //alle Vokabeln
    this.vocService.getOfflineData().then(res => {
        if (res != null) {
          this.offlineArrayTemp = res;
        }
      }
    );
    //nicht alle Vokabeln
    this.vocService.getOfflineDataList().then(res => {
      if(res!=null){
        this.offlineArrayList = res;
      }
    })
    this.networkService.onlineScreen = false;
  }

  openList(listName: string){
    this.vocService.actualListName = listName;
    this.router.navigateByUrl('vocList');
  }

  async removeListe(list: string, time: string){
    await this.vocService.removeList(list, time).then(() => this.vocService.getOfflineDataList().then(res => {
      this.offlineArrayList = res;
    }));

    await this.vocService.getOfflineDataList().then(res => {
      this.offlineArrayList = res;
    })
  }

  minimize(is: boolean){
    this.minimizing = is;
  }

  ionViewDidLoad() {
    this.authService.splashing();
    this.authService.OfflineMenu = true;
  }

  goReg() {
    if (this.netService.isOnline == true) {
      if (this.authService.loggedIn == false) {
        this.router.navigateByUrl('registration');
      } else {
        this.router.navigateByUrl('home');
      }
    } else {

    }
  }

  vocliste(voc: boolean) {
    this.voclist = voc;
  }

  //Vokabel hinzufügen
  async test() {
    if(this.listName !== undefined && this.inputtrans !== undefined && this.inputvoc !== undefined){
    let OfflineArray = [];
    let Offline = new OfflineVoc(this.inputvoc, this.inputtrans, this.listName, 0, 0, 0, new Date().toString());
    OfflineArray.push(Offline);
    await this.vocService.setOfflineVoc(OfflineArray).then(() => {
      this.vocService.getOfflineDataList().then(res => this.offlineArrayList = res);
      this.inputtrans = "";
      this.inputvoc = "";
      this.vocliste(false);
      setTimeout(() => {
        this.myInput.setFocus();
      },400);
    });
    }
  }

  test2(){
    setTimeout(() => {
      this.myInput.setFocus();
    },400);
    console.log("tset2");
  }

  async startVoc(voc: OfflineVoc){
    await this.vocService.getOfflineDataListOne(voc.listName).then(res => this.offlineService.actualVoc = res );
    this.presentActionSheet();
    /*this.navCtrl.push("OfflineGamePage")*/
  }

  remove() {
    this.vocService.removeOffline();
  }

  async presentActionSheet() {
    this.router.navigateByUrl('game-decision');
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: 'Modus auswählen',
  //     buttons: [
  //       {
  //         text: 'Vokabelliste Online lernen',
  //         role: 'destructive',
  //         handler: () => {
  //           this.vocService.actualModus = Modus.online;
  //           console.log('tests', this.nameService.userId);
  //           if(this.nameService.userId === undefined) {
  //             this.showYouNeedLoggedInAlert();
  //           }
  //           else if(this.offlineService.actualVoc.length >= 10) {
  //             this.chooseOnlineModus()
  //           } else {
  //             this.showAlert(10);
  //           }
  //         }
  //       },
  //       {
  //         text: 'Vokabel zu Übersetzung',
  //         role: 'destructive',
  //         handler: () => {
  //           this.vocService.actualModus = Modus.vocToTran;
  //           this.router.navigateByUrl('offlineGame');;
  //         }
  //       }, {
  //         text: 'Übersetzung zu Vokabel',
  //         handler: () => {
  //           this.vocService.actualModus = Modus.tranToVoc;
  //           this.router.navigateByUrl('offlineGame');
  //         }
  //       },
  //       {
  //         text: 'Training: Vokabel zu Übersetzung',
  //         handler: () => {
  //           this.vocService.actualModus = Modus.trainingVocToTran;
  //           if(this.offlineService.actualVoc.length >= 4) {
  //             this.router.navigateByUrl('offlineTrainingsGame');
  //           }else{
  //             this.showAlert(4);
  //           }
  //         }},
  //       {
  //         text: 'Training: Übersetzung zu Vokabel',
  //         handler: () => {
  //           this.vocService.actualModus = Modus.trainingTranToVoc;
  //           if(this.offlineService.actualVoc.length >=4) {
  //             this.router.navigateByUrl('offlineTrainingsGame');
  //           }else{
  //             this.showAlert(4);
  //           }
  //         }
  //       },
  //       // {
  //       //   text: 'Training: Easy Modus',
  //       //   handler: () => {
  //       //     this.vocService.actualModus = '5';
  //       //     if(this.offlineService.actualVoc.length >=4) {
  //       //       this.router.navigateByUrl('offlineEasyModusGame');
  //       //     }else{
  //       //       this.showAlert();
  //       //     }
  //       //   }
  //       // },
  //       {
  //         text: 'Zurück',
  //         role: 'cancel',
  //         handler: () => {

  //         }
  //       }
  //     ]
  //   });
  //    actionSheet.present();
  // }

  // async chooseOnlineModus() {
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: 'Modus auswählen',
  //     buttons: [
  //       {
  //         text: 'Vokabeltest (Fremdsprache zu Übersetzung)',
  //         role: 'destructive',
  //         handler: () => {
  //           this.offlineService.setModus(IModus.normalModus);
  //           this.router.navigateByUrl('oneVsOne');
  //         }
  //       },
  //       // {
  //       //   text: '4 Möglichkeiten (Fremdsprache zu Übersetzung)',
  //       //   role: 'destructive',
  //       //   handler: () => {
  //       //     this.offlineService.setModus(IModus.trainingsModus);
  //       //     this.router.navigateByUrl('oneVsOne');
  //       //   }
  //       // }, 
  //       {
  //         text: 'Zurück',
  //         role: 'cancel',
  //         handler: () => {
  //         !@#
  //         }
  //       }
  //     ]
  //   });
  //    actionSheet.present();
  }

  async showAlert(num: number) {
    const alert = await this.alertCtrl.create({
      header: 'Fehler!',
      subHeader: 'Du benötigst mindestens ' + num + ' Vokabeln für den Modus',
      buttons: ['OK'],
      cssClass: `alert-head`,
    });
    alert.present();
  }

  async showYouNeedLoggedInAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Fehler!',
      subHeader: 'Du musst eingeloggt sein, um online zu spielen',
      buttons: ['OK'],
      cssClass: `alert-head`,
    });
    alert.present();
  }

  openStats(list: string) {
    this.vocService.actualListName = list;
    this.router.navigateByUrl('statsOffline');
  }


  // multiColumnOptions = [
  //   [
  //     'Minified',
  //     'Responsive',
  //     'Full Stack',
  //     'Mobile First',
  //     'Serverless'
  //   ],
  //   [
  //     'Tomato',
  //     'Avocado',
  //     'Onion',
  //     'Potato',
  //     'Artichoke'
  //   ]
  // ]


  
  // async showBasicPicker() {
  //   let opts: PickerOptions = {
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel'
  //       },
  //       {
  //         text: 'Done'
  //       }
  //     ],
  //     columns: [
  //       {
  //         name: 'framework',
  //         options: [
  //           { text: 'Angular', value: 'A' },
  //           { text: 'Vue', value: 'B' },
  //           { text: 'React', value: 'C' }
  //         ]
  //       }
  //     ]
  //   };
  //   let picker = await this.pickerCtrl.create(opts);
  //   picker.present();
  //   picker.onDidDismiss().then(async data => {
  //     let col = await picker.getColumn('framework');
  //     this.framework = col.options[col.selectedIndex].text;
  //   });
  // }
 
  // async showAdvancedPicker() {
  //   let opts: PickerOptions = {
  //     cssClass: 'academy-picker',
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel'
  //       },
  //       {
  //         text: 'Done',
  //         cssClass: 'special-done'
  //       }
  //     ],
  //     columns: [
  //       {
  //         name: 'game',
  //         options: [
  //           { text: 'Dota', value: 'dota' },
  //           { text: 'WoW', value: 'wow' },
  //           { text: 'CS', value: 'cs' }
  //         ]
  //       },
  //       {
  //         name: 'category',
  //         options: [
  //           { text: 'MOBA', value: 'MOBA' },
  //           { text: 'MMORPG', value: 'MMORPG' }
  //         ]
  //       },
  //       {
  //         name: 'rating',
  //         options: [
  //           { text: 'Good', value: 1 },
  //           { text: 'Very Good', value: 2 },
  //           { text: 'Excellent', value: 3 }
  //         ]
  //       }
  //     ]
  //   };
  //   let picker = await this.pickerCtrl.create(opts);
  //   picker.present();
  //   picker.onDidDismiss().then(async data => {
  //     let game = await picker.getColumn('game');
  //     let cat = await picker.getColumn('category');
  //     let rating = await picker.getColumn('rating');
  //     this.selected = [
  //       game.options[game.selectedIndex].text, 
  //       cat.options[cat.selectedIndex].text,
  //       rating.options[rating.selectedIndex].text
  //     ];
  //   });
  // }
}
  

