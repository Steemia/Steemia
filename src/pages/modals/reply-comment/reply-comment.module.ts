import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReplyCommentPage } from './reply-comment';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    ReplyCommentPage,
  ],
  imports: [
    IonicPageModule.forChild(ReplyCommentPage),
    TranslateModule.forChild()
  ],
})
export class ReplyCommentPageModule {}
