import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostSinglePage } from './post-single';

@NgModule({
  declarations: [
    PostSinglePage,
  ],
  imports: [
    IonicPageModule.forChild(PostSinglePage),
  ],
})
export class PostSinglePageModule {}
