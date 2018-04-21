export const feedTemplate = `

<ion-content>

  <ion-refresher (ionRefresh)="doRefresh($event)" *ngIf="logged_in == true">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>

  <ion-spinner *ngIf="is_loading"></ion-spinner>

  <ion-card *ngIf="!is_loading && logged_in == true" class="share-post card" (click)="openPage('PostPage')" id="main-share-card">
    <ion-item id="header">
      <ion-avatar item-start>
        <img [src]="profile_pc" (error)="util.imgError('profile',$event)" />
      </ion-avatar>
      <ion-searchbar mode="ios" placeholder="What's on your mind today?" disabled="true">
      </ion-searchbar>
    </ion-item>
  </ion-card>

  <div *ngIf="logged_in == false" class="vertical-align h-100">
    <ion-card id="not-logged">
      <ion-card-content>
        <p text-center> You need to log in to see this page</p>
        <button ion-button block mode="ios" (click)="openPage('LoginPage')">Login Now!</button>
      </ion-card-content>
    </ion-card>

  </div>

  <post-render *ngIf="!is_loading && logged_in == true" [posts]="contents" [from]="'NORMAL'" [user]="'null'"></post-render>

  <div *ngIf="is_more_post == false">
    <p text-center>There are not more posts to load</p>
  </div>

  <ion-infinite-scroll *ngIf="contents.length > 1 && is_more_post == true" (ionInfinite)="doInfinite($event)" distance="1%">
    <ion-infinite-scroll-content></ion-infinite-scroll-content>
  </ion-infinite-scroll>

</ion-content>

`;