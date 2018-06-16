import { Component, ViewChild, OnDestroy } from '@angular/core';
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
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { SharedServiceProvider } from 'providers/shared-service/shared-service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: 'app.html',
})
export class MyApp implements OnDestroy {

  @ViewChild(Nav) nav: Nav;

  rootPage = 'TabsPage';
  private isLoggedIn: boolean;

  private loggedInPages: MaterialMenuOptions;
  private loggedOutPages: MaterialMenuOptions;
  private profilePicture: string = "./assets/icon.png";
  private profile;
  private background: string = './assets/mb-bg-fb-03.jpg';
  chosenTheme: string;
  private $language: Subscription;

  // Rewards Data
  private rewards = {
    steem: null,
    sbd: null,
    vesting_steem: null,
    vesting_steem_balance: null
  };

  constructor(private platform: Platform,
    private statusBar: StatusBar,
    private sharedService: SharedServiceProvider,
    private splashScreen: SplashScreen,
    private steemConnect: SteemConnectProvider,
    private menuCtrl: MenuController,
    private translate: TranslateService,
    public storage: Storage,
    private steeemActions: SteeemActionsProvider,
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
          this.rewards = {
            sbd: parseFloat(data[0].reward_sbd_balance),
            steem: parseFloat(data[0].reward_steem_balance),
            vesting_steem: parseFloat(data[0].reward_vesting_balance),
            vesting_steem_balance: parseFloat(data[0].reward_vesting_steem)
          };
          this.initializeLoggedInMenu();
          this.isLoggedIn = true;
          this.ws.sendAsync('login', this.steemConnect.get_token, 1);
          this.ws.sendAsync('get_notifications', this.profile.name, 0);
          this.storage.get('auto_claim').then(data => {
            if (data === true) {
              if (this.rewards.sbd > 0 || this.rewards.steem > 0 || this.rewards.vesting_steem > 0 || this.rewards.vesting_steem_balance > 0) {
                this.claim_rewards();
              }
            }
          });
        });
      }
    });

  }

  private initializeLoggedOutMenu(): void {
    this.loggedOutPages = {
      header: {
        background: '#ccc url(' + this.background + ') no-repeat top left / cover',
        picture: this.profilePicture,
        name: 'Hey,',
        voting_power: '',
        username: 'Welcome to Steemia!',
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
        background: 'url(' + this.profile.json_metadata.profile.cover_image + ')',
        picture: this.profile.json_metadata.profile.profile_image,
        name: this.profile.json_metadata.profile.name || '',
        voting_power: (this.profile.voting_power / 100).toFixed(0),
        username: '@'+this.profile.name,
        onClick: () => {
          this.openPage('ProfilePage', 'profile');
        }
      },
      entries: [
        { title: 'menu.home', leftIcon: 'mdi-home', onClick: () => { this.menuCtrl.close(); } },
        {
          title: 'menu.wallet', leftIcon: 'cash', onClick: () => { this.openPage("WalletPage", 'wallet') }
        },
        { title: 'menu.notifications', leftIcon: 'mdi-bell', onClick: () => { this.openPage('NotificationsPage') } },
        { title: 'menu.my_profile', leftIcon: 'mdi-account', onClick: () => { this.openPage('ProfilePage', 'profile') } },
        { title: 'menu.bookmarks', leftIcon: 'bookmarks', onClick: () => { this.openPage('BookmarksPage') } },
        { title: 'menu.settings', leftIcon: 'settings', onClick: () => { this.openPage('SettingsPage') } },
        { title: 'menu.about', leftIcon: 'information-circle', onClick: () => { this.openPage('AboutPage') } },
        {
          title: 'menu.logout', leftIcon: 'log-out', onClick: () => {
            this.steemConnect.doLogout().then(data => {
              if (data === 'done') {
                this.menuCtrl.close().then(() => {
                  this.profilePicture = './assets/icon.png'
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
          this.statusBar.backgroundColorByHexString("#1d252c");
        }

        else if (val === 'blue-theme') {
          this.statusBar.backgroundColorByHexString("#488aff");
        }
        this.chosenTheme = val;
      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.ga.track_page('Loaded App');

      this.fcm.onNotification().subscribe(
        (data) => {
          if (data.wasTapped) {
            // TODO: Open corresponding page from the notification
            console.log("Received in background", JSON.stringify(data))
          } else {
            // TODO: Open corresponding page from the notification
            console.log("Received in foreground", JSON.stringify(data))
          }
        }, error => {
          // Should do nothing on error, so it is okay to leave it empty
          // but it is necessary to avoid any crash.
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

  /**
   * Function to initialize the ngx translate default language
   */
  private initTranslate(): void {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');

    // Try to get the language saved in local storage
    this.storage.get('language').then(language => {

      // If there is any language saved there, use it. 
      if (language !== null) {
        this.translate.use(language);
      }

      // Otherwise, try to get the device language and set it. If the language is not found, use English.
      else {
        
        if (this.translate.getBrowserLang() !== undefined) {

          this.translate.use(this.translate.getBrowserLang());

        } else {

          this.translate.use('en'); // Set your language here
        }
      }
    });

    /**
     * Watch the language from the shared provider to set any changes globally in the app
     */
    this.$language = this.sharedService.watchLanguage().subscribe((lang: string) => {
      this.translate.use(lang);
    });

  }
  /**
   * Method to claim rewards
   */
  private claim_rewards(): void {
    const steem = this.rewards.steem.toFixed(3).toString() + ' STEEM';
    const sbd = this.rewards.sbd.toFixed(3).toString() + ' SBD';
    const sp = this.rewards.vesting_steem.toFixed(6).toString() + ' VESTS';

    this.steeemActions.dispatch_claim_reward(steem, sbd, sp);
  }

  ngOnDestroy(): void {
    // If the language is not null, unsubscribe to avoid memory leak.
    if (this.$language != null) this.$language.unsubscribe();
  }
}