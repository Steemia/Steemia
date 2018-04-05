import { Component, Input, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import { App, ModalController, PopoverController } from 'ionic-angular';
import { ImageLoaderConfig } from 'ionic-image-loader';
// PROVIDERS
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { UtilProvider } from 'providers/util/util';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'post-card',
  templateUrl: 'post-card.html'
})
export class PostCardComponent implements AfterViewInit {

  @Input('post') content: any;
  private is_voting: boolean = false;
  public popover;
  videoUrl: SafeResourceUrl;
  player = [];
  private revealed: boolean = false;
  private reveal_trigger: boolean = false;

  constructor(private app: App,
    private modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    private imageLoaderConfig: ImageLoaderConfig,
    private steemActions: SteeemActionsProvider,
    private cdr: ChangeDetectorRef,
    public util: UtilProvider,
    private domSanitizer: DomSanitizer,
    private steemConnect: SteemConnectProvider,
    private steemiaProvider: SteemiaProvider) {

    this.imageLoaderConfig.setBackgroundSize('cover');
    this.imageLoaderConfig.setHeight('200px');
    this.imageLoaderConfig.setFallbackUrl('assets/placeholder2.png');
    this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
    this.imageLoaderConfig.setConcurrency(25);
    this.imageLoaderConfig.setMaximumCacheSize(20 * 1024 * 1024);
    this.imageLoaderConfig.setMaximumCacheAge(7 * 24 * 60 * 60 * 1000); // 7 days

  }

  getYTImage(url) {
    return "https://img.youtube.com/vi/" + this.getId(url) + "/0.jpg";
  }

  ngAfterViewInit() {
    if (this.content.is_nsfw === false) {
      this.reveal_trigger = true;
    }
  }

  private parse_video(url) {
    return this.getId(url);
  }

  private getId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return 'error';
    }
  }

  savePlayer(player) {
    this.player.push(player);
  }
  
  onStateChange(event){
    
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
      if (data) {
        this.castVote(this.content.author, this.content.url, data.weight);
      }
      
    });
  }

  /**
   * Method to open the single page of a post
   * @param post 
   */
  private postOpen(post): void {

    if (this.content.is_nsfw === false && this.reveal_trigger === false) {
      return;
    }

    else {
      try {
        this.player.map(yt => {
          yt.pauseVideo();
        });
      }

      catch(e) {}
      
      this.app.getRootNavs()[0].push('PostSinglePage', {
        post: post
      });
    }
  }

  /**
   * Method to open author profile page
   * @param {String} author: author of the post
   */
  private openProfile(author: string): void {
    if (this.steemConnect.user_object !== undefined) {
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
    let commentModal = this.modalCtrl.create('CommentsPage', { permlink: url, author:  author}, { cssClass:"full-modal" });
    commentModal.present();
  }


  /**
   * Method to open a modal with the votes of the post
   * @param post 
   */
  private openVotes(url: string, author: string): void {
    let votesModal = this.modalCtrl.create("VotesPage", { permlink: url, author: author }, { cssClass:"full-modal" });
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
      author: this.content.author,
      permlink: this.content.url
    }).then(data => {
      this.content.vote = (data as any).vote;
      this.content.net_likes = (data as any).net_likes;
      this.content.net_votes = (data as any).net_votes;
      this.content.top_likers_avatars = (data as any).top_likers_avatars;
      this.content.total_payout_reward = (data as any).total_payout_reward;
      this.content.children = (data as any).children;
    });
  }

  private reveal_image() {
    this.content.is_nsfw = false;

    setTimeout(() => {
      this.reveal_trigger = true;
    }, 500);
    this.cdr.detectChanges();
  }

}
