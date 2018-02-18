import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthorProfilePage } from './author-profile';

@NgModule({
  declarations: [
    AuthorProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(AuthorProfilePage),
  ],
})
export class AuthorProfilePageModule {}
