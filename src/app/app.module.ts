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

// IONIC NATIVE / PROVIDERS
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BrowserTab } from '@ionic-native/browser-tab';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { SecureStorageMock } from '@ionic-native-mocks/secure-storage';
import { GoogleAnalyticsMock } from '@ionic-native-mocks/google-analytics';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FCM } from '@ionic-native/fcm';
import { Clipboard } from '@ionic-native/clipboard';

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
import { CameraProvider } from '../providers/camera/camera';
import { SettingsProvider } from '../providers/settings/settings';
import { SharedServiceProvider } from '../providers/shared-service/shared-service';


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
    SettingsProvider,
    Clipboard,
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
    GoogleTrackingProvider,
    GoogleAnalytics,
    //{ provide: GoogleAnalytics, useClass: GoogleAnalyticsMock },
    WebsocketsProvider,
    FCM,
    CameraProvider,
    SharedServiceProvider
  ]
})
export class AppModule {}
