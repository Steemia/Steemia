import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentsPage } from './comments';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from "@ngx-translate/core";
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  declarations: [
      CommentsPage,
  ],
  imports: [
      ComponentsModule,
      DirectivesModule,
      IonicPageModule.forChild(CommentsPage),
      TranslateModule.forChild()
  ],
})
export class CommentsPageModule {}
