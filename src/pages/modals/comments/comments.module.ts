import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentsPage } from './comments';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
      CommentsPage,
  ],
  imports: [
      ComponentsModule,
      IonicPageModule.forChild(CommentsPage),
      TranslateModule.forChild()
  ],
})
export class CommentsPageModule {}
