import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReplyCommentPage } from './reply-comment';

@NgModule({
  declarations: [
    ReplyCommentPage,
  ],
  imports: [
    IonicPageModule.forChild(ReplyCommentPage),
  ],
})
export class ReplyCommentPageModule {}
