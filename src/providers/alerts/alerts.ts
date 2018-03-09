import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';
import { NOT_LOGGED_IN, 
         REBLOGGED_CORRECTLY,
         ERRORS } from '../../constants/constants';


@Injectable()
export class AlertsProvider {

  constructor(private alertCtrl: AlertController, 
  private toastCtrl: ToastController) {

  }

  /**
   * Method to display an alert with the corresponding message
   * @param {String} type: Type of message to be dispatched
   */
  public display_alert(type: string) {
    let message;

    switch (type) {

      case 'NOT_LOGGED_IN':
        message = NOT_LOGGED_IN;
        break;
      
      case 'REBLOGGED_CORRECTLY':
        message = REBLOGGED_CORRECTLY;
        break;
      
      case 'ALREADY_REBLOGGED':
        message = ERRORS.DUPLICATE_REBLOG.message;
        break;

      case 'COMMENT_INTERVAL':
        message = ERRORS.COMMENT_INTERVAL.message
        break;

      default:
        message = 'Type is not given';
        break;
    }

    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: message,
      buttons: ['Dismiss']
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

    toast.present();
  }

}
