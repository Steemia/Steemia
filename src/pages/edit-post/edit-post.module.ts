import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditPostPage } from './edit-post';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    EditPostPage,
  ],
  imports: [
    IonicPageModule.forChild(EditPostPage),
    TranslateModule.forChild()
  ],
})
export class EditPostPageModule {}
