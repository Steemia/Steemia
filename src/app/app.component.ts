import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SteemProvider } from 'providers/steemconnect/steemconnect';
import { ActionsSteem }  from 'providers/steemconnect/actions';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'TabsPage';
  user = "jaysermendez";
  private isLoggedIn: boolean

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              steemProvider: SteemProvider,
              private menuCtrl: MenuController,
              steemActions: ActionsSteem,) {
    
 

    platform.ready().then(() => {
      this.user = 'hsynterkr';
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      statusBar.overlaysWebView(true);
      statusBar.backgroundColorByHexString('#000000');
      splashScreen.hide();
    });
  }

  private openPage(page: string): void {
    this.menuCtrl.close().then(() => {
      this.nav.push(page);
    });
    
  }
}

