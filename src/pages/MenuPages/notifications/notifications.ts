import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, LoadingController } from 'ionic-angular';
import { WebsocketsProvider } from 'providers/websockets/websockets';
import { UtilProvider } from 'providers/util/util';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { SteemiaProvider } from 'providers/steemia/steemia';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  private notifications: any = [];
  private current_user: string = (this.steemConnect.user_temp as any).user;

  constructor(public navCtrl: NavController,
    private ws: WebsocketsProvider,
    public menu: MenuController,
    private loading: LoadingController,
    private steemiaProvider: SteemiaProvider,
    private steemConnect: SteemConnectProvider,
    public util: UtilProvider) {
    this.ws.notifications.subscribe(data => {
      if (data) {
        this.notifications = data;
        this.steemConnect.saveNotificationsLastTimestamp(this.notifications[0].timestamp).then(data => {
          this.ws.set_timestamp = data;
        });
      }
    });
    this.ws.counter.next(0);
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    this.menu.enable(true);
  }

  ionWillLeave() {
    this.ws.notifications.unsubscribe();
  }

  private render_image(author: string) {
    return 'https://steemitimages.com/u/' + author + '/avatar/small';
  }

  private parse_date(timestamp: number) {
    var date = new Date(timestamp * 1000);
    return date;
  }

  private open_post(i) {
    let author;
    let loading = this.loading.create({
      content: 'Please wait until we locate the post 💯'
    })
    loading.present();
    if (this.notifications[i].type === 'reblog') {
      author = this.current_user;
    }

    else if (this.notifications[i].type === 'reply') {
      author = this.notifications[i].author;
    }

    else if (this.notifications[i].type === 'mention') {
      author = this.notifications[i].author;
    }
    this.steemiaProvider.dispatch_post_single_notifications({
      author: author,
      permlink: this.notifications[i].permlink
    }).then(data => {
      this.steemiaProvider.dispatch_post_single_notifications({
        author: (data as any).root_author,
        permlink: (data as any).root_permlink
      }).then((res) => {
        loading.dismiss();
        this.navCtrl.push('PostSinglePage', {
          post: res
        });
      });
    });
  }

  private open_profile(i) {
    this.navCtrl.push('AuthorProfilePage', {
      author: this.notifications[i].follower
    });
  }

}
