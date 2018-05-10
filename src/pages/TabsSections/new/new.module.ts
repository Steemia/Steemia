import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewPage } from './new';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
      NewPage,
  ],
  imports: [
      ComponentsModule,
      IonicPageModule.forChild(NewPage),
      TranslateModule.forChild()
  ],
})
export class NewPageModule {}
