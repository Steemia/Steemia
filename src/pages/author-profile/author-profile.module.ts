import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthorProfilePage } from './author-profile';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
      AuthorProfilePage,
  ],
  imports: [
      ComponentsModule,
      IonicPageModule.forChild(AuthorProfilePage),
      TranslateModule.forChild()
  ],
})
export class AuthorProfilePageModule {}
