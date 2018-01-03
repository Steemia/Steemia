import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrendPage } from './trend';

@NgModule({
  declarations: [
    TrendPage,
  ],
  imports: [
    IonicPageModule.forChild(TrendPage),
  ],
})
export class TrendPageModule {}
