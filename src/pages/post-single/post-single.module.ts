import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostSinglePage } from './post-single';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    declarations: [
        PostSinglePage
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(PostSinglePage),
        TranslateModule.forChild()
    ]
})
export class PostSinglePageModule { }
