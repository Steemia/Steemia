import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PendingPayoutPage } from './pending-payout';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    PendingPayoutPage,
  ],
  imports: [
    IonicPageModule.forChild(PendingPayoutPage),
    TranslateModule.forChild()
  ],
})
export class PendingPayoutPageModule {}
