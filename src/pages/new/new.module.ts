import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewPage } from './new';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    NewPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(NewPage),
  ],
})
export class NewPageModule {}
