import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, ViewController, ActionSheetController, LoadingController, ToastController } from 'ionic-angular';
import marked from 'marked';
import { TdTextEditorComponent } from '@covalent/text-editor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { SteemiaLogProvider } from 'providers/steemia-log/steemia-log';


@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  @ViewChild('textEditor') private _textEditor: TdTextEditorComponent;
  @ViewChild('myInput') myInput: ElementRef;

  private rewards: string = '50%'
  private storyForm: FormGroup;
  private upvote: boolean = false;
  imageURI: any;
  imageFileName: any;

  constructor(public viewCtrl: ViewController,
    public actionSheetCtrl: ActionSheetController,
    private formBuilder: FormBuilder,
    private steemActions: SteeemActionsProvider,
    private transfer: FileTransfer,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private steemiaLog: SteemiaLogProvider) {

    this.storyForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tags: ['', Validators.pattern(/[^,\s][^\,]*[^,\s]*/g) || '']
    });

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
      let tags = this.storyForm.controls.tags.value.match(/[^,\s][^\,]*[^,\s]*/g);
      this.steemActions.dispatch_post(
        this.storyForm.controls.title.value,
        this.storyForm.controls.description.value,
        tags, this.upvote, this.rewards).then(res => {
          this.steemiaLog.log_post().then(res => {
            console.log('log', res)
          });
          console.log(res)
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
