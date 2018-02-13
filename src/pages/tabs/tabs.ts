import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  private feedRoot: string = 'FeedPage';
  private trendRoot: string = 'TrendPage';
  private promotedRoot: string = 'PromotedPage';
  private hotRoot: string = 'HotPage';
  private newRoot: string = 'NewPage';

  constructor(private superTabsCtrl: SuperTabsController) {
    this.superTabsCtrl.showToolbar(true);
    this.superTabsCtrl.enableTabsSwipe(true)
    
  }

}
