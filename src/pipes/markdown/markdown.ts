import { Pipe, PipeTransform } from '@angular/core';
import marked from 'marked';

/**
 * Generated class for the MarkdownPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'parseMarkdown',
})
export class MarkdownPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(str: string) {
    return marked(str.toString());
  }
}
