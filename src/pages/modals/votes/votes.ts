import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';
import { PostsRes } from 'models/models';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { AuthorProfilePage } from '../../../pages/author-profile/author-profile';

const IMG_SERVER = 'https://steemitimages.com/';

@IonicPage({
  priority: 'medium'
})
@Component({
  selector: 'page-votes',
  templateUrl: 'votes.html',
})
export class VotesPage {

  private author: string;
  private permlink: string;
  private votes: any;
  private is_loading = true;
  private no_content = false;
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private steemia: SteemiaProvider) {
  }

  ionViewDidLoad() {
    this.permlink = this.navParams.get('permlink');
    this.steemia.dispatch_votes({
      url: this.permlink,
    }).then((votes: PostsRes) => {
      this.votes = votes.results;

      if (votes.results.length < 1) {
        this.no_content = true;
      }

      // Set the loading spinner to false
      this.is_loading = false
    });
  }

  /**
   * Method to render images in the correct size
   * @param {String} img: Url of the image to render
   */
  private renderImage(img: string): string {
    return IMG_SERVER + '80x80/' + img;
  }

  /**
   * Method to close the current modal
   */
  private dismiss(): void {
    this.viewCtrl.dismiss();
  }
  
  /**
   * Method to replace 404 images with placeholder
   * @param event 
   */
  private imgError(event): void {
    event.target.src = 'assets/user.png';
  }

  /**
   * Method to open author profile page
   * @param {String} author: author of the post
   */
  private openProfile(author: string): void {
    this.navCtrl.push(AuthorProfilePage, {
      author: author
    })
  }

}
