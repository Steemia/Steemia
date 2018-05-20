import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostSinglePage } from './post-single';
import { ComponentsModule } from '../../components/components.module';
import { MomentModule } from 'angular2-moment';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    declarations: [
        PostSinglePage,
    ],
    imports: [
        MomentModule,
        ComponentsModule,
        IonicPageModule.forChild(PostSinglePage),
        TranslateModule.forChild()
    ],
})
export class PostSinglePageModule { }
