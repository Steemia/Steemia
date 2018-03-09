import { Component, Input } from '@angular/core';

@Component({
  selector: 'no-data',
  templateUrl: 'no-data.html'
})
export class NoDataComponent {

  @Input() title: string;
  @Input() icon: string;

  constructor() { }

}
