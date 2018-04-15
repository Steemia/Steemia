import { Component, ViewChild, ElementRef } from '@angular/core';
import {
  IonicPage,
  ViewController,
  AlertController,
  MenuController,
  ActionSheetController,
  LoadingController,
  NavController,
  ToastController
} from 'ionic-angular';
import marked from 'marked';
import { Storage } from '@ionic/storage';
import { TdTextEditorComponent } from '@covalent/text-editor';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AlertsProvider } from 'providers/alerts/alerts';

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  @ViewChild('textEditor') private _textEditor: TdTextEditorComponent;
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
    private steemActions: SteeemActionsProvider,
    private navCtrl: NavController,
    public menu: MenuController,
    private transfer: FileTransfer,
    private alerts: AlertsProvider,
    private camera: Camera,
    public storage: Storage,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {

    this.storyForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tags: ['', Validators.pattern(/[^,\s][^\,]*[^,\s]*/g) || '']
    });
  }

  ionViewCanLeave(): boolean {
    if (this.is_preview === true) {
      this.showPreview();
      return false;
    }
    else {
      return true;
    }

  }

  ionViewDidLoad() {
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

  ionViewDidLeave() {
    this.storage.set('title', this.storyForm.controls['title'].value).then(() => { });
    this.storage.set('description', this.storyForm.controls['description'].value).then(() => { });
    this.storage.set('tags', this.storyForm.controls['tags'].value).then(() => { });
    this.menu.enable(true);
  }

  ionViewDidEnter() {
    this.menu.enable(false);
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
    if (this.is_preview == false) {
      let plainText = this.storyForm.value.description;
      this.markdowntext = marked(plainText.toString())
      this.is_preview = true;

    }

    else {
      this.is_preview = false;
    }
  }

  /**
   * Method to retrieve an image from camera or library
   * @param {String} from: origin of the image
   */
  private choose_image(from, edit: boolean): void {
    let imageURI;
    const options: CameraOptions = {
      quality: 80,
      allowEdit: edit,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: from
    }

    this.camera.getPicture(options).then((imageData) => {
      imageURI = imageData;

    }, (err) => {
      if (err) {
        //this.presentToast(err);
      }
    }).then(data => {
      if (imageURI) {
        this.uploadFile(imageURI);
      }
    });
  }

  /**
   * Method to show insert URL actionsheet
   */
  presentInsertURL(): void {
    let alert = this.alertCtrl.create({
      title: 'Login',
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

  /**
   * Method to upload image to Steemia IPFS
   * @param {String} image: Image path to be uploaded
   */
  uploadFile(image): void {
    let url = 'https://steemia.net/api/v0/add';
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();

    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'ionicfile',
      fileName: 'ionicfile',
      chunkedMode: false,
      mimeType: "image/jpeg",
    }

    fileTransfer.upload(image, url, options)
      .then((data) => {
        loader.dismiss();
        this.presentToast("Image uploaded successfully");
        let hash = data.response;
        this.insertText('![image](https://gateway.ipfs.io/ipfs/' + JSON.parse(hash).Hash + ')');
      }, (err) => {
        loader.dismiss();
        this.presentToast(err);
      });
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
      let loading = this.loadingCtrl.create({
        content: 'We are posting your amazing story 💯'
      });

      loading.present();
      let tags = this.storyForm.controls.tags.value.match(/[^,\s][^\,]*[^,\s]*/g);
      this.steemActions.dispatch_post(
        this.storyForm.controls.title.value,
        this.storyForm.controls.description.value,
        tags, this.upvote, this.rewards).then(res => {

          if (res === 'not-logged-in') {
            // Show alert telling the user that needs to login
            loading.dismiss();
          }

          if (res === 'Correct') {
            loading.dismiss();
            this.presentToast('Post was posted correctly!');
            this.navCtrl.pop().then(() => {
              this.deleteDraft();
            });
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

  /**
   * Method to prevent default behavior of an object.
   * @param event 
   */
  protected preventEnter(event: any): void {
    event.preventDefault();
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
            this.choose_image(this.camera.PictureSourceType.CAMERA, false);
          }
        },
        {
          text: 'Gallery',
          icon: 'albums',
          handler: () => {
            this.choose_image(this.camera.PictureSourceType.PHOTOLIBRARY, true);
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
   * Method to prevent focus change of an element
   * @param e 
   */
  preventFocusChange(e) {
    e.preventDefault();
  }

}

