import { Component } from '@angular/core';
import { IonicPage, App } from 'ionic-angular';
import { WebsocketsProvider } from 'providers/websockets/websockets';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-tabs',
  template: `
    <ion-header>
      <ion-navbar color="primary">
        <button ion-button menuToggle>
          <ion-icon name="mdi-menu"></ion-icon>
        </button>
        <ion-title>
          Steemia
        </ion-title>
        <ion-buttons end>
          <button ion-button icon-only (click)="openPage('SearchPage')">
            <ion-icon name="mdi-magnify"></ion-icon>
          </button>
          <button id="notification-button" ion-button icon-only (click)="openPage('NotificationsPage')">
            <ion-badge color="danger" *ngIf="notifications != 0">{{ notifications }}</ion-badge>
            <ion-icon name="mdi-bell"></ion-icon>              
          </button>
        </ion-buttons>
      </ion-navbar>
    </ion-header>
    <ion-content>
    <ion-tabs>
      <ion-tab [root]="newRoot" tabIcon="mdi-flash-circle" tabTitle="New"></ion-tab>
      <ion-tab [root]="hotRoot" tabIcon="mdi-flame" tabTitle="Hot"></ion-tab>
      <ion-tab></ion-tab>
      <ion-tab [root]="trendRoot" tabIcon="mdi-elevation-rise" tabTitle="Trending"></ion-tab>
      <ion-tab [root]="feedRoot" tabIcon="mdi-file-document-box" tabTitle="Feed"></ion-tab>
    </ion-tabs>
      <ion-fab center bottom>
        <button ion-fab color="primary" (click)="openPage('PostPage')">
          <ion-icon name="mdi-message-draw"></ion-icon>
        </button>
      </ion-fab>
    </ion-content>
  `
})
export class TabsPage {

  private feedRoot = 'FeedPage';
  private trendRoot = 'TrendPage';
  private hotRoot = 'HotPage';
  private newRoot = 'NewPage';
  private notifications: number = 0;

  constructor(private appCtrl: App, private ws: WebsocketsProvider) {
    this.ws.counter.subscribe(count => {
      this.notifications = count;
    });
  }

  /**
   * @method openPage: Method to push a page to the nav controller
   * @param {string} str: the name of the page to push
   */
  private openPage(str: string): void {
    this.appCtrl.getRootNavs()[0].push(str);
  }

}
