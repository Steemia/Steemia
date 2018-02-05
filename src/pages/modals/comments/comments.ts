import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, ModalController } from 'ionic-angular';
import { Post } from 'models/models';
import { SteemProvider } from '../../../providers/steem/steem';
import { FormControl, FormBuilder } from '@angular/forms';

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
              public modalCtrl: ModalController) {

    this.author = this.navParams.get('author');
    this.permlink = this.navParams.get('permlink');

    this.steemData.getComments({author: this.author, permlink: this.permlink}).subscribe(data => {
      console.log(data)
      this.comments = data;
    });

    

    this.messageForm = formBuilder.group({
      message: new FormControl('')
    });
    this.chatBox = '';
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
