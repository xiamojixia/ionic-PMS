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
      this.showAlert('成功', '更新成功');
      this.cancelEdit();
    } catch (error) {
      this.handleError(error);
    }
  }

  async showHelp() {
    const alert = await this.alertController.create({
      header: '详细操作指南',
      message: `
      ━━━━━ 基础操作 ━━━━━
      🔹 查看项目：点击列表中任意项目
      🔹 编辑项目：左滑项目 → 点击 ✏️ 图标 → 修改后保存
      🔹 删除项目：左滑项目 → 点击 🗑️ 图标（Laptop不可删除）

      ━━━━━ 页面操作 ━━━━━
      🔹 手动刷新：点击右上角 ⟳ 图标
      🔹 打开帮助：点击右上角 ❓ 图标

      ━━━━━ 重要限制 ━━━━━
      🔸 删除保护：项目名称为"Laptop"时禁止删除
      🔸 数字验证：价格/库存必须 ≥ 0
      🔸 必填字段：项目名称不能为空
      `,
      buttons: ['明白'],
      cssClass: 'help-alert'
    });
    await alert.present();
  }

  async deleteItem(item: InventoryItem) {
    if (item.item_name.toLowerCase() === 'laptop') {
      this.showAlert('错误', '无法删除 Laptop');
      return;
    }

    const confirm = await this.alertController.create({
      header: '确认删除',
      message: `确定要删除 ${item.item_name} 吗？`,
      buttons: [
        { text: '取消', role: 'cancel' },
        { text: '删除', handler: () => this.confirmDelete(item) }
      ]
    });
    await confirm.present();
  }

  private async confirmDelete(item: InventoryItem) {
    try {
      await this.http.delete(`${API_ENDPOINT}/${item.item_name}`).toPromise();
      this.inventoryList = this.inventoryList.filter(i => i.item_id !== item.item_id);
      this.showAlert('成功', '删除成功');
    } catch (error) {
      this.handleError(error);
    }
  }

  private validateForm(): boolean {
    if (!this.editingItem) return false;

    const errors = [];

    if (!this.editingItem.item_name) errors.push('项目名称必填');
    if (this.editingItem.quantity < 0) errors.push('库存不能为负数');
    if (this.editingItem.price < 0) errors.push('价格不能为负数');
    if (!this.categories.includes(this.editingItem.category)) errors.push('请选择有效分类');

    if (errors.length > 0) {
      this.showAlert('表单错误', errors.join('\n'));
      return false;
    }
    return true;
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['确定']
    });
    await alert.present();
  }

  private handleError(error: any) {
    console.error(error);
    const message = error.error?.message || error.message || '系统错误';
    this.showAlert('错误', message);
  }
}
