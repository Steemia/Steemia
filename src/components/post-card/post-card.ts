import { Component, Input, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { App, ModalController, PopoverController, NavController } from 'ionic-angular';
// PROVIDERS
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { UtilProvider } from 'providers/util/util';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';

@Component({
  selector: 'post-card',
  templateUrl: 'post-card.html'
})
export class PostCardComponent implements AfterViewInit {
  @Input('post') content: any;
  @Input('from') from: string;
  @Input('user') user: string;
  private is_voting: boolean = false;
  player = [];
  private reveal_trigger: boolean = false;
  private inner_rebblog: boolean = false;

  constructor(private app: App,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private steemActions: SteeemActionsProvider,
    private cdr: ChangeDetectorRef,
    public util: UtilProvider,
    private steemConnect: SteemConnectProvider,
    private steemiaProvider: SteemiaProvider) {}

  ngAfterViewInit(): void {
    if (this.content.author !== this.user && this.from == 'PROFILE') {
      this.inner_rebblog = true;
      
      this.cdr.detectChanges();
    }
    if (this.content.is_nsfw === false) {
      this.reveal_trigger = true;
    }
  }

  /**
   * Method to extract id from youtube urls
   * @param {String} url 
   * @returns Returns a string with the id of the video
   */
  private getId(url): string {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) return match[2];
    else return 'error';
  }

  /**
   * Method to save all the players into an array
   * @param {Event} player 
   */
  savePlayer(player): void {
    this.player.push(player);
  }

  /**
   * Method to open the voting-slider popover
   */
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create('VotingSliderPage');
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data => {
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
      if (this.from === 'PROFILE') {
        this.navCtrl.push('PostSinglePage', {
          post: post
        });
      }
      else {
        this.app.getRootNav().push('PostSinglePage', {
          post: post
        });
      }
      
    }
  }

  /**
   * Method to open author profile page
   * @param {String} author: author of the post
   */
  private openProfile(author: string): void {
    if (this.steemConnect.user_object !== undefined) {
      if ((this.steemConnect.user_object as any).user == author) {
        this.app.getRootNav().push('ProfilePage', {
          author: (this.steemConnect.user_object as any).user
        });
      }
      else {
        this.app.getRootNav().push('AuthorProfilePage', {
          author: author
        });
      }
    }
    else {
      this.app.getRootNav().push('AuthorProfilePage', {
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
    this.steemActions.dispatch_vote('posts', author, permlink, weight).then((data: any) => {
      this.is_voting = false; // remove the spinner
      if (data.msg == 'not-logged') return;

      if (data.msg === 'correct') {
        if (data.type === 'vote') {
          this.content.vote = true;
        }

        else if (data.type === 'unvote') {
          this.content.vote = false;
        }
        this.refreshPost();
      }

    });
  }

  /**
   * Method to refresh the current data of the post
   */
  private refreshPost(): void {
    this.steemiaProvider.dispatch_post_single({
      author: this.content.author,
      permlink: this.content.url
    }).then(data => {
      //this.content.vote = (data as any).vote;
      this.content.net_likes = (data as any).net_likes;
      this.content.net_votes = (data as any).net_votes;
      this.content.top_likers_avatars = (data as any).top_likers_avatars;
      this.content.total_payout_reward = (data as any).total_payout_reward;
      this.content.children = (data as any).children;
    });
  }

  /**
   * Method to reveal NSFW Image
   */
  private reveal_image() {
    this.content.is_nsfw = false;
    setTimeout(() => {
      this.reveal_trigger = true;
    }, 500);
    this.cdr.detectChanges();
  }

}
