import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletPage } from './wallet';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    WalletPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(WalletPage),
    TranslateModule.forChild()
  ],
})
export class WalletPageModule {}