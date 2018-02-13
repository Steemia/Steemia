import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrendPage } from './trend';
import { ComponentsModule } from '../../../components/components.module';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    TrendPage,
  ],
  imports: [
    ComponentsModule,
    IonicImageLoader,
    IonicPageModule.forChild(TrendPage),
  ],
})
export class TrendPageModule {}
