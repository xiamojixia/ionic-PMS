import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

interface InventoryItem {
  item_id?: number;
  item_name: string;
  category: string;
  quantity: number;
  price: number;
  supplier_name: string;
  stock_status: string;
  featured_item: number;
  special_note?: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
})
export class Tab1Page implements OnInit {
  allItems: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  searchTerm: string = '';
  isLoading = false;
  private apiUrl = 'https://prog2005.it.scu.edu.au/ArtGalley';

  constructor(
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.isLoading = true;
    this.http.get<InventoryItem[]>(this.apiUrl).subscribe({
      next: (items) => {
        // 过滤掉空名称的项目（根据你的数据中有空名称的项目）
        this.allItems = items.filter(item => item.item_name && item.item_name.trim() !== '');
        this.filteredItems = [...this.allItems];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading items:', err);
        this.isLoading = false;
        this.presentAlert('Error', 'Failed to load inventory items');
      }
    });
  }

  searchItems() {
    if (!this.searchTerm) {
      this.filteredItems = [...this.allItems];
      return;
    }

    this.filteredItems = this.allItems.filter(item => 
      item.item_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  refreshItems(event: any) {
    this.loadItems();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'In stock': return 'success';
      case 'Low stock': return 'warning';
      case 'Out of stock': return 'danger';
      default: return 'primary';
    }
  }

  async showHelp() {
    const alert = await this.alertController.create({
      header: 'Help',
      message: `
        <p>This page displays all inventory items. Use the search bar to filter items by name. Pull down to refresh the list.</p>
        <p><strong>Stock Status Colors:</strong></p>
        <ul>
          <li><ion-badge color="success">In stock</ion-badge> - Green</li>
          <li><ion-badge color="warning">Low stock</ion-badge> - Yellow</li>
          <li><ion-badge color="danger">Out of stock</ion-badge> - Red</li>
        </ul>
      `,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}