import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  feedRoot = 'FeedPage'
  trendRoot = 'TrendPage'
  addRoot = 'AddPage'
  hotRoot = 'HotPage'
  newRoot = 'NewPage'


  constructor(public navCtrl: NavController) {}

}
