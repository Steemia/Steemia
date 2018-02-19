import { Component } from '@angular/core';
import { FeedPage } from '../TabsSections/feed/feed';
import { HotPage } from '../TabsSections/hot/hot';
import { NewPage } from '../TabsSections/new/new';
import { TrendPage } from '../TabsSections/trend/trend';
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
          <ion-tab [root]="feedRoot" tabIcon="list"></ion-tab>
          <ion-tab [root]="trendRoot" tabIcon="pulse"></ion-tab>
          <ion-tab></ion-tab>
          <ion-tab [root]="hotRoot" tabIcon="flame"></ion-tab>
          <ion-tab [root]="newRoot" tabIcon="flash"></ion-tab>
      </ion-tabs>

      <ion-fab center bottom>
        <button ion-fab color="primary">
          <ion-icon name="create"></ion-icon>
        </button>
      </ion-fab>
    </ion-content>
  `
})
export class TabsPage {

  private feedRoot = FeedPage;
  private trendRoot = TrendPage;
  private hotRoot = HotPage;
  private newRoot = NewPage;

  constructor(private appCtrl: App) { }

  /**
   * @method openPage: Method to push a page to the nav controller
   * @param {string} str: the name of the page to push
   */
  private openPage(str: string): void {
    this.appCtrl.getRootNavs()[0].push(str);
  }

}
