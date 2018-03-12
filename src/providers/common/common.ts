

import {  AngularFireDatabase } from 'angularfire2/database';

import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from 'ionic-angular';

@Injectable()
export class CommonProvider {
  userId: string;
  userEmail: string;
  loading;
  



  constructor(private afDB: AngularFireDatabase, private afAuth: AngularFireAuth, private loadingCtrl: LoadingController
              ,private toastCtrl: ToastController) {
    console.log('Hello CommonProvider Provider');
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

  loadingSpinner(msg: string){
    return this.loading=this.loadingCtrl.create({
      content: msg
    })
  
  }

  toastPop(msg: string, position: string){
    return this.toastCtrl.create({
      message:msg,
      position: position,
      duration: 1500
    })
  }


}
