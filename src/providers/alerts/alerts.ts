import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';
import { NOT_LOGGED_IN, 
         REBLOGGED_CORRECTLY,
         ERRORS } from '../../constants/constants';
import { TranslateService } from '@ngx-translate/core';

         
/**
 * 
 * Class to generate alerts and toast messages
 * @author Jayser Mendez
 * @version 0.0.1
 * 
 */

@Injectable()
export class AlertsProvider {

  constructor(private alertCtrl: AlertController, 
  private toastCtrl: ToastController,
  private translate: TranslateService) {}

  /**
   * Method to display an alert with the corresponding message
   * @param {String} type: Type of message to be dispatched
   */
  public display_alert(type: string) {
    let message;

    switch (type) {

      case 'NOT_LOGGED_IN':
        message = this.translate.instant('generic_messages.not_logged_in');
        break;

      case 'NO_TAGS':
        message = this.translate.instant('generic_messages.tag_error');
        break;
      
      case 'ALL_FIELDS':
        message = this.translate.instant('generic_messages.all_fields');
        break;
        
      case 'REBLOGGED_CORRECTLY':
        message = this.translate.instant('generic_messages.reblogged_correctly');
        break;
      
      case 'ALREADY_REBLOGGED':
        message = this.translate.instant('generic_messages.already_reblogged');
        break;

      case 'COMMENT_INTERVAL':
        message = this.translate.instant('generic_messages.comment_interval');
        break;

      case 'POST_INTERVAL':
        message = this.translate.instant('generic_messages.post_interval');
        break;
        
      case 'EMPTY_TEXT':
        message = this.translate.instant('generic_messages.empty_message');
        break;

      case 'FLAG_ERROR':
        message = this.translate.instant('generic_messages.flag_error');
        break;

      default:
        message = 'Type is not given';
        break;
    }

    let alert = this.alertCtrl.create({
      title: this.translate.instant('generic_messages.alert_title'),
      subTitle: message,
      buttons: [this.translate.instant('generic_messages.dismiss')]
    });
    alert.present();
  }

  public display_toast(type: string) {

    let message;

    switch (type) {
      case 'FOLLOW':
        message = 'You have correctly followed this user 😎';
        break;

      case 'UNFOLLOW':
        message = 'You have correctly unfollowed this user 😅';
        break;
    }

    let toast = this.toastCtrl.create({
      message: message,
      duration: 3500,
      position: 'bottom'
    }); 

    return toast;
  }

}
