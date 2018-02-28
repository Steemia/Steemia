import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { NOT_LOGGED_IN } from '../../constants/constants';


@Injectable()
export class AlertsProvider {

  constructor(private alertCtrl: AlertController) {
  }

  /**
   * Method to display an alert with the corresponding message
   * @param {String} type: Type of message to be dispatched
   */
  public display_alert(type: string) {
    let message;

    switch(type) {

      case 'NOT_LOGGED_IN':
        message = NOT_LOGGED_IN;
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

}
