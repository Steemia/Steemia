import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, App, Tabs, Tab, NavController } from 'ionic-angular';
import { WebsocketsProvider } from 'providers/websockets/websockets';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { AlertsProvider } from 'providers/alerts/alerts';
import { SharedServiceProvider } from 'providers/shared-service/shared-service';

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
          <ion-title [ngClass]="{'title-centered': (selectedIndex == 0)}">
            <div *ngIf="selectedIndex == 0">Steemia</div>
            <ion-item *ngIf="selectedIndex != 0" class="custom-item" no-lines (click)="openPage('TagsPage', false)">
              <ion-select [(ngModel)]="current_tag" disabled="true">
                <ion-option *ngFor="let tag of tags" [value]="tag">
                 {{ tag }}
                </ion-option>
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
      <ion-tabs #navTabs mode="wp" (ionChange)="tabChange($event)">
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
  @ViewChild("navTabs") navTabs: Tabs;

  private feedRoot = 'FeedPage';
  private trendRoot = 'TrendPage';
  private hotRoot = 'HotPage';
  private newRoot = 'NewPage';
  private notifications: number = 0;

  private current_tag: string = "All Tags";
  private tags: Array<string> = ["All Tags"];
  selectedIndex: number = 0;
  calledOnce: boolean = false;


  constructor(private appCtrl: App,
    private ws: WebsocketsProvider,
    private sharedProvider: SharedServiceProvider,
    private cdr: ChangeDetectorRef,
    private navCtrl: NavController,
    private alerts: AlertsProvider,
    private steemConnect: SteemConnectProvider) {

    this.ws.counter.subscribe(count => {
      this.notifications = count;
    });
    
  }

  ionViewDidLoad(): void {

    this.sharedProvider.current_tag.subscribe(tag => {

      if (tag === "") {
        this.current_tag = "All Tags";
        this.tags = ["All Tags"]
      }

      else {
        this.current_tag = tag;
        this.tags = [tag];
      }
      
    });
  }

  ionViewWillEnter() {
    this.steemConnect.status.subscribe(res => {

      if (this.calledOnce === false) {
        if (res.status === true) {
          // set feed tab as active
          this.changeTab(0);
          this.calledOnce = true;
        }
  
        else {
          // set trending tab as active
          this.changeTab(4);
          this.calledOnce = true;
        }
      }
      
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
        this.appCtrl.getRootNavs()[0].push('LoginPage');
      }
    }
    else {
      this.appCtrl.getRootNavs()[0].push(str);
    }
  }

  tabChange(tab: Tab): void {
    this.selectedIndex = tab.index;
  }

  changeTab(tabIndex: number): void {
    this.navTabs.select(tabIndex);
  }

}
