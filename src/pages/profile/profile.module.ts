import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ProfilePage),
  ],
})
export class ProfilePageModule {}
