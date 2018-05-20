import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { AlertsProvider } from 'providers/alerts/alerts';
import { Subscription } from 'rxjs';
import { SettingsProvider } from 'providers/settings/settings';
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
  selector: 'page-edit-comment',
  templateUrl: 'edit-comment.html',
})
export class EditCommentPage {

  private comment: any;
  private comment_body: string;
  chosenTheme: string;
  subs: Subscription;

  constructor(public viewCtrl: ViewController,
    public navParams: NavParams,
    private translate: TranslateService,
    private alerts: AlertsProvider,
    public menu: MenuController,
    private _settings: SettingsProvider,
    private loadingCtrl: LoadingController,
    private steemActions: SteeemActionsProvider,
  ) {

    this.subs = this._settings.getTheme().subscribe(val => this.chosenTheme = val);

    this.comment = this.navParams.get('comment');
    this.comment_body = this.comment.raw_body;
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    this.subs.unsubscribe();
    this.menu.enable(true);
  }

  private save() {
    let loading = this.loadingCtrl.create({
      content: this.translate.instant('generic_messages.please_wait')
    });
    loading.present();
    this.steemActions.dispatch_edit_comment(this.comment.parent_author, this.comment.url, this.comment_body).then(res => {
      if (res === 'not-logged') {
        this.show_prompt(loading, 'NOT_LOGGED_IN');
        return;
      }

      else if (res === 'Correct') {
        loading.dismiss();
        this.dismiss('correct');
      }

      else if (res === 'COMMENT_INTERVAL') {
        this.show_prompt(loading, 'COMMENT_INTERVAL');
      }
    });
  }

  private dismiss(data: string) {
    this.viewCtrl.dismiss({
      data: data
    });
  }

  private show_prompt(loader, msg) {
    loader.dismiss();
    setTimeout(() => {
      this.alerts.display_alert(msg);
    }, 500);
  }

  /**
  * function to adjust the height of the message textarea
  * @param {any} event - the event, which is provided by the textarea input
  * @return {void} 
  */
  protected adjustTextarea(event: any): void {
    let textarea: any = event.target;
    textarea.style.overflow = 'hidden';
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    return;
  }

  protected preventEnter(event: any): void {
    event.preventDefault();
  }

}
