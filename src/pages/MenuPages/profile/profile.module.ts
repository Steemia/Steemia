import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
      ProfilePage,
  ],
  imports: [
      ComponentsModule,
      IonicPageModule.forChild(ProfilePage),
      TranslateModule.forChild()
  ],
})
export class ProfilePageModule {}
