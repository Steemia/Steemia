import { Component, ViewChild } from '@angular/core';
import { IonicPage, App, Tabs } from 'ionic-angular';
import { WebsocketsProvider } from 'providers/websockets/websockets';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { AlertsProvider } from 'providers/alerts/alerts';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-tabs',
  template: `
      <ion-header id="header">
        <ion-navbar color="primary">
          <button ion-button menuToggle>
            <ion-icon name="mdi-menu"></ion-icon>
          </button>
          <ion-title>
            <ion-item class="custom-item" no-lines>
              <ion-select [(ngModel)]="tags" interface="popover">
                <ion-option value="all_tags">All Tags</ion-option>
                <ion-option>Today</ion-option>
                <ion-option>Next 7 Days</ion-option>
                <ion-option>Overdue</ion-option>
                <ion-option>Watching</ion-option>
                <ion-option>Favourites</ion-option>
                <ion-option>Tasks assigned to</ion-option>
                <ion-option>Tasks I've assigned</ion-option>
              </ion-select>
            </ion-item>
          </ion-title>
          <ion-buttons end>
            <button ion-button icon-only (click)="openPage('SearchPage', false)">
              <ion-icon name="mdi-magnify"></ion-icon>
            </button>
            <button id="notification-button" ion-button icon-only (click)="openPage('NotificationsPage', true)">
              <ion-badge color="danger" *ngIf="notifications != 0">{{ notifications }}</ion-badge>
              <ion-icon name="mdi-bell"></ion-icon>              
            </button>
          </ion-buttons>
        </ion-navbar>
      </ion-header>

    <ion-content>
      <ion-tabs mode="wp">
        <ion-tab [root]="feedRoot" tabTitle="Feed" tabIcon="mdi-file-document-box"></ion-tab>
        <ion-tab [root]="newRoot" tabTitle="New" tabIcon="mdi-flash-circle" ></ion-tab>
        <ion-tab></ion-tab>
        <ion-tab [root]="hotRoot" tabTitle="Hot" tabIcon="mdi-flame"></ion-tab>
        <ion-tab [root]="trendRoot" tabTitle="Trending" tabIcon="mdi-elevation-rise" ></ion-tab>
      </ion-tabs>
      <ion-fab center bottom>
        <button ion-fab color="primary" (click)="openPage('PostPage', true)">
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

  private tags: string = "all_tags";

  constructor(private appCtrl: App,
    private ws: WebsocketsProvider,
    private alerts: AlertsProvider,
    private steemConnect: SteemConnectProvider) {

    this.ws.counter.subscribe(count => {
      this.notifications = count;
    });
  }

  /**
   * @method openPage: Method to push a page to the nav controller
   * @param {string} str: the name of the page to push
   */
  private openPage(str: string, restricted: boolean): void {

    if (restricted === true) {
      if ((this.steemConnect.user_temp as any).user) {
        this.appCtrl.getRootNavs()[0].push(str);
      }

      else {
        this.alerts.display_alert('NOT_LOGGED_IN');
      }
    }
    else {
      this.appCtrl.getRootNavs()[0].push(str);
    }
  }

}
