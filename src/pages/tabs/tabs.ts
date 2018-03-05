import { Component } from '@angular/core';
import { App } from 'ionic-angular';

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
          <button ion-button icon-only (click)="openPage('SearchPage')">
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
      <ion-tab [root]="newRoot" tabTitle="New" tabIcon="flash"></ion-tab>
      <ion-tab [root]="hotRoot" tabTitle="Hot" tabIcon="flame"></ion-tab>
      <ion-tab></ion-tab>
      <ion-tab [root]="trendRoot" tabTitle="Trending" tabIcon="pulse"></ion-tab>
      <ion-tab [root]="feedRoot" tabTitle="Feed" tabIcon="list"></ion-tab>
      </ion-tabs>

      <ion-fab center bottom>
        <button ion-fab color="primary" (click)="openPage('PostPage')">
          <ion-icon name="create"></ion-icon>
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

  constructor(private appCtrl: App) {
   }

  /**
   * @method openPage: Method to push a page to the nav controller
   * @param {string} str: the name of the page to push
   */
  private openPage(str: string): void {
    this.appCtrl.getRootNavs()[0].push(str);
  }

}
