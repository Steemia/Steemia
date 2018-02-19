import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, ModalController } from 'ionic-angular';
import { PostsRes, Query } from 'models/models';
import { SteemProvider } from '../../../providers/steem/steem';
import { FormControl, FormBuilder } from '@angular/forms';
import { SteemiaProvider } from 'providers/steemia/steemia';

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

  public messageForm: any;
  chatBox: any;

  constructor(public viewCtrl: ViewController,
    public navParams: NavParams,
    public steemData: SteemProvider,
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
      console.log(comments.results)
      this.comments = comments.results;
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

}
