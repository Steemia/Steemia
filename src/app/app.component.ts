import { Component, ViewChild, NgZone } from '@angular/core';
import { Platform, Nav, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { FCM } from '@ionic-native/fcm';
import { MaterialMenuOptions } from '../components/material-menu/material-menu';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { Socket } from 'ng-socket-io';
import { GoogleTrackingProvider } from 'providers/google-tracking/google-tracking';
import { WebsocketsProvider } from 'providers/websockets/websockets';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage = 'TabsPage';
  private isLoggedIn: boolean;

  menuOptions: MaterialMenuOptions;
  private loggedInPages: MaterialMenuOptions;
  private loggedOutPages: MaterialMenuOptions;
  private profilePicture: string = "./assets/steemlogo.png";
  private profile;
  private location: string;
  private username: string;
  private dispatch_menu: boolean = false;


  constructor(private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private steemConnect: SteemConnectProvider,
    private menuCtrl: MenuController,
    private ga: GoogleTrackingProvider,
    private events: Events,
    private ws: WebsocketsProvider,
    private fcm: FCM,
    private zone: NgZone,
    private steemiaProvider: SteemiaProvider) {

    this.initializeApp();

    this.steemConnect.status.subscribe(res => {
      if (res.status == false) {
        this.isLoggedIn = false;
        this.initializeLoggedOutMenu();
      }

      else {
        this.steemiaProvider.dispatch_account(res.userObject.user).then(data => {
          this.profile = data[0];
          this.profile.json_metadata = JSON.parse(this.profile.json_metadata);
          // this.socket.connect();
          // this.socket.emit('set-nickname', this.profile.username);
          this.initializeLoggedInMenu();
          this.isLoggedIn = true;
          this.ws.sendAsync('login', this.steemConnect.get_token, 1);
          this.ws.sendAsync('get_notifications', this.profile.name, 0);
        });
      }
    });

  }

  private initializeLoggedOutMenu(): void {
    this.loggedOutPages = {
      header: {
        background: '#ccc url(./assets/mb-bg-fb-03.jpg) no-repeat top left / cover',
        picture: this.profilePicture,
        username: 'Steemia',
        email: 'steemia@steemia.io'
      },
      entries: [
        { title: 'Home', leftIcon: 'mdi-home', onClick: () => { } },
        { title: 'About', leftIcon: 'information-circle', onClick: () => { this.openPage("AboutPage") } },
        { title: 'Login', leftIcon: 'log-in', onClick: () => { this.openPage("LoginPage") } }
      ]
    };

  }

  isBadgeEntry(entry) {
    return entry.badge && entry.badge.text;
  }

  isDividerEntry(entry) {
    return entry.isDivider && entry.isDivider === true;
  }

  private initializeLoggedInMenu(): void {
    this.loggedInPages = {
      header: {
        background: '#ccc url(./assets/mb-bg-fb-03.jpg) no-repeat top left / cover',
        picture: this.profile.json_metadata.profile.profile_image,
        username: this.profile.name,
        email: this.profile.json_metadata.profile.location || '',
        //onClick: () => { alert('menu header clicked'); }
      },
      entries: [
        { title: 'Home', leftIcon: 'mdi-home', onClick: () => { } },
        { title: 'Wallet', leftIcon: 'cash', onClick: () => { this.openPage("WalletPage", 'wallet') } },
        { title: 'Notifications', leftIcon: 'mdi-bell', onClick: () => { this.openPage('NotificationsPage') } },
        { title: 'My Profile', leftIcon: 'mdi-account', onClick: () => { this.openPage('ProfilePage', 'profile') } },
        { title: 'Messages', leftIcon: 'chatbubbles', onClick: () => { this.openPage('MessagesPage', 'chat') } },
        { title: 'Bookmarks', leftIcon: 'bookmarks', onClick: () => { this.openPage('BookmarksPage') } },
        { title: 'Settings', leftIcon: 'settings', onClick: () => { this.openPage('SettingsPage') } },
        { title: 'About', leftIcon: 'information-circle', onClick: () => { this.openPage('AboutPage') } },
        {
          title: 'Logout', leftIcon: 'log-out', onClick: () => {
            this.steemConnect.doLogout().then(data => {
              if (data === 'done') {
                this.menuCtrl.close().then(() => {
                  this.profilePicture = './assets/steemlogo.png'
                  this.isLoggedIn = false;
                });
              }
            })
          }
        }
      ]
    };
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleBlackOpaque();
      this.statusBar.backgroundColorByHexString('#488aff');
      this.splashScreen.hide();
      this.ga.track_page('Loaded App');

      this.fcm.onNotification().subscribe(
        (data) => {
          if (data.wasTapped) {
            console.log("Received in background", JSON.stringify(data))
          } else {

            console.log("Received in foreground", JSON.stringify(data))
          }
        }, error => {
          console.error("Error in notification", error)
        }
      );
    });
  }

  private openPage(page: any, type?: string): void {
    this.menuCtrl.close().then(() => {
      if (type === 'profile' || type === 'wallet' || type === 'chat') {
        this.nav.push(page, {
          author: this.profile.name
        });
      }
      else {
        this.nav.push(page);
      }
    });
  }
}

