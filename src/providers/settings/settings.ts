import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';

@Injectable()
export class SettingsProvider {
    // typing our private Observable, which will store our chosen theme in-memory
    private theme: BehaviorSubject<string>;
    availableThemes: Array<{ className: string, prettyName: string }>;
    public current_theme: string = 'blue-theme';

    constructor(private storage: Storage) {
        // initializing the chosen theme with a default.
        // NOTE: once you've wired up your persistence layer,
        // you would pull the initial theme setting from there.
        this.theme = new BehaviorSubject('blue-theme');

        this.availableThemes = [
            { className: 'blue-theme', prettyName: 'Blue' },
            { className: 'dark-theme', prettyName: 'Dark' },
        ];
    }

    // exposing a public method to set the private theme property,
    // using the Observable.next() method, which BehaviorSubject inherits
    setTheme(val) {
        // When you've wired in your persistence layer,
        // you would send it an updated theme value here.
        // for now we're just doing things in-memory
        this.theme.next(val);
        this.current_theme = val;
    }

    // exposing a method to subscribe to changes in the theme,
    // using the Observable.asObservable() method, which BehaviorSubject also inherits
    getTheme() {

        // Check if there is a theme saved in localstorage
        this.storage.get('theme').then(color => {
            if (color != null) {
                this.theme.next(color);
                this.current_theme = color;
            }
        });

        // Return this theme to the page calling it
        return this.theme.asObservable();

    }
}