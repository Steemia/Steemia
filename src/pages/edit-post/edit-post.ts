import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import {
  IonicPage,
  ViewController,
  AlertController,
  ActionSheetController,
  LoadingController,
  ToastController,
  MenuController,
  NavController,
  NavParams,
} from 'ionic-angular';
import marked from 'marked';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { AlertsProvider } from 'providers/alerts/alerts';
import { CameraProvider } from 'providers/camera/camera';
import { SettingsProvider } from 'providers/settings/settings';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

@IonicPage({
  priority: 'medium'
})
@Component({
  selector: 'page-edit-post',
  templateUrl: 'edit-post.html',
})
export class EditPostPage {
  @ViewChild('myInput') myInput: ElementRef;

  private content: any;
  private caret: number = 0;
  private is_preview: boolean = false;
  private markdowntext;

  private storyForm: FormGroup;

  imageURI: any;
  imageFileName: any;
  cameraIMG: any;

  parsedHash: any;
  response: any;
  imgdata: any;
  hash: any;
  URL: any;

  chosenTheme: string;
  subs: Subscription;

  constructor(public viewCtrl: ViewController,
    public actionSheetCtrl: ActionSheetController,
    private formBuilder: FormBuilder,
    public menu: MenuController,
    private steemActions: SteeemActionsProvider,
    private navCtrl: NavController,
    private translate: TranslateService,
    private navParams: NavParams,
    private _settings: SettingsProvider,
    private camera: CameraProvider,
    private alerts: AlertsProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {

    this.subs = this._settings.getTheme().subscribe(val => this.chosenTheme = val);

    this.content = this.navParams.get('post');

    this.storyForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tags: ['', Validators.pattern(/[^,\s][^\,]*[^,\s]*/g) || '']
    });

  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    this.menu.enable(true);
  }

  ionViewDidLoad() {
    this.storyForm.controls['title'].setValue(this.content.title);
    this.storyForm.controls['description'].setValue(this.content.raw_body);
    let tags = this.content.tags.filter((element) => {
      return element !== 'steemia';
    });
    this.storyForm.controls['tags'].setValue(tags.join());

  }

  insertText(text) {
    const current = this.storyForm.value.description.toString();
    let final = current.substr(0, this.caret) + text + current.substr(this.caret);
    this.storyForm.controls["description"].setValue(final);
  }

  showPreview() {
    if (this.is_preview == false) {
      let plainText = this.storyForm.value.description;
      this.markdowntext = marked(plainText.toString())
      this.is_preview = true;

    }

    else {
      this.is_preview = false;
    }
  }

  presentPrompt() {
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
            console.log(data);
            this.URL = '![image](' + data.URL + ')'
            this.insertText(this.URL);
          }
        }
      ]
    });
    alert.present();
  }

  getCaretPos(oField) {
    let node = oField._elementRef.nativeElement.children[0];
    if (node.selectionStart || node.selectionStart == '0') {
      this.caret = node.selectionStart;
    }
  }


  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  private post() {
    if (this.storyForm.valid) {
      let loading = this.loadingCtrl.create({
        content: this.translate.instant('generic_messages.editing_post')
      });

      loading.present();
      let tags = this.storyForm.controls.tags.value.match(/[^,\s][^\,]*[^,\s]*/g);
      tags = tags.map(v => v.toLowerCase());
      this.steemActions.dispatch_edit_post(
        this.storyForm.controls.title.value,
        this.storyForm.controls.description.value,
        tags, this.content.root_permlink).then(res => {

          if (res === 'not-logged-in') {
            // Show alert telling the user that needs to login
            loading.dismiss();
          }

          if (res === 'Correct') {
            loading.dismiss();
            this.presentToast(this.translate.instant('generic_messages.post_edited'));
            this.navCtrl.pop();
          }

          else {
            loading.dismiss();
          }

        });

    }
    else {
      console.log("not valid");
    }
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
            console.log('Cancel clicked');
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

  /**
   * Method to prevent focus change of an element
   * @param e 
   */
  preventFocusChange(e) {
    e.preventDefault();
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }
}

