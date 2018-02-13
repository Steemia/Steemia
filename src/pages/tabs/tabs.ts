import { Component } from '@angular/core';

@Component({
  selector: 'page-tabs',
  template: `
    <ion-header>
      <ion-navbar color="primary">
        <button ion-button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>

        <ion-title>
          Steemia
        </ion-title>

        <ion-buttons end>
          <button ion-button icon-only (tap)="openPage('SearchPage')">
            <ion-icon name="ios-search-outline"></ion-icon>
          </button>
          <button ion-button icon-only>
            <ion-icon name="ios-notifications-outline"></ion-icon>
          </button>
        </ion-buttons>
      </ion-navbar>
    </ion-header>
    <ion-content>
      <ion-tabs>
          <ion-tab [root]="feedRoot" tabIcon="list"></ion-tab>
          <ion-tab [root]="trendRoot" tabIcon="pulse"></ion-tab>
          <ion-tab [root]="hotRoot" tabIcon="flame"></ion-tab>
          <ion-tab [root]="newRoot" tabIcon="flash"></ion-tab>
          <ion-tab [root]="promotedRoot" tabIcon="pricetag"></ion-tab>
      </ion-tabs>
    </ion-content>
  `
})
export class TabsPage {

  private feedRoot: string = 'FeedPage';
  private trendRoot: string = 'TrendPage';
  private promotedRoot: string = 'PromotedPage';
  private hotRoot: string = 'HotPage';
  private newRoot: string = 'NewPage';

  constructor() {


  }

}
