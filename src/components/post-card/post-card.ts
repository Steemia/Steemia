import { Component, Input} from '@angular/core';
import { Post } from 'models/models';
import { App, ModalController } from 'ionic-angular';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import steemInstance from 'providers/steemconnect/steemConnectAPI';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { AuthorProfilePage } from '../../pages/author-profile/author-profile';

const IMG_SERVER = 'https://steemitimages.com/';

@Component({
  selector: 'post-card',
  templateUrl: 'post-card.html'
})
export class PostCardComponent {

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

    // Get the current logged in user
    if (this.steemConnect.user === '' || this.steemConnect.user === null
        || this.steemConnect.user == undefined) {
      
      this.steemConnect.get_current_user().then(user => {
        this.username = user.toString();
      });
    }

    else {
      this.username = this.steemConnect.user;
    }
  }

  /**
   * Method to open the single page of a post
   * @param post 
   */
  private postOpen(post): void {
    this.app.getRootNavs()[0].push('PostSinglePage', {
      post: post
    })
  }

  /**
   * Method to open author profile page
   * @param {String} author: author of the post
   */
  private openProfile(author: string): void {
    this.app.getRootNavs()[0].push(AuthorProfilePage, {
      author: author
    })
  }

  /**
   * Method to open a modal with the comments of the post
   * @param post 
   */
  private openComments(url: string): void {
    let commentModal = this.modalCtrl.create("CommentsPage", { permlink: url });
    commentModal.present();
  }

  /**
   * Method to cast a vote or unvote
   * @param i 
   * @param author 
   * @param permlink 
   * @param weight 
   */
  private castVote(author: string, permlink: string, weight: number = 1000): void {
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
  private renderLikes(likes: number): string {
    if (likes > 1 || likes == 0) return likes.toLocaleString() + ' likes';
    else return likes + ' like';

  }

  private renderImage(type: string, img: string): string {
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

  private imgError(event): void {
    event.target.src = 'assets/placeholder2.png';
  }

}
