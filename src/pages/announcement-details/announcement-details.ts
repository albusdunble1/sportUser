import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-announcement-details',
  templateUrl: 'announcement-details.html',
})
export class AnnouncementDetailsPage {

  announcementDate:string;
  announcementTitle: string;
  announcementDescription: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.announcementDate= this.navParams.get('date');
    this.announcementDescription= this.navParams.get('description');
    this.announcementTitle= this.navParams.get('title');
  }

  onClose(remove =false){
    this.viewCtrl.dismiss(remove);
  }



}
