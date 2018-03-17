import { HttpClient } from '@angular/common/http';
import { BrowserTab } from '@ionic-native/browser-tab';
import { Injectable } from '@angular/core';

/**
 * Class for Crypto Activities
 * @author Jayser Mendez
 * @version 0.0.1
 */

@Injectable()
export class CryptoProvider {

  constructor(private http: HttpClient,
    private browserTab: BrowserTab) { }

  /**
   * Method to buy and sell cryptos
   * @param balance 
   * @param address 
   * @param inputType 
   * @param outputType 
   */
  public buy_sell(balance: any, address: any, inputType: string, outputType: string) {
    this.browserTab.isAvailable()
      .then((isAvailable: boolean) => {
        if (isAvailable) {
          this.browserTab.openUrl('https://blocktrades.us/?input_coin_type=' + inputType +
            '&input_coin_amount=' + balance +
            '&output_coin_type=' + outputType +
            '&receive_address=' + address +
            '&memo=' /* +this.memo */);
        } else {
          // if custom tabs are not available you may use InAppBrowser
        }
      });
  }

  /**
   * Method to check crypto accounts balance
   * @param {String} type 
   * @param {String} address 
   */
  public check_balance(type: string, address: string) {

    // If the account is BTC or LTC
    if (type === 'btc' || type === 'ltc') {

      type = type.toUpperCase(); // Since the API get it in Uppercase, let's convert it

      const url = 'https://chain.so/api/v2/get_address_balance/' + type + '/' + address;

      // Return a promise with the response of the API
      return new Promise(resolve => {
        this.http.get(url).toPromise().then(data => {
          resolve({
            confirmed: parseInt((data as any).data.confirmed_balance).toFixed(0),
            unconfirmed: parseInt((data as any).data.unconfirmed_balance).toFixed(0)
          })
        }).catch(e => console.log(e));
      });

    }

    // If the account is ETH
    else if (type === 'eth') {

      const url = 'https://api.blockcypher.com/v1/eth/main/addrs/' + address;

      // Return a promise with the response of the API
      return new Promise(resolve => {
        this.http.get(url).toPromise().then(data => {
          resolve({
            confirmed: (data as any).balance,
            unconfirmed: (data as any).unconfirmed_balance
          });
        }).catch(e => console.log(e));
      });
    }
  }

  /**
   * Method to get crypto prices
   */
  public get_prices() {
    return new Promise(resolve => {
      this.http.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=STEEM,SBD,BTC,ETH,LTC,BCH,DASH&tsyms=USD')
        .toPromise().then((data: any) => {
          resolve({
            steem: data.STEEM.USD,
            sbd: data.SBD.USD,
            btc: data.BTC.USD.toFixed(2),
            eth: data.ETH.USD.toFixed(2),
            ltc: data.LTC.USD.toFixed(2)
          });
        });
    }).catch(e => console.log(e))
  }
}