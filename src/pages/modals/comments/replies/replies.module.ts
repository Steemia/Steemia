import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RepliesPage } from './replies';

@NgModule({
  declarations: [
    RepliesPage,
  ],
  imports: [
    IonicPageModule.forChild(RepliesPage),
  ],
})
export class RepliesPageModule {}
