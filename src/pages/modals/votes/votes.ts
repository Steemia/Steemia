import { Component } from '@angular/core';
import { App, IonicPage, ViewController, NavController, NavParams, ModalController } from 'ionic-angular';
import { PostsRes } from 'models/models';
import { FormControl, FormBuilder } from '@angular/forms';
import { SteemiaProvider } from 'providers/steemia/steemia';

import { AuthorProfilePage } from '../../../pages/author-profile/author-profile';

const IMG_SERVER = 'https://steemitimages.com/';

/**
 * Generated class for the VotesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-votes',
  templateUrl: 'votes.html',
})
export class VotesPage {

  private author: string;
  private permlink: string;
  private votes: any;
  private is_loading = true;
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private app: App,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    private steemia: SteemiaProvider) {
  }

  ionViewDidLoad() {
    this.permlink = this.navParams.get('permlink');
    this.steemia.dispatch_votes({
      url: this.permlink,
    }).then((votes: PostsRes) => {
      this.votes = votes.results;

      // Set the loading spinner to false
      this.is_loading = false
    });
  }

  private renderImage(type: string, img: string): string {
    if (type === 'profile') {
      return IMG_SERVER + '80x80/' + img;
    }
    else if (type === 'votes') {
      return IMG_SERVER + '50x50/' + img;
    }
  }

  private dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }
  
  private imgError(event): void {
    event.target.src = 'assets/user.png';
  }

  /**
   * Method to open author profile page
   * @param {String} author: author of the post
   */
  private openProfile(author: string): void {
    this.dismiss();
    this.app.getRootNavs()[0].push(AuthorProfilePage, {
      author: author
    })
  }

}
