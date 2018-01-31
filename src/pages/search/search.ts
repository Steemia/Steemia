import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { SteemProvider } from '../../providers/steem/steem';
import 'rxjs/add/operator/takeUntil';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage implements OnInit, OnDestroy {

  private currentVal: string;
  private destroyed$: Subject<{}> = new Subject();
  results: Object;
  searchTerm$ = new Subject<string>();
  isSearching: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private steemProvider: SteemProvider) {

      
  }

  public ngOnInit() {
    this.steemProvider
      .getSearch(this.searchTerm$, "created", "desc")
      .takeUntil(this.destroyed$)
      .subscribe(results => {
        this.isSearching = false;
        this.results = results.results;
      });
  }

  public ngOnDestroy() {
    this.destroyed$.next(); /* Emit a notification on the subject. */
    this.destroyed$.complete();
  }

  performSearch(event) {

    this.isSearching = true;

    if (event === undefined) {

      this.isSearching = false;
      this.results = null;

    } else {
      this.searchTerm$.next(event);
    }
    
  }

}
