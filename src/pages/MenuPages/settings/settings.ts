import { UtilProvider } from 'providers/util/util';
import { Component } from '@angular/core';
import { IonicPage, ToastController, NavParams, AlertController, MenuController, Platform } from 'ionic-angular';
import { SettingsProvider } from 'providers/settings/settings';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  public upvote = 1;
  public language;
  private currency;
  selected: String;
  availableThemes: { className: string, prettyName: string }[];

  constructor(public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private platform: Platform,
    private storage: Storage,
    private statusBar: StatusBar,
    public menu: MenuController,
    private _settings: SettingsProvider,
    public util: UtilProvider) {

    // now we're setting the selected property asynchronously, based
    // on the behavior of our observable theme in SettingsService
    this._settings.getTheme().subscribe(val => this.selected = val);
    // similarly, as promised, we've moved availableThemes to SettingsService,
    // and therefore need to call that property here
    this.availableThemes = this._settings.availableThemes;

    this.language = [
      'en_US'
    ]
    this.currency = [
      'USD'
    ]
  }

  ionViewDidLoad() {
    this.util.getVoteValue().then(data => {
      this.upvote = (data as any) || 1;
    })
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    this.menu.enable(true);
  }

  onChangeUpvote(value) { }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Successfully Saved',
      subTitle: 'Your settings have been successfully saved 😎',
      buttons: ['OK']
    });
    alert.present();
  }
  saveSettings() {
    this.util.setVoteValue(this.upvote);
    this.presentAlert();
  }

  // We're finally wiring in some change communication, which will allow us to
  // interact with our form, and see some changes in the theme.
  public setTheme(e) {
    this.platform.ready().then(() => {

      if (e === 'dark-theme') {
        this.statusBar.backgroundColorByHexString("#1d252c");
      }

      else if (e === 'blue-theme') {
        this.statusBar.backgroundColorByHexString("#488aff");
      }
      this.storage.set('theme', e);

      this._settings.setTheme(e);
      let toast = this.toastCtrl.create({
        message: 'Theme was changed successfully 😎',
        duration: 2000,
        position: 'bottom'
      });

      toast.present();

    });




  }

}
