import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http'
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { MyApp } from './app.component';
import { DataProvider } from 'providers/data/data';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
//import { ActionsSteem } from 'providers/steemconnect/actions';
import { IonicStorageModule } from '@ionic/storage';
import { MaterialMenuComponent } from '../components/material-menu/material-menu';
import { SteemProvider } from 'providers/steem/steem';
import { HttpClientModule } from '@angular/common/http';
import { SteemiaProvider } from '../providers/steemia/steemia';
import { IonicImageLoader } from 'ionic-image-loader';
import { TabsPage } from '../pages/tabs/tabs';
import { FeedPage } from '../pages/TabsSections/feed/feed';
import { HotPage } from '../pages/TabsSections/hot/hot';
import { NewPage } from '../pages/TabsSections/new/new';
import { PromotedPage } from '../pages/TabsSections/promoted/promoted';
import { TrendPage } from '../pages/TabsSections/trend/trend';
import { PostRenderComponent } from '../components/post-render/post-render';
import { SkeletonLoadingComponent } from '../components/skeleton-loading/skeleton-loading';
import { MomentModule } from 'angular2-moment';
import { PostCardComponent } from '../components/post-card/post-card';

@NgModule({
  declarations: [
    MaterialMenuComponent,
    MyApp,
    TabsPage,
    FeedPage,
    HotPage,
    NewPage,
    PromotedPage,
    TrendPage,
    PostRenderComponent,
    SkeletonLoadingComponent,
    PostCardComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'top',
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false,
      preloadModules: true
    }),
    IonicStorageModule.forRoot(),
    IonicImageLoader.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    FeedPage,
    HotPage,
    NewPage,
    PromotedPage,
    TrendPage
  ],
  providers: [
    StatusBar,
    InAppBrowser,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    SteemConnectProvider,
    SteemProvider,
    SteemiaProvider,
  ]
})
export class AppModule {}
