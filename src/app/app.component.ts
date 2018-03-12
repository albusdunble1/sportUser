import { MyReservationsPage } from './../pages/my-reservations/my-reservations';
import { AngularFireAuth } from 'angularfire2/auth';
import { ReserveDatePage } from './../pages/reserve-date/reserve-date';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SigninPage } from '../pages/signin/signin';
import { CommonProvider } from '../providers/common/common';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,private common: CommonProvider ,private afAuth: AngularFireAuth) {
    this.initializeApp();
    this.afAuth.authState.subscribe(
      (user) => {
      if(user){
        this.nav.setRoot(HomePage);
        this.common.setUser(user.uid,user.email);
      }else{
        this.nav.setRoot(SigninPage);
      }
      
      }
    )
    
    

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Reserve Item', component: ReserveDatePage },
      { title: 'My Reservations', component: MyReservationsPage }
      

    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  onLogout(){
    this.afAuth.auth.signOut();
    this.nav.setRoot(SigninPage);
  }
}
