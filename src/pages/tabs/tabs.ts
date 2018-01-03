import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the TabsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
