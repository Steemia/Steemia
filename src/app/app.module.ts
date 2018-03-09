// ENTRY COMPONENT
import { MyApp } from './app.component';
import { Config } from 'ionic-angular';

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
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';

// COMPONENTS
import { MaterialMenuComponent } from '../components/material-menu/material-menu';

// PROVIDERS
import { SteeemActionsProvider } from '../providers/steeem-actions/steeem-actions';
import { SteemiaProvider } from '../providers/steemia/steemia';
import { SteemProvider } from 'providers/steem/steem';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { UtilProvider } from '../providers/util/util';
import { AlertsProvider } from '../providers/alerts/alerts';
import { SteemiaLogProvider } from '../providers/steemia-log/steemia-log';


@NgModule({
  declarations: [
    MaterialMenuComponent,
    MyApp
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'bottom',
      scrollPadding: true,
      scrollAssist: true,
      autoFocusAssist: true,
      preloadModules: true,
      pageTransition: 'wp-transition',
      modalLeave: 'modal-slide-out',
      popoverEnter: 'popover-pop-in',
      popoverLeave: 'popover-pop-out',
      tabsHideOnSubPages: true
    }),
    IonicStorageModule.forRoot({ name: '__mydb', driverOrder: ['sqlite', 'websql', 'indexeddb'] }),
    IonicImageLoader.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    SocialSharing,
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
    FileTransfer,
    FileTransferObject,
    File,
    Camera,
    SteemiaLogProvider
  ]
})
export class AppModule {}
