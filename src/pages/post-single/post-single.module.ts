import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostSinglePage } from './post-single';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PostSinglePage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(PostSinglePage)
  ],
})
export class PostSinglePageModule {}
