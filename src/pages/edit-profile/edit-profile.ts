import { UtilProvider } from 'providers/util/util';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { BrowserTab } from '@ionic-native/browser-tab';
import { Component, Input } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  AlertController,
  LoadingController,
  MenuController
} from 'ionic-angular';
import { SettingsProvider } from 'providers/settings/settings';
import { Subscription } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  private account_data;
  chosenTheme: string;
  subs: Subscription;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public util: UtilProvider,
    private steemia: SteemiaProvider,
    private _settings: SettingsProvider,
    private browserTab: BrowserTab,
    public menu: MenuController,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController) {

    this.account_data = this.navParams.get('steem_account_data');
    this.subs = this._settings.getTheme().subscribe(val => this.chosenTheme = val);

  }

  private saveInfo(input, value) {
    this.browserTab.isAvailable()
      .then((isAvailable: boolean) => {

        if (isAvailable) {

          this.browserTab.openUrl('https://steemconnect.com/sign/profile-update?' + input + '=' + value);

        } else {

          // open URL with InAppBrowser instead or SafariViewController

        }

      });
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    this.subs.unsubscribe();
    this.menu.enable(true);
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

  public showPrompt(input) {
    let prompt = this.alertCtrl.create({
      title: 'Submit your ' + input,
      message: "Click the Save button below to be redirected to SteemConnect to complete your transaction.",
      inputs: [
        {
          name: 'title',
          placeholder: 'Submit your ' + input + ' here'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
            console.log(data);
            this.saveInfo(input, data.title);
          }
        }
      ]
    });
    prompt.present();
  }

}
