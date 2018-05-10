export const feedTemplate = `

<ion-content>

  <ion-refresher (ionRefresh)="doRefresh($event)" *ngIf="logged_in == true">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>

  <ion-spinner *ngIf="is_loading"></ion-spinner>

  <div *ngIf="logged_in == false" class="vertical-align h-100">
    <ion-card id="not-logged">
      <ion-card-content>
        <p text-center> You need to log in to see this page</p>
        <button ion-button block mode="ios" (click)="openPage('LoginPage')">Login Now!</button>
      </ion-card-content>
    </ion-card>

  </div>

  <div *ngIf="!is_loading && logged_in == true">
    <div *ngFor="let content of contents; trackBy: trackById">
      <post-card [post]="content" [from]="'NORMAL'" [user]="'null'"></post-card>
    </div>
  </div>
  <div *ngIf="is_more_post == false">
    <p text-center>{{ 'generic_messages.not_more_posts' | translate }}</p>
  </div>

  <ion-infinite-scroll *ngIf="contents.length > 1 && is_more_post == true" (ionInfinite)="doInfinite($event)">
    <ion-infinite-scroll-content></ion-infinite-scroll-content>
  </ion-infinite-scroll>

</ion-content>

`;