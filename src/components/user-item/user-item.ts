import { Component, Input } from '@angular/core';
import { UtilProvider } from 'providers/util/util';
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { NavController } from 'ionic-angular';

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

  constructor(public util: UtilProvider,
  private steemActions: SteeemActionsProvider,
  private navCtrl: NavController) {}

  /**
   * Method to follow the current user
   */
  private follow() {
    this.is_loading = true;
    this.steemActions.dispatch_follow(this.item.name).then(data => {
      this.is_loading = false;
      this.item.has_followed = true;
    });
  }

  /**
   * Method to unfollow the current user
   */
  private unfollow() {
    this.is_loading = true;
    this.steemActions.dispatch_unfollow(this.item.name).then(data => {
      this.is_loading = false;
      this.item.has_followed = false;
    });
  }

  /**
   * Method to open author profile page
   * @param {String} author: author of the post
   */
  private openProfile(): void {
    this.navCtrl.push('AuthorProfilePage', {
      author: this.item.name
    })
  }

}
