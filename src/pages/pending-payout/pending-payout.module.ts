import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PendingPayoutPage } from './pending-payout';

@NgModule({
  declarations: [
    PendingPayoutPage,
  ],
  imports: [
    IonicPageModule.forChild(PendingPayoutPage),
  ],
})
export class PendingPayoutPageModule {}
