import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * 
 */

@Component({
  selector: 'wallet-item',
  templateUrl: 'wallet-item.html'
})
export class WalletItemComponent {

  @Input('name') private name: String;
  @Input('balance') private balance: any;
  @Input('price') private price: any;
  @Input('icon') private icon: string;
  @Input('native') private native: string;
  @Input('coinAb') private coinAb: string;
  @Output() private tapEvent = new EventEmitter();

  /**
   * Method to emit clicked event of a item to main
   * component.
   * @param {String} type 
   */
  private emit_data(type: string) {

    // Send type of action to host component
    this.tapEvent.emit({
      type: type,
      name: this.name
    });

  }

}
