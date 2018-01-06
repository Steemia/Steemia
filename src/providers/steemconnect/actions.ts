/**
 * 
 * Actions for Steem api
 * 
 * @author Jayser Mendez
 * 
 */

import { Injectable, OnInit } from '@angular/core';
import { Vote, Comment, deleteComment, Follow, Ignore, Reblog } from 'models/models';
import { SteemProvider } from './steemconnect'
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular'

@Injectable()
export class ActionsSteem extends SteemProvider {

  constructor(public storage: Storage, public platform: Platform) {

    // Call the constructor of the base class
    super(storage, platform);
   
  }

  /**
   * 
   * Method to broadcast a vote action
   * 
   * @param {Vote} vote: Metadata with the vote to broadcast
   * @returns {Promise<any>}
   */
  public vote(vote: Vote): Promise<any> {
    return new Promise((resolve, reject) => {
      this.steemit.vote(vote, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  /**
   * 
   * Method to broadcast a comment action
   * 
   * @param {Comment} comment: Metadata with the comment to broadcast
   * @returns {Promise<any>}
   */
  public comment(comment: Comment): Promise<any> {
    return new Promise((resolve, reject) => {
      this.steemit.comment(comment, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  /**
   * 
   * Method to broadcast a delete comment action
   * 
   * @param {deleteComment} comment: Metadata with the delete comment to broadcast
   * @returns {Promise<any>}
   */
  public deleteComment(comment: deleteComment) {
    return new Promise((resolve, reject) => {
      this.steemit.deleteComment(comment, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  /**
   * 
   * Method to broadcast a follow action
   * 
   * @param {Follow} follow: Metadata with the follow to broadcast
   * @returns {Promise<any>}
   */
  public follow(follow: Follow) {
    return new Promise((resolve, reject) => {
      this.steemit.follow(follow, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  /**
   * 
   * Method to broadcast an ignore action
   * 
   * @param {Ignore} ignore: Metadata with the ignore to broadcast
   * @returns {Promise<any>}
   */
  public ignore(ignore: Ignore) {
    return new Promise((resolve, reject) => {
      this.steemit.ignore(ignore, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  /**
   * 
   * Method to broadcast a reblog action
   * 
   * @param {Reblog} reblog: Metadata with the reblog to broadcast
   * @returns {Promise<any>}
   */
  public reblog(reblog: Reblog) {
    return new Promise((resolve, reject) => {
      this.steemit.reblog(reblog, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

}