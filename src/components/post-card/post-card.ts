import { Component, Input, ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Post } from 'models/models';
import { App, ModalController } from 'ionic-angular';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import steemInstance from 'providers/steemconnect/steemConnectAPI';
import { ImageLoaderConfig } from 'ionic-image-loader';

/**
 * Generated class for the PostCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'post-card',
  templateUrl: 'post-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostCardComponent implements AfterViewInit {

  @Input('post') content: Post;
  private username: string = '';

  constructor(private app: App,
    private modalCtrl: ModalController,
    private steemConnect: SteemConnectProvider,
    private imageLoaderConfig: ImageLoaderConfig,
    private cdr: ChangeDetectorRef) {

    this.imageLoaderConfig.setBackgroundSize('cover');
    this.imageLoaderConfig.setHeight('200px');
    this.imageLoaderConfig.setFallbackUrl('assets/placeholder2.png');
    this.imageLoaderConfig.setImageReturnType('base64');
    this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
    this.imageLoaderConfig.setConcurrency(10);

    // Subscribe to the current username logged in
    this.steemConnect.username.subscribe(user => {
      this.username = user;
    });

  }

  // Wait until the view inits before disconnecting
  ngAfterViewInit() {
    // Since we know the list is not going to change
    // let's request that this component not undergo change detection at all
    this.cdr.detach();
  }

  /**
   * Method to open the single page of a post
   * @param post 
   */
  private postOpen(post) {
    this.app.getRootNavs()[0].push('PostSinglePage', {
      post: post
    })
  }

  /**
   * Method to open a modal with the comments of the post
   * @param post 
   */
  private openComments(post) {
    let commentModal = this.modalCtrl.create("CommentsPage", { author: post.author, permlink: post.permlink });
    commentModal.present();
  }

  /**
   * Method to cast a vote or unvote
   * @param i 
   * @param author 
   * @param permlink 
   * @param weight 
   */
  private castVote(author: string, permlink: string, weight: number = 1000) {
    // Set the is voting value of the post to true
    this.content.isVoting = true;
    steemInstance.vote(this.username, author, permlink, weight, (err, res) => {
      console.log(err, res)

      // Check for errors
      if (!err) {
        // remove the is voting flag
        this.content.isVoting = false

        // check if vote is not an unvote
        if (weight > 0) {
          this.content.isVoting = false
          this.content.voted = true;
        }

        // perform the downvote
        else {
          this.content.voted = false;
        }
      }
    });
  }

  /**
   * Method to add pluralization to the likes in the post
   * @param likes 
   */
  private renderLikes(likes: number) {
    if (likes > 1 || likes == 0) return likes.toLocaleString() + ' likes';
    else return likes + ' like';

  }

}
