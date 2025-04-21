import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrivacyPage } from './privacy.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { PrivacyPageRoutingModule } from './privacy-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    PrivacyPageRoutingModule
  ],
  declarations: [PrivacyPage]
})
export class PrivacyPageModule {}