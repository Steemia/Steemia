import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { Subscription } from 'rxjs/Subscription';

/**
 * Search page for users and tags
 * 
 * @author Jayser Mendez
 * @version 0.0.1
 */

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  private sub: Subscription;
  private is_tag: boolean = false;
  private is_user: boolean = false;
  private is_more_post: boolean = true;
  private page: number = 1;
  
  objectKeys = Object.keys;
  results: Object;
  searchTerm$ = new Subject<string>();
  isSearching: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private steemiaProvider: SteemiaProvider) { }

  ionViewWillEnter() {  
    this.sub = this.steemiaProvider.dispatch_search(this.searchTerm$, this.page)
      .subscribe((results: any) => {

        if (results.results.length === 0) {
          this.is_more_post = false;
        }

        // Detect if the results are for tags
        if (results.type === 'full_text_search' || results.type === 'tags_search') {
          this.is_tag = true;
          this.is_user = false;
        }

        else if (results.type === 'user_search') {
          this.is_tag = false;
          this.is_user = true;
        }

        this.isSearching = false;
        this.results = results.results;
      });
      
  }

  ionViewWillLeave() {
    this.sub.unsubscribe(); // Remove subscription of the search observable
  }

  performSearch(event) {
    this.isSearching = true;

    try {
      event = event.trim()
    }
    catch (e) {} // length is not enough to trim it 

    if (event === undefined || event === '') {
      this.isSearching = false;
      this.results = null;
    }

    else {
      this.searchTerm$.next(event);
    }

  }

}
