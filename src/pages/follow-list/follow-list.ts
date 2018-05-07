import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { UtilProvider } from 'providers/util/util';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';

/**
 * Following/followers page
 * @author Jayser Mendez
 * @version 0.0.1
 */

@IonicPage()
@Component({
  selector: 'page-follow-list',
  templateUrl: 'follow-list.html',
})
export class FollowListPage {

  private username: string = '';
  private title: string = '';
  private data: Array<Object> = [];
  private limit: number = 100;
  private start_user: string = '';
  private loading: boolean = true;
  private is_more_post: boolean = true;

  constructor(private app: App,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menu: MenuController,
    private util: UtilProvider,
    private steemConnect: SteemConnectProvider,
    private steemiaProvider: SteemiaProvider) {

  }

  ionViewWillLoad(): void {
    this.username = this.navParams.get('Username');
    this.title = this.navParams.get('Title');
    this.fetchData();
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    this.menu.enable(true);
  }

  fetchData(event?: any): void {
    if (this.title === 'Followers') {
      this.steemiaProvider.dispatch_followers(this.username,this.limit, this.start_user).then(data => {
        if ((data as any).results.length === 0) {
          this.is_more_post = false;
        }
        this.data = this.data.concat((data as any).results);
        this.start_user = (data as any).offset;
        this.loading = false;
        if (event) {
          event.complete();
        }
      });
    }

    else if (this.title === 'Following') {
      this.steemiaProvider.dispatch_following(this.username,this.limit, this.start_user).then(data => {
        if ((data as any).results.length === 0) {
          this.is_more_post = false;
        }
        this.data = this.data.concat((data as any).results);
        this.start_user = (data as any).offset;
        this.loading = false;
        if (event) {
          event.complete();
        }
      });
    }
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