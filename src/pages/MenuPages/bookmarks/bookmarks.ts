import { Component } from '@angular/core';
import { IonicPage, 
         NavController, 
         NavParams, 
         LoadingController,
         MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PostsRes } from 'models/models';
import { UtilProvider } from 'providers/util/util';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { TranslateService } from "@ngx-translate/core";


@IonicPage()
@Component({
  selector: 'page-bookmarks',
  templateUrl: 'bookmarks.html',
})
export class BookmarksPage {
  public bookmarks = [];

  private profile_pc: string = 'assets/user.png';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    private loading: LoadingController,
    private translate: TranslateService,
    public util: UtilProvider,
    private steemiaProvider: SteemiaProvider,
    public storage: Storage) {
  }

  ionViewDidLoad() {
    this.storage.get('bookmarks').then(data => {
      if (data) {
        this.bookmarks = data.reverse();
      };
    });
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  openPost(post) {
    let loading = this.loading.create({
      content: this.translate.instant('locating_post')
    });

    loading.present();
    this.steemiaProvider.dispatch_post_single_notifications({
      author: post.author,
      permlink: post.permlink
    }).then(data => {
      loading.dismiss();
      this.navCtrl.push('PostSinglePage', {
        post: data
      });
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
