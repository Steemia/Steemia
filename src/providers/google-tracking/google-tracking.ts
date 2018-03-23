import { Injectable } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

/**
 * Class with Google Tracking Actions
 * 
 * @author Jayser Mendez
 * @version 0.0.1
 */

@Injectable()
export class GoogleTrackingProvider {

  constructor(public ga: GoogleAnalytics) {

    // Initialize the instance of Google Analytics
    this.ga.startTrackerWithId('UA-116039633-1')
      .then(() => {
        console.log('Google analytics is ready now');
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  /**
   * @method track_page: Method to add page tracking to Analytics
   * @param {String} page: Current Screen 
   * @returns Returns a promise with the response from GA
   */
  public track_page(page: string): Promise<any> {
    return this.ga.trackView(page);
  }

  /**
   * @method track_event: Method to add event tracking to Analytics
   * @param {String} category: Category of the perfomed action
   * @param {String} action: Action performed 
   * @param {String} label: Label for the action performed
   * @param {Number} value: Key value of the action for reference
   * @returns Returns a promise with the response from GA
   */
  public track_event(category: string, action: string, label: string, value: number): Promise<any> {
    return this.ga.trackEvent(category, action, label, value);
  }

}
