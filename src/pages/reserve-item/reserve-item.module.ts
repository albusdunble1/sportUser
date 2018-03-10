import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReserveItemPage } from './reserve-item';

@NgModule({
  declarations: [
    ReserveItemPage,
  ],
  imports: [
    IonicPageModule.forChild(ReserveItemPage),
  ],
})
export class ReserveItemPageModule {}
