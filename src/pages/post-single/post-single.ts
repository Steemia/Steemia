import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Post } from 'models/models';
import { DataProvider } from 'providers/data/data';
import marked from 'marked';
import * as moment from 'moment';

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
              private dataProvider: DataProvider) {
  
    this.dataProvider.getContent(this.navParams.get('author'), this.navParams.get('permlink'))
    .subscribe((data: Post) => {
      this.post = data;
      this.body = marked(data.body);
      data.author_reputation = parseInt(Math.floor((((Math.log10(parseInt(data.author_reputation.toString())))-9)*9)+25).toFixed(2));
      this.created = moment(data.created).fromNow();
    })


  }

}
