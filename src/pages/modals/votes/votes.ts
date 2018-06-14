import { Component } from '@angular/core';
import {
  App,
  IonicPage,
  ViewController,
  NavController,
  NavParams,
  Events,
  MenuController
} from 'ionic-angular';
import { PostsRes } from 'models/models';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { UtilProvider } from 'providers/util/util';
import { SettingsProvider } from 'providers/settings/settings';
import { Subscription } from 'rxjs';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';

@IonicPage({
  priority: 'medium'
})
@Component({
  selector: 'page-votes',
  templateUrl: 'votes.html',
})
export class VotesPage {

  private slice: number = 25;
  private is_more: boolean = true;

  private author: string;
  private permlink: string;
  private votes: any;
  private is_loading = true;
  private no_content = false;
  chosenTheme: string;
  subs: Subscription;

  constructor(private app: App,
    private steemConnect: SteemConnectProvider,
    public navCtrl: NavController,
    private events: Events,
    public navParams: NavParams,
    public util: UtilProvider,
    private _settings: SettingsProvider,
    public menu: MenuController,
    public viewCtrl: ViewController,
    private steemia: SteemiaProvider) {

    this.subs = this._settings.getTheme().subscribe(val => this.chosenTheme = val);

    // Subscribe to an event to dismiss modals when event is fired
    this.events.subscribe('dismiss-modals', () => {
      this.navCtrl.popToRoot().then(() => {
        this.viewCtrl.dismiss();
      });
    });
  }

  ionViewDidLoad() {
    this.votes = this.navParams.get('votes');

    if (this.votes.length < 1) {
      this.no_content = true;
    }

    if (this.slice > this.votes.length) {
      this.is_more = false;
    }

    this.votes = this.votes;

    // Set the loading spinner to false
    this.is_loading = false

  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.subs.unsubscribe();
    this.menu.enable(true);
  }

  /**
   * Infinite scroll to load more comments
   * @param infiniteScroll 
   */
  private load_more(infiniteScroll) {
    setTimeout(() => {

      this.slice += 25;

      if (this.slice > this.votes.length) {
        this.is_more = false;
      }
      infiniteScroll.complete();

    }, 50);
  }

  /**
   * Method to close the current modal
   */
  private dismiss(): void {
    this.viewCtrl.dismiss();
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
        this.app.getActiveNavs()[0].push('AuthorProfilePage', {
          author: author
        });
      }
    }
    else {
      this.app.getActiveNavs()[0].push('AuthorProfilePage', {
        author: author
      });
    }

  }

}
