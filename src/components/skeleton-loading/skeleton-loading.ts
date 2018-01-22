import { Component } from '@angular/core';

/**
 * Generated class for the SkeletonLoadingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'skeleton-loading',
  templateUrl: 'skeleton-loading.html'
})
export class SkeletonLoadingComponent {

  private mockArray: Array<string> = new Array(2);

  constructor() {}

}
