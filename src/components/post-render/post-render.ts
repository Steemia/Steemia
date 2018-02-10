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
  private username: string = '';

  constructor(private app: App, 
              private modalCtrl: ModalController,
              private steemConnect: SteemConnectProvider) { 

    // Subscribe to the current username logged in
    this.steemConnect.username.subscribe(user => {
      this.username = user;
    });
  }

  /**
   * Method to open the single page of a post
   * @param post 
   */
  private postOpen(post) {
    this.app.getRootNavs()[0].push('PostSinglePage', {
      post: post
    })
  }

  /**
   * Method to open a modal with the comments of the post
   * @param post 
   */
  private openComments(post) {
    let commentModal = this.modalCtrl.create("CommentsPage", { author: post.author, permlink: post.permlink });
    commentModal.present();
  }

  /**
   * Method to cast a vote or unvote
   * @param i 
   * @param author 
   * @param permlink 
   * @param weight 
   */
  private castVote(i: number, author: string, permlink: string, weight: number = 1000) {
    // Set the is voting value of the post to true
    this.contents[i].isVoting = true;
    steemInstance.vote(this.username, author, permlink, weight, (err, res) => {

      // Check for errors
      if (!err) {
        // remove the is voting flag
        this.contents[i].isVoting = false

        // check if vote is not an unvote
        if (weight > 0) {
          this.contents[i].voted = true;
        }

        // perform the downvote
        else {
          this.contents[i].voted = false;
        }
      }
    });
  }

  /**
   * Method to add pluralization to the likes in the post
   * @param likes 
   */
  private renderLikes(likes: number) {
    if (likes > 1 || likes == 0) return likes + ' likes';
    else return likes + ' like';

  }

}
