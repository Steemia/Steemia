/**
 * 
 * Custom component to render post into the given feeds.
 * 
 * @author Jayser Mendez
 * @version 1.0
 */

import { Component, Input } from '@angular/core';
import { Post } from 'models/models';
import { App, ModalController } from 'ionic-angular';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import steemInstance from 'providers/steemconnect/steemConnectAPI';


@Component({
  selector: 'post-render',
  templateUrl: 'post-render.html'
})
export class PostRenderComponent {

  @Input('posts') private contents: Array<Post> = [];
  private no_image: string = 'http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder2.png';
  private isVoting: boolean = false;
  private username: string = '';

  constructor(public app: App, 
              public modalCtrl: ModalController,
              private steemConnect: SteemConnectProvider) { 

    this.steemConnect.username.subscribe(user => {
      this.username = user;
    })
  }

  /**
   * Method to emit clicked event of a post to main
   * component.
   * @param post 
   * @param meta
   */
  private postOpen(post) {
    this.app.getRootNavs()[0].push('PostSinglePage', {
      post: post
    })
  }

  private openComments(post) {
    let commentModal = this.modalCtrl.create("CommentsPage", { author: post.author, permlink: post.permlink });
    commentModal.present();
  }

  private castVote(i, author, permlink, weight = 1000) {
    this.contents[i].isVoting = true
    console.log(this.username)
    steemInstance.vote(this.username, author, permlink, weight, (err, res) => {
      if (!err) {
        this.contents[i].isVoting = false

        if (weight > 0) {
          this.contents[i].voted = true;
        }
        else {
          this.contents[i].voted = false;
        }
      }
    });
  }

  private isVoted(i) {
    this.contents[i].active_votes.filter(vote => {
      return vote.voter.indexOf('jaysermendez') !== -1
    })
  }

}
