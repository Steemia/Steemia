import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthorProfilePage } from './author-profile';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AuthorProfilePage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(AuthorProfilePage),
  ],
})
export class AuthorProfilePageModule {}
