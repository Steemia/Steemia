import { Injectable } from '@angular/core';
import { $WebSocket } from 'angular2-websocket/angular2-websocket';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { LocalNotifications } from '@ionic-native/local-notifications';

/**
 * Websockets utility for Busy Notifications system
 * 
 * @author Jayser Mendez
 * @version 0.0.1
 */

@Injectable()
export class WebsocketsProvider {

  public ws = new $WebSocket('wss://api.busy.org/');
  public notifications: BehaviorSubject<Array<any>> = new BehaviorSubject(null);
  private static_notifications: Array<any> = [];
  public counter: BehaviorSubject<number> = new BehaviorSubject(0);
  private internal_counter: number = 0;
  private last_timestamp: number;
  private current_user: string = '';

  constructor(private steemConnect: SteemConnectProvider,
    private localNotifications: LocalNotifications) {

    this.steemConnect.status.subscribe(data => {
      if (data.status == true) {
        this.current_user = data.userObject.user
        this.last_timestamp = data.userObject.user_metadata.notifications_last_timestamp;
      }
    });

    this.ws.onOpen((msg: MessageEvent) => {
      console.log("Notification server loaded")
    });

    this.ws.onMessage((msg: MessageEvent) => {
      
      let data = JSON.parse(msg.data);

      // Catch first array of notifications
      if (data.id == 0) {
        this.static_notifications = data.result;
        this.static_notifications.map(notification => {
          if (notification.timestamp > this.last_timestamp) {

            this.internal_counter += 1;
          }
        });
        this.counter.next(this.internal_counter);
        this.notifications.next(this.static_notifications);
      }

      // Catch new notifications
      if (data.notification) {
        if (data.type === "notification") {
          if (data.notification.type === 'reply') {   
            if (data.notification.author !== this.current_user) {
              this.localNotifications.schedule({
                id: data.notification.block,
                text: data.notification.author + ' commented on your post.',
                data: 'test',
                icon: 'https://steemitimages.com/u/' + data.notification.author + '/avatar/small'
              });
            }
          }

          else if (data.notification.type === 'mention') {
            this.localNotifications.schedule({
              id: data.notification.block,
              text: data.notification.author + ' mentioned you in a post.',
              data: 'test',
              icon: 'https://steemitimages.com/u/' + data.notification.author + '/avatar/small'
            });
          }

          else if (data.notification.type === 'transfer') {
            this.localNotifications.schedule({
              id: data.notification.block,
              text: data.notification.from + ' sent you ' + data.notification.amount,
              data: 'test',
              icon: 'https://steemitimages.com/u/' + data.notification.from + '/avatar/small'
            });
          }

          else if (data.notification.type === 'reblog') {
            this.localNotifications.schedule({
              id: data.notification.block,
              text: data.notification.account + ' reblogged your post.',
              data: 'test',
              icon: 'https://steemitimages.com/u/' + data.notification.account + '/avatar/small'
            });
          }

          else if (data.notification.type === 'follow') {
            this.localNotifications.schedule({
              id: data.notification.block,
              text: data.notification.follower + ' started following you.',
              data: 'test',
              icon: 'https://steemitimages.com/u/' + data.notification.follower + '/avatar/small'
            });
          }
          
          this.static_notifications.unshift(data.notification);
          this.notifications.next(this.static_notifications);
          this.internal_counter += 1;
          this.counter.next(this.internal_counter);
        }
      }
    });
  }

  set set_timestamp(n) {
    this.last_timestamp = n;
  }

  public sendAsync(method, parameter, id): void {
    this.ws.send4Promise(JSON.stringify({
      id: id,
      jsonrpc: '2.0',
      method: method,
      params: [parameter]
    })).then(data => { });
  }

}
