import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TagsPage } from './tags';

@NgModule({
  declarations: [
    TagsPage,
  ],
  imports: [
    IonicPageModule.forChild(TagsPage),
  ],
})
export class TagsPageModule {}
