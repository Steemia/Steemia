import { Component, NgZone, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import {
  App, IonicPage, NavController, NavParams, LoadingController,
  ActionSheetController, MenuController, ToastController, AlertController,
  PopoverController, ModalController, Events
} from 'ionic-angular';
import { PostsRes } from 'models/models';
import { postSinglePage } from './post-single.template';
import { AuthorProfilePage } from '../../pages/author-profile/author-profile';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { Subject } from 'rxjs/Subject';
import { AlertsProvider } from 'providers/alerts/alerts';
import { ERRORS } from '../../constants/constants';
import { UtilProvider } from 'providers/util/util';
import { Storage } from '@ionic/storage';
import { CameraProvider } from 'providers/camera/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { SharedServiceProvider } from 'providers/shared-service/shared-service';
import { Subscription } from 'rxjs/Subscription';
import { ImageViewerController } from 'ionic-img-viewer';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-post-single',
  template: postSinglePage
})
export class PostSinglePage {
  @ViewChild('myInput') myInput: ElementRef;

  private post: any;
  private is_voting: boolean = false;
  private is_bookmarked: boolean = false;
  private is_loading: boolean = true;
  private is_logged_in: boolean = false;
  private profile: any;
  private current_user: string = "";
  private user;
  private chatBox: string = '';
  private is_owner: boolean = false;
  private ref;
  private bookmarks;
  private caret: number = 0;
  private parsed_body: any = '';

  private commentsTree: Array<any> = [];
  private subs: Array<Subscription> = [];
  private _imageViewerCtrl: ImageViewerController;
  private captured_images: any = [];

  constructor(private app: App,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    private imageViewerCtrl: ImageViewerController,
    private translate: TranslateService,
    private dom: DomSanitizer,
    public menu: MenuController,
    private camera: CameraProvider,
    private actionSheetCtrl: ActionSheetController,
    private service: SharedServiceProvider,
    public storage: Storage,
    private steemia: SteemiaProvider,
    private alerts: AlertsProvider,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public util: UtilProvider,
    private modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    private steemActions: SteeemActionsProvider,
    private steemConnect: SteemConnectProvider) {

    this.user = (this.steemConnect.user_temp as any);
    this._imageViewerCtrl = imageViewerCtrl;

  }

  ionViewDidLoad(): void {

    this.post = this.navParams.get('post');

    this.parsed_body = this.getPostBody();

    this.current_user = (this.steemConnect.user_temp as any).user;

    if (this.current_user === this.post.author) {
      this.is_owner = true;
    }

    this.zone.runOutsideAngular(() => {
      this.load_comments();
    });

    this.subs.push(this.service.reply_status.subscribe(status => {
      if (status === true) {
        this.zone.runOutsideAngular(() => {
          this.load_comments('refresh');
        });
      }
    }));

    this.storage.ready().then(() => {
      this.storage.get('bookmarks').then(data => {
        if (data) {
          this.containsObject(data);
        }
      });
    });
  }

  ionViewDidEnter(): void {

    // Grab all the images from the post and add a click event listener
    this.captured_images = document.getElementById("card-content").getElementsByTagName("img");
    for (let i = 0; i < this.captured_images.length; i++) {

      // Listen for the click event and open the image when fired
      this.captured_images[i].addEventListener("click", () => {
        this.presentImage(this.captured_images[i]);
      });
    }

    this.menu.enable(false);
  }

  ionViewWillLeave(): void {

    // Unsubscribe data from server
    this.subs.forEach(sub => {
      sub.unsubscribe();
    });

    // Re-enable drawer menu
    this.menu.enable(true);

    // Remove click listener for the images when component is about to be destroyed
    for (let i = 0; i < this.captured_images.length; i++) {
      this.captured_images[i].removeEventListener("click", () => { });
    }
  }

