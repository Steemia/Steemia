import { Component } from '@angular/core';
import { IonicPage, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { AlertController, ToastController } from 'ionic-angular';
import { BrowserTab } from '@ionic-native/browser-tab';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { CryptoProvider } from 'providers/crypto-api/crypto-api';
import { Address } from 'models/models';
import { TranslateService } from '@ngx-translate/core';

/**
 *
 * @author Hüseyin TERKİR
 * @author Jayser Mendez
 * @version 2.0
 */

@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {

  // Main Account Data
  private account_balance: {
    sbd?: any,
    balance?: any,
    vesting_shares?: any
  } = {};

  // Rewards Data
  private rewards = {
    steem: null,
    sbd: null,
    vesting_steem: null,
    vesting_steem_balance: null
  };

  // Account Addresses Data
  private address = {
    btc: {
      address: null,
      confirmed: null,
      unconfirmed: null
    },
    ltc: {
      address: null,
      confirmed: null,
      unconfirmed: null
    },
    eth: {
      address: null,
      confirmed: null,
      unconfirmed: null
    }
  };

  // Coin's Prices
  private prices: any;

  private account: string = "steemia-io";

  constructor(public navParams: NavParams,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public menu: MenuController,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private steeemActions: SteeemActionsProvider,
    private steemiaProvider: SteemiaProvider,
    private browserTab: BrowserTab,
    private iab: InAppBrowser,
    private cryptoProvider: CryptoProvider) {}

  
  ionViewDidLoad() {
    this.account = this.navParams.get("author");

    this.getAccount().then(() => {
      // Conditions to avoid querying not necessary data.
      if (this.address.btc.address !== null || this.address.btc.address !== undefined) {
        this.checkBalance('btc');
      }

      if (this.address.eth.address !== null || this.address.eth.address !== undefined) {
        this.checkBalance('eth');
      }

      if (this.address.ltc.address !== null || this.address.ltc.address !== undefined) {
        this.checkBalance('ltc');
      }
      this.cryptoProvider.get_prices().then(prices => {
        this.prices = prices;
      });
    });
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  /**
   * Method to transfer coins
   * @param coin
   */
  showPrompt(coin) {
    let prompt = this.alertCtrl.create({
      title: this.translate.instant('pages.wallet.prompts.transfer.title'),
      subTitle: this.translate.instant('pages.wallet.prompts.transfer.subtitle'),
      message: this.translate.instant('pages.wallet.prompts.transfer.message'),
      cssClass: 'alert-center',
      enableBackdropDismiss: true,
      inputs: [{
        name: 'username',
        placeholder: this.translate.instant('pages.wallet.prompts.transfer.inputs.recipient'),
      }, {
        name: 'amount',
        placeholder: this.translate.instant('pages.wallet.prompts.transfer.inputs.amount'),
      }, {
        name: 'memo',
        placeholder: this.translate.instant('pages.wallet.prompts.transfer.inputs.memo'),
      }],
      buttons: [{
        text: this.translate.instant('generic_messages.cancel'),
        cssClass: 'block round dark ion-button'
      },
      {
        text: this.translate.instant('pages.wallet.prompts.transfer.send'),
        handler: data => {
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

  /**
   * Method to add a new crypto address
   */
  private addAddress() {
    let prompt = this.alertCtrl.create({
      title: this.translate.instant('pages.wallet.prompts.add_crypto.title'),
      message: this.translate.instant('pages.wallet.prompts.add_crypto.message'),
      inputs: [{
        type: 'radio',
        label: 'Bitcoin',
        value: 'bitcoin'
      }, {
        type: 'radio',
        label: 'Ethereum',
        value: 'ethereum'
      }, {
        type: 'radio',
        label: 'Litecoin',
        value: 'litecoin'
      }],
      buttons: [{
        text: this.translate.instant('generic_messages.cancel'),
      }, {
        text: this.translate.instant('pages.wallet.prompts.add_crypto.continue'),
        handler: data => {
          this.SaveAdress(data);
        }
      }]
    });
    prompt.present();
  }

  /**
   * Method to save a new crypto address
   * @param coin 
   */
  private SaveAdress(coin): void {
    let alert = this.alertCtrl.create({
      title: this.translate.instant('pages.wallet.prompts.save_address.title', { coin: coin }),
      inputs: [{
        name: 'address',
        placeholder: this.translate.instant('pages.wallet.prompts.save_address.inputs.address', { coin: coin }),
      }],
      buttons: [{
        text: this.translate.instant('generic_messages.cancel'),
        role: 'cancel'
      },
      {
        text: this.translate.instant('pages.wallet.prompts.save_address.save'),
        handler: data => {
          this.browserTab.isAvailable()
            .then((isAvailable: boolean) => {
              if (isAvailable) {

                this.browserTab.openUrl(`https://steemconnect.com/sign/profile-update?${coin}=${data.address}`);
              } else {
                // if custom tabs are not available you may  use InAppBrowser
              }
            });
        }
      }
      ]
    });
    alert.present();
  }

  /**
   * Method to get account data
   */
  private getAccount() {
    return new Promise(resolve => {
      this.steemiaProvider.dispatch_account(this.account).then(data => {

        const metadata = JSON.parse(data[0].json_metadata);
  
        this.account_balance = {
          sbd: parseFloat(data[0].sbd_balance),
          balance: parseFloat(data[0].balance),
          vesting_shares: parseInt(data[0].vesting_shares).toFixed(2)
        }
  
        this.rewards = {
          sbd: parseFloat(data[0].reward_sbd_balance),
          steem: parseFloat(data[0].reward_steem_balance),
          vesting_steem: parseFloat(data[0].reward_vesting_balance),
          vesting_steem_balance: parseFloat(data[0].reward_vesting_steem)
        }
  
        if (metadata.profile.bitcoin) {
          this.address.btc.address = metadata.profile.bitcoin;
        }
  
        if (metadata.profile.litecoin) {
          this.address.ltc.address = metadata.profile.litecoin;
        }
  
        if (metadata.profile.ethereum) {
          this.address.eth.address = metadata.profile.ethereum;
        }
      }).then(() => {
        resolve();
      });
    })
    
  }

  /**
   * Event listener for the wallet item component
   * @param {Object} event 
   */
  private eventListener(event) {

    if (event.type === 'transfer') {
      this.showPrompt(event.name)
    }

    else if (event.type === 'buy') {
      switch (event.name) {
        case 'STEEM':
          this.buySteem();
          break;

        case 'SBD':
          this.buySbd();
          break;

        case 'Bitcoin':
          this.buy_crypto('btc');
          break;

        case 'Litecoin':
          this.buy_crypto('ltc');
          break;

        case 'Ethereum':
          this.buy_crypto('eth');
          break;
      }
    }

    else if (event.type === 'sell') {
      switch (event.name) {
        case 'STEEM':
          this.sell('steem');
          break;

        case 'SBD':
          this.sell('sbd');
          break;

        case 'Bitcoin':
          this.sell('btc');
          break;

        case 'Litecoin':
          this.sell('ltc');
          break;

        case 'Ethereum':
          this.sell('eth');
          break;
      }
    }
  }

  /**
   * Method to check account balance
   * @param {String} type 
   */
  private checkBalance(type: string): void {
    this.cryptoProvider.check_balance(type, this.address[type].address).then((data: any) => {
      this.address[type].confirmed = data.confirmed;
      this.address[type].unconfirmed = data.unconfirmed;
    });
  }

  /**
   * Method to sell cryptos
   * @param {String} type 
   */
  private sell(type: string): void {
    this.cryptoProvider.buy_sell(this.account_balance[type], this.address.btc.address, type, 'btc');
  }

  /**
   * Method to buy cryptos
   * @param {String} type 
   */
  private buy_crypto(type: string): void {
    this.cryptoProvider.buy_sell(this.account_balance.sbd, this.address[type].address, 'sbd', type);

  }

  /**
   * Method to buy Steem
   */
  private buySteem(): void {
    this.cryptoProvider.buy_sell(1, this.account, 'btc', 'steem');
  }

  /**
   * Method to buy SBD
   */
  private buySbd(): void {
    this.cryptoProvider.buy_sell(1, this.account, 'btc', 'sbd');
  }

  /**
   * Method to claim rewards
   */
  private claim_rewards(): void {
    const steem = this.rewards.steem.toFixed(3).toString() + ' STEEM';
    const sbd = this.rewards.sbd.toFixed(3).toString() + ' SBD';
    const sp = this.rewards.vesting_steem.toFixed(6).toString() + ' VESTS';
    let loader = this.loadingCtrl.create({
      content: this.translate.instant('generic_messages.collecting_rewards')
    });
    loader.present();
    this.steeemActions.dispatch_claim_reward(steem, sbd, sp).then(data => {
      loader.dismiss();
      this.getAccount();
      let toast = this.toastCtrl.create({
        message: this.translate.instant('generic_messages.rewards_collected'),
        duration: 1500
      });

      toast.present();
    });
  }

}