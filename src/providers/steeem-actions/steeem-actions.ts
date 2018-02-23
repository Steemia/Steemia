import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class SteeemActionsProvider {

  constructor(public http: HttpClient) {
  }

  public dispatch_vote(author: string, permlink: string, weight: number = 10000) {

  }

  public dispatch_comment() {

  }

  public dispatch_reblog() {

  }

  public dispatch_flag() {

  }

}
