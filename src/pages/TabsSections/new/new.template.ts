export const newTemplate = `

<ion-content>

  <ion-refresher (ionRefresh)="doRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>

  <skeleton-loading *ngIf="is_loading"></skeleton-loading>

  <post-render *ngIf="!is_loading" [posts]="contents"></post-render>

  <div *ngIf="is_more_post == false">
    <p text-center>There are not more posts to load</p>
  </div>
  
  <ion-infinite-scroll *ngIf="contents.length > 1 && is_more_post == true" (ionInfinite)="doInfinite($event)" distance="1%">
    <ion-infinite-scroll-content></ion-infinite-scroll-content>
  </ion-infinite-scroll>

  <ion-fab right bottom>
    <button ion-fab color="primary">
      <ion-icon name="add"></ion-icon>
    </button>
    <ion-fab-list side="top">
      <button ion-fab>
        <ion-icon name="options"></ion-icon>
      </button>
      <button ion-fab>
        <ion-icon name="create"></ion-icon>
      </button>
    </ion-fab-list>
  </ion-fab>

</ion-content>

`;