import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookmarksPage } from './bookmarks';

@NgModule({
  declarations: [
    BookmarksPage,
  ],
  imports: [
    IonicPageModule.forChild(BookmarksPage),
  ],
})
export class BookmarksPageModule {}