  /**
   * Method to present image in a modal
   * @param {HTMLImageElement} image: Image object to re-draw 
   * @private
   */
  private presentImage(image: HTMLImageElement): void {
    const imageViewer = this._imageViewerCtrl.create(image);
    imageViewer.present();
  }

  /**
   * Method to return a sanitized post body
   * @returns a string with the body of the post
   */
  private getPostBody() {
    return this.dom.bypassSecurityTrustHtml(this.post.full_body);
  }

  /**
   * Method to load comments as tree
   * @param action 
   */
  private load_comments(action?: string) {
    this.steemia.get_comments_tree(this.post.author, encodeURIComponent(this.post.url), this.current_user).then((data: any) => {
      // Check if the action is to refresh. If so, we need to 
      // reinitialize all the data after initializing the query
      // to avoid the data to dissapear
      if (action === "refresh") {
        this.reinitialize();
      }

      this.commentsTree = data.results;

      // Set the loading spinner to false
      this.is_loading = false;

      // Tell Angular that changes were made since we detach the auto check
      this.cdr.detectChanges();

    });
  }

  /**
   * Method to initialize comments back to an empty array
   */
  private reinitialize() {
    this.commentsTree = [];
  }

  /**
   * Method to get caret position in a textfield
   * @param oField 
   */
  private getCaretPos(oField): void {
    let node = oField._elementRef.nativeElement.children[0];
    if (node.selectionStart || node.selectionStart == '0') {
      this.caret = node.selectionStart;
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
   * Method to open the voting-slider popover
   */
  private presentPopover(myEvent) {
    let popover = this.popoverCtrl.create('VotingSliderPage');
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data => {
      if (data) {
        this.castVote(this.post.author, this.post.url, data.weight);
      }
    });
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
      // Catch if the user is not logged in and display an alert
      if (data.msg == 'not-logged') return;

      if (data.msg === 'correct') {
        if (data.type === 'vote') {
          this.post.vote = true;
        }

        else if (data.type === 'unvote') {
          this.post.vote = false;
        }
        this.refreshPost();
      }

    });
  }

  /**
   * Method to cast a flag
   * @param i 
   * @param author 
   * @param permlink 
   * @param weight 
   */
  private castFlag(author: string, permlink: string, weight: number = -10000): void {
    let loading = this.loadingCtrl.create({
      content: this.translate.instant('pages.post_single.flag_loading')
    });
    loading.present();
    this.steemActions.dispatch_vote('posts', author, permlink, weight).then(data => {

      loading.dismiss();
      // Catch if the user is not logged in and display an alert
      if (data == 'not-logged') {
        return;
      }

      else if (data === 'Correct') {
        this.toastCtrl.create({
          message: this.translate.instant('pages.post_single.flag_correctly')
        });
      }

      else if (data === 'flag-error') {
        setTimeout(() => {
          this.alerts.display_alert('FLAG_ERROR');
        }, 200);

      }
    });
  }

  /**
   * Method to refresh the current data of the post
   */
  private refreshPost(): void {
    this.steemia.dispatch_post_single({
      author: this.post.author,
      permlink: this.post.url
    }).then(data => {
      this.post.net_likes = (data as any).net_likes;
      this.post.net_votes = (data as any).net_votes;
      this.post.top_likers_avatars = (data as any).top_likers_avatars;
      this.post.total_payout_reward = (data as any).total_payout_reward;
      this.post.children = (data as any).children;
    });
  }

  /**
   * Method to reblog the post
   */
  private reblog(): void {

    let loading = this.loadingCtrl.create({
      content: this.translate.instant('pages.post_single.reblog_action')
    });
    loading.present();
    this.steemActions.dispatch_reblog(this.post.author, this.post.url).then(data => {

      // Catch if the user is not logged in and display an alert
      if (data === 'not-logged') {
        this.show_prompt(loading, 'NOT_LOGGED_IN');
        return;
      }

      if (data === 'Correct') {
        this.show_prompt(loading, 'REBLOGGED_CORRECTLY');
      }

      if (data === 'ALREADY_REBLOGGED') {
        this.show_prompt(loading, 'ALREADY_REBLOGGED');
      }

    });
  }

  /**
   * Method to display a delayed alert to prevent two alerts
   * oppening at the same time
   * @param loader 
   * @param msg 
   */
  private show_prompt(loader, msg) {
    loader.dismiss();
    setTimeout(() => {
      this.alerts.display_alert(msg);
    }, 500);
  }

  /**
   * Method to socially share the post
   */
  private share() {
    this.steemActions.dispatch_share(this.post.url).then(res => {

    })
  }

  /**
   * Dispatch a comment to the current post
   */
  private comment() {
    if (this.chatBox.length === 0) {
      this.alerts.display_alert('EMPTY_TEXT');
      return;
    }

    let loading = this.loadingCtrl.create({
      content: this.translate.instant('generic_messages.please_wait')
    });
    loading.present();
    this.steemActions.dispatch_comment(this.post.author, this.post.url, this.chatBox).then(res => {
      if (res === 'not-logged') {
        this.show_prompt(loading, 'NOT_LOGGED_IN');
        return;
      }

      else if (res === 'Correct') {
        this.chatBox = '';
        this.zone.runOutsideAngular(() => {
          this.load_comments('refresh');
        });
        loading.dismiss();
      }

      else if (res === 'COMMENT_INTERVAL') {
        this.show_prompt(loading, 'COMMENT_INTERVAL');
      }

    });
  }

  /**
   * Method to open page to edit the current post
   */
  private editPost() {
    this.navCtrl.push("EditPostPage", {
      post: this.post
    });
  }

  /**
   * Method to add a post to the bookmarks
   */
  private addBookmark() {
    if ((this.steemConnect.user_temp as any).user) {
      this.storage.get('bookmarks').then(data => {
        if (data) {
          this.bookmarks = data;
          this.bookmarks.push({
            author: this.post.author,
            permlink: this.post.root_permlink,
            url: this.post.url,
            title: this.post.title,
            body: this.post.body
          });
          this.storage.set('bookmarks', this.bookmarks).then(data => {
            this.is_bookmarked = true;
            this.displayToast('saved');
          });
        } else {
          this.bookmarks = [{
            author: this.post.author,
            permlink: this.post.root_permlink,
            url: this.post.url,
            title: this.post.title,
            body: this.post.body
          }];
          this.storage.set('bookmarks', this.bookmarks).then(data => {
            this.is_bookmarked = true;
            this.displayToast('saved');
          });
        }
      });
    }
    else {
      this.alerts.display_alert('NOT_LOGGED_IN');
    }

  }

  /**
   * Method to remove post from bookmarks
   */
  private removeBookmark(): void {
    if ((this.steemConnect.user_temp as any).user) {
      this.storage.get('bookmarks').then(data => {
        this.bookmarks = data;
        for (let object of data) {
          if (object.author === this.post.author && object.url === this.post.url) {
            let index = this.bookmarks.indexOf(object);
            this.bookmarks.splice(index, 1);
            this.storage.set('bookmarks', this.bookmarks).then(data => {
              this.is_bookmarked = false;
              this.displayToast('removed');
            });
          }
        }
      });
    }
    else {
      this.alerts.display_alert('NOT_LOGGED_IN');
    }
  }

  /**
   * Toast helper for bookmark state
   * @param msg 
   */
  private displayToast(msg) {
    let toast = this.toastCtrl.create({
      message: this.translate.instant('bookmark_action', { action: msg }),
      duration: 1500,
      position: 'bottom'
    });

    toast.present();
  }

  /**
   * Method to check if the post is currently bookmarked
   * @param array
   */
  private containsObject(array) {
    for (let object of array) {
      if (object.author === this.post.author && object.url === this.post.url) {
        this.is_bookmarked = true;
      }
    }
  }

  /**
   * Method to adjust textarea based on the user input so input does
   * not get hidden
   * @param event 
   */
  protected adjustTextarea(event?: any): void {
    this.myInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0].style.height = 'auto';
    this.myInput['_elementRef']
      .nativeElement
      .getElementsByClassName("text-input")[0]
      .style
      .height = this.myInput['_elementRef']
        .nativeElement
        .getElementsByClassName("text-input")[0]
        .scrollHeight + 'px';
  }

  /**
   * Method to insert text at current pointer
   * @param {String} text: Text to insert 
   */
  private insertText(text: string): void {
    const current = this.chatBox;
    let final = current.substr(0, this.caret) + text + current.substr(this.caret);
    this.chatBox = final;
    this.adjustTextarea();
  }

  /**
   * Method to present actionsheet with options
   */
  private presentActionSheet(): void {
    if ((this.steemConnect.user_temp as any).user) {

      let actionSheet = this.actionSheetCtrl.create({
        title: this.translate.instant('general.camera_options.title'),
        buttons: [
          {
            text: this.translate.instant('general.camera_options.camera'),
            icon: 'camera',
            handler: () => {
              this.camera.choose_image(this.camera.FROM_CAMERA, false, 'comment').then((image: any) => {
                this.insertText(image);
              });
            }
          },
          {
            text: this.translate.instant('general.camera_options.gallery'),
            icon: 'albums',
            handler: () => {
              this.camera.choose_image(this.camera.FROM_GALLERY, true, 'comment').then((image: any) => {
                this.insertText(image);
              });
            }
          },
          {
            text: this.translate.instant('general.camera_options.custom_url'),
            icon: 'md-globe',
            handler: () => {
              this.presentInsertURL()
            }
          },
          {
            text: this.translate.instant('generic_messages.cancel'),
            icon: 'close',
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });

      actionSheet.present();

    }

    else {
      this.alerts.display_alert('NOT_LOGGED_IN');
    }

  }

  /**
   * Method to show insert URL actionsheet
   */
  private presentInsertURL(): void {
    let alert = this.alertCtrl.create({
      title: this.translate.instant('general.insert_image.title'),
      inputs: [
        {
          name: 'URL',
          placeholder: this.translate.instant('general.insert_image.url'),
        }
      ],
      buttons: [
        {
          text: this.translate.instant('general.insert_image.cancel'),
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            this.insertText('![image](' + data.URL + ')');
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Method to open the pending payout popover
   */
  private presentPayoutPopover(myEvent): void {
    let payout = { payout: this.post.total_payout_reward, created: this.post.created, beneficiaries: this.post.beneficiaries }
    let popover = this.popoverCtrl.create('PendingPayoutPage', payout);
    popover.present({
      ev: myEvent
    });
  }

  /**
   * Method to open a modal with the votes of the post
   * @param post 
   */
  private openVotes(url: string, author: string): void {
    let votesModal = this.modalCtrl.create("VotesPage", { votes: this.post.votes }, { cssClass: "full-modal" });
    votesModal.present();
  }

  /**
   * Method to show reblog alert with a detailed message of this action
   * @private
   */
  private reblogAlert(): void {
    let confirm = this.alertCtrl.create({
      title: this.translate.instant('reblog.title'),
      message: this.translate.instant('reblog.message'),
      buttons: [
        {
          text: this.translate.instant('generic_messages.cancel'),
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: this.translate.instant('reblog.reblog_action'),
          handler: () => {
            this.reblog();
          }
        }
      ]
    });
    confirm.present();
  }

  /**
   * Method to pop to root when a tag is tapped
   * @param {String} tag: Tag to set in the app
   * @private
   */
  private assign_tag(tag: string): void {
    // Publish event to dismiss all modals behind this page.
    this.events.publish('dismiss-modals');
    // Set the next tag to the global service.
    this.service.current_tag.next(tag);
    // Remove all the pages in the navigation stack until it is root.
    this.navCtrl.popToRoot();
  }

}
