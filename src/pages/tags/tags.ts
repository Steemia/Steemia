import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController } from 'ionic-angular';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { SharedServiceProvider } from 'providers/shared-service/shared-service';
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
  searching: boolean = false;

  constructor(public navCtrl: NavController,
    private steemia: SteemiaProvider,
    private menu: MenuController,
    private sharedService: SharedServiceProvider) {
  }

  ionViewDidLoad() {
    this.steemia.dispatch_tags().then((data: any) => {
      this.tags = data.results;

      // Manually unshift the Steemia tag
      this.tags.unshift({
        name: "Steemia"
      });

      // Manually unshift the All Tags tag
      this.tags.unshift({
        name: "All Tags"
      });
    });
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  /**
   * Method to select tag and pop the pafe
   * @param tag 
   */0
  selectTag(tag: string): void {
    if (tag === "All Tags")
      this.sharedService.current_tag.next('');
  
    else
      this.sharedService.current_tag.next(tag);
    
    this.navCtrl.pop();
  }

  /**
   * Method to reset tags to all tags
   */
  resetTag(): void {
    this.sharedService.current_tag.next('');
    this.navCtrl.pop();
  }

}
