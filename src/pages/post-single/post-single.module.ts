import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostSinglePage } from './post-single';
import { EmbedVideo } from 'ngx-embed-video';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PostSinglePage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(PostSinglePage),
    EmbedVideo.forRoot()
  ],
})
export class PostSinglePageModule {}
