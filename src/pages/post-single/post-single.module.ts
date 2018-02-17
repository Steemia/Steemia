import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostSinglePage } from './post-single';
import { PipesModule } from '../../pipes/pipes.module';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    PostSinglePage,
  ],
  imports: [
    MomentModule,
    PipesModule,
    IonicPageModule.forChild(PostSinglePage)
  ],
})
export class PostSinglePageModule {}
