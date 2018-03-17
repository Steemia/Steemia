import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { SteemiaProvider } from 'providers/steemia/steemia';
import 'rxjs/add/operator/takeUntil';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage implements OnInit, OnDestroy {

  objectKeys = Object.keys;
  private destroyed$: Subject<{}> = new Subject();
  results: Object;
  searchTerm$ = new Subject<string>();
  isSearching: boolean = false;
  gender: string = 'Post';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private steemiaProvider: SteemiaProvider) {


  }

  public ngOnInit() {
    this.steemiaProvider.dispatch_tag_search(this.searchTerm$, 10)
      .takeUntil(this.destroyed$)
      .subscribe(results => {
        this.isSearching = false;
        this.results = (results as any).results;
        console.log(results)
      });
    // this.steemProvider
    //   .getSearch(this.searchTerm$, "created", "desc")
    //   .takeUntil(this.destroyed$)
    //   .subscribe(results => {
    //     this.isSearching = false;
    //     this.results = results.results;
    //   });
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
