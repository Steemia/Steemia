import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostSinglePage } from './post-single';
import { ComponentsModule } from '../../components/components.module';
import { MomentModule } from 'angular2-moment';

@NgModule({
    declarations: [
        PostSinglePage,
    ],
    imports: [
        MomentModule,
        ComponentsModule,
        IonicPageModule.forChild(PostSinglePage),
    ],
})
export class PostSinglePageModule { }
