import { AngularFireDatabase } from 'angularfire2/database';
import { Reservation } from './../../app/models/reservation.model';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReserveDetailsPage } from '../reserve-details/reserve-details';
import { Subject } from 'rxjs/Subject';
import { DateTime } from '../../app/models/datetime.interface';
import { Subscription } from 'rxjs/Subscription';
import { CommonProvider } from '../../providers/common/common';


@IonicPage()
@Component({
  selector: 'page-reserve-item',
  templateUrl: 'reserve-item.html',
})
export class ReserveItemPage implements OnDestroy{

  courtType: string;
  categoryForm: FormGroup;

  isBadminton=false;
  isSquash=false;
  isTakraw=false;
  isBasketball=false;
  isFootball=false;

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

  takrawRef$;
  takrawObservable;
  takraw2Sync=[];

  basketballRef$;
  basketballObservable;
  basketball2Sync=[];

  footballRef$;
  footballObservable;
  football2Sync=[];



  badmintonStatusUpdateRef$;
  squashStatusUpdateRef$;
  fee: number;

  badmintonRecentStatus=false;
  squashRecentStatus=false;
  takrawRecentStatus=false;
  basketballRecentStatus=false;
  footballRecentStatus=false;

  reservationTimeSub: Subscription;
  badmintonSub: Subscription;
  squashSub: Subscription;
  takrawSub: Subscription;
  basketballSub: Subscription;
  footballSub: Subscription;

  userSub: Subscription;
  userObject;
  userId;
  

