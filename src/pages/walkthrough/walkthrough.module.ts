import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalkthroughPage } from './walkthrough';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    WalkthroughPage,
  ],
  imports: [
    IonicPageModule.forChild(WalkthroughPage),
    TranslateModule.forChild()
  ],
})
export class WalkthroughPageModule {}
