import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddPage } from './add.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { AddPageRoutingModule } from './add-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    AddPageRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [AddPage]
})
export class AddPageModule {}