  constructor(private common: CommonProvider,public navCtrl: NavController, public navParams: NavParams, private afDB: AngularFireDatabase) {
    this.dateTime= this.navParams.get('dateTime');
    console.log(this.dateTime);

    this.userId= this.common.getUser();

    this.userSub=this.afDB.object('/users/'+ this.userId).valueChanges()
  .subscribe(
    (userName) => {
      this.userObject= userName;
      console.log(this.userObject.name); // get user's name

      
    }
  )


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

    this.reservationTimeSub=this.reservationAfterChecking.subscribe(
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

                  this.badmintonSub=this.badmintonObservable.subscribe(
                    (badmintonStuff) => {
                      
                      this.badminton2Sync= badmintonStuff;
                     
                    }
                  )

                  this.squashRef$=this.afDB.list('/reservationTimes/'+ this.dateTime.time + '/'+ this.dateTime.date+'/'+ this.categoryKey+ '/category/3/courts');
                  this.squashObservable= this.squashRef$.valueChanges();
                  
                  this.squashSub=this.squashObservable.subscribe(
                    (squashStuff) => {
                      this.squash2Sync= squashStuff;
                      

                    }
                  )

                  this.takrawRef$=this.afDB.list('/reservationTimes/'+ this.dateTime.time + '/'+ this.dateTime.date+'/'+ this.categoryKey+ '/category/4/courts');
                  this.takrawObservable= this.takrawRef$.valueChanges();
                  
                  this.takrawSub=this.takrawObservable.subscribe(
                    (takrawStuff) => {
                      this.takraw2Sync= takrawStuff;
                      console.log(this.takraw2Sync);
                    }
                  )

                  this.basketballRef$=this.afDB.list('/reservationTimes/'+ this.dateTime.time + '/'+ this.dateTime.date+'/'+ this.categoryKey+ '/category/1/courts');
                  this.basketballObservable= this.basketballRef$.valueChanges();
                  
                  this.basketballSub=this.basketballObservable.subscribe(
                    (basketballStuff) => {
                      this.basketball2Sync= basketballStuff;
                    }
                  )

                  this.footballRef$=this.afDB.list('/reservationTimes/'+ this.dateTime.time + '/'+ this.dateTime.date+'/'+ this.categoryKey+ '/category/2/courts');
                  this.footballObservable= this.footballRef$.valueChanges();
                  
                  this.footballSub=this.footballObservable.subscribe(
                    (footballStuff) => {
                      this.football2Sync= footballStuff;
                    }
                  )

                  
                }
              )
            }
          )



 
  }


  onSelect(){
    console.log(this.courtType);
    console.log(this.courtName);
    if(this.badmintonRecentStatus === true){
      this.fee= 5;
    }else if(this.squashRecentStatus === true){
      this.fee=3;
    }else if(this.takrawRecentStatus === true){
      this.fee=4;
    }else if(this.basketballRecentStatus === true){
      this.fee=7;
    }else if(this.footballRecentStatus === true){
      this.fee=10;
    }
    // const reservationRef= this.afDB.list('reservation');
    // reservationRef.push(this.reservationFinal);
    this.navCtrl.push(ReserveDetailsPage,{courtType: this.courtType, courtName: this.courtName, dateTime: this.dateTime, fee: this.fee, approvedStatus: false, reservationKey: this.categoryKey, userName: this.userObject.name});

  }

  onChange(event){
    // console.log(this.RCArray);
    if(event === 'badminton'){
      this.isBadminton=true;
      this.isSquash=false;
      this.isTakraw=false;
      this.isBasketball=false;
      this.isFootball=false;
      this.squashRecentStatus= false;
      this.takrawRecentStatus= false;
      this.basketballRecentStatus= false;
      this.footballRecentStatus= false;
    }else if(event ==='squash'){
      this.isBadminton=false;
      this.isSquash=true;
      this.isTakraw=false;
      this.isBasketball=false;
      this.isFootball=false;
      this.badmintonRecentStatus= false;
      this.takrawRecentStatus= false;
      this.basketballRecentStatus= false;
      this.footballRecentStatus= false;
    }else if(event ==='takraw'){
      this.isBadminton=false;
      this.isSquash=false;
      this.isTakraw=true;
      this.isBasketball=false;
      this.isFootball=false;
      this.badmintonRecentStatus= false;
      this.squashRecentStatus= false;
      this.basketballRecentStatus= false;
      this.footballRecentStatus= false;
    }else if(event ==='basketball'){
      this.isBadminton=false;
      this.isSquash=false;
      this.isTakraw=false;
      this.isBasketball=true;
      this.isFootball=false;
      this.badmintonRecentStatus= false;
      this.takrawRecentStatus= false;
      this.squashRecentStatus= false;
      this.footballRecentStatus= false;
    }else if(event ==='football'){
      this.isBadminton=false;
      this.isSquash=false;
      this.isTakraw=false;
      this.isBasketball=false;
      this.isFootball=true;
      this.badmintonRecentStatus= false;
      this.takrawRecentStatus= false;
      this.basketballRecentStatus= false;
      this.squashRecentStatus= false;
    }
    else{
      this.isBadminton=false;
      this.isSquash=false;
      this.isTakraw=false;
      this.isBasketball= false;
      this.isFootball= false;
      this.badmintonRecentStatus= false;
      this.squashRecentStatus=false;
      this.takrawRecentStatus= false;
      this.basketballRecentStatus= false;
      this.footballRecentStatus= false;
    }
  }

  onSelectCourt(courtName:string, bookedStatus){
    this.courtName=courtName;
    
    if(bookedStatus==true){
      this.badmintonRecentStatus= false;
      this.squashRecentStatus= false;
      this.takrawRecentStatus= false;
      this.basketballRecentStatus= false;
      this.footballRecentStatus= false;

      // console.log('badminton: ',this.badmintonRecentStatus);
      //   console.log('squash:',this.squashRecentStatus);
    }else{
      // console.log(this.courtName);
      // console.log(this.courtType);
      if(this.courtType=== 'badminton'){
        this.badmintonRecentStatus= true;
        if(this.squashRecentStatus == true){
          this.squashRecentStatus= false;
        }else if(this.takrawRecentStatus == true){
          this.takrawRecentStatus= false;
        }else if(this.basketballRecentStatus == true){
          this.basketballRecentStatus= false;
        }else if(this.footballRecentStatus == true){
          this.footballRecentStatus= false;
        }
        // console.log('badminton: ',this.badmintonRecentStatus);
        // console.log('squash:',this.squashRecentStatus);
      }else if(this.courtType === 'squash'){
        this.squashRecentStatus= true;
        if(this.badmintonRecentStatus == true){
          this.badmintonRecentStatus= false;
        }else if(this.takrawRecentStatus == true){
          this.takrawRecentStatus= false;
        }else if(this.basketballRecentStatus == true){
          this.basketballRecentStatus= false;
        }else if(this.footballRecentStatus == true){
          this.footballRecentStatus= false;
        }


      }else if(this.courtType === 'takraw'){
        this.takrawRecentStatus= true;
        if(this.badmintonRecentStatus == true){
          this.badmintonRecentStatus= false;
        }else if(this.squashRecentStatus == true){
          this.squashRecentStatus= false;
        }else if(this.basketballRecentStatus == true){
          this.basketballRecentStatus= false;
        }else if(this.footballRecentStatus == true){
          this.footballRecentStatus= false;
        }
      }
      
      
      else if(this.courtType === 'basketball'){
        this.basketballRecentStatus= true;
        if(this.badmintonRecentStatus == true){
          this.badmintonRecentStatus= false;
        }else if(this.takrawRecentStatus == true){
          this.takrawRecentStatus= false;
        }else if(this.squashRecentStatus == true){
          this.squashRecentStatus= false;
        }else if(this.footballRecentStatus == true){
          this.footballRecentStatus= false;
        }
      }
      
      
      else if(this.courtType === 'football'){
        this.footballRecentStatus= true;
        if(this.badmintonRecentStatus == true){
          this.badmintonRecentStatus= false;
        }else if(this.takrawRecentStatus == true){
          this.takrawRecentStatus= false;
        }else if(this.basketballRecentStatus == true){
          this.basketballRecentStatus= false;
        }else if(this.squashRecentStatus == true){
          this.squashRecentStatus= false;
        }
      }
    }
    

    
  }


  // this.badmintonStatusUpdateRef$=this.afDB.list('/reservationTimes/'+ this.dateTime.time + '/'+ this.dateTime.date+'/'+ this.categoryKey+ '/category/0/courts');

  ngOnDestroy(){
    this.badmintonSub.unsubscribe();
    this.squashSub.unsubscribe();
    this.reservationTimeSub.unsubscribe();
    this.takrawSub.unsubscribe();
    this.basketballSub.unsubscribe();
    this.footballSub.unsubscribe();
    this.userSub.unsubscribe();
  }
}
