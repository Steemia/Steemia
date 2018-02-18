import { Component, Input} from '@angular/core';
import { Post } from 'models/models';
import { App, ModalController } from 'ionic-angular';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import steemInstance from 'providers/steemconnect/steemConnectAPI';
import { ImageLoaderConfig } from 'ionic-image-loader';

const IMG_SERVER = 'https://steemitimages.com/';

@Component({
  selector: 'post-card',
  templateUrl: 'post-card.html'
})
export class PostCardComponent{

  @Input('post') content: any;
  private username: string = '';
  private is_voting: boolean = false;

  constructor(private app: App,
    private modalCtrl: ModalController,
    private steemConnect: SteemConnectProvider,
    private imageLoaderConfig: ImageLoaderConfig) {

    this.imageLoaderConfig.setBackgroundSize('cover');
    this.imageLoaderConfig.setHeight('200px');
    this.imageLoaderConfig.setFallbackUrl('assets/placeholder2.png');
    this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
    this.imageLoaderConfig.setConcurrency(10);
    this.imageLoaderConfig.setMaximumCacheSize(20 * 1024 * 1024);
    this.imageLoaderConfig.setMaximumCacheAge(7 * 24 * 60 * 60 * 1000); // 7 days

    // Subscribe to the current username logged in
    this.steemConnect.username.subscribe(user => {
      this.username = user;
    });
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

  private openProfile(author: string) {
    this.app.getActiveNav()[0].push('AuthorProfilePage')

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
    this.is_voting = true;
    let url = permlink.split('/')[3];
    this.steemConnect.instance.vote(this.username, author, url, weight, (err, res) => {
      // Check for errors
      if (!err) {
        // remove the is voting flag
        this.is_voting = false

        // check if vote is not an unvote
        if (weight > 0) {
          this.is_voting = false
          this.content.vote = true;
        }

        // perform the downvote
        else {
          this.content.vote = false;
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

  private renderImage(type: string, img: string) {
    if (type === 'profile') {
      return IMG_SERVER + '80x80/' + img;
    }

    else if (type === 'cover') {
      return IMG_SERVER + '850x500/' + img;
    }

    else if (type === 'votes') {
      return IMG_SERVER + '50x50/' + img
    }
  }

  private imgError(event) {
    event.target.src = 'assets/placeholder2.png';
  }

}
