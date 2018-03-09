import { Component, ViewChild, NgZone } from '@angular/core';
import { Platform, Nav, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
//import { ActionsSteem }  from 'providers/steemconnect/actions';
import { MaterialMenuOptions } from '../components/material-menu/material-menu';
import { SteemProvider } from 'providers/steem/steem';
import { SteemiaProvider } from 'providers/steemia/steemia';

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
    private events: Events,
    private steemProvider: SteemProvider,
    private zone: NgZone,
    private steemiaProvider: SteemiaProvider) {

    this.initializeApp();

    this.steemConnect.status.subscribe(res => {
      if (res.status == false) {
        this.isLoggedIn = false;
        this.initializeLoggedOutMenu();
      }

      else {
        this.steemiaProvider.dispatch_menu_profile(res.userObject.user).then(data => {
          this.profile = data;
          this.initializeLoggedInMenu();
          this.isLoggedIn = true;
        });
      }
    });

  }

  private initializeLoggedOutMenu(): void {
    this.loggedOutPages = {
      header: {
        background: '#ccc url(./assets/mb-bg-fb-03.jpg) no-repeat top left / cover',
        //background: 'linear-gradient(to right, #347eff 0%, #1ea3ff 100%)',
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
        //background: 'linear-gradient(to right, #347eff 0%, #1ea3ff 100%)',
        picture: this.profile.profile_image,
        username: this.profile.username,
        email: this.profile.location || '',
        //onClick: () => { alert('menu header clicked'); }
      },
      entries: [
        { title: 'Home', leftIcon: 'mdi-home', onClick: () => { } },
        { title: 'Wallet', leftIcon: 'cash', onClick: () => { this.openPage("WalletPage", 'wallet') } },
        { title: 'Notifications', leftIcon: 'mdi-bell', onClick: () => { this.openPage('NotificationsPage') } },
        { title: 'My Profile', leftIcon: 'mdi-account', onClick: () => { this.openPage('ProfilePage', 'profile') } },
        { title: 'Messages', leftIcon: 'chatbubbles', onClick: () => { this.openPage('MessagesPage') } },
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
    });
  }


  private openPage(page: any, type?: string): void {
    this.menuCtrl.close().then(() => {
      if (type === 'profile' || type === 'wallet') {
        this.nav.push(page, {
          author: this.profile.username
        });
      }
      else {
        this.nav.push(page);
      }
    });
  }
}

