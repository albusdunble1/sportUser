import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { Subscription } from 'rxjs/Subscription';



@IonicPage()
@Component({
  selector: 'page-my-reservations',
  templateUrl: 'my-reservations.html',
})
export class MyReservationsPage implements OnDestroy{
  reservationSub: Subscription;
  reservationsArray=[];
  matricsNo: string;
  checked= false;
  paidArray=[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private afDB: AngularFireDatabase, private common: CommonProvider) {
      
    this.matricsNo= this.common.getUserEmail().substring(0,7);

    this.reservationSub=this.afDB.list('/reservation', ref => ref.orderByChild('matricsNo').equalTo(this.matricsNo)).snapshotChanges()
    .map(
      (changes)=> {
        return changes.map(
          (data) => ({
            key: data.payload.key,
            ...data.payload.val()
          })
        )
      }
    ).subscribe(
      (reservationStuff) => {
        this.reservationsArray= reservationStuff;
        this.paidArray= this.reservationsArray.filter(x => x.paidStatus === false);
      }
    )

    

  }
  
  ngOnDestroy(){
    this.reservationSub.unsubscribe();
  }

  

}
