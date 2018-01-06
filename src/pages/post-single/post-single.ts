import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Post } from 'models/models';
import { DataProvider } from 'providers/data/data';

@IonicPage()
@Component({
  selector: 'page-post-single',
  templateUrl: 'post-single.html',
})
export class PostSinglePage {

  private post: Post;
  private test: any;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private dataProvider: DataProvider) {

    console.log(this.navParams.get('author'), this.navParams.get('permlink'))
    this.dataProvider.getContent(this.navParams.get('author'), this.navParams.get('permlink')).subscribe(data => {
      this.post = data;
      this.test = JSON.stringify(data);
    })


  }

}
