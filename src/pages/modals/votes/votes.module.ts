import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VotesPage } from './votes';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    VotesPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(VotesPage),
    TranslateModule.forChild()
  ],
})
export class VotesPageModule {}
