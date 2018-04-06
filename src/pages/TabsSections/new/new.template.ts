export const newTemplate = `

<ion-content scroll-overflow=“false”>

  <ion-refresher (ionRefresh)="doRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>

  <ion-spinner *ngIf="is_loading"></ion-spinner>
  <ion-card *ngIf="!is_loading && is_logged" class="share-post card" (click)="openPage('PostPage')">
    <ion-item>
      <ion-avatar item-start>
        <img [src]="profile_pc" (error)="util.imgError('profile',$event)" />
      </ion-avatar>
      <ion-searchbar mode="ios" placeholder="What's on your mind today?" disabled="true">
      </ion-searchbar>
    </ion-item>
  </ion-card>

  <post-render *ngIf="!is_loading" [posts]="contents"></post-render>

  <div *ngIf="is_more_post == false">
    <p text-center>There are not more posts to load</p>
  </div>

  <ion-infinite-scroll *ngIf="contents.length > 1 && is_more_post == true" (ionInfinite)="doInfinite($event)" distance="1%">
    <ion-infinite-scroll-content></ion-infinite-scroll-content>
  </ion-infinite-scroll>

</ion-content>

`;