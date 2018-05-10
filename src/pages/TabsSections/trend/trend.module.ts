import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrendPage } from './trend';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
      TrendPage,
  ],
  imports: [
      ComponentsModule,
      IonicPageModule.forChild(TrendPage),
      TranslateModule.forChild()
  ],
})
export class TrendPageModule {}
