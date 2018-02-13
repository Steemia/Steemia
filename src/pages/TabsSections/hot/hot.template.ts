export const hotTemplate = `

<ion-content>

  <ion-refresher (ionRefresh)="doRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>

  <skeleton-loading *ngIf="contents.length < 1"></skeleton-loading>

  <post-render *ngIf="contents.length > 1" [posts]="contents"></post-render>

  <ion-infinite-scroll *ngIf="contents.length > 1" (ionInfinite)="doInfinite($event)" distance="1%">
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