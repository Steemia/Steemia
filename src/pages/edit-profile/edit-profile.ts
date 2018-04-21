import { UtilProvider } from 'providers/util/util';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { BrowserTab } from '@ionic-native/browser-tab';
import { Component, Input } from '@angular/core';
import { IonicPage, 
         NavController, 
         NavParams, 
         ToastController,
         ViewController, 
         AlertController, 
         LoadingController,
         ActionSheetController,
         MenuController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  private account_data;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public util: UtilProvider,
    public toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private transfer: FileTransfer,
    private camera: Camera,
    private steemia: SteemiaProvider,
    private browserTab: BrowserTab,
    public menu: MenuController,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController) {
      this.account_data = this.navParams.get('steem_account_data');
  }

  private saveInfo(input, value) {
    this.browserTab.isAvailable()
    .then((isAvailable: boolean) => {

      if (isAvailable) {

        this.browserTab.openUrl('https://steemconnect.com/sign/profile-update?'+input+'='+value);

      } else {

        // open URL with InAppBrowser instead or SafariViewController

      }

    });
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    this.menu.enable(true);
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

  public showPrompt(input) {
    let prompt = this.alertCtrl.create({
      title: 'Submit your '+ input,
      message: "Click the Save button below to be redirected to SteemConnect to complete your transaction.",
      inputs: [
        {
          name: 'title',
          placeholder: 'Submit your '+ input +' here'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
            console.log(data);
            this.saveInfo(input, data.title);
          }
        }
      ]
    });
    prompt.present();
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
      correctOrientation: true,      
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
            this.saveInfo('profile_image', data.URL);
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
        this.saveInfo('profile_image', ('https://gateway.ipfs.io/ipfs/' + JSON.parse(hash).Hash) );
      }, (err) => {
        loader.dismiss();
        this.presentToast(err);
      });
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
  
}
