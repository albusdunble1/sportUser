import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  reservationID: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.reservationID= this.navParams.get('reservationID');
  }

  onHome(){
    this.navCtrl.setRoot(HomePage);
  }

}
