import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookmarksPage } from './bookmarks';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    BookmarksPage,
  ],
  imports: [
    IonicPageModule.forChild(BookmarksPage),
    TranslateModule.forChild()
  ],
})
export class BookmarksPageModule {}
