import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReserveDetailsPage } from './reserve-details';

@NgModule({
  declarations: [
    ReserveDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReserveDetailsPage),
  ],
})
export class ReserveDetailsPageModule {}
