import { Directive, ElementRef, Renderer } from '@angular/core';
import { Content } from "ionic-angular";

/**
 * Generated class for the HidefabDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[hide-fab]', // Attribute selector
  host: {
    '(ionScroll)': 'handleScroll($event)'
  }
})
export class HidefabDirective {

  private fabRef;
  private storedScroll: number = 0;
  private threshold: number = 10;

  constructor(public element:ElementRef,public renderer:Renderer) {
    
  }

  ngAfterViewInit() {
    this.fabRef = this.element.nativeElement.getElementsByClassName("fab")[0];
    this.renderer.setElementStyle(this.fabRef, 'webkitTransition', 'transform 500ms,top 500ms');
  }
 
  handleScroll(event: Content) {
    if (event.scrollTop - this.storedScroll > this.threshold) {
      
        this.renderer.setElementStyle(this.fabRef, 'top', '60px');
        this.renderer.setElementStyle(this.fabRef, 'webkitTransform', 'scale3d(.1,.1,.1)');

    } else if (event.scrollTop - this.storedScroll < 0) {

        this.renderer.setElementStyle(this.fabRef, 'top', '0');
        this.renderer.setElementStyle(this.fabRef, 'webkitTransform', 'scale3d(1,1,1)');
    }
    // console.log(event.scrollTop - this.storedScroll);
    this.storedScroll = event.scrollTop;
  }

}
