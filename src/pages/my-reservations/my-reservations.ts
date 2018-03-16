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
  searchedId:string;
  filteredArray1=[];
  filteredArray2=[];
  

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
        this.filteredArray1= this.reservationsArray;
        this.filteredArray2= this.paidArray;
      }
    )

    

  }

  onInput(event){
    if(this.searchedId !== ''){
      // this.filteredArray= this.allReservation.filter(x=> x.reservationID.toString().startsWith(this.searchedId) !== -1);
      this.filteredArray1= this.reservationsArray.filter(x=> 
        x.reservationID.toString().substring(0,this.searchedId.length)=== this.searchedId);
        this.filteredArray2= this.paidArray.filter(x=> 
          x.reservationID.toString().substring(0,this.searchedId.length)=== this.searchedId);
    }else{
      this.filteredArray1= this.reservationsArray;
      this.filteredArray2= this.paidArray;
    }
  
  }

  onCancel(event){

  }
  
  ngOnDestroy(){
    this.reservationSub.unsubscribe();
  }

  

}
