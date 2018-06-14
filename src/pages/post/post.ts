import { Component, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import {
  IonicPage, ViewController, AlertController, MenuController, ActionSheetController,
  LoadingController, NavController, ToastController
} from 'ionic-angular';
import marked from 'marked';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { AlertsProvider } from 'providers/alerts/alerts';
import { CameraProvider } from 'providers/camera/camera';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  @ViewChild('myInput') myInput: ElementRef;

  private caret: number = 0;
  private is_preview: boolean = false;
  private markdowntext;

  private rewards: string = '50%'
  private storyForm: FormGroup;
  private upvote: boolean = false;

  constructor(private viewCtrl: ViewController,
    private actionSheetCtrl: ActionSheetController,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private steemActions: SteeemActionsProvider,
    private navCtrl: NavController,
    public menu: MenuController,
    private translate: TranslateService,
    private alerts: AlertsProvider,
    private camera: CameraProvider,
    public storage: Storage,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {

    this.storyForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tags: ['', Validators.required]
    });
  }

  ionViewCanLeave(): boolean {
    if (this.is_preview === true) {
      this.showPreview();
      this.cdr.detectChanges();
      return false;
    }
    else {
      return true;
    }

  }

  ionViewDidLoad(): void {
    this.storage.get('title').then((title) => {
      if (title) {
        this.insertTitle(title);
      }
    });

    this.storage.get('description').then((description) => {
      if (description) {
        this.insertText(description);
      }
    });

    this.storage.get('tags').then((tags) => {
      if (tags) {
        this.insertTags(tags);
      }
    });
  }

  ionViewDidLeave(): void {
    this.storage.set('title', this.storyForm.controls['title'].value).then(() => { });
    this.storage.set('description', this.storyForm.controls['description'].value).then(() => { });
    this.storage.set('tags', this.storyForm.controls['tags'].value).then(() => { });
  }

  ionViewDidEnter(): void {
    this.menu.enable(false);
  }

  ionViewWillLeave(): void {
    this.menu.enable(true);
  }

  public deleteDraft() {
    this.storage.ready().then(() => {
      this.storage.remove('title').then(() => { });
      this.storage.remove('description').then(() => { });
      this.storage.remove('tags').then((res) => { });
    });
  }

  /**
   * Method to insert text at current pointer
   * @param {String} text: Text to insert 
   */
  insertText(text: string): void {
    const current = this.storyForm.value.description.toString();
    let final = current.substr(0, this.caret) + text + current.substr(this.caret);
    this.storyForm.controls["description"].setValue(final);
  }

  insertTitle(text) {
    const current = this.storyForm.value.title.toString();
    let final = current.substr(0, this.caret) + text + current.substr(this.caret);
    this.storyForm.controls["title"].setValue(final);
  }

  insertTags(text) {
    const current = this.storyForm.value.tags.toString();
    let final = current.substr(0, this.caret) + text + current.substr(this.caret);
    this.storyForm.controls["tags"].setValue(final);
  }

  /**
   * Method to switch view to preview mode
   */
  showPreview(): void {
    this.zone.run(() => {
      if (this.is_preview == false) {
        let plainText = this.storyForm.value.description;
        this.markdowntext = marked(plainText.toString())
        this.is_preview = true;
      }

      else {
        this.is_preview = false;

      }

      this.cdr.detectChanges();
    })

  }

  /**
   * Method to show insert URL actionsheet
   */
  presentInsertURL(): void {
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
   * Method to get caret position in a textfield
   * @param oField 
   */
  getCaretPos(oField): void {
    let node = oField._elementRef.nativeElement.children[0];
    if (node.selectionStart || node.selectionStart == '0') {
      this.caret = node.selectionStart;
    }
  }

  /**
   * Method to show a toast message
   * @param {String} msg: message to show in the toast
   */
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1500,
      position: 'bottom'
    });

    toast.present();
  }

  /**
   * Method to post the article
   */
  private post(): void {
    if (this.storyForm.valid) {

      if (this.storyForm.controls.tags.value.match(/[^,\s][^\,]*[^,\s]*/g)) {

        let loading = this.loadingCtrl.create({
          content: this.translate.instant('generic_messages.creating_post')
        });

        loading.present();
        let tags;

        if (this.storyForm.controls.tags.value.indexOf(',') > -1) {
          tags = this.storyForm.controls.tags.value.trim().split(',')
        }

        else if (this.storyForm.controls.tags.value.indexOf(' ') > -1) {
          tags = this.storyForm.controls.tags.value.trim().split(' ');
        }

        else if (this.storyForm.controls.tags.value.trim() === '') {
          this.alerts.display_alert('NO_TAGS');
          return;
        }

        else {
          tags = [this.storyForm.controls.tags.value.trim()]
        }

        tags = tags.map(v => v.toLowerCase());
        this.steemActions.dispatch_post(
          this.storyForm.controls.title.value,
          this.storyForm.controls.description.value,
          tags, this.upvote, this.rewards).then(res => {

            if (res === 'not-logged-in') {
              // Show alert telling the user that needs to login
              loading.dismiss();
            }

            else if (res === 'Correct') {
              loading.dismiss();
              this.presentToast(this.translate.instant('generic_messages.posted_correctly'));
              this.navCtrl.pop().then(() => {
                this.deleteDraft();
              });
            }

            else if (res === 'POST_INTERVAL') {
              this.show_prompt(loading, 'POST_INTERVAL');
            }

            else {
              loading.dismiss();
            }

          });
      }

      else {
        this.alerts.display_alert('ALL_FIELDS');
      }

    }
    else {
      this.alerts.display_alert('ALL_FIELDS');
    }
  }

  private show_prompt(loader, msg) {
    loader.dismiss();
    setTimeout(() => {
      this.alerts.display_alert(msg);
    }, 500);
  }

  /**
  * function to adjust the height of the message textarea
  * @param {any} event - the event, which is provided by the textarea input
  * @return {void} 
  */
  protected adjustTextarea(event: any): void {
    let textarea: any = event.target;
    textarea.style.overflow = 'hidden';
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    return;
  }

  /**
   * Method to prevent default behavior of an object.
   * @param event 
   */
  protected preventEnter(event: any): void {
    event.preventDefault();
  }

  insertLink() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant('modals.edit_post.insert_url'),
      inputs: [
        {
          name: 'URL',
          placeholder: this.translate.instant('modals.edit_post.url_placeholder'),
        },
        {
          name: 'Text',
          placeholder: this.translate.instant('modals.edit_post.mask_url'),
        }
      ],
      buttons: [
        {
          text: this.translate.instant('generic_messages.cancel'),
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'OK',
          handler: data => {
            this.insertText('[' + data.Text + '](' + data.URL + ')');
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Method to present actionsheet with options
   */
  presentActionSheet(): void {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.translate.instant('general.camera_options.title'),
      buttons: [
        {
          text: this.translate.instant('general.camera_options.camera'),
          icon: 'camera',
          handler: () => {
            this.camera.choose_image(this.camera.FROM_CAMERA, false, 'post').then((image: any) => {
              this.insertText(image);
            });
          }
        },
        {
          text: this.translate.instant('general.camera_options.gallery'),
          icon: 'albums',
          handler: () => {
            this.camera.choose_image(this.camera.FROM_GALLERY, true, 'post').then((image: any) => {
              console.log(image);
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

  /**
   * Method to prevent focus change of an element
   * @param e 
   */
  preventFocusChange(e) {
    e.preventDefault();
  }

  /**
   * Method to force angular to detect changes in the component
   */
  protected updateChanges(): void {
    this.cdr.detectChanges();
  }

}

