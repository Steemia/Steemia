import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 * @author Jayser Mendez
 * @version 0.0.1
 */

@Injectable()
export class SharedServiceProvider {

  // This Behavior subject only has two states: true or false and its purpose
  // is to dispatch this event to the subscribed components since we cannot use,
  // ionic events for nested host.
  public reply_status: BehaviorSubject<boolean> = new BehaviorSubject(false);


  // Initialize this behavior subject with an empty string meaning that all
  // tags will be query.
  public current_tag: BehaviorSubject<string> = new BehaviorSubject("");

  constructor() { }

}
