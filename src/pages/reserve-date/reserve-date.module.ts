import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReserveDatePage } from './reserve-date';

@NgModule({
  declarations: [
    ReserveDatePage,
  ],
  imports: [
    IonicPageModule.forChild(ReserveDatePage),
  ],
})
export class ReserveDatePageModule {}
