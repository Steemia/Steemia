export const postSinglePage = `

<ion-header>
  <ion-navbar color="primary">
    <ion-title></ion-title>
    <ion-buttons end>
      <button ion-button icon-only>
        <ion-icon name="ios-bookmark-outline"></ion-icon>
      </button>
    </ion-buttons>
  </ion-navbar>
</ion-header>

<ion-content>
  <ion-card no-padding>
    <h2 class="title" padding>{{ post?.title }}</h2>
    <ion-card-header no-padding>
      <ion-item>
        <ion-avatar item-start tappable (click)="openProfile()">
          <img src="https://img.busy.org/@{{post?.author}}?s=100">
        </ion-avatar>
        <div>
          <ion-badge color="primary" tappable (click)="openProfile()">{{ post?.author }}</ion-badge>
          <ion-badge color="gray">{{ post?.author_reputation }}</ion-badge>
          <ion-note end>{{ post?.created | amTimeAgo }}</ion-note>
        </div>

        <div>
          <div *ngFor="let tag of post?.json_metadata.tags" style="float: left !important; margin: 5px 5px 0px 0px">
            <ion-badge color="light">
              <ion-icon name="attach"></ion-icon>
              {{ tag }}
            </ion-badge>
          </div>
        </div>

        <ion-icon *ngIf="!post?.vote && is_voting == false" name="ios-thumbs-up-outline" item-right (tap)="castVote(post?.author, post?.url, 10000);"></ion-icon>

        <ion-icon *ngIf="post?.vote && is_voting == false" name="ios-thumbs-up" item-right color="primary" (tap)="castVote(post?.author, post?.url, 0);"></ion-icon>

        <ion-spinner *ngIf="is_voting == true" item-right></ion-spinner>

      </ion-item>
    </ion-card-header>
    <hr />
    <ion-card-content no-padding>
      <div id="content" [innerHTML]="post?.full_body"></div>
    </ion-card-content>
  </ion-card>

  <div class="comment-box" text-center>
    <button ion-button round>Post a comment</button>
  </div>

  <ion-spinner *ngIf="is_loading"></ion-spinner>

  <div *ngFor="let comment of comments" class="message-wrapper">
    <render-comment [comment]="comment"></render-comment>
  </div>


  <ion-fab right bottom>
    <button ion-fab color="primary">
      <ion-icon name="ios-more"></ion-icon>
    </button>
    <ion-fab-list side="top">
      <button ion-fab (click)="share()">
        <ion-icon name="share"></ion-icon>
        <ion-label>Share</ion-label>
      </button>
      <button ion-fab (click)="reblog()">
        <ion-icon name="share-alt"></ion-icon>
        <ion-label>Reblog</ion-label>
      </button>
      <button ion-fab>
        <ion-icon name="flag"></ion-icon>
        <ion-label>Flag Post</ion-label>
      </button>
    </ion-fab-list>
  </ion-fab>
</ion-content>

`;