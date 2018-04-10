import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditCommentPage } from './edit-comment';

@NgModule({
  declarations: [
    EditCommentPage,
  ],
  imports: [
    IonicPageModule.forChild(EditCommentPage),
  ],
})
export class EditCommentPageModule {}
