import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VotingSliderPage } from './voting-slider';

@NgModule({
  declarations: [
    VotingSliderPage,
  ],
  imports: [
    IonicPageModule.forChild(VotingSliderPage),
  ],
})
export class VotingSliderPageModule {}
