import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SteemProvider } from 'providers/steemconnect/steemconnect';
import { ActionsSteem }  from 'providers/steemconnect/actions';
import { MaterialMenuOptions } from '../components/material-menu/material-menu';

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

  rootPage: string = 'TabsPage';
  user = "jaysermendez";
  private isLoggedIn: boolean

  menuOptions: MaterialMenuOptions;
  private loggedInPages: MaterialMenuOptions;
  private loggedOutPages: MaterialMenuOptions;

  constructor(private platform: Platform, 
              private statusBar: StatusBar, 
              private splashScreen: SplashScreen,
              steemProvider: SteemProvider,
              private menuCtrl: MenuController,
              steemActions: ActionsSteem) {
    
    this.initializeApp();
    this.menuOptions = this.intializeMenu();

    this.loggedInPages = {
      header: {
        background: '#ccc url(./assets/mb-bg-fb-03.jpg) no-repeat top left / cover',
        //background: 'linear-gradient(to right, #347eff 0%, #1ea3ff 100%)',
        picture: 'https://steemit-production-imageproxy-upload.s3.amazonaws.com/DQmQF3m4SRRjycPjQYajpvJvd1v9m9oncBPVpQ1qAHRUBJq',
        username: 'Steemia',
        email: 'steemia@steemia.io',
        onClick: () => { alert('menu header clicked'); }
      },
      entries: [
        { title: 'Home', leftIcon: 'home', onClick: () => {  } },
        { title: 'Wallet', leftIcon: 'cash', onClick: () => { this.openPage("WalletPage") } },
        { title: 'Notifications', leftIcon: 'notifications', onClick: () => { this.openPage("NotificationsPage") } },
        { title: 'My Profile', leftIcon: 'person', onClick: () => { this.openPage("ProfilePage") } },
        { title: 'Bookmarks', leftIcon: 'bookmarks', onClick: () => { this.openPage("BookmarksPage") } },
        { title: 'Settings', leftIcon: 'settings', onClick: () => { this.openPage("SettingsPage") } },
        { title: 'About', leftIcon: 'information-circle', onClick: () => { this.openPage("AboutPage") } }
      ]
    };

    this.loggedOutPages = {
      header: {
        background: '#ccc url(./assets/mb-bg-fb-03.jpg) no-repeat top left / cover',
        //background: 'linear-gradient(to right, #347eff 0%, #1ea3ff 100%)',
        picture: 'https://steemit-production-imageproxy-upload.s3.amazonaws.com/DQmQF3m4SRRjycPjQYajpvJvd1v9m9oncBPVpQ1qAHRUBJq',
        username: 'Steemia',
        email: 'steemia@steemia.io',
        onClick: () => { alert('menu header clicked'); }
      },
      entries: [
        { title: 'Home', leftIcon: 'home', onClick: () => {  } },
        { title: 'Login', leftIcon: 'settings', onClick: () => { this.openPage("LoginPage") } },
        { title: 'Settings', leftIcon: 'settings', onClick: () => { this.openPage("SettingsPage") } },
        { title: 'About', leftIcon: 'information-circle', onClick: () => { this.openPage("AboutPage") } }
      ]
    };
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.user = 'hsynterkr';
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(true);
      this.statusBar.backgroundColorByHexString('#488aff');
      this.splashScreen.hide();
    });
  }

  private intializeMenu() {
    let _t = this;
    return {
      header: {
        background: '#ccc url(./assets/mb-bg-fb-03.jpg) no-repeat top left / cover',
        //background: 'linear-gradient(to right, #347eff 0%, #1ea3ff 100%)',
        picture: 'https://steemit-production-imageproxy-upload.s3.amazonaws.com/DQmQF3m4SRRjycPjQYajpvJvd1v9m9oncBPVpQ1qAHRUBJq',
        username: 'Steemia',
        email: 'steemia@steemia.io',
        onClick: () => { alert('menu header clicked'); }
      },
      entries: [
        {
          title: 'Home',
          leftIcon: 'home',
          onClick: () => { this.nav.setRoot("FeedPage")}
        },
        { 
          title: 'Wallet', 
          leftIcon: 'cash', 
          onClick: () => {  } 
        },
        { 
          title: 'Notifications', 
          leftIcon: 'notifications', 
          onClick: () => { this.openPage("WalletPage") } 
        },
        { 
          title: 'My Profile', 
          leftIcon: 'person', 
          onClick: () => { this.openPage("ProfilePage") } 
        },
        { 
          title: 'Bookmarks', 
          leftIcon: 'bookmarks', 
          onClick: () => { this.openPage("BookmarksPage") } 
        },
        { 
          title: 'Settings', 
          leftIcon: 'settings', 
          onClick: () => { this.openPage("SettingsPage") } 
        },
        { 
          title: 'About', 
          leftIcon: 'information-circle', 
          onClick: () => { this.openPage("AboutPage") } 
        }
      ]
    };
  }

  private openPage(page: string): void {
    this.menuCtrl.close().then(() => {
      this.nav.push(page);
    });
    
  }
}

