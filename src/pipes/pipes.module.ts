import { NgModule } from '@angular/core';
import { MarkdownPipe } from './markdown/markdown';
import { KeepHtmlPipe } from './keep-html/keep-html';
@NgModule({
	declarations: [MarkdownPipe,
    KeepHtmlPipe],
	imports: [],
	exports: [MarkdownPipe,
    KeepHtmlPipe]
})
export class PipesModule {}
