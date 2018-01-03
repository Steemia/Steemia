import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage } from './tabs';
import { HomePage } from '../home/home'

@NgModule({
  declarations: [
    TabsPage,
    HomePage
  ],
  imports: [
    IonicPageModule.forChild(TabsPage),
    IonicPageModule.forChild(HomePage),
  ]
})
export class TabsPageModule {}
