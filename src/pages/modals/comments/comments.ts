import { Component } from '@angular/core';
import { App, IonicPage, ViewController, NavParams, ModalController } from 'ionic-angular';
import { PostsRes } from 'models/models';
import { FormControl, FormBuilder } from '@angular/forms';
import { SteemiaProvider } from 'providers/steemia/steemia';

import { AuthorProfilePage } from '../../../pages/author-profile/author-profile';

const IMG_SERVER = 'https://steemitimages.com/';

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {

  private author: string;
  private permlink: string;
  private comments: any;
  private is_loading = true;

  public messageForm: any;
  chatBox: any;

  constructor(private app: App,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    private steemia: SteemiaProvider) {

    this.messageForm = formBuilder.group({
      message: new FormControl('')
    });
    this.chatBox = '';
  }

  ionViewDidLoad() {
    this.permlink = this.navParams.get('permlink');
    this.steemia.dispatch_comments({
      url: this.permlink,
      limit: 15,
      current_user: "steemia-io"
    }).then((comments: PostsRes) => {
      this.comments = comments.results;

      // Set the loading spinner to false
      this.is_loading = false
    });
  }

  private renderImage(type: string, img: string): string {
    if (type === 'profile') {
      return IMG_SERVER + '80x80/' + img;
    }
    else if (type === 'votes') {
      return IMG_SERVER + '50x50/' + img
    }
  }



  private dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }

  private openReplies(comment) {
    let repliesModal = this.modalCtrl.create("RepliesPage", {});
    repliesModal.present();
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