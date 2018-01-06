/**
 * 
 * Custom component to render post into the given feeds.
 * 
 * @author Jayser Mendez
 * @version 1.0
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Post } from 'models/models';

@Component({
  selector: 'post-render',
  templateUrl: 'post-render.html'
})
export class PostRenderComponent {

  @Input('posts') private contents: Array<Post> = [];
  @Input('meta') private meta: Array<any> = [];
  @Output() private clickedPost = new EventEmitter();

  constructor() {}

  /**
   * Method to emit clicked event of a post to main
   * component.
   * @param post 
   * @param meta
   */
  private postOpen(post, i) {

    // Send post details to host component.
    this.clickedPost.emit({
      Post: post,
      Meta: this.meta[i]
    });

  }

}
