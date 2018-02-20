import { Component, ViewChild, NgZone } from '@angular/core';
import { Platform, Nav, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
//import { ActionsSteem }  from 'providers/steemconnect/actions';
import { MaterialMenuOptions } from '../components/material-menu/material-menu';
import { SteemProvider } from 'providers/steem/steem';
import { TabsPage } from '../pages/tabs/tabs';

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage = TabsPage;
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
    private zone: NgZone) {

    this.initializeApp();

    this.steemConnect.status.subscribe(res => {
      if (res.status == false) {
        this.initializeLoggedOutMenu();
        this.isLoggedIn = false;
      }

      else {
        this.steemProvider.getProfile([res.userObject.user]).subscribe(data => {
          this.profile = data.profile.json_metadata.profile;
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
        email: 'steemia@steemia.io',
        onClick: () => { alert('menu header clicked'); }
      },
      entries: [
        { title: 'Home', leftIcon: 'home', onClick: () => { } },
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
        username: this.profile.name,
        email: this.profile.location || '',
        onClick: () => { alert('menu header clicked'); }
      },
      entries: [
        { title: 'Home', leftIcon: 'home', onClick: () => { } },
        { title: 'Wallet', leftIcon: 'cash', onClick: () => { this.openPage("WalletPage") } },
        { title: 'Notifications', leftIcon: 'notifications', onClick: () => { this.openPage("NotificationsPage") } },
        { title: 'My Profile', leftIcon: 'person', onClick: () => { this.openPage("ProfilePage") } },
        { title: 'Messages', leftIcon: 'chatbubbles', onClick: () => { this.openPage("MessagesPage") } },
        { title: 'Bookmarks', leftIcon: 'bookmarks', onClick: () => { this.openPage("BookmarksPage") } },
        { title: 'Settings', leftIcon: 'settings', onClick: () => { this.openPage("SettingsPage") } },
        { title: 'About', leftIcon: 'information-circle', onClick: () => { this.openPage("AboutPage") } },
        {
          title: 'Logout', leftIcon: 'log-out', onClick: () => {
            this.steemConnect.doLogout().then(data => {
              if (data === 'done') {
                this.menuCtrl.close().then(() => {
                  this.profilePicture = "./assets/steemlogo.png"
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


  private openPage(page: string): void {
    this.menuCtrl.close().then(() => {
      this.nav.push(page);
    });
  }
}

