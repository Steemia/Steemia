import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';
import { PostsRes } from 'models/models';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { UtilProvider } from 'providers/util/util';

@IonicPage({
  priority: 'medium'
})
@Component({
  selector: 'page-votes',
  templateUrl: 'votes.html',
})
export class VotesPage {

  private slice: number = 15;
  private is_more: boolean = true;

  private author: string;
  private permlink: string;
  private votes: any;
  private is_loading = true;
  private no_content = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public util: UtilProvider,
    public viewCtrl: ViewController,
    private steemia: SteemiaProvider) {
  }

  ionViewDidLoad() {
    this.permlink = this.navParams.get('permlink');
    this.steemia.dispatch_votes({
      url: this.permlink,
    }).then((votes: PostsRes) => {

      if (votes.results.length < 1) {
        this.no_content = true;
      }

      if (this.slice > votes.results.length) {
        this.is_more = false;
      }

      this.votes = votes.results;

      // Set the loading spinner to false
      this.is_loading = false
    });
  }

  /**
   * Infinite scroll to load more comments
   * @param infiniteScroll 
   */
  private load_more(infiniteScroll) {
    setTimeout(() => {

      this.slice += 5;

      if (this.slice > this.votes.length) {
        this.is_more = false;
      }
      infiniteScroll.complete();

    }, 1000);
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
    this.navCtrl.push('AuthorProfilePage', {
      author: author
    })
  }

}
