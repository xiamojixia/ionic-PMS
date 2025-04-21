import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

// Define the InventoryItem interface to represent each inventory item
interface InventoryItem {
  item_id?: number; // Optional item ID
  item_name: string; // Name of the item
  category: string; // Category of the item
  quantity: number; // Quantity of the item
  price: number; // Price of the item
  supplier_name: string; // Name of the supplier
  stock_status: string; // Stock status of the item
  featured_item: number; // Flag indicating if the item is featured
  special_note?: string; // Optional special note for the item
}

// Define the CategoryGroup interface to group items by category
interface CategoryGroup {
  category: string; // Category name
  items: InventoryItem[]; // Array of items in the category
  collapsed: boolean; // Flag indicating if the category is collapsed
}

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: false
})
export class Tab1Page implements OnInit {
  allItems: InventoryItem[] = []; // Array to store all inventory items
  filteredItems: InventoryItem[] = []; // Array to store filtered inventory items
  categoryGroups: CategoryGroup[] = []; // Array to store category groups
  searchTerm: string = ''; // Search term for item filtering
  isLoading = false; // Flag indicating if data is being loaded
  private apiUrl = 'https://prog2005.it.scu.edu.au/ArtGalley'; // API URL to fetch inventory items

  constructor(
    private http: HttpClient, // HttpClient for making HTTP requests
    private alertController: AlertController // AlertController for showing alerts
  ) {}

  ngOnInit() {
    this.loadItems(); // Load items when the component is initialized
  }

  async loadItems() {
    this.isLoading = true; // Set the loading flag to true
    try {
      const items = await this.http.get<InventoryItem[]>(this.apiUrl).toPromise();
      // Filter out items with empty names
      this.allItems = items?.filter(item => item.item_name && item.item_name.trim() !== '') || [];
      this.filteredItems = [...this.allItems]; // Initialize filtered items with all items
      this.groupItemsByCategory(); // Group items by category
    } catch (err) {
      console.error('Error loading items:', err);
      await this.showAlert('Error', 'Failed to load inventory items'); // Show an error alert
    } finally {
      this.isLoading = false; // Set the loading flag to false
    }
  }

  groupItemsByCategory() {
    const categories = new Set(this.filteredItems.map(item => item.category));
    // Create category groups and sort them alphabetically
    this.categoryGroups = Array.from(categories).map(category => ({
      category,
      items: this.filteredItems.filter(item => item.category === category),
      collapsed: false
    })).sort((a, b) => a.category.localeCompare(b.category));
  }
  
  getCategoryColor(category: string): string {
    // Define a color map for different categories
    const colorMap: {[key: string]: string} = {
      'Electronics': 'primary',
      'Furniture': 'secondary',
      'Clothing': 'tertiary',
      'Tools': 'success',
      'Miscellaneous': 'warning'
    };
    return colorMap[category] || 'medium'; // Return the corresponding color or 'medium' if not found
  }

  toggleCategory(category: string) {
    const group = this.categoryGroups.find(g => g.category === category);
    if (group) {
      group.collapsed = !group.collapsed; // Toggle the collapsed state of the category group
    }
  }

  collapseAll() {
    this.categoryGroups.forEach(group => group.collapsed = true); // Collapse all category groups
  }

  expandAll() {
    this.categoryGroups.forEach(group => group.collapsed = false); // Expand all category groups
  }

  onSearchChange() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredItems = [...this.allItems]; // Reset filtered items if the search term is empty
      this.groupItemsByCategory(); // Regroup items by category
    }
  }
  
  clearSearch() {
    this.searchTerm = ''; // Clear the search term
    this.filteredItems = [...this.allItems]; // Reset filtered items
    this.groupItemsByCategory(); // Regroup items by category
  }

  searchItems() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredItems = [...this.allItems]; // Reset filtered items if the search term is empty
    } else {
      this.filteredItems = this.allItems.filter(item => 
        item.item_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      ); // Filter items based on the search term
      if (this.filteredItems.length === 0) {
        this.categoryGroups = []; // Clear category groups if no items are found
      }
    }
    if (this.filteredItems.length > 0) {
      this.groupItemsByCategory(); // Regroup items by category if there are filtered items
    }
  }

  refreshItems(event: any) {
    this.loadItems().then(() => {
      event.target.complete(); // Complete the refresh event after loading items
    });
  }

  getStatusColor(status: string): string {
    // Return different colors based on the stock status
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
    ); // Show a help alert
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present(); // Present an alert
  }
}