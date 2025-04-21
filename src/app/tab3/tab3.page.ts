import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

const API_ENDPOINT = 'https://prog2005.it.scu.edu.au/ArtGalley';

interface InventoryItem {
  item_id: number;
  item_name: string;
  category: string;
  quantity: number;
  price: number;
  supplier_name: string;
  stock_status: string;
  featured_item: number;
  special_note: string;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  toggleEdit(_t19: InventoryItem) {
    throw new Error('Method not implemented.');
  }
  inventoryList: InventoryItem[] = [];
  editingItem: InventoryItem | null = null;
  originalItem: InventoryItem | null = null;
  categories = ['Electronics', 'Furniture', 'Tools'];
  stockStatusOptions = ['In stock', 'Out of stock', 'Low stock'];

  constructor(
    private http: HttpClient,
    private alertController: AlertController
  ) {
    this.loadInventory();
  }

  async loadInventory() {
    try {
      this.inventoryList = await this.http.get<InventoryItem[]>(API_ENDPOINT).toPromise() || [];
    } catch (error) {
      this.handleError(error);
    }
  }

  startEdit(item: InventoryItem) {
    this.editingItem = { ...item };
    this.originalItem = item;
  }

  cancelEdit() {
    this.editingItem = null;
    this.originalItem = null;
  }

  async saveChanges() {
    if (!this.validateForm()) return;

    try {
      await this.http.put(
        `${API_ENDPOINT}/${this.originalItem?.item_name}`,
        this.editingItem
      ).toPromise();

      Object.assign(this.originalItem!, this.editingItem);
      this.showAlert('Success', 'Update successful');
      this.cancelEdit();
    } catch (error) {
      this.handleError(error);
    }
  }

  async showHelp() {
    const alert = await this.alertController.create({
      header: 'User Guide',
      message: 'Click items to view details; Swipe left to edit (✏️) or delete (🗑️) items (Laptop cannot be deleted); Click 🔄 to refresh; Note: All numbers must be ≥0, item name is required.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async deleteItem(item: InventoryItem) {
    if (item.item_name.toLowerCase() === 'laptop') {
      this.showAlert('Error', 'Cannot delete Laptop');
      return;
    }

    const confirm = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete ${item.item_name}?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', handler: () => this.confirmDelete(item) }
      ]
    });
    await confirm.present();
  }

  private async confirmDelete(item: InventoryItem) {
    try {
      await this.http.delete(`${API_ENDPOINT}/${item.item_name}`).toPromise();
      this.inventoryList = this.inventoryList.filter(i => i.item_id !== item.item_id);
      this.showAlert('Success', 'Deletion successful');
    } catch (error) {
      this.handleError(error);
    }
  }

  private validateForm(): boolean {
    if (!this.editingItem) return false;

    const errors = [];

    if (!this.editingItem.item_name) errors.push('Item name is required');
    if (this.editingItem.quantity < 0) errors.push('Stock quantity cannot be negative');
    if (this.editingItem.price < 0) errors.push('Price cannot be negative');
    if (!this.categories.includes(this.editingItem.category)) errors.push('Please select a valid category');

    if (errors.length > 0) {
      this.showAlert('Form Error', errors.join('\n'));
      return false;
    }
    return true;
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
    const message = error.error?.message || error.message || 'System error';
    this.showAlert('Error', message);
  }
}
