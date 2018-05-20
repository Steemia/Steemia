import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotPage } from './hot';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
      HotPage,
  ],
  imports: [
      ComponentsModule,
      IonicPageModule.forChild(HotPage),
      TranslateModule.forChild()
  ],
})
export class HotPageModule {}
