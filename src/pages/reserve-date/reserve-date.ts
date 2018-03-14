import { CommonProvider } from './../../providers/common/common';
import { AngularFireDatabase } from 'angularfire2/database';
import { DateTime } from './../../app/models/datetime.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReserveItemPage } from '../reserve-item/reserve-item';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import moment from 'moment';



@IonicPage()
@Component({
  selector: 'page-reserve-date',
  templateUrl: 'reserve-date.html',
})
export class ReserveDatePage implements OnInit, OnDestroy{
  timeForm: FormGroup;
  myDate= new Date().toString();
  reservation$;
  category$;
  reservationArray=[];
  categoryArray=[];
  RCArray=[];
  dateTime: DateTime ={
    date: "",
    time:""
  };
  reservationComparisonArray=[];
  reservationFilteredArray=[];

  reservationTimeRef$; // ref for reservation used throughout this file
  reservationAfterChecking; // observable holding the data for reservation list
  reservationQueryRef$; // querying the reservation with the exact date and time 
  reservationQuery;
 
  categoryKey: string;

  userId: string;
  matricsNo: string;
  minDate: string = new Date().toISOString();
  dateMax = moment();
  maxDate:string;
  

  categorySub: Subscription;
  reservationSub: Subscription;
  querySubscription: Subscription;
  reservationTimeSub:  Subscription;

  reservationTimes =["1pm-2pm", "2pm-3pm", "3pm-4pm", "4pm-5pm", "5pm-6pm"];

  constructor(public navCtrl: NavController, public navParams: NavParams, private afDB: AngularFireDatabase, private common: CommonProvider) {
    this.dateMax.add(1, 'months'); // get max date that user can book
    this.maxDate= this.dateMax.toDate().toISOString();

    this.userId= this.common.getUser();
    this.matricsNo= this.common.getUserEmail().substring(0,7);
    

    //fetching category list
    this.category$ = afDB.list("category").snapshotChanges()
    .map(
      (changes) => {
        return changes.map(
          (data) => ({
            key: data.payload.key,
            ...data.payload.val()
          })
        )
      }
    );

    //extracting all the data from the observable and putting it in local array to be used
       this.categorySub=this.category$.subscribe(
        (data) => {
          // this.itemArray = data;
          this.categoryArray=data;
        }
      )


    //returning and extracting the key and values ( ... ) returns all the values of the key
    this.reservation$ = afDB.list("/reservation").snapshotChanges()
    .map(
      (changes) => {
        return changes.map(
          (data) => ({
            key: data.payload.key,
            ...data.payload.val()
          })
        )
      }
    );

    //extracting all the data from the observable and putting it in local array to be used
    this.reservationSub=this.reservation$.subscribe(
      (data) => {
        // this.itemArray = data;
        this.reservationArray=data;
      }
    )

  }

  ngOnInit(){
    this.initializeForm();
  }
  

  private initializeForm(){
    this.timeForm= new FormGroup({
      'time': new FormControl('1pm-2pm', Validators.required)
      
    })
  }

  // private promiseTest(){
  //   const promise= new Promise((resolve,reject) => {
  //     this.reservationQuery.subscribe(      ///problemmmmm
  //       (data) => {
  //         this.reservationComparisonArray= data;
  //         resolve(this.reservationComparisonArray);
  //       }
  //     )
  //   });
  //   return promise;
  // }

  onSubmit(){
    this.dateTime.date= this.myDate;
    this.dateTime.time= this.timeForm.value.time;
    this.reservationTimeRef$= this.afDB.list('/reservationTimes/'+ this.dateTime.time + '/'+ this.dateTime.date);
    // constantly checking if theres a new reservation complete with date and category
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
        // passing the reservation data fetched to a local array
    this.reservationTimeSub=this.reservationAfterChecking.subscribe( // causing an infinite loop out of nowhere
            (data) => {
              this.RCArray= data;
              console.log(this.RCArray);
              this.RCArray.forEach(
                (check)=> {
                  console.log(check.key);
                  this.categoryKey=check.key;
                }
              )
            }
          )
      // comparing dates (still not working)
      

      this.reservationQueryRef$= this.afDB.list('/reservationTimes/'+ this.dateTime.time);
      this.reservationQuery= this.reservationQueryRef$.snapshotChanges()
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

       this.querySubscription=this.reservationQuery.subscribe(      ///problemmmmm (solved for now)
        (data) => {
          this.reservationComparisonArray= data;
          // console.log(this.reservationComparisonArray);

          let counter =0;
          this.reservationComparisonArray.forEach(
            (check) => {
                if(check.key == this.dateTime.date){
                  counter++;
                }
              }
          )
          if(counter> 0){
            // console.log('found');
            
          }else{
            this.reservationTimeRef$.push({category: this.categoryArray});
            
          }
        }
      )
       
      this.navCtrl.push(ReserveItemPage, {dateTime:this.dateTime});
     
      // this.reservationFilteredArray= this.reservationComparisonArray.filter(
      //    (data) => {
      //      data.key == this.dateTime.date;
      //      }
      //     )

      //     if(this.reservationFilteredArray.length>0){
      //           console.log('already exist');
      //         }else{
                // this.reservationTimeRef$.push({category: this.categoryArray});
      //         }
       
      

     


  //     //  example code
  //     this.favoriteBooks = this.favoriteBooks.map(books => {
  //       const topRatedBooks = books.filter(item =>  item.rate>4);
  //       return topRatedBooks;
  //   })
  //   return this.favoriteBooks;
  // }

      

     
      
      
    
    
    
    // .then(
    //   () => {
    //     console.log(this.RCArray);
    //   }
    // )
    console.log(this.dateTime);

  }

  ngOnDestroy(){
   
  }

  ionViewDidLeave(){

    if(this.reservationTimeSub){
      this.reservationTimeSub.unsubscribe();
      this.querySubscription.unsubscribe();
    }
    this.categorySub.unsubscribe();
    this.reservationSub.unsubscribe();
    
  }
}
