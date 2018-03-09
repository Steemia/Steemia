import { NgModule } from '@angular/core';
import { CommentComponent } from './comment/comment';
import { PostCardComponent } from './post-card/post-card';
import { PostRenderComponent } from './post-render/post-render';

import { MomentModule } from 'angular2-moment';
import { IonicImageLoader } from 'ionic-image-loader';
import { IonicModule } from 'ionic-angular';
import { NoDataComponent } from './no-data/no-data';

@NgModule({
	declarations: [
		CommentComponent, 
		PostCardComponent, 
		PostRenderComponent,
    NoDataComponent
	],

	imports: [
		IonicModule,
		MomentModule,
		IonicImageLoader
	],

	exports: [
		CommentComponent, 
		PostCardComponent, 
		PostRenderComponent,
    NoDataComponent
	]
})
export class ComponentsModule {}
