import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the EthereumPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ethereum',
  templateUrl: 'ethereum.html',
})
export class EthereumPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {
      
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad EthereumPage');
    }
    
    private dismiss() {
      let data = {
        'foo': 'bar'
      };
      this.viewCtrl.dismiss(data);
    }

}
