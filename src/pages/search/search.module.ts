import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPage } from './search';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(SearchPage),
  ],
})
export class SearchPageModule {}
