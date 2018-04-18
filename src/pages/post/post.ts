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
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { AlertsProvider } from 'providers/alerts/alerts';
import { CameraProvider } from 'providers/camera/camera';

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
    private steemActions: SteeemActionsProvider,
    private navCtrl: NavController,
    public menu: MenuController,
    private alerts: AlertsProvider,
    private camera: CameraProvider,
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
      tags = tags.map(v => v.toLowerCase());
      this.steemActions.dispatch_post(
        this.storyForm.controls.title.value,
        this.storyForm.controls.description.value,
        tags, this.upvote, this.rewards).then(res => {
          console.log(res)

          if (res === 'not-logged-in') {
            // Show alert telling the user that needs to login
            loading.dismiss();
          }

          else if (res === 'Correct') {
            loading.dismiss();
            this.presentToast('Post was posted correctly!');
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
      console.log("not valid");
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
      title: 'Insert URL',
      inputs: [
        {
          name: 'URL',
          placeholder: 'Url to insert'
        },
        {
          name: 'Text',
          placeholder: 'Text to mask the url'
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
            this.insertText('[' + data.Text +'](' + data.URL + ')');
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
   * Method to prevent focus change of an element
   * @param e 
   */
  preventFocusChange(e) {
    e.preventDefault();
  }

}

