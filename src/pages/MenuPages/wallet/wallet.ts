import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { DataProvider } from 'providers/data/data';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { BrowserTab } from '@ionic-native/browser-tab';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the WalletPage page.
 *
 * @author Hüseyin TERKİR
 * @version 1.0
 */

@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {

  private account: string = "steemia-io";
  private metadata;

  private sbd_balance;
  private sbd_float;

  private balance;
  private balance_float;

  private vesting_shares;

  private btc_address;
  private ltc_address;
  private eth_address;

  private currencies;
  private steem_price;
  private sbd_price;
  private btc_price;
  private eth_price;
  private ltc_price;

  private reward_sbd_balance;
  private reward_steem_balance
  private reward_vesting_steem

  constructor(private modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private steemConnect: SteemConnectProvider,
    private dataProvider: DataProvider,
    private browserTab: BrowserTab,
    private _http: HttpClient) {
    // Subscribe to the current username logged in 

    this.account = (this.steemConnect.user_object as {user: string}).user;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletPage');
    this.getAccount();
    this.getCoins();
  }

  /**
       * Method to open a modal with the Bitcoin Wallet
       */
      private openBTCWallet(): void {
        let bitcoinModal = this.modalCtrl.create("BitcoinPage");
        bitcoinModal.present();
      }

      /**
       * Method to open a modal with the Litecoin Wallet
       */
      private openLTCWallet(): void {
        let litecoinModal = this.modalCtrl.create("LitecoinPage");
        litecoinModal.present();
      }

      /**
       * Method to open a modal with the Bitcoin Wallet
       */
      private openETHWallet(): void {
        let ethereumModal = this.modalCtrl.create("EthereumPage");
        ethereumModal.present();
      }

  showPrompt(coin) {
    let prompt = this.alertCtrl.create({
      title: 'Transfer to Account',
      // subTitle: 'Move funds to another Steemia account.',
      // message: "Click the button below to be redirected to SteemConnect to complete your transaction.",
      cssClass: 'alert-center',
      enableBackdropDismiss: true,
      inputs: [{
        name: 'username',
        placeholder: 'Payment recipient'
      }, {
        name: 'amount',
        placeholder: 'How much do you want to send?'
      }, {
        name: 'memo',
        placeholder: 'This memo is public!'
      }],
      buttons: [{
        text: 'Cancel',
        cssClass: 'block round dark ion-button',
        handler: data => {
          console.log('Cancel clicked');
          console.log(data);
        }
      },
      {
        text: 'Send',
        handler: data => {
          console.log('Send clicked');
          console.log(data);
          this.browserTab.isAvailable()
            .then((isAvailable: boolean) => {
              if (isAvailable) {

                this.browserTab.openUrl('https://steemconnect.com/sign/transfer?to=' + data.username +
                  '&amount=' + data.amount + '%20' + coin +
                  '&memo=' + data.memo);
              } else {
                // if custom tabs are not available you may  use InAppBrowser
              }
            });
        }
      }
      ]
    });
    prompt.present();
  }
  private getAccount() {
    this.dataProvider.getAccount(this.account)
      .subscribe((data) => {
        this.metadata = JSON.parse(data[0].json_metadata);
        this.btc_address = this.metadata.profile.bitcoin;
        this.ltc_address = this.metadata.profile.litecoin;
        this.eth_address = this.metadata.profile.ethereum;
        this.sbd_balance = data[0].sbd_balance;
        this.balance = data[0].balance;
        this.sbd_float = parseFloat(data[0].sbd_balance);
        this.balance_float = parseFloat(data[0].balance);
        this.vesting_shares = parseInt(data[0].vesting_shares).toFixed(2);
        this.reward_sbd_balance = parseFloat(data[0].reward_sbd_balance);
        this.reward_steem_balance = parseFloat(data[0].reward_steem_balance);
        this.reward_vesting_steem = parseFloat(data[0].reward_vesting_steem);
        //  console.log(data);
        //  console.log('---------');
        //  console.log(this.metadata);
      })
  }
  private getCoins() {
    return this._http.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=STEEM,SBD,BTC,ETH,LTC,BCH,DASH&tsyms=USD')
      .subscribe(data => {
        console.log('my data: ', data);
        this.currencies = data;
        console.log(this.currencies);
        this.steem_price = this.currencies.STEEM.USD;
        this.sbd_price = this.currencies.SBD.USD;
        this.btc_price = this.currencies.BTC.USD;
        this.eth_price = this.currencies.ETH.USD;
        this.ltc_price = this.currencies.LTC.USD;
      })
  }

  private buySteem(coin) {
    this.browserTab.isAvailable()
      .then((isAvailable: boolean) => {
        if (isAvailable) {

          this.browserTab.openUrl('https://blocktrades.us/?input_coin_type=btc' +
            '&input_coin_amount=1' +
            '&output_coin_type=' + coin +
            '&receive_address=' + this.account +
            '&memo=' /* +this.memo */);
        } else {
          // if custom tabs are not available you may  use InAppBrowser
        }
      });
  }
  private sellSteem() {
    this.browserTab.isAvailable()
      .then((isAvailable: boolean) => {
        if (isAvailable) {

          this.browserTab.openUrl('https://blocktrades.us/?input_coin_type=steem' +
            '&input_coin_amount=' + this.balance_float +
            '&output_coin_type=btc' +
            '&receive_address=' + this.btc_address +
            '&memo=' /* +this.memo */);
        } else {
          // if custom tabs are not available you may  use InAppBrowser
        }
      });
  }
  private sellSBD() {
    this.browserTab.isAvailable()
      .then((isAvailable: boolean) => {
        if (isAvailable) {

          this.browserTab.openUrl('https://blocktrades.us/?input_coin_type=sbd' +
            '&input_coin_amount=' + this.sbd_float +
            '&output_coin_type=btc' +
            '&receive_address=' + this.btc_address +
            '&memo=' /* +this.memo */);
        } else {
          // if custom tabs are not available you may  use InAppBrowser
        }
      });
  }
  private buySP() {
    this.browserTab.isAvailable()
      .then((isAvailable: boolean) => {
        if (isAvailable) {

          this.browserTab.openUrl('https://blocktrades.us/?input_coin_type=steem' +
            '&input_coin_amount=' + this.balance_float +
            '&output_coin_type=sp' +
            '&receive_address=' + this.account +
            '&memo=' /* +this.memo */);
        } else {
          // if custom tabs are not available you may  use InAppBrowser
        }
      });
  }
  private buyBTC() {
    this.browserTab.isAvailable()
      .then((isAvailable: boolean) => {
        if (isAvailable) {

          this.browserTab.openUrl('https://blocktrades.us/?input_coin_type=sbd' +
            '&input_coin_amount=' + this.sbd_float +
            '&output_coin_type=btc' +
            '&receive_address=' + this.btc_address +
            '&memo=' /* +this.memo */);
        } else {
          // if custom tabs are not available you may  use InAppBrowser
        }
      });
  }
  private buyLTC() {
    this.browserTab.isAvailable()
      .then((isAvailable: boolean) => {
        if (isAvailable) {

          this.browserTab.openUrl('https://blocktrades.us/?input_coin_type=sbd' +
            '&input_coin_amount=' + this.sbd_float +
            '&output_coin_type=ltc' +
            '&receive_address=' + this.ltc_address +
            '&memo=' /* +this.memo */);
        } else {
          // if custom tabs are not available you may  use InAppBrowser
        }
      });
  }
  private buyETH() {
    this.browserTab.isAvailable()
      .then((isAvailable: boolean) => {
        if (isAvailable) {

          this.browserTab.openUrl('https://blocktrades.us/?input_coin_type=sbd' +
            '&input_coin_amount=' + this.sbd_float +
            '&output_coin_type=eth' +
            '&receive_address=' + this.eth_address +
            '&memo=' /* +this.memo */);
        } else {
          // if custom tabs are not available you may  use InAppBrowser
        }
      });
  }

}