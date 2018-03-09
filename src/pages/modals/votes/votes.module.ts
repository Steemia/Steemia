import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VotesPage } from './votes';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    VotesPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(VotesPage),
  ],
})
export class VotesPageModule {}
