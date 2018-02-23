import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Post } from 'models/models';
import marked from 'marked';
import { SteemProvider } from '../../providers/steem/steem';
import { postSinglePage } from './post-single.template'; 

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-post-single',
  template: postSinglePage
})
export class PostSinglePage {
  
  private post: any;
  private body: string;
  private meta;
  private tags;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public steemData: SteemProvider) {

    this.post = this.navParams.get('post');
    
    this.body = marked(this.post.full_body, {
      gfm: true,
      tables: true,
      smartLists: true,
      breaks: true,
      pedantic: false,
      sanitize: false,
      smartypants: false
    });

  }
  

}
