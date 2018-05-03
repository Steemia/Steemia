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

  constructor() { }

}
