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
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

// Socket IO Server
const config: SocketIoConfig = { url: 'http://192.168.0.11:3001', options: {} };

// IONIC NATIVE
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BrowserTab } from '@ionic-native/browser-tab';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { SecureStorage } from '@ionic-native/secure-storage';
import { SecureStorageMock } from '@ionic-native-mocks/secure-storage';
import { GoogleAnalyticsMock } from '@ionic-native-mocks/google-analytics';
import { LocalNotifications } from '@ionic-native/local-notifications';

// COMPONENTS
import { MaterialMenuComponent } from '../components/material-menu/material-menu';

// PROVIDERS
import { SteeemActionsProvider } from '../providers/steeem-actions/steeem-actions';
import { SteemiaProvider } from '../providers/steemia/steemia';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { UtilProvider } from '../providers/util/util';
import { AlertsProvider } from '../providers/alerts/alerts';
import { CryptoProvider } from '../providers/crypto-api/crypto-api';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { GoogleTrackingProvider } from '../providers/google-tracking/google-tracking';
import { WebsocketsProvider } from '../providers/websockets/websockets';

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
    LocalNotifications,
    SocialSharing,
    StatusBar,
    InAppBrowser,
    BrowserTab,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SteemConnectProvider,
    SteemiaProvider,
    SteeemActionsProvider,
    UtilProvider,
    AlertsProvider,
    FileTransfer,
    FileTransferObject,
    File,
    Camera,
    CryptoProvider,
    //SecureStorage, // Only for prod build
    { provide: SecureStorage, useClass: SecureStorageMock }, // Only for dev build
    GoogleTrackingProvider,
    //GoogleAnalytics,
    { provide: GoogleAnalytics, useClass: GoogleAnalyticsMock },
    WebsocketsProvider
  ]
})
export class AppModule {}
