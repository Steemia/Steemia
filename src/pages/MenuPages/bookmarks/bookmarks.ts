import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PostsRes } from 'models/models';

@IonicPage()
@Component({
  selector: 'page-bookmarks',
  templateUrl: 'bookmarks.html',
})
export class BookmarksPage {
  public bookmarks;

  private profile_pc: string = 'assets/user.png';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookmarksPage');
    this.storage.get('bookmarks').then(data => {
      if (data) {
        this.bookmarks = data;
      };
    });
  }

  openPost(post) {
    this.navCtrl.push('PostSinglePage', {
      post: post
    });
  }

  removeBookmark(post) {
    this.storage.get('bookmarks').then(data => {
      this.bookmarks = data;
      for(let object of data) {
        if (object.author === post.author && object.url === post.url) {
          let index = this.bookmarks.indexOf(object);
          this.bookmarks.splice(index,1);
          this.storage.set('bookmarks', this.bookmarks).then(data => {
          })
        }
      }
    })
  }

}
