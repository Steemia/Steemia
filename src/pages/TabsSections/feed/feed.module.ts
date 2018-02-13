import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedPage } from './feed';
import { ComponentsModule } from '../../../components/components.module';


@NgModule({
  declarations: [
    FeedPage
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(FeedPage),
  ],
})
export class FeedPageModule {}
