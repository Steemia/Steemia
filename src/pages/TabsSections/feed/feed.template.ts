export const feedTemplate = `

<ion-content>

  <ion-refresher (ionRefresh)="doRefresh($event)" *ngIf="logged_in == true">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>

  <ion-spinner *ngIf="is_loading"></ion-spinner>

  <ion-card class="share-post card custom-card" *ngIf="!is_loading && logged_in == true" (click)="openPage('PostPage')" id="main-share-card">
    <ion-item id="header">
      <ion-avatar item-start>
        <img [src]="profile_pc" (error)="util.imgError('profile',$event)" />
      </ion-avatar>
      <ion-searchbar mode="ios" placeholder="{{ 'generic_messages.what_is_on_your' | translate }}" disabled="true">
      </ion-searchbar>
    </ion-item>
  </ion-card>

  <div *ngIf="logged_in == false" class="vertical-align h-100">
    <ion-card id="not-logged" class="card custom-card">
      <ion-card-content>
        <p text-center>{{ 'need_to_login' | translate }}</p>
        <button ion-button block mode="ios" (click)="openPage('LoginPage')">{{ 'login_now' | translate }}</button>
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