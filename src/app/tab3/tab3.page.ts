// tab3.page.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

const API_ENDPOINT = 'https://prog2005.it.scu.edu.au/ArtGalley';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  itemName = '';
  itemData = {
    price: 0,
    quantity: 0,
    description: ''
  };
  apiResponse: any;

  constructor(
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  // 获取所有项目
  async getAllItems() {
    try {
      this.apiResponse = await this.http.get(API_ENDPOINT).toPromise();
      this.showAlert('Success', 'Data loaded successfully');
    } catch (error) {
      this.handleError(error);
    }
  }

  // 获取单个项目
  async getItem() {
    if (!this.itemName) return;

    try {
      this.apiResponse = await this.http.get(`${API_ENDPOINT}/${this.itemName}`).toPromise();
      this.showAlert('Success', 'Item found');
    } catch (error) {
      this.handleError(error);
    }
  }

  // 创建新项目
  async createItem() {
    try {
      const response = await this.http.post(API_ENDPOINT, this.itemData).toPromise();
      this.apiResponse = response;
      this.showAlert('Success', 'Item created');
      this.clearForm();
    } catch (error) {
      this.handleError(error);
    }
  }

  // 更新项目
  async updateItem() {
    if (!this.itemName) return;

    try {
      const response = await this.http.put(
        `${API_ENDPOINT}/${this.itemName}`,
        this.itemData
      ).toPromise();
      this.apiResponse = response;
      this.showAlert('Success', 'Item updated');
    } catch (error) {
      this.handleError(error);
    }
  }

  // 删除项目
  async deleteItem() {
    if (!this.itemName) return;

    try {
      const response = await this.http.delete(`${API_ENDPOINT}/${this.itemName}`).toPromise();
      this.apiResponse = response;
      this.showAlert('Success', 'Item deleted');
      this.itemName = '';
    } catch (error) {
      this.handleError(error);
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private handleError(error: any) {
    console.error(error);
    const message = error.error?.message || error.message;
    this.showAlert('Error', message || 'Unknown error occurred');
  }

  private clearForm() {
    this.itemData = {
      price: 0,
      quantity: 0,
      description: ''
    };
  }
}
