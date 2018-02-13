import { Directive, ElementRef, Renderer } from '@angular/core';
import { NavController } from 'ionic-angular';

@Directive({
  selector: '[hide-header]', // Attribute selector
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class HideHeaderDirective {

  header: any;
  tab: any;
  headerHeight: any;
  tabHeight: any;
  translateAmt: any;
  scrollPosition: number = 0;
  lastScrollTop: number = 0;
  activePage: any;

  constructor(private element: ElementRef,
    private renderer: Renderer,
    private navCtrl: NavController) {
    console.log('Hello HideHeaderDirective Directive');
  }

  ngAfterViewInit() {

    // lets get the active page's view controller
    this.activePage = this.navCtrl.getActive()._cmp;

    // let's select the header of the active page
    this.header = this.activePage.location.nativeElement.getElementsByClassName("hello")[0];
    this.tab = this.activePage.location.nativeElement.getElementsByClassName("tabbar")[0];


    // the height of the header
    this.headerHeight = this.header.clientHeight;
    //this.tabHeight = this.tab.clientHeight;
  }

  onContentScroll(ev) {
    ev.domWrite(() => {
      this.updateHeader(ev);
    });
  }

  updateHeader(ev) {

    this.scrollPosition = ev.scrollTop;

    if (this.scrollPosition > this.lastScrollTop && this.scrollPosition >= 25) {
      // scrolling down
      this.renderer.setElementStyle(this.header, 'transition', 'all 0.3s linear');
      this.renderer.setElementStyle(this.header, 'transform', 'translateY(-' + this.headerHeight + 'px)');
      // this.renderer.setElementStyle(this.tab, 'transition', 'all 0.3s linear');
      // this.renderer.setElementStyle(this.tab, 'transform', 'translateY(-' + 65 + 'px)');
    } else {
      // scrolling up
      this.renderer.setElementStyle(this.header, 'transform', 'translateY(0px)');
    }

    // reset
    this.lastScrollTop = this.scrollPosition;

  }

}
