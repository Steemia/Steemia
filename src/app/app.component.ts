import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SteemProvider } from 'providers/steemconnect/steemconnect';
import { ActionsSteem }  from 'providers/steemconnect/actions';
import { MaterialMenuOptions } from '../components/material-menu/material-menu';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'TabsPage';
  user = "jaysermendez";
  private isLoggedIn: boolean

  menuOptions: MaterialMenuOptions;

  constructor(private platform: Platform, 
              private statusBar: StatusBar, 
              private splashScreen: SplashScreen,
              steemProvider: SteemProvider,
              private menuCtrl: MenuController,
              steemActions: ActionsSteem,) {
    
    this.initializeApp();
    this.menuOptions = this.intializeMenu(); 
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.user = 'hsynterkr';
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(true);
      this.statusBar.backgroundColorByHexString('#000000');
      this.splashScreen.hide();
    });
  }

  private intializeMenu() {
    let _t = this;
    return {
      header: {
        background: '#ccc url(./assets/mb-bg-fb-03.jpg) no-repeat top left / cover',
        //background: 'linear-gradient(to right, #347eff 0%, #1ea3ff 100%)',
        picture: 'https://img.busy.org/@jaysermendez?s=100',
        username: 'Steemia',
        email: 'steemia@steemia.org',
        onClick: () => { alert('menu header clicked'); }
      },
      entries: [
        { 
          title: 'Inbox', 
          leftIcon: 'mail',
          onClick: () => {  }
        },
        { 
          title: 'Feed', 
          leftIcon: 'home', 
          onClick: () => {  } 
        },
        { 
          title: 'Wallet', 
          leftIcon: 'cash', 
          onClick: () => {  } 
        },
        { 
          title: 'Notifications', 
          leftIcon: 'notifications', 
          onClick: () => {  } 
        },
        { 
          title: 'My Profile', 
          leftIcon: 'person', 
          onClick: () => {  } 
        },
        { 
          title: 'Bookmarks', 
          leftIcon: 'bookmarks', 
          onClick: () => {  } 
        },
        { 
          title: 'About', 
          leftIcon: 'information-circle', 
          onClick: () => {  } 
        },
        // { title: 'Labels', isDivider: true },
        // // item with a right icon
        // { 
        //   title: 'Label 1', 
        //   leftIcon: 'square-outline', 
        //   rightIcon: 'ios-arrow-forward', // define a right icon
        //   onClick: () => { _t.nav.setRoot("Page1") } 
        // },
        // // item with a badge
        // { title: 'Label 2', 
        //   leftIcon: 'square-outline',
        //   classes: 'my-custom-css-class', // optional custom classes
        //   badge: { //you can also define a badge
        //     text: '3',
        //     color: 'secondary'
        //   },
        //   onClick: () => { _t.nav.setRoot("Page1") }
        // },
        // { title: 'Label 3', leftIcon: 'square-outline', onClick: () => { _t.nav.setRoot("Page1") } },
        // { title: 'Label 4', leftIcon: 'square-outline', onClick: () => { _t.nav.setRoot("Page1") } },
        // { title: 'Label 5', leftIcon: 'square-outline', onClick: () => { _t.nav.setRoot("Page1") } },
        // { title: 'Label 6', leftIcon: 'square-outline', onClick: () => { _t.nav.setRoot("Page1") } },
      ]
    };
  }

  private openPage(page: string): void {
    this.menuCtrl.close().then(() => {
      this.nav.push(page);
    });
    
  }
}

