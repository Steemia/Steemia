import { Component } from '@angular/core';

/**
 * Generated class for the ShrinkingSegmentHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'shrinking-segment-header',
  templateUrl: 'shrinking-segment-header.html'
})
export class ShrinkingSegmentHeaderComponent {

  text: string;

  constructor() {
    console.log('Hello ShrinkingSegmentHeaderComponent Component');
    this.text = 'Hello World';
  }

}
