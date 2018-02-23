import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http'
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BrowserTab } from '@ionic-native/browser-tab';

import { MyApp } from './app.component';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { IonicStorageModule } from '@ionic/storage';
import { MaterialMenuComponent } from '../components/material-menu/material-menu';
import { SteemProvider } from 'providers/steem/steem';
import { HttpClientModule } from '@angular/common/http';
import { SteemiaProvider } from '../providers/steemia/steemia';
import { IonicImageLoader } from 'ionic-image-loader';

// PAGES
import { AuthorProfilePage } from '../pages/author-profile/author-profile';
import { TabsPage } from '../pages/tabs/tabs';
import { FeedPage } from '../pages/TabsSections/feed/feed';
import { HotPage } from '../pages/TabsSections/hot/hot';
import { NewPage } from '../pages/TabsSections/new/new';
import { TrendPage } from '../pages/TabsSections/trend/trend';

// COMPONENTS
import { SkeletonLoadingComponent } from '../components/skeleton-loading/skeleton-loading';
import { MomentModule } from 'angular2-moment';
import { PostRenderComponent } from '../components/post-render/post-render';
import { PostCardComponent } from '../components/post-card/post-card';
import { SteeemActionsProvider } from '../providers/steeem-actions/steeem-actions';

@NgModule({
  declarations: [
    MaterialMenuComponent,
    MyApp,
    TabsPage,
    FeedPage,
    HotPage,
    NewPage,
    TrendPage,
    PostRenderComponent,
    SkeletonLoadingComponent,
    PostCardComponent,
    AuthorProfilePage
  ],
  imports: [
    MomentModule,
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
    }),
    IonicStorageModule.forRoot({ name: '__mydb', driverOrder: ['sqlite', 'websql', 'indexeddb'] }),
    IonicImageLoader.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    FeedPage,
    HotPage,
    NewPage,
    TrendPage,
    AuthorProfilePage
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
  ]
})
export class AppModule {}
