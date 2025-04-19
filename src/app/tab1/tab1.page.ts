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

interface CategoryGroup {
  category: string;
  items: InventoryItem[];
  collapsed: boolean;
}

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: false
})
export class Tab1Page implements OnInit {
  allItems: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  categoryGroups: CategoryGroup[] = [];
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

  async loadItems() {
    this.isLoading = true;
    try {
      const items = await this.http.get<InventoryItem[]>(this.apiUrl).toPromise();
      this.allItems = items?.filter(item => item.item_name && item.item_name.trim() !== '') || [];
      this.filteredItems = [...this.allItems];
      this.groupItemsByCategory();
    } catch (err) {
      console.error('Error loading items:', err);
      await this.showAlert('Error', 'Failed to load inventory items');
    } finally {
      this.isLoading = false;
    }
  }

  groupItemsByCategory() {
    const categories = new Set(this.filteredItems.map(item => item.category));
    this.categoryGroups = Array.from(categories).map(category => ({
      category,
      items: this.filteredItems.filter(item => item.category === category),
      collapsed: false
    })).sort((a, b) => a.category.localeCompare(b.category));
  }

  toggleCategory(category: string) {
    const group = this.categoryGroups.find(g => g.category === category);
    if (group) {
      group.collapsed = !group.collapsed;
    }
  }

  collapseAll() {
    this.categoryGroups.forEach(group => group.collapsed = true);
  }

  expandAll() {
    this.categoryGroups.forEach(group => group.collapsed = false);
  }

  onSearchChange() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredItems = [...this.allItems];
      this.groupItemsByCategory();
    }
  }
  
  clearSearch() {
	this.searchTerm = '';
	this.filteredItems = [...this.allItems];
	this.groupItemsByCategory();
  }

  searchItems() {
  if (!this.searchTerm || this.searchTerm.trim() === '') {
    this.filteredItems = [...this.allItems];
  } else {
    this.filteredItems = this.allItems.filter(item => 
      item.item_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    if (this.filteredItems.length === 0) {
      this.categoryGroups = [];
    }
  }
  if (this.filteredItems.length > 0) {
    this.groupItemsByCategory();
  }
}

  refreshItems(event: any) {
    this.loadItems().then(() => {
      event.target.complete();
    });
  }

  getStatusColor(status: string): string {
    switch(status.toLowerCase()) {
      case 'in stock': return 'success';
      case 'low stock': return 'warning';
      case 'out of stock': return 'danger';
      default: return 'primary';
    }
  }

  async showHelp() {
    await this.showAlert(
      'Help',
      'This page displays inventory items grouped by category. Click on category headers to expand/collapse.'
    );
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}