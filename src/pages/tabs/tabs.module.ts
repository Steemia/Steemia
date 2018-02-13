import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage } from './tabs';
import { AutoHideDirective } from '../../directives/auto-hide/auto-hide';


@NgModule({
  declarations: [
    TabsPage,
    AutoHideDirective
  ],
  imports: [
    IonicPageModule.forChild(TabsPage),
  ]
})
export class TabsPageModule {}
