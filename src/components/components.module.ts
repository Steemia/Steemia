import { NgModule } from '@angular/core';
import { PostCardComponent } from './post-card/post-card';
import { PostRenderComponent } from './post-render/post-render';
import { SkeletonLoadingComponent } from './skeleton-loading/skeleton-loading';
import { MomentModule } from 'angular2-moment';
import { IonicImageLoader } from 'ionic-image-loader';
import { IonicModule } from "ionic-angular";

@NgModule({
	declarations: [PostCardComponent, PostRenderComponent, SkeletonLoadingComponent],
	imports: [IonicModule, MomentModule, IonicImageLoader],
	exports: [PostCardComponent, PostRenderComponent, SkeletonLoadingComponent]
})
export class ComponentsModule {}
