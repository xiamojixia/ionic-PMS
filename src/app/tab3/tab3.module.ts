import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 新增 FormsModule
import { IonicModule } from '@ionic/angular'; // 确保 Ionic 模块导入
import { Tab3Page } from './tab3.page';
import { HttpClientModule } from '@angular/common/http';
import { Tab3PageRoutingModule } from './tab3-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpClientModule, // 确保这里导入了 HttpClientModule
    Tab3PageRoutingModule
  ],
  declarations: [Tab3Page] // 正确声明组件
})
export class Tab3PageModule {}
