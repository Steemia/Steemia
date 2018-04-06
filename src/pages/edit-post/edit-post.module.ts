import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditPostPage } from './edit-post';

@NgModule({
  declarations: [
    EditPostPage,
  ],
  imports: [
    IonicPageModule.forChild(EditPostPage),
  ],
})
export class EditPostPageModule {}
