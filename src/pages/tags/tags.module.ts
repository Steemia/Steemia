import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TagsPage } from './tags';
import { PipesModule } from '../../pipes/pipes.module';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    TagsPage,
  ],
  imports: [
    TranslateModule,
    PipesModule,
    IonicPageModule.forChild(TagsPage),
  ],
})
export class TagsPageModule {}
