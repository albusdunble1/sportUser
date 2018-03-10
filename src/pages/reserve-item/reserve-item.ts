import { AngularFireDatabase } from 'angularfire2/database';
import { Reservation } from './../../app/models/reservation.model';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, OnChanges } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReserveDetailsPage } from '../reserve-details/reserve-details';
import { Subject } from 'rxjs/Subject';
import { DateTime } from '../../app/models/datetime.interface';


@IonicPage()
@Component({
  selector: 'page-reserve-item',
  templateUrl: 'reserve-item.html',
})
export class ReserveItemPage implements OnInit{

  courtType: string;
  categoryForm: FormGroup;
  isBadminton=false;
  isSquash=false;
  courtName:string;
  reservationFinal: Reservation;
  dateTime: DateTime;
  reservationTimeRef$;
  reservationAfterChecking;
  RCArray= [];
  categoryKey:string;
  badmintonRef$;
  badmintonObservable;
  badminton2Sync=[];
  squashRef$;
  squashObservable;
  squash2Sync=[];
  badmintonStatusUpdateRef$;
  squashStatusUpdateRef$;
  fee: number;
  badmintonRecentStatus=false;
  squashRecentStatus=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afDB: AngularFireDatabase) {
    this.dateTime= this.navParams.get('dateTime');
    console.log(this.dateTime);



    //retreving the reservation with the submitted date and time
    this.reservationTimeRef$= this.afDB.list('/reservationTimes/'+ this.dateTime.time + '/'+ this.dateTime.date);

    this.reservationAfterChecking = this.reservationTimeRef$.snapshotChanges()
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
        
          // this.reservationAfterChecking.subscribe(
          //   (data) => {
          //     this.RCArray= data;
              
          //   }
          // )

          this.reservationAfterChecking.subscribe(
            (data) => {
              this.RCArray= data;
              console.log(this.RCArray);
              this.RCArray.forEach(
                (check)=> {
                  console.log(check.key);
                  this.categoryKey=check.key;

                  // problemmm (solved for now ) ( retreived the category on that date, now think about how to sync everything)
                  this.badmintonRef$=this.afDB.list('/reservationTimes/'+ this.dateTime.time + '/'+ this.dateTime.date+'/'+ this.categoryKey+ '/category/0/courts');
                  this.badmintonObservable= this.badmintonRef$.valueChanges();

                  this.badmintonObservable.subscribe(
                    (badmintonStuff) => {
                      
                      this.badminton2Sync= badmintonStuff;
                     
                    }
                  )

                  this.squashRef$=this.afDB.list('/reservationTimes/'+ this.dateTime.time + '/'+ this.dateTime.date+'/'+ this.categoryKey+ '/category/1/courts');
                  this.squashObservable= this.squashRef$.valueChanges();
                  
                  this.squashObservable.subscribe(
                    (squashStuff) => {
                      this.squash2Sync= squashStuff;
                    }
                  )
                }
              )
            }
          )



 
  }

    
  
  ngOnInit(){
 
    
   
  }
  



  onSelect(){
    console.log(this.courtType);
    console.log(this.courtName);
    if(this.badmintonRecentStatus === true){
      this.fee= 5;
    }else{
      this.fee=3;
    }
    // const reservationRef= this.afDB.list('reservation');
    // reservationRef.push(this.reservationFinal);
    this.navCtrl.push(ReserveDetailsPage,{courtType: this.courtType, courtName: this.courtName, dateTime: this.dateTime, fee: this.fee, approvedStatus: false, reservationKey: this.categoryKey});

  }

  onChange(event){
    // console.log(this.RCArray);
    if(event === 'badminton'){
      this.isBadminton=true;
      this.isSquash=false;
    }else if(event ==='squash'){
      this.isBadminton=false;
      this.isSquash=true;
    }
    else{
      this.isBadminton=false;
      this.isSquash=false;
    }
  }

  onSelectCourt(courtName:string, bookedStatus){
    this.courtName=courtName;
    
    if(bookedStatus==true){

    }else{
      console.log(this.courtName);
      console.log(this.courtType);
      if(this.courtType=== 'badminton'){
        this.badmintonRecentStatus= !this.badmintonRecentStatus;
        if(this.squashRecentStatus == true){
          this.squashRecentStatus= false;
        }
        console.log('badminton: ',this.badmintonRecentStatus);
        console.log('squash:',this.squashRecentStatus);
      }else{
        this.squashRecentStatus= !this.squashRecentStatus;
        if(this.badmintonRecentStatus == true){
          this.badmintonRecentStatus= false;
        }
        console.log('badminton:',this.badmintonRecentStatus);
        console.log('squash:',this.squashRecentStatus);
      }
    }
    

    
  }


  // this.badmintonStatusUpdateRef$=this.afDB.list('/reservationTimes/'+ this.dateTime.time + '/'+ this.dateTime.date+'/'+ this.categoryKey+ '/category/0/courts');

}
