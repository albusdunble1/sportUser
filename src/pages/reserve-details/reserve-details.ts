import { Reservation } from './../../app/models/reservation.model';
import { DateTime } from './../../app/models/datetime.interface';
import { AngularFireDatabase } from 'angularfire2/database';
import { PaymentPage } from './../payment/payment';
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { Subscription } from 'rxjs/Subscription';



@IonicPage()
@Component({
  selector: 'page-reserve-details',
  templateUrl: 'reserve-details.html',
})
export class ReserveDetailsPage implements OnDestroy{

  courtName:string;
  courtType: string;
  reservationRef$;
  reservationObservable;
  dateTime: DateTime;
  reservationFinal: Reservation;
  fee:number;
  approvedStatus= false;
  alternativeCourtType : string;
  badmintonChosen= false;
  squashChosen = false;
  userRef$;
  userObservable;
  reservationKey: string;

  userId: string;
  matricsNo:string;

  reservationSub :Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afDB: AngularFireDatabase, private common: CommonProvider) {
    this.userId= this.common.getUser();
    this.matricsNo= this.common.getUserEmail().substring(0,7);
    
    // this.userRef$= this.afDB.list('/users/'+ this.userId);
    // this.userObservable= this.userRef$.snapshotChanges()
    // .map(
    //   (changes) => {
    //     return changes.map(
    //       (data) => ({
    //         key: data.payload.key,
    //         matricsNo:data.payload.val()
    //       })
    //     )
    //   }
    // )

    // this.userObservable.subscribe(
    //   (userData)=> {
    //     console.log(userData);
    //   }
    // )

    this.reservationRef$= this.afDB.list('reservation');
    this.reservationObservable = this.reservationRef$.snapshotChanges()
    .map(
      (changes) => {
        return changes.map(
          (data) => ({
            key: data.payload.key,
            ...data.payload.val()
          })
        )
      }
    )

    this.reservationSub=this.reservationObservable.subscribe(
      (reservationStuff) =>{
        console.log(reservationStuff);
      }
    )

    this.courtType= this.navParams.get('courtType');
    this.courtName= this.navParams.get('courtName');
    console.log(this.courtName,"  in details page");
    console.log(this.courtType,"  in details page");
    this.dateTime= this.navParams.get('dateTime');
    console.log(this.dateTime);
    this.approvedStatus= this.navParams.get('approvedStatus');
    console.log(this.approvedStatus);
    this.fee= this.navParams.get('fee');
    console.log(this.fee);
    this.reservationKey= this.navParams.get('reservationKey');


    this.reservationFinal= new Reservation(this.dateTime.date, this.dateTime.time, this.courtType, this.courtName, this.fee,this.approvedStatus, false,this.matricsNo,this.reservationKey);
    
    if(this.courtType==='badminton'){
      this.alternativeCourtType='Badminton Court';
      this.badmintonChosen= true;
      if(this.squashChosen === true){
        this.squashChosen= false;
      }
    }else{
      this.alternativeCourtType='Squash Court';
      this.squashChosen= true;
      if(this.badmintonChosen === true){
        this.badmintonChosen= false;
      }
    }
  }

  onReserve(){
    this.navCtrl.push(PaymentPage);
    const reservationRefForPush$= this.afDB.list('reservation');
    reservationRefForPush$.push(this.reservationFinal);

  }

  ngOnDestroy(){
    this.reservationSub.unsubscribe();
  }

}
