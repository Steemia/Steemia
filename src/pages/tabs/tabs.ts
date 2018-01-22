import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  private feedRoot: string = 'FeedPage'
  private trendRoot: string = 'TrendPage'
  private addRoot: string = 'AddPage'
  private hotRoot: string = 'HotPage'
  private newRoot: string = 'NewPage'
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
