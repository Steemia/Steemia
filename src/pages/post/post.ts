import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, ViewController, Content, Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Slides } from 'ionic-angular';
import marked from 'marked';

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  @ViewChild(Slides) slides: Slides;

  data;
  htmldata;

  step: any;
  stepCondition: any;
  stepDefaultCondition: any;
  currentStep: any;
  @ViewChild(Content) content: Content;
  constructor(private viewCtrl: ViewController, public navParams: NavParams, public evts: Events) {
    /**
     * Step Wizard Settings
     */
    this.step = 1;//The value of the first step, always 1
    this.stepCondition = false;//Set to true if you don't need condition in every step
    this.stepDefaultCondition = this.stepCondition;//Save the default condition for every step
    //You can subscribe to the Event 'step:changed' to handle the current step
    this.evts.subscribe('step:changed', step => {
      //Handle the current step if you need
      this.currentStep = step[0];
      //Set the step condition to the default value
      this.stepCondition = this.stepDefaultCondition;
    });
    this.evts.subscribe('step:next', () => {
      //Do something if next
      console.log('Next pressed: ', this.currentStep);
    });
    this.evts.subscribe('step:back', () => {
      //Do something if back
      console.log('Back pressed: ', this.currentStep);
    });
  }

  /**
   * Demo functions
   */
  onFinish() {
  }

  toggle() {
    this.stepCondition = !this.stepCondition;
  }
  getIconStep2() {
    return this.stepCondition ? 'done-all' : 'create';
  }

  getIconStep3() {
    return this.stepCondition ? 'happy' : 'sad';
  }
  getLikeIcon() {
    return this.stepCondition ? 'thumbs-down' : 'thumbs-up';
  }
  goToExample2() {
    //this.navCtrl.push(DynamicPage);
  }

  textChange(e) {
    if (e.target.value && e.target.value.trim() !== '') {
      this.stepCondition = true;
    } else {
      this.stepCondition = false;
    }
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
