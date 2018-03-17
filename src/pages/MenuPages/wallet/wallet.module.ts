import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletPage } from './wallet';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    WalletPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(WalletPage),
  ],
})
export class WalletPageModule {}