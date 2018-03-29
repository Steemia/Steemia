/**
 * 
 * Custom component to render post into the given feeds.
 * 
 * @author Jayser Mendez
 * @version 1.0
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'post-render',
  templateUrl: 'post-render.html'
})
export class PostRenderComponent {

  @Input('posts') private contents: Array<any> = [];

  constructor() { 
  }

  trackById(index, post) {
    return post.id;
  }


}
