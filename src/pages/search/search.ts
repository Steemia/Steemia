import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { SteemProvider } from '../../providers/steem/steem';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  results: Object;
  searchTerm$ = new Subject<string>();

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private steemProvider: SteemProvider) {

      this.steemProvider
      .getSearch(this.searchTerm$, "created", "desc")
      .subscribe(results => {
        this.results = results.results;
      });
  }

}
