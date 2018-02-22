import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EthereumPage } from './ethereum';

@NgModule({
  declarations: [
    EthereumPage,
  ],
  imports: [
    IonicPageModule.forChild(EthereumPage),
  ],
})
export class EthereumPageModule {}
