import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentsPage } from './comments';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    CommentsPage,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(CommentsPage),
  ],
})
export class CommentsPageModule {}
