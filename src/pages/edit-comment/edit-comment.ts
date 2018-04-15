import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { AlertsProvider } from 'providers/alerts/alerts';

@IonicPage()
@Component({
  selector: 'page-edit-comment',
  templateUrl: 'edit-comment.html',
})
export class EditCommentPage {

  private comment: any;
  private comment_body: string;

  constructor(public viewCtrl: ViewController,
    public navParams: NavParams,
    private alerts: AlertsProvider,
    public menu: MenuController,
    private loadingCtrl: LoadingController,
    private steemActions: SteeemActionsProvider,
  ) {

    this.comment = this.navParams.get('comment');
    this.comment_body = this.comment.body;
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    this.menu.enable(true);
  }

  private save() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.steemActions.dispatch_edit_comment(this.comment.author, this.comment.url, this.comment_body).then(res => {
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
