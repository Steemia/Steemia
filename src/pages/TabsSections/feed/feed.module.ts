import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedPage } from './feed';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  declarations: [
    FeedPage
  ],
  imports: [
    DirectivesModule,
    ComponentsModule,
    IonicPageModule.forChild(FeedPage),
  ],
})
export class FeedPageModule {}
