import { AnnouncementDetailsPage } from './../announcement-details/announcement-details';
import { CommonProvider } from './../../providers/common/common';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';






@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnDestroy{
  items: Observable<any[]>;
  items1$;
  size$= new Subject<string>();  // naming convention for subject/observables size -->($)<---
  items2;
  allItems=[];
  itemArray=[];
  loading;
  userId;
  user;
  matricsNo;

  announSub: Subscription;

  ionViewDidLoad(){
    this.loading=this.common.loadingSpinner('Loading');
    this.loading.present();
  }
  

  getRandomColor(){
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }

  
  
  
  constructor(private modalCtrl: ModalController,private cdRef: ChangeDetectorRef,private common: CommonProvider,public navCtrl: NavController, private afDB: AngularFireDatabase, private afAuth: AngularFireAuth) {
  // path for announcement
  let path = "announcements";

  
    
  
  this.userId= this.common.getUser();
  this.matricsNo= this.common.getUserEmail().substring(0,7);

  let content ={
    matricsNo: this.matricsNo
  }
  this.afDB.object('/users/'+ this.userId).update(content);

    // normal single query
    // this.items1 = afDB.list('announcements', (ref) => ref.orderByChild('description')).snapshotChanges()
    // .map(
    //   (changes) => {
    //     return changes.map(
    //       (data) => ({
    //         key: data.payload.key,
    //         ...data.payload.val()
    //       })
    //     )
    //   }
    // )

    //  2.0 dynamic querying using subject(similar to observable but is able -->) to listen to multiple observers 
    
    // 2.1 dynamic querying using buttons to identify size
    // const queryObservable = this.size$.switchMap(  //switchMap to map each value to an observable
    //   (size) => afDB.list('announcements', (ref) => ref.orderByChild('size').equalTo(size)).valueChanges()
    // )
    // queryObservable.subscribe(
    //   (queriedItems) => {
    //     console.log(queriedItems);
    //   }
    // )

    // 2.1 dynamic querying using buttons to retrieve the data
  //   this.items1$ = this.size$.switchMap(  //switchMap to map each value to an observable
  //     (size) => afDB.list('announcements', (ref) => ref.orderByChild('size').equalTo(size)).snapshotChanges()

  //   )
  
  //  this.items1$.subscribe(
  //    (data) => {
  //     data.map(
  //       (item) => {
  //        console.log(item.type+ 'lol');
  //        console.log(item.payload.key);
  //        console.log(item.payload.val());

  //        this.allItems.push({
  //          key: item.payload.key,
  //          ...item.payload.val()

  //        })
  //       }
  //     )
      
      
  //   }
  //  )
    

  
    

    
    

    // 1.1 listening to the changes from database and retreiving data without any query

    // ( test 1 ) realtime list display testing
    // this.items = afDB.list('announcements').valueChanges();
   

    // ( test 2) Console.log testing
    // this.items1 = afDB.list('announcements').snapshotChanges(['child_removed'])
    // .subscribe(
    //   (actions) => {
    //     actions.map(
    //       (action) => {
    //         console.log(action.type);
    //         console.log(action.payload.key);
    //         console.log(action.payload.val());
    //       }
    //     )
    //   }
    // );


    //returning and extracting the key and values ( ... ) returns all the values of the key
    this.items = afDB.list(path, ref => ref.limitToLast(10)).snapshotChanges()
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
    this.announSub=this.items.subscribe(
      (data) => {
        this.itemArray = data;
        this.loading.dismiss();
      }
    )
    
  }

  onAnnouncement(announcement :string){
    const modal= this.modalCtrl.create(AnnouncementDetailsPage, announcement);
    modal.present();
    }
  

  //  onSignUp(email: string= "cc16165", password: string= "123123123"){
  //   this.afAuth.auth.createUserWithEmailAndPassword(email+'@test.com',password)
  //   .then(
  //     (res) => {
  //       console.log(res);
  //     }
  //   );
  // }


 


  // 1.2 changing the data of the database

  onAdd(){
    
    // (add stuff)
    const itemRef = this.afDB.list('announcements');
    itemRef.push({description: "lol hester", title:"A new title"});

    // (delete stuff)
    // const itemRef= this.afDB.list('announcements');
    // itemRef.remove("-L6hQV6d54RJGVM9Z38P");

    // (update stuff)
    // const itemRef= this.afDB.list('announcements');
    // itemRef.update("ayy", {title: "boiiiii  back"});

    // (set stuff) similar to update but this destroys the originally and replaces it so need to "update" all the data within the object
    // const itemRef= this.afDB.list('announcements');
    // itemRef.set("ayy", {title: "i am boi back", description: "oops accident"});

    // (add stuff with custom id instead of auto generated ones) its like "add stuff" but with a custom id using "set stuff"
    // const itemRef = this.afDB.list('announcements');
    // itemRef.set("a custom id thru set",{description: "lol description", title:"A new title"});

    // const itemRef= this.afDB.object("announcements" +"/"+ '0');
    // itemRef.update({lol: "meaningful text"});
  }


  // 1.3 querying the database and retreiving wanted data only

  // onSmall(){
  //   this.size$.next('small');
  // }
  

  // onLarge(){
  //   this.size$.next('large');

  // }

  // onMedium(){

  //   this.size$.next('medium');
  // }

  // onCheckAllItems(){
  //   console.log(this.allItems);
  //   console.log(this.items);
  // }

  ngOnDestroy(){
    this.announSub.unsubscribe();
  }
}


