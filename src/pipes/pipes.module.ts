import { NgModule } from '@angular/core';
import { MarkdownPipe } from './markdown/markdown';
@NgModule({
	declarations: [MarkdownPipe],
	imports: [],
	exports: [MarkdownPipe]
})
export class PipesModule {}
