import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CryptoProvider } from 'providers/crypto-api/crypto-api'
import { Storage } from '@ionic/storage';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-pending-payout',
  templateUrl: 'pending-payout.html',
})
export class PendingPayoutPage {
  public payout;
  public author;
  public created;
  public cashout;
  public boolean = true;
  public local: string= 'USD';
  public sbd_str = 'SBD*'
  public cryptos;
  public STEEM;
  public SBD;
  public beneficiaries;

  private is_loading: boolean = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private translate: TranslateService,
    public storage: Storage,
    public crypto: CryptoProvider) {
      this.payout = navParams.get('payout');
      this.beneficiaries = navParams.get('beneficiaries');
      this.created = moment(navParams.get('created')).toDate();
  }

  ionViewDidLoad() {
    this.getCurrency();
    this.calculatePayout();
  }

  getCurrency() {
    this.is_loading = true;
    this.storage.get('currency').then(data => {
      if (data) {
        this.local = data;
      } else {
        this.local = 'USD';
      }
    }).then(() => {
      this.getLocalPrice();
    })
  }

  getLocalPrice() {
    this.crypto.get_steem_price(this.local).then(data => {
      this.cryptos = data;
      this.cryptos = this.cryptos.data;

      this.STEEM = this.cryptos.STEEM.USD;
 
      this.SBD = this.cryptos['SBD*'];
      this.SBD = this.SBD[this.local];

    }).then(() => {
      this.author = (((this.payout * 37.5) / 100) * this.SBD).toFixed(2);
      this.is_loading = false;
    })
  }

  calculatePayout() {
    let now = moment().toDate();
    let cashout_time = moment(this.created).add(7, 'd').toDate();

    let hours = moment(cashout_time).diff(now, 'hours');
    let minutes = moment(cashout_time).diff(now, 'minutes');
    let days = moment(cashout_time).diff(now, 'days');

    if (hours > 24 ) {
      this.cashout = moment(cashout_time).diff(now, 'days') + this.translate.instant('days');
      this.boolean = false;
    } else if (hours < 24 && hours > 0) {
      this.cashout = moment(cashout_time).diff(now, 'hours') + this.translate.instant('hours');
      this.boolean = false;
    } else if (minutes < 60 && minutes > 0) {
      this.cashout = moment(cashout_time).diff(now, 'minutes') + this.translate.instant('minutes');
      this.boolean = false;
    }
  }

}