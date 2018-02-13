import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedPage } from './feed';
import { ComponentsModule } from '../../../components/components.module';

import { AutoHideDirective } from '../../../directives/auto-hide/auto-hide';

@NgModule({
  declarations: [
    FeedPage,
    AutoHideDirective
  ],
  imports: [
    ComponentsModule,
    
    IonicPageModule.forChild(FeedPage),
  ],
})
export class FeedPageModule {}
