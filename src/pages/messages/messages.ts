import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as Peer from 'peerjs';

/**
 * Generated class for the MessagesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {

  peer;
  username: string;
  msg: string;
  receiver: string;
  anotherid;
  mypeerid;
  msgs: Array<string> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    

    this.peer = new Peer({key: 'lwjd5qra8257b9'});
      setTimeout(() => {
      this.mypeerid = this.peer.id;
      },3000);
      
      this.peer.on('connection', (conn) => {
      conn.on('data', (data) => {
        
      console.log(data);
      });
    })
    
  }

  sendMsg() {
    var conn = this.peer.connect(this.anotherid);
    conn.on('open', () => {
      this.msgs.push(this.msg)
      conn.send(this.msg);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage');
  }

}
