import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationsPage } from './notifications';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    NotificationsPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationsPage),
    TranslateModule.forChild()
  ],
})
export class NotificationsPageModule {}
