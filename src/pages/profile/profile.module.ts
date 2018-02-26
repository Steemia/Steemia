import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { ComponentsModule } from '../../components/components.module';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
      ProfilePage,
  ],
  imports: [
      MomentModule,
      ComponentsModule,
      IonicPageModule.forChild(ProfilePage),
  ],
})
export class ProfilePageModule {}
