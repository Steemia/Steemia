import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

const IMG_SERVER = 'img_server';

/**
 * Class/provider to take images from camera/gallery and upload it to IPFS
 * 
 * @author Jayser Mendez
 */
@Injectable()
export class CameraProvider {

  public FROM_CAMERA;
  public FROM_GALLERY;

  constructor(private camera: Camera,
    private transfer: FileTransfer,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {

      this.FROM_CAMERA = this.camera.PictureSourceType.CAMERA;
      this.FROM_GALLERY = this.camera.PictureSourceType.PHOTOLIBRARY;

  }

  /**
   * Method to retrieve an image from camera or library
   * @param {String} from: origin of the image
   */
  public choose_image(from, edit: boolean, type: string) {
    const options: CameraOptions = {
      quality: 80,
      allowEdit: edit,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,      
      sourceType: from
    }

    return new Promise(resolve => {
      this.camera.getPicture(options).then((imageData) => {
        this.uploadFile(imageData, type).then(data => {
          resolve(data)
        });
      }, (err) => {
        //
      })
    });
  }

  /**
   * Method to upload image to Steemia IPFS
   * @param {String} image: Image path to be uploaded
   */
  private uploadFile(image, type: string): Promise<string> {

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

    return new Promise(resolve => {
      fileTransfer.upload(image, IMG_SERVER, options)
      .then((data) => {
        loader.dismiss();
        if (type === 'post' || type === 'profile') {
          this.presentToast("Image uploaded successfully", 'bottom');
        }

        else if (type === 'comment') {
          this.presentToast("Image uploaded successfully", 'top');
        }
        
        let hash = data.response;

        if (type === 'comment' || type === 'post') {
          resolve('![image](https://gateway.ipfs.io/ipfs/' + JSON.parse(hash).Hash + ')');
        }

        else if (type === 'profile') {
          resolve('https://gateway.ipfs.io/ipfs/' + JSON.parse(hash).Hash);
        }
        
      }, (err) => {
        loader.dismiss();
        if (type === 'post' || type === 'profile') {
          this.presentToast(err, 'bottom');
        }

        else if (type === 'comment') {
          this.presentToast(err, 'top');
        }
      });
    });
    
  }

  /**
  * Method to show a toast message
  * @param {String} msg: message to show in the toast
  */
  private presentToast(msg: string, position: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1500,
      position: position
    });

    toast.present();
  }

}
