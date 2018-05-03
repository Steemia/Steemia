import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class SharedServiceProvider {

  public reply_status: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {
    
  }

}
