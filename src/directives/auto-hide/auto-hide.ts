import { Directive, Renderer, ElementRef } from '@angular/core';

/**
 * Generated class for the AutoHideDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[auto-hide]', // Attribute selector
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class AutoHideDirective {

  private fabRef;
  private storedScroll: number = 0;
  private threshold: number = 10;

  constructor(private renderer: Renderer, 
              public element: ElementRef) {
    console.log('Hello AutoHideDirective Directive');
  }

  ngAfterViewInit() {

    this.fabRef = this.element.nativeElement.getElementsByClassName('fab')[0];
    this.renderer.setElementStyle(this.fabRef, 'webkitTransition', 'transform 500ms,top 500ms');

  }

  onContentScroll(event) {
    if (event.scrollTop - this.storedScroll > this.threshold) {
      this.renderer.setElementStyle(this.fabRef, 'top', '60px');
      this.renderer.setElementStyle(this.fabRef, 'webkitTransform', 'scale3d(.1,.1,.1)');

    } else if (event.scrollTop - this.storedScroll < 0) {
      this.renderer.setElementStyle(this.fabRef, 'top', '0');
      this.renderer.setElementStyle(this.fabRef, 'webkitTransform', 'scale3d(1,1,1)');
    }
    
    this.storedScroll = event.scrollTop;
  }

}
