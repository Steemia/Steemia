import { UtilProvider } from 'providers/util/util';
import { Component } from '@angular/core';
import { IonicPage, ToastController, NavParams, AlertController, MenuController, Platform } from 'ionic-angular';
import { SettingsProvider } from 'providers/settings/settings';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  public upvote = 1;
  public language = 'en';
  public claim: boolean = false;
  private currency = 'USD';
  selected: String;
  availableThemes: { className: string, prettyName: string }[];

  constructor(public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private platform: Platform,
    private storage: Storage,
    private statusBar: StatusBar,
    private translate: TranslateService,
    public menu: MenuController,
    private _settings: SettingsProvider,
    public util: UtilProvider) { }

  ionViewDidLoad() {

    // now we're setting the selected property asynchronously, based
    // on the behavior of our observable theme in SettingsService
    this._settings.getTheme().subscribe(val => this.selected = val);
    // similarly, as promised, we've moved availableThemes to SettingsService,
    // and therefore need to call that property here
    this.availableThemes = this._settings.availableThemes;

    this.util.getVoteValue().then(data => {
      this.upvote = (data as any) || 1;
    });

    this.storage.get('currency').then(data => {
      if (data) {
        this.currency = data;
      } else {
        this.currency = 'USD'
      }
    });
  
    this.storage.get('auto_claim').then(data => {
      if (data) {
        this.claim = data;
      } else {
        this.claim = false;
      }     
    });
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  onChangeUpvote(value) {
    this.util.setVoteValue(this.upvote);
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Successfully Saved',
      subTitle: 'Your settings have been successfully saved 😎',
      buttons: ['OK']
    });
    alert.present();
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
        message: this.translate.instant('generic_messages.theme-saved'),
        duration: 2000,
        position: 'bottom'
      });

      toast.present();

    });
  }

  /**
   * Method to update the current selected currency
   * @param event 
   */
  updateCurrencyValue(event): void {
    this.storage.set('currency', event).then(() => {
      let toast = this.toastCtrl.create({
        message: this.translate.instant('generic_messages.currency-saved'),
        duration: 2000,
        position: 'bottom'
      });

      toast.present();
    });
  }

  /**
   * Method to auto-claim rewards
   */
  autoClaim(): void {
    this.storage.set('auto_claim', this.claim);
  }

  /**
   * Method to update language
   * @param event  
   */
  updateLanguage(event): void {
    this.storage.set('language', event).then(() => {
      let toast = this.toastCtrl.create({
        message: this.translate.instant('generic_messages.language-saved'),
        duration: 2000,
        position: 'bottom'
      });

      this.translate.use(this.language);

      toast.present();
    })
  }

}
