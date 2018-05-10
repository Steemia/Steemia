import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditCommentPage } from './edit-comment';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    EditCommentPage,
  ],
  imports: [
    IonicPageModule.forChild(EditCommentPage),
    TranslateModule.forChild()
  ],
})
export class EditCommentPageModule {}
