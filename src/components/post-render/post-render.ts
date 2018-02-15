/**
 * 
 * Custom component to render post into the given feeds.
 * 
 * @author Jayser Mendez
 * @version 1.0
 */

import { Component, Input } from '@angular/core';
import { Post } from 'models/models';


@Component({
  selector: 'post-render',
  templateUrl: 'post-render.html'
})
export class PostRenderComponent {

  @Input('posts') private contents: Array<Post> = [];

  constructor() { 
  }


}
