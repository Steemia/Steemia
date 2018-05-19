export const postSinglePage = `

<ion-header id="header">
  <ion-navbar color="primary">
    <ion-title></ion-title>
    <ion-buttons end>
      <button *ngIf="!is_bookmarked" ion-button (click)="addBookmark()">
        <ion-icon class="custom-close" name="ios-bookmark-outline"></ion-icon>
      </button>
      <button *ngIf="is_bookmarked" ion-button (click)="removeBookmark()">
        <ion-icon class="custom-close" name="ios-bookmark"></ion-icon>
      </button>
    </ion-buttons>
  </ion-navbar>
</ion-header>

<ion-content>
  <ion-card id="content-single">
    <h2 class="title" padding>{{ post?.title }}</h2>
    <ion-card-header no-padding>
      <ion-item>
        <ion-avatar item-start tappable (click)="openProfile()">
          <img [src]="post?.avatar" (error)="util.imgError('profile',$event)" />
        </ion-avatar>
        <div>
          <ion-badge color="primary" tappable (click)="openProfile()">{{ post?.author }}</ion-badge>
          <ion-badge color="gray">{{ post?.author_reputation }}</ion-badge>
          <ion-note end>{{ util.parse_date(post?.created) }}</ion-note>
        </div>
        <p style="margin-top: 6px;">{{ post?.reading_time }}</p>

        <i *ngIf="!post?.vote && is_voting == false" class="fa fa-thumbs-o-up fa-2x upvote" item-right (tap)="presentPopover($event);"></i>

        <i *ngIf="post?.vote && is_voting == false" class="fa fa-thumbs-up fa-2x unvote" item-right (tap)="castVote(post?.author, post?.url, 0);"></i>

        <ion-spinner *ngIf="is_voting == true" item-right></ion-spinner>

      </ion-item>
      <hr id="hr-separator" />
    </ion-card-header>
    <ion-card-content no-padding>
      <div id="content" class="cancel-bottom-pd selectable-text" padding [innerHTML]="parsed_body"></div>

      <ion-grid padding>

      <ion-row>
      <ion-col col-6 text-center>
          <div style="float: left;" *ngIf="post?.top_likers_avatars" (click)="openVotes(post?.url, post?.author)">
            <div class="voters">
              <span class="voters_image" *ngFor="let voter of post?.top_likers_avatars">
                <img [src]="voter" (error)="util.imgError('comment',$event)" />
              </span>
            </div>
            <div class="likes">
              <p id="likes">{{ util.renderLikes(post?.net_likes) }}</p>
            </div>
        </div>
      </ion-col>
  
      <ion-col col-3 text-center>
        <button ion-button clear small left>
          <ion-icon name="ios-text" id="comment-icon"></ion-icon>
          &nbsp;
          <div class="info" id="comment">{{ post?.children }}</div>
        </button>
      </ion-col>
  
      <ion-col col-3 text-center>
        <button end ion-button icon-right clear small (click)="presentPayoutPopover($event)">
          <div class="info top-4">
            <del *ngIf="post?.max_accepted_payout == 0" id="payout">{{ post?.total_payout_reward | currency:'USD': 'symbol' }}</del>
            <p *ngIf="post?.max_accepted_payout == 1000000" id="payout">{{ post?.total_payout_reward | currency:'USD': 'symbol' }}</p>
          </div>
        </button>
      </ion-col>
  
    </ion-row>

        <ion-row>
          <ion-col no-padding>
            <div *ngFor="let tag of post?.tags" style="float: left !important; margin: 5px 5px 0px 0px">
              <ion-badge class="custom-chip" color="light">
              <ion-icon style='color: black !important' name="attach"></ion-icon>
              {{ tag }}
              </ion-badge>
            </div>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col no-padding class="top-33">
            <h3 class="h3-custom">Comments</h3>
          </ion-col>
        </ion-row>
      </ion-grid>
      <div padding class="cancel-top-pd">
        <ion-textarea #myInput (click)="getCaretPos(myInput)" (keyup)="getCaretPos(myInput)" (input)="adjustTextarea($event);" [(ngModel)]="chatBox"
          rows="6" placeholder="What do you think about this story?" style="margin-bottom: 7px;"></ion-textarea>
        <button class="pull-right" ion-button mode="ios" (click)="comment()">Post a Comment</button>
        <button class="pull-right" ion-fab mini (click)="presentActionSheet()">
          <ion-icon name="images"></ion-icon>
        </button>

      </div>

      <br />
      <br />
      <br />
      <br />

      <ion-spinner *ngIf="is_loading"></ion-spinner>
    </ion-card-content>

    <ul class="pad">
      <ng-template #recursiveList let-commentsTree>
        <li *ngFor="let item of commentsTree">
          <render-comment [comment]="item"></render-comment>
          <ul *ngIf="item.replies.length > 0">
            <ng-container *ngTemplateOutlet="recursiveList; context:{ $implicit: item.replies }"></ng-container>
          </ul>
        </li>
      </ng-template>
      <ng-container *ngTemplateOutlet="recursiveList; context:{ $implicit: commentsTree }"></ng-container>
    </ul>
    <!-- <div *ngFor="let comment of comments" class="message-wrapper">
      <render-comment [comment]="comment"></render-comment>
    </div> -->

    <br />
    <br />
    <br />
    <br />
  </ion-card>
  <ion-fab right bottom>
    <button ion-fab color="primary">
      <ion-icon name="ios-more"></ion-icon>
    </button>
    <ion-fab-list side="top">
      <button ion-fab (click)="share()">
        <ion-icon name="share"></ion-icon>
        <ion-label>Share</ion-label>
      </button>
      <button ion-fab *ngIf="!is_owner" (click)="reblogAlert()">
        <ion-icon name="share-alt"></ion-icon>
        <ion-label>Reblog</ion-label>
      </button>
      <button ion-fab (click)="castFlag(post?.author, post?.url)">
        <ion-icon name="flag"></ion-icon>
        <ion-label>Flag Post</ion-label>
      </button>
      <button ion-fab *ngIf="is_owner" (click)="editPost()">
        <ion-icon name="md-create"></ion-icon>
        <ion-label>Edit Post</ion-label>
      </button>
    </ion-fab-list>
  </ion-fab>
</ion-content>

`;