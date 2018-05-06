import { Component } from '@angular/core';
import { App, 
         IonicPage, 
         NavController, 
         NavParams, 
         LoadingController,
         MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PostsRes } from 'models/models';
import { UtilProvider } from 'providers/util/util';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';

@IonicPage()
@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage {
  public favorites = []

  constructor(private app: App,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menu: MenuController,
    private loading: LoadingController,
    private steemConnect: SteemConnectProvider,
    public util: UtilProvider,
    private steemiaProvider: SteemiaProvider,
    public storage: Storage)  {
  }

  ionViewDidLoad() {
    this.storage.get('bookmarks').then(data => {
      if (data) {
        this.favorites = data.reverse();
      };
    });
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    this.menu.enable(true);
  }

   /**
   * Method to open author profile page
   * @param {String} author: author of the post
   */
  openProfile(author: string): void {
      this.app.getRootNav().push('AuthorProfilePage', {
        author: author
      });
    
  }

}
