import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
// import * as Peer from 'peerjs';

// import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

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
  anotherid: string = '';
  mypeerid;
  msgs: Array<string> = [];
  messages = [];
  message = '';

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  private toastCtrl: ToastController) {

    this.username = this.navParams.get('author');

    this.getMessages().subscribe(message => {
      this.messages.push(message);
    });

    this.getUsers().subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.showToast('User left: ' + user);
      } else {
        this.showToast('User joined: ' + user);
      }
    });
    
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  sendMessage() {
   // this.socket.emit('add-message', { text: this.message });
    this.message = '';
  }

  getMessages() {
    let observable = new Observable(observer => {
      // this.socket.on('message', (data) => {
      //   observer.next(data);
      // });
    })
    return observable;
  }
 
  getUsers() {
    let observable = new Observable(observer => {
      // this.socket.on('users-changed', (data) => {
      //   observer.next(data);
      // });
    });
    return observable;
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

  ionViewWillLeave() {
    //this.socket.disconnect();
  }

}
