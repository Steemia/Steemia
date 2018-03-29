import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, 
         ViewController, 
         ActionSheetController, 
         LoadingController, 
         ToastController,
         NavController } from 'ionic-angular';
import marked from 'marked';
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
  imageURI: any;
  imageFileName: any;

  constructor(public viewCtrl: ViewController,
    public actionSheetCtrl: ActionSheetController,
    private formBuilder: FormBuilder,
    private steemActions: SteeemActionsProvider,
    private navCtrl: NavController,
    private transfer: FileTransfer,
    private alerts: AlertsProvider,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {

    this.storyForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tags: ['', Validators.pattern(/[^,\s][^\,]*[^,\s]*/g) || '']
    });

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

  getImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }

  uploadFile() {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    this.steemActions.mock_transaction().then(data => {
      let signature = data.result.signatures[0];
      const fileTransfer: FileTransferObject = this.transfer.create();

      let options: FileUploadOptions = {
        fileKey: 'ionicfile',
        fileName: 'ionicfile',
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {
          trx: signature,

        }
      }

    });




    // fileTransfer.upload(this.imageURI, 'http://192.168.0.7:8080/api/uploadImage', options)
    //   .then((data) => {
    //     console.log(data + " Uploaded Successfully");
    //     this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
    //     loader.dismiss();
    //     this.presentToast("Image uploaded successfully");
    //   }, (err) => {
    //     console.log(err);
    //     loader.dismiss();
    //     this.presentToast(err);
    //   });
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

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  private post() {
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
            this.alerts.display_toast('Post was posted correctly!').present();
            this.navCtrl.pop();
            // Close page and tell the user that it was posted correctly
            console.log('posted correctly')
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

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'How do you want to insert the image? 📷🌄',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Gallery',
          icon: 'albums',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Custom URL',
          icon: 'md-globe',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  preventFocusChange(e) {
    e.preventDefault();
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  convert(this) {
    if (this.toggleVal == true) {
      if (this.plainText && this.plainText != '') {
        let plainText = this.plainText;

        this.markdownText = marked(plainText.toString());
        this.content = this.markdownText;
      } else {
        this.toggleVal = false
      }
    }
  }
  md2html(this) {
    if (this.toggleVal == true) {
      if (this.data.body) {
        let plainText = this.data.body;

        this.markdownText = marked(plainText.toString());
        this.htmldata = this.markdownText;
      } else {
        this.toggleVal = false
      }
    }
  }
}

