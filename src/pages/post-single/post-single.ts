import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Post } from 'models/models';
import marked from 'marked';
import { SteemProvider } from '../../providers/steem/steem';
import { EmbedVideoService } from 'ngx-embed-video';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-post-single',
  templateUrl: 'post-single.html',
})
export class PostSinglePage {
  
  private post: Post;
  private body: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public steemData: SteemProvider,) {

    this.post = this.navParams.get('post');
    
    this.body = marked(this.post.body, {
      gfm: true,
      tables: true,
      smartLists: true,
      breaks: true,
      pedantic: false,
      sanitize: false,
      smartypants: false
    });
    //this.body = md.render(this.post.body)
    //this.body = this.post.body.replace(image_url,this.embedService.embed('$1'))
    this.steemData.getComments({author: this.post.author, permlink: this.post.permlink}).subscribe(data => {
      console.log(data)
    })

  }
  

}
