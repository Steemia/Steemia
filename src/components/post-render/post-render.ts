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


@Component({
  selector: 'post-render',
  templateUrl: 'post-render.html'
})
export class PostRenderComponent {

  @Input('posts') private contents: Array<Post> = [];
  private no_image: string = 'http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder2.png';

  constructor(public app: App, 
              public modalCtrl: ModalController) { }

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

}
