// ENTRY COMPONENT
import { MyApp } from './app.component';

// MODULES
import { HttpModule } from '@angular/http'
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { IonicImageLoader } from 'ionic-image-loader';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ErrorHandler, NgModule } from '@angular/core';

// IONIC NATIVE
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BrowserTab } from '@ionic-native/browser-tab';

// PAGES
import { TabsPage } from '../pages/tabs/tabs';

// COMPONENTS
import { MaterialMenuComponent } from '../components/material-menu/material-menu';

// PROVIDERS
import { SteeemActionsProvider } from '../providers/steeem-actions/steeem-actions';
import { SteemiaProvider } from '../providers/steemia/steemia';
import { SteemProvider } from 'providers/steem/steem';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { UtilProvider } from '../providers/util/util';
import { AlertsProvider } from '../providers/alerts/alerts';

@NgModule({
  declarations: [
    MaterialMenuComponent,
    MyApp,
    TabsPage
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'bottom',
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false,
      preloadModules: true,
      pageTransition: 'wp-transition',
      modalLeave: 'modal-slide-out',
      tabsHideOnSubPages: true
    }),
    IonicStorageModule.forRoot({ name: '__mydb', driverOrder: ['sqlite', 'websql', 'indexeddb'] }),
    IonicImageLoader.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage
  ],
  providers: [
    StatusBar,
    InAppBrowser,
    BrowserTab,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SteemConnectProvider,
    SteemProvider,
    SteemiaProvider,
    SteeemActionsProvider,
    UtilProvider,
    AlertsProvider,
  ]
})
export class AppModule {}
