import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Post } from 'models/models';
import marked from 'marked';
import { SteemProvider } from '../../providers/steem/steem';

@IonicPage()
@Component({
  selector: 'page-post-single',
  templateUrl: 'post-single.html',
})
export class PostSinglePage {
  
  private post: Post;
  private body: string;
  private created: string;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public steemData: SteemProvider) {
  
    this.post = this.navParams.get('post');
    this.body = marked(this.post.body);
    this.steemData.getComments({author: this.post.author, permlink: this.post.permlink}).subscribe(data => {
      console.log(data)
    })

  }

}
