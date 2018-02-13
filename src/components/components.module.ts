import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostRenderComponent } from './post-render/post-render';
import { MomentModule } from 'angular2-moment';
import { IonicModule } from "ionic-angular"
import { SkeletonLoadingComponent } from './skeleton-loading/skeleton-loading';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
	declarations: [PostRenderComponent,
    SkeletonLoadingComponent ],
	imports: [IonicModule, CommonModule, MomentModule, IonicImageLoader],
	exports: [PostRenderComponent,
    SkeletonLoadingComponent],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ComponentsModule {}
