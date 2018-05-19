import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  /**
   * Filter out a subset of items on an array
   */
  transform(items: Array<Object>, term: string): Array<Object> {
    if (!items) return [];
    if (!term) return items;
    term = term.toLowerCase();
    return items.filter((it: any) => {
      return it.name.toLowerCase().includes(term);
    });
  }
}
