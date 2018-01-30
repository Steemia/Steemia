import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PromotedPage } from './promoted';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    PromotedPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(PromotedPage),
  ],
})
export class PromotedPageModule {}
