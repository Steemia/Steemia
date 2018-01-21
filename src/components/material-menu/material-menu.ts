import { Component, Input, SimpleChange, OnInit } from '@angular/core';

@Component({
  selector: 'material-menu',
  templateUrl: 'material-menu.html'
})
export class MaterialMenuComponent implements OnInit {

  @Input() options: MaterialMenuOptions;

  private _options = {};

  constructor() {
    
  }

  ngOnInit() {
    if (this.options === undefined || this.options === null) {
      console.error('[MaterialMenuComponent] options are not defined.');
      return;
    }
    this._options = this.options;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    let o: SimpleChange = changes['options'];
    if (this.options && o && !o.isFirstChange()) {
      this._options = o.currentValue;
    }
  }

  isBadgeEntry(entry) {
    return entry.badge && entry.badge.text;
  }

  isDividerEntry(entry) {
    return entry.isDivider && entry.isDivider === true;
  }

}

export interface MaterialMenuOptions {
  header: {
    background: string,
    picture: string,
    username: string,
    email?: string,
    onClick?: Function
  },
  entries: Array<{
    title?: string,
    isSelected?: boolean,
    isDivider?: boolean,
    component?: any,
    leftIcon?: string,
    rightIcon?: string,
    classes?: string,
    onClick?: Function,
    badge?: {
      text?: string,
      color?: string
    }
  }>
}