import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ThemeableBrowser, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
import { SettingsProvider } from 'providers/settings/settings';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * @author Jayser Mendez
 */

@Injectable()
export class SharedServiceProvider {

  // This Behavior subject only has two states: true or false and its purpose
  // is to dispatch this event to the subscribed components since we cannot use,
  // ionic events for nested host.
  public reply_status: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private current_color: string = '#488aff';


  // Initialize this behavior subject with an empty string meaning that all
  // tags will be query.
  public current_tag: BehaviorSubject<string> = new BehaviorSubject("");

  constructor(private themeableBrowser: ThemeableBrowser, private settings: SettingsProvider,
  private clipboard: Clipboard, private socialShare: SocialSharing) { }

  /**
   * Method to open "Steemia" in-app browser
   * @param {String} url: Url to open in the in-app browser 
   */
  public openBrowser(url: string) {

    // First check the current theme to determine the color of the browser tab
    if (this.settings.current_theme === 'dark-theme') {
      this.current_color = '#1d252c';
    }

    // Define the theme of the browser tab
    const options: any = {
      toolbar: {
        height: 50,
        color: this.current_color
      },
      title: {
        color: '#ffffff',
        showPageTitle: true
      },
      closeButton: {
        wwwImage: 'assets/Close-32.png',
        align: 'left',
        event: 'close-event'
      },
      customButtons: [
        {
          wwwImage: 'assets/share.png',
          align: 'right',
          event: 'share-event'
        }
      ],
      menu: {
        wwwImage: 'assets/show-more.png',
        imagePressed: 'menu_pressed',
        title: 'Options',
        cancel: 'Cancel',
        align: 'right',
        items: [
            {
                event: 'copy-link',
                label: 'Copy Link'
            },
            {
                event: 'open-browser',
                label: 'Open In Browser'
            }
        ]
      },
    };

    // Create instance of Themable Browser
    const browser: ThemeableBrowserObject = this.themeableBrowser.create(url, '_blank', options);

    // Browser Events

    // Event to close browser
    browser.on('close-event').subscribe(res => {
      browser.close();
    });

    // Event for copy link to clipboard
    browser.on('copy-link').subscribe(res => {
      this.clipboard.copy(url);
    });

    // Event to open link in native browser
    browser.on('open-browser').subscribe(res => {
      window.open(url, '_system', 'location=yes');
    });

    // Event for sharing the link
    browser.on('share-event').subscribe(res => {
      this.socialShare.share(url);
    });
  }

}
