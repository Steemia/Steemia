import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FollowListPage } from './follow-list';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    FollowListPage,
  ],
  imports: [
    IonicPageModule.forChild(FollowListPage),
    TranslateModule.forChild()
  ],
})
export class FollowListPageModule {}
