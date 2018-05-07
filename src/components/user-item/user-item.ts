import { Component, Input } from '@angular/core';
import { UtilProvider } from 'providers/util/util';
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { App, NavController } from 'ionic-angular';
import { AlertsProvider } from 'providers/alerts/alerts';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';

/**
 * Class for user item
 * 
 * @author Jayser Mendez
 * @version 0.0.1
 */

@Component({
  selector: 'user-item',
  templateUrl: 'user-item.html'
})
export class UserItemComponent {

  @Input('item') private item: any;
  private is_loading: boolean = false;

  constructor(private app: App,
    public util: UtilProvider,
  private steemActions: SteeemActionsProvider,
  private alerts: AlertsProvider,
  private steemConnect: SteemConnectProvider,
  private navCtrl: NavController) {}

  /**
   * Method to follow the current user
   */
  private follow() {
    this.is_loading = true;
    this.steemActions.dispatch_follow(this.item.name).then(data => {
      this.is_loading = false;
      if (data === 'not-logged') {
        this.alerts.display_alert('NOT_LOGGED_IN');
      }

      else {
        this.item.has_followed = true;
      }
    });
  }

  /**
   * Method to unfollow the current user
   */
  private unfollow() {
    this.is_loading = true;
    this.steemActions.dispatch_unfollow(this.item.name).then(data => {
      this.is_loading = false;
      if (data === 'not-logged') {
        this.alerts.display_alert('NOT_LOGGED_IN');
      }
      else {
        this.item.has_followed = false;
      }
    });
  }

  /**
   * Method to open author profile page
   * @param {String} author: author of the post
   */
  private openProfile(author: string): void {
    if (this.steemConnect.user_object !== undefined) {
      if ((this.steemConnect.user_object as any).user == author) {
        this.app.getRootNav().push('ProfilePage', {
          author: (this.steemConnect.user_object as any).user
        });
      }
      else {
        this.app.getRootNav().push('AuthorProfilePage', {
          author: author
        });
      }
    }
    else {
      this.app.getRootNav().push('AuthorProfilePage', {
        author: author
      });
    }
    
  }

}
