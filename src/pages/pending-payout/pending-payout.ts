import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CryptoProvider } from 'providers/crypto-api/crypto-api'

@IonicPage()
@Component({
  selector: 'page-pending-payout',
  templateUrl: 'pending-payout.html',
})
export class PendingPayoutPage {
  public payout;
  public curation;
  public author;
  public SP;
  public local: string= 'USD';
  
  public sbd_str = 'SBD*'
  public cryptos;
  public STEEM;
  public SBD;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public crypto: CryptoProvider) {
      this.payout = navParams.get('payout');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PendingPayoutPage');
    this.getLocalPrice();
  }

  getLocalPrice() {
    this.crypto.get_steem_price(this.local).then(data => {
      this.cryptos = data;
      this.cryptos = this.cryptos.data;

      this.STEEM =this.cryptos.STEEM.USD;
 
      this.SBD = this.cryptos['SBD*'].USD;

    }).then(() => {
      this.author = (((this.payout*37.5)/100)*this.SBD).toFixed(2);
    })
  }

}