import { Component, Input} from '@angular/core';
import { App, ModalController, PopoverController } from 'ionic-angular';
import { ImageLoaderConfig } from 'ionic-image-loader';
// PROVIDERS
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { UtilProvider } from 'providers/util/util';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';

@Component({
  selector: 'post-card',
  templateUrl: 'post-card.html'
})
export class PostCardComponent {

  @Input('post') content: any;
  private is_voting: boolean = false;
  public popover;

  constructor(private app: App,
    private modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    private imageLoaderConfig: ImageLoaderConfig,
    private steemActions: SteeemActionsProvider,
    public util: UtilProvider,
    private steemConnect: SteemConnectProvider,
    private steemiaProvider: SteemiaProvider) {

    this.imageLoaderConfig.setBackgroundSize('cover');
    this.imageLoaderConfig.setHeight('200px');
    this.imageLoaderConfig.setFallbackUrl('assets/placeholder2.png');
    this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
    this.imageLoaderConfig.setConcurrency(10);
    this.imageLoaderConfig.setMaximumCacheSize(20 * 1024 * 1024);
    this.imageLoaderConfig.setMaximumCacheAge(7 * 24 * 60 * 60 * 1000); // 7 days

  }

  /**
   * Method to open the voting-slider popover
   */
  presentPopover(myEvent) {
    this.popover = this.popoverCtrl.create('VotingSliderPage');
    this.popover.present({
      ev: myEvent
    });

    this.popover.onDidDismiss(data => {
      this.castVote(this.content.author, this.content.url, data.weight);
    });
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
    if ((this.steemConnect.user_object as any).user == author) {
      this.app.getRootNavs()[0].push('ProfilePage', {
        author: (this.steemConnect.user_object as any).user
      });
    }

    else {
      this.app.getRootNavs()[0].push('AuthorProfilePage', {
        author: author
      });
    }
    
  }

  /**
   * Method to open a modal with the comments of the post
   * @param post 
   */
  private openComments(url: string, author: string): void {
    let commentModal = this.modalCtrl.create('CommentsPage', { permlink: url, author:  author});
    commentModal.present();
  }


  /**
   * Method to open a modal with the votes of the post
   * @param post 
   */
  private openVotes(url: string): void {
    let votesModal = this.modalCtrl.create("VotesPage", { permlink: url });
    votesModal.present();
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
    this.steemActions.dispatch_vote('posts', author, permlink, weight).then(data => {

      this.is_voting = false; // remove the spinner
      // Catch if the user is not logged in and display an alert
      if (data == 'not-logged') {
        return;
      }

      if (data === 'Correct') {
        this.refreshPost();
      }
    });

  }

  private refreshPost() {
    this.steemiaProvider.dispatch_post_single({
      url: this.content.url
    }).then(data => {
      this.content.vote = (data as any).vote;
      this.content.net_likes = (data as any).net_likes;
      this.content.net_votes = (data as any).net_votes;
      this.content.top_likers_avatars = (data as any).top_likers_avatars;
      this.content.total_payout_reward = (data as any).total_payout_reward;
      this.content.children = (data as any).children;
    });
  }

}
