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
  <ion-card>
    <h2 class="title" padding>{{ post?.title }}</h2>
    <ion-card-header no-padding>
      <ion-item>
        <div class="image-cropper" item-start tappable (click)="openProfile()">
          <img src="https://img.busy.org/@{{post?.author}}">
        </div>
        <div>
          <ion-badge color="primary" tappable (click)="openProfile()">{{ post?.author }}</ion-badge>
          <ion-badge color="gray">{{ post?.author_reputation }}</ion-badge>
          <ion-note end>{{ util.parse_date(post?.created) }}</ion-note>
        </div>

        <div>
          <div *ngFor="let tag of post?.tags" style="float: left !important; margin: 5px 5px 0px 0px">
            <ion-badge color="light">
              <ion-icon name="attach"></ion-icon>
              {{ tag }}
            </ion-badge>
          </div>
        </div>

        <i *ngIf="!post?.vote && is_voting == false" class="fa fa-thumbs-o-up fa-2x upvote" item-right (tap)="castVote(post?.author, post?.url, 10000);"></i>

        <i *ngIf="post?.vote && is_voting == false" class="fa fa-thumbs-up fa-2x unvote" item-right (tap)="castVote(post?.author, post?.url, 0);"></i>

        <ion-spinner *ngIf="is_voting == true" item-right></ion-spinner>

      </ion-item>
    </ion-card-header>
  </ion-card>

  <div id="content" class="cancel-bottom-pd" padding [innerHTML]="post?.full_body"></div>

  <ion-grid padding>
    <ion-row>
      <ion-col no-padding>
        <div *ngFor="let tag of post?.tags" style="float: left !important; margin: 5px 5px 0px 0px">
          <ion-badge class="custom-chip" color="light">
            {{ tag }}
          </ion-badge>
        </div>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col no-padding class="top-33">
        <h3>Comments</h3>
      </ion-col>
    </ion-row>
  </ion-grid>
  <div padding class="cancel-top-pd">
    <ion-textarea [(ngModel)]="chatBox" rows="6" placeholder="What do you think about this story?" style="margin-bottom: 7px;"></ion-textarea>
    <button class="pull-right" ion-button mode="ios" (click)="comment()">Post a Comment</button>
  </div>

  <br />
  <br />
  <br />
  <br />

  <ion-spinner *ngIf="is_loading"></ion-spinner>

  <div *ngFor="let comment of comments" class="message-wrapper">
    <render-comment [comment]="comment"></render-comment>
  </div>

  <br />
  <br />
  <br />
  <br />

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