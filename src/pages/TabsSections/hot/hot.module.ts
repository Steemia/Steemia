import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotPage } from './hot';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    HotPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(HotPage),
  ],
})
export class HotPageModule {}
