import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { SharedServiceProvider } from 'providers/shared-service/shared-service';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-tags',
  templateUrl: 'tags.html',
})
export class TagsPage {

  private tags = [];
  private term: string = '';
  private searchControl: FormControl;
  searching: boolean = false;

  constructor(public navCtrl: NavController,
    private steemia: SteemiaProvider,
    private sharedService: SharedServiceProvider) {

      this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    this.steemia.dispatch_tags().then((data: any) => {
      this.tags = data.results;
      
      this.initializeTags();
      
      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.initializeTags();
      });

    });
  }

  /**
   * Method to initialize the set of tags
   */
  initializeTags() {
    this.tags = this.searchTag(this.term);
  }

  /**
   * Method to filter the array of tags based on search
   * @param term 
   */
  searchTag(term: string) {

    if (term === "" || term === null || term === undefined) {
      return this.tags
    }

    return this.tags.filter((item) => {
      return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
    });  
  }

  /**
   * Event method for onSearch input
   */
  onSearchInput(){
    this.searching = true;
  }

  /**
   * Method to select tag and pop the pafe
   * @param tag 
   */
  selectTag(tag: string): void {
    this.sharedService.current_tag.next(tag);
    this.navCtrl.pop();
  }

}
