import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthorProfilePage } from './author-profile';
import { ComponentsModule } from '../../components/components.module';
import { MomentModule } from 'angular2-moment';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
      AuthorProfilePage,
  ],
  imports: [
      MomentModule,
      ComponentsModule,
      IonicPageModule.forChild(AuthorProfilePage),
      TranslateModule.forChild()
  ],
})
export class AuthorProfilePageModule {}
