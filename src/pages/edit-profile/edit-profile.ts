import { BrowserTab } from '@ionic-native/browser-tab';
import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private browserTab: BrowserTab,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController) {
  }

  private saveInfo(input, value) {
    this.browserTab.isAvailable()
    .then((isAvailable: boolean) => {

      if (isAvailable) {

        this.browserTab.openUrl('https://steemconnect.com/sign/profile-update?'+input+'='+value);

      } else {

        // open URL with InAppBrowser instead or SafariViewController

      }

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

  public showPrompt(input) {
    let prompt = this.alertCtrl.create({
      title: 'Edit your'+ input,
      message: "Click the Save button below to be redirected to SteemConnect to complete your transaction.",
      inputs: [
        {
          name: 'title',
          placeholder: 'Change Info'
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
