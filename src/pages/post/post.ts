import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import marked from 'marked';

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  constructor() {
  }

  ngAfterViewInit() {
   
  }

  convert(this) {
    if(this.toggleVal==true){
      if(this.plainText && this.plainText!=''){
        let plainText = this.plainText;

        this.markdownText = marked(plainText.toString());
        this.content = this.markdownText;
      }else{
        this.toggleVal=false
      }
    }
  }
  md2html(this) {
    if(this.toggleVal==true){
      if(this.data.body){
        let plainText = this.data.body;

        this.markdownText = marked(plainText.toString());
        this.htmldata = this.markdownText;
      }else{
        this.toggleVal=false
      }
    }
  }
}
