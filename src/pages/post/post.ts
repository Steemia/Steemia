import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, ViewController, Content } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data'
import marked from 'marked';
/**
 * Generated class for the PostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  data;
  htmldata;
  @ViewChild(Content) content: Content;
  constructor(private viewCtrl: ViewController, public navParams: NavParams, private DataProvider:DataProvider) {
    this.getContent()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostPage');
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }
  getContent() {
    this.DataProvider.getContent('utopian-io','utopian-public-poll-12-23-2017-the-results').subscribe(data => {

      this.data = data;
      console.log(this.data.body);
    })
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
