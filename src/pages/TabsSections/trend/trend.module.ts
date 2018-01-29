import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrendPage } from './trend';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    TrendPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(TrendPage),
  ],
})
export class TrendPageModule {}
