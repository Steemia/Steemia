import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { SettingsProvider } from 'providers/settings/settings';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-reply-comment',
  templateUrl: 'reply-comment.html',
})
export class ReplyCommentPage {

  subs: Subscription;
  chosenTheme: string;
  private reply;

  constructor(public viewCtrl: ViewController, 
    public navParams: NavParams,
    private _settings: SettingsProvider) {

      this.subs = this._settings.getTheme().subscribe(val => this.chosenTheme = val);
  }

  ionViewDidLeave(): void {
    this.subs.unsubscribe();
  }

  /**
   * Method to dismiss the current modal
   */
  private dismiss() {
    this.viewCtrl.dismiss();
  }

  /**
   * Method to close modal with data passed to last component
   */
  private save() {
    this.viewCtrl.dismiss({
      status: true,
      reply: this.reply
    });
  }

}
