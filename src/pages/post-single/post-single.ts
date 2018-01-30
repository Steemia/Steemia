import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Post } from 'models/models';
import marked from 'marked';
import { SteemProvider } from '../../providers/steem/steem';
import * as remarkable from 'remarkable';
import { EmbedVideoService } from 'ngx-embed-video';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


const md = new remarkable();
md.set({
  html: true,
  breaks: true
});

@IonicPage()
@Component({
  selector: 'page-post-single',
  templateUrl: 'post-single.html',
})
export class PostSinglePage {
  
  private post: Post;
  private body: SafeHtml;
  private created: string;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public steemData: SteemProvider,
              private embedService: EmbedVideoService,
              private sanitizer: DomSanitizer) {

                
    let videos_url = /^^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm;
    let images_url = /((?:https?\:\/\/)(?:[a-zA-Z]{1}(?:[\w\-]+\.)+(?:[\w]{2,5}))(?:\:[\d]{1,5})?\/(?:[^\s\/]+\/)*(?:[^\s]+\.(?:jpe?g|gif|png))(?:\?\w+=\w+(?:&\w+=\w+)*)?)/gim;
    this.post = this.navParams.get('post');
    
    let videos = this.post.body.match(videos_url);
    

    // this.post.body.replace(/(!\[.*?\]\()(.+?)(\))/g, function(whole, a, image, c) {
    //   whole = '<img src="' + image;
      
    //   return whole;
    // });

    let images = this.post.body.match(images_url);

    // if (images) {
    //   for (let i = 0; i < images.length; i++) {
    //     this.post.body = this.post.body.replace(images[i], '<img src="' + images[i] + '" />');
    //   }
    // }

    if (videos) {
      for (let i = 0; i < videos.length; i++) {
        this.post.body = this.post.body.replace(videos[i], this.embedService.embed(videos[i]));
      }
    }
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
