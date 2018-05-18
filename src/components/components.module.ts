import { NgModule } from '@angular/core';
import { CommentComponent } from './comment/comment';
import { PostCardComponent } from './post-card/post-card';
import { NoDataComponent } from './no-data/no-data';
import { WalletItemComponent } from './wallet-item/wallet-item';
import { UserItemComponent } from './user-item/user-item';
import { IonicModule } from 'ionic-angular';
import { YoutubePlayerModule } from 'ngx-youtube-player';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [
		CommentComponent,
		PostCardComponent,
		NoDataComponent,
		WalletItemComponent,
		UserItemComponent
	],

	imports: [
		YoutubePlayerModule,
		IonicModule,
		TranslateModule.forChild()
	],

	exports: [
		CommentComponent,
		PostCardComponent,
		NoDataComponent,
		WalletItemComponent,
		UserItemComponent
	]
})
export class ComponentsModule { }
