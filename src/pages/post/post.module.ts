import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostPage } from './post';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    PostPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(PostPage),
    TranslateModule.forChild()
  ],
})
export class PostPageModule {}
