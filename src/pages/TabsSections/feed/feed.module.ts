import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedPage } from './feed';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
      FeedPage,
  ],
  imports: [
      ComponentsModule,
      IonicPageModule.forChild(FeedPage),
      TranslateModule.forChild()
  ],
})
export class FeedPageModule {}
