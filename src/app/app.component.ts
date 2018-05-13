import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { FCM } from '@ionic-native/fcm';
import { MaterialMenuOptions } from '../components/material-menu/material-menu';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { GoogleTrackingProvider } from 'providers/google-tracking/google-tracking';
import { WebsocketsProvider } from 'providers/websockets/websockets';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { Storage } from '@ionic/storage';
import { SettingsProvider } from '../providers/settings/settings';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage = 'TabsPage';
  private isLoggedIn: boolean;

  private loggedInPages: MaterialMenuOptions;
  private loggedOutPages: MaterialMenuOptions;
  private profilePicture: string = "./assets/steemlogo.png";
  private profile;
  private background: string = './assets/mb-bg-fb-03.jpg';
  chosenTheme: string;


  constructor(private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private steemConnect: SteemConnectProvider,
    private menuCtrl: MenuController,
    public storage: Storage,
    private _settings: SettingsProvider,
    private ga: GoogleTrackingProvider,
    private imageLoaderConfig: ImageLoaderConfig,
    private events: Events,
    private ws: WebsocketsProvider,
    private fcm: FCM,
    private steemiaProvider: SteemiaProvider) {

    // Check if the user has already seen the tutorial
    this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
          this.rootPage = 'TabsPage';
        } else {
          this.rootPage = 'WalkthroughPage';
        }
        this.initializeApp()
      });
      
    this.steemConnect.status.subscribe(res => {
      if (res.status === false || res.status === null) {
        this.isLoggedIn = false;
        this.initializeLoggedOutMenu();
      }

      else if (res.status === true) {
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
        background: '#ccc url(' + this.background + ') no-repeat top left / cover',
        picture: this.profilePicture,
        username: 'Steemia',
        voting_power: '',
        email: 'steemia@steemia.io',

      },
      entries: [
        { title: 'Home', leftIcon: 'mdi-home', onClick: () => { this.menuCtrl.close(); } },
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
        background: 'url('+this.profile.json_metadata.profile.cover_image+')',
        picture: this.profile.json_metadata.profile.profile_image,
        username: this.profile.name,
        voting_power: (this.profile.voting_power/100).toFixed(0),
        email: this.profile.json_metadata.profile.location || '',
        onClick: () => {
          this.openPage('ProfilePage', 'profile');
        }
      },
      entries: [
        { title: 'Home', leftIcon: 'mdi-home', onClick: () => { this.menuCtrl.close(); } },
        {
          title: 'Wallet', leftIcon: 'cash', onClick: () => { this.openPage("WalletPage", 'wallet') }
        },
        { title: 'Notifications', leftIcon: 'mdi-bell', onClick: () => { this.openPage('NotificationsPage') } },
        { title: 'My Profile', leftIcon: 'mdi-account', onClick: () => { this.openPage('ProfilePage', 'profile') } },
        // { title: 'Messages', leftIcon: 'chatbubbles', onClick: () => { this.openPage('MessagesPage', 'chat') } },
        { title: 'Bookmarks', leftIcon: 'bookmarks', onClick: () => { this.openPage('BookmarksPage') } },
        // { title: 'Favorites', leftIcon: 'heart', onClick: () => { this.openPage('FavoritesPage') } },
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
      
      this.statusBar.styleBlackOpaque();
      this.splashScreen.hide();
      this._settings.getTheme().subscribe(val => {
        if (val === 'dark-theme') {
         // this.background = './assets/menu_bg2.jpg';
          this.statusBar.backgroundColorByHexString("#1d252c");
        }
  
        else if (val === 'blue-theme') {
         // this.background = './assets/mb-bg-fb-03.jpg';
          this.statusBar.backgroundColorByHexString("#488aff");
        }
        this.chosenTheme = val;
      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      
      this.ga.track_page('Loaded App');
      this.imageLoaderConfig.setBackgroundSize('cover');
      this.imageLoaderConfig.setHeight('200px');
      this.imageLoaderConfig.setFallbackUrl('assets/placeholder2.png');
      this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
      this.imageLoaderConfig.setMaximumCacheAge(7 * 24 * 60 * 60 * 1000); // 7 days

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