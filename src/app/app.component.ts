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
import { Storage } from '@ionic/storage';
import { SettingsProvider } from '../providers/settings/settings';
import { TranslateService } from '@ngx-translate/core';

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
    private translate: TranslateService,
    public storage: Storage,
    private _settings: SettingsProvider,
    private ga: GoogleTrackingProvider,
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
        this.initializeApp();
        
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
        background: '#ccc url(' + this.background + ') no-repeat top left / cover',
        picture: this.profile.json_metadata.profile.profile_image,
        username: this.profile.name,
        email: this.profile.json_metadata.profile.location || '',
        onClick: () => {
          this.openPage('ProfilePage', 'profile');
        }
      },
      entries: [
        { title: this.translate.instant('menu.home'), leftIcon: 'mdi-home', onClick: () => { this.menuCtrl.close(); } },
        {
          title: this.translate.instant('menu.wallet'), leftIcon: 'cash', onClick: () => { this.openPage("WalletPage", 'wallet') }
        },
        { title: this.translate.instant('menu.notifications'), leftIcon: 'mdi-bell', onClick: () => { this.openPage('NotificationsPage') } },
        { title: this.translate.instant('menu.my_profile'), leftIcon: 'mdi-account', onClick: () => { this.openPage('ProfilePage', 'profile') } },
        // { title: 'Messages', leftIcon: 'chatbubbles', onClick: () => { this.openPage('MessagesPage', 'chat') } },
        { title: this.translate.instant('menu.bookmarks'), leftIcon: 'bookmarks', onClick: () => { this.openPage('BookmarksPage') } },
        { title: this.translate.instant('menu.settings'), leftIcon: 'settings', onClick: () => { this.openPage('SettingsPage') } },
        { title: this.translate.instant('menu.about'), leftIcon: 'information-circle', onClick: () => { this.openPage('AboutPage') } },
        {
          title: this.translate.instant('menu.logout'), leftIcon: 'log-out', onClick: () => {
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
      this.initTranslate();

      this.statusBar.styleBlackOpaque();
      this.splashScreen.hide();
      this._settings.getTheme().subscribe(val => {
        if (val === 'dark-theme') {
          
          this.background = './assets/menu_bg2.jpg';
          
          if (this.platform.is('android')) {
            this.statusBar.backgroundColorByHexString("#33000000");
          }

          else {
            this.statusBar.backgroundColorByHexString("#1d252c");
          }
        }

        else if (val === 'blue-theme') {

          this.background = './assets/mb-bg-fb-03.jpg';

          if (this.platform.is('android')) {
            this.statusBar.backgroundColorByHexString("#33000000");
          }

          else {
            this.statusBar.backgroundColorByHexString("#488aff");
          }
        }
        this.chosenTheme = val;
      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

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

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');


    if (this.translate.getBrowserLang() !== undefined) {
      
      this.translate.use(this.translate.getBrowserLang()); 
      
    } else {

      this.translate.use('en'); // Set your language here
    }

  }

}

