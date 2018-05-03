import { Component, NgZone, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import {
  IonicPage, App, ViewController, NavParams, ActionSheetController,
  ModalController, LoadingController, MenuController, AlertController
} from 'ionic-angular';
import { PostsRes } from 'models/models';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { Subject } from 'rxjs/Subject';
import { AlertsProvider } from 'providers/alerts/alerts';
import { ERRORS } from '../../../constants/constants';
import { CameraProvider } from 'providers/camera/camera';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SettingsProvider } from 'providers/settings/settings';
import { Subscription } from 'rxjs/Subscription';
import { SharedServiceProvider } from 'providers/shared-service/shared-service';


@IonicPage({
  priority: 'high',
})
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {

  @ViewChild('myInput') myInput: ElementRef;

  private slice: number = 25;
  private is_more: boolean = true;
  private commentForm: FormGroup;

  private author: string;
  private permlink: string;
  private commentsTree: Array<any> = [];
  private is_loading = true;
  private is_voting: boolean = false;
  private logged_in: boolean = false;
  private username: string = '';
  private no_content: boolean = false;

  private chatBox: string = '';

  private ngUnsubscribe: Subject<any> = new Subject();
  private caret: number = 0;
  chosenTheme: string;

  subs: Subscription;

  constructor(private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private app: App,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private _settings: SettingsProvider,
    private service: SharedServiceProvider,
    private actionSheetCtrl: ActionSheetController,
    public viewCtrl: ViewController,
    private camera: CameraProvider,
    public menu: MenuController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private alerts: AlertsProvider,
    private steemia: SteemiaProvider,
    private steemActions: SteeemActionsProvider,
    public loadingCtrl: LoadingController,
    private steemConnect: SteemConnectProvider) {

      this.subs = this._settings.getTheme().subscribe(val => this.chosenTheme = val);

      this.commentForm = this.formBuilder.group({
        comment: ['', Validators.required],
      });
      
      this.service.reply_status.subscribe(status => {
        if (status === true) {
          this.zone.runOutsideAngular(() => {
            this.load_comments('refresh');
          });
        }
      });
  }

  ionViewDidLoad() {
    this.permlink = this.navParams.get('permlink');
    this.author = this.navParams.get('author');
    this.username = (this.steemConnect.user_temp as any).user;

    this.zone.runOutsideAngular(() => {
      this.load_comments();
    });
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    this.subs.unsubscribe();
    this.menu.enable(true);
  }

  private load_comments(action?: string) {
    this.steemia.get_comments_tree(this.author, encodeURIComponent(this.permlink), this.username).then((data: any) => {
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
   * Infinite scroll to load more comments
   * @param infiniteScroll 
   */
  private load_more(infiniteScroll) {
    setTimeout(() => {
      this.slice += 25;
      if (this.slice > this.commentsTree.length) {
        this.is_more = false;
      }
      infiniteScroll.complete();

    }, 500);
  }

  /**
   * Reinitialize comments state
   */
  private reinitialize() {
    this.no_content = false;
    this.commentsTree = [];
  }

  /**
   * Dispatch a comment to the current post
   */
  private comment() {
    if (/\S/.test(this.commentForm.value.comment.toString())) {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();

      this.steemActions.dispatch_comment(this.author, this.permlink, this.commentForm.value.comment.toString()).then(res => {
        console.log(res)
        if (res === 'not-logged') {
          this.show_prompt(loading, 'NOT_LOGGED_IN');
          return;
        }

        else if (res === 'Correct') {
          this.commentForm.controls["comment"].setValue('');
          this.adjustTextarea();
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

  }

  /**
   * Method to get caret position in a textfield
   * @param oField 
   */
  getCaretPos(oField): void {
    let node = oField._elementRef.nativeElement.children[0];
    if (node.selectionStart || node.selectionStart == '0') {
      this.caret = node.selectionStart;
    }
  }

  private show_prompt(loader, msg) {
    loader.dismiss();
    setTimeout(() => {
      this.alerts.display_alert(msg);
    }, 500);
  }

  private dismiss() {
    this.viewCtrl.dismiss();
  }

  protected adjustTextarea(event?: any): void {
    this.myInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0].style.height = 'auto';
    this.myInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0].style.height = this.myInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0].scrollHeight + 'px';
    return;
  }

  /**
   * Method to insert text at current pointer
   * @param {String} text: Text to insert 
   */
  insertText(text: string): void {
    const current = this.commentForm.value.comment.toString();
    let final = current.substr(0, this.caret) + text + current.substr(this.caret);
    this.commentForm.controls["comment"].setValue(final);
    this.myInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0].style.height = 'auto';
    this.myInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0].style.height = (this.myInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0].scrollHeight + 0) + 'px';
  }

  /**
   * Method to present actionsheet with options
   */
  presentActionSheet(): void {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'How do you want to insert the image? 📷🌄',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.camera.choose_image(this.camera.FROM_CAMERA, false, 'comment').then((image: any) => {
              this.insertText(image);
            });
          }
        },
        {
          text: 'Gallery',
          icon: 'albums',
          handler: () => {
            this.camera.choose_image(this.camera.FROM_GALLERY, true, 'comment').then((image: any) => {
              this.insertText(image);
            });
          }
        },
        {
          text: 'Custom URL',
          icon: 'md-globe',
          handler: () => {
            this.presentInsertURL()
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });

    actionSheet.present();
  }

  /**
   * Method to show insert URL actionsheet
   */
  presentInsertURL(): void {
    let alert = this.alertCtrl.create({
      title: 'Insert Image',
      inputs: [
        {
          name: 'URL',
          placeholder: 'Image URL'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
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


}
