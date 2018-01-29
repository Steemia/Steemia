/**
 * 
 * Custom component to render post into the given feeds.
 * 
 * @author Jayser Mendez
 * @version 1.0
 */

import { Component, Input } from '@angular/core';
import { Post } from 'models/models';
import { App } from 'ionic-angular';


@Component({
  selector: 'post-render',
  templateUrl: 'post-render.html'
})
export class PostRenderComponent {

  @Input('posts') private contents: Array<Post> = [];

  constructor(public app: App) { }

  /**
   * Method to emit clicked event of a post to main
   * component.
   * @param post 
   * @param meta
   */
  private postOpen(post) {
    this.app.getRootNav().push('PostSinglePage', {
      post: post
    })
  }

}
