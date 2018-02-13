import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage } from './tabs';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { AutoHideDirective } from '../../directives/auto-hide/auto-hide';


@NgModule({
  declarations: [
    TabsPage,
    AutoHideDirective
  ],
  imports: [
    SuperTabsModule,
    IonicPageModule.forChild(TabsPage),
  ]
})
export class TabsPageModule {}
