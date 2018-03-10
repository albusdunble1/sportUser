

import {  AngularFireDatabase } from 'angularfire2/database';

import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class CommonProvider {
  userId: string;
  userEmail: string;
  loading;
  



  constructor(private afDB: AngularFireDatabase, private afAuth: AngularFireAuth, private loadingCtrl: LoadingController) {
    console.log('Hello CommonProvider Provider');
  }

  login(){
    
    
  }

  setUser(uid: string, userEmail: string){
    this.userId= uid;
    this.userEmail= userEmail;
  }

  getUser(){
    return this.userId;
  }

  getUserEmail(){
    return this.userEmail;
  }

  loadingFeature(msg: string){
    return this.loading=this.loadingCtrl.create({
      content: msg
    })
  
  }


}
