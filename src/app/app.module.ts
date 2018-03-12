import { MyReservationsPage } from './../pages/my-reservations/my-reservations';
import { AnnouncementDetailsPage } from './../pages/announcement-details/announcement-details';
import { SigninPage } from './../pages/signin/signin';
import { PaymentPage } from './../pages/payment/payment';
import { ReserveDetailsPage } from './../pages/reserve-details/reserve-details';
import { ReserveItemPage } from './../pages/reserve-item/reserve-item';
import { ReserveDatePage } from './../pages/reserve-date/reserve-date';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { CommonProvider } from '../providers/common/common';

export const firebaseConfig = {
  apiKey: "AIzaSyAqEwyw1GntJd1F3yVftTlDCUQdRKlXGfQ",
  authDomain: "angularfire-dummy.firebaseapp.com",
  databaseURL: "https://angularfire-dummy.firebaseio.com",
  projectId: "angularfire-dummy",
  storageBucket: "",
  messagingSenderId: "164158484108"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ReserveDatePage,
    ReserveItemPage,
    ReserveDetailsPage,
    PaymentPage,
    SigninPage,
    AnnouncementDetailsPage,
    MyReservationsPage

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ReserveDatePage,
    ReserveItemPage,
    ReserveDetailsPage,
    PaymentPage,
    SigninPage,
    AnnouncementDetailsPage,
    MyReservationsPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireDatabase,
    CommonProvider
  ]
})
export class AppModule {}
